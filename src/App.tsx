import React, { useState } from 'react';
import { Cloud, Download, Upload, HardDrive, Share2, Settings } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { ShareDialog } from './components/ShareDialog';
import { ShareSettingsDialog } from './components/ShareSettingsDialog';
import { DownloadDialog } from './components/DownloadDialog';
import { LocalFilesList } from './components/LocalFilesList';
import { SharedFilesList } from './components/SharedFilesList';
import { ThemeToggle } from './components/ThemeToggle';
import { useLocalStorage } from './hooks/useLocalStorage';
import { localShareService } from './services/localShareService';
import { LocalFile, SharedFile, UploadProgress, ShareSettings } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'download' | 'local' | 'shared'>('upload');
  const [localFiles, setLocalFiles] = useLocalStorage<LocalFile[]>('localFiles', []);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareSettingsDialogOpen, setShareSettingsDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [currentSharedFile, setCurrentSharedFile] = useState<SharedFile | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'local' | 'share'>('local');
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadError(''); // Clear any previous errors
    
    if (uploadMode === 'local') {
      // Store files locally
      const newLocalFiles: LocalFile[] = fileArray.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        uploadedAt: new Date()
      }));
      
      setLocalFiles(prev => [...prev, ...newLocalFiles]);
      
      // Simulate upload progress for visual feedback
      const progressItems: UploadProgress[] = fileArray.map(file => ({
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      }));
      
      setUploadProgress(progressItems);
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setTimeout(() => {
          setUploadProgress(prev => prev.map(item => ({
            ...item,
            progress: i,
            status: i === 100 ? 'completed' : 'uploading'
          })));
        }, i * 20);
      }
      
      setTimeout(() => setUploadProgress([]), 3000);
    } else {
      // Share file using local storage
      if (fileArray.length > 1) {
        setUploadError('Please select only one file for sharing');
        return;
      }
      
      const file = fileArray[0];
      
      // Check file size (limit to 5MB for local storage)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB for sharing');
        return;
      }
      
      // Store the file and open settings dialog
      setPendingFile(file);
      setShareSettingsDialogOpen(true);
    }
  };

  const handleShareSettings = async (settings: ShareSettings) => {
    if (!pendingFile) return;

    const progressItem: UploadProgress = {
      fileName: settings.customFileName || pendingFile.name,
      progress: 0,
      status: 'uploading'
    };
    
    setUploadProgress([progressItem]);
    
    try {
      console.log('Starting local file sharing for:', settings.customFileName || pendingFile.name);
      
      const sharedFile = await localShareService.shareFile(pendingFile, settings, (progress) => {
        setUploadProgress([{
          ...progressItem,
          progress,
          status: 'uploading'
        }]);
      });
      
      console.log('File shared successfully:', sharedFile);
      
      setUploadProgress([{
        ...progressItem,
        progress: 100,
        status: 'completed'
      }]);
      
      setCurrentSharedFile(sharedFile);
      setShareDialogOpen(true);
      setPendingFile(null);
      
      setTimeout(() => setUploadProgress([]), 2000);
    } catch (error) {
      console.error('Share failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to share file. Please try again.';
      setUploadError(errorMessage);
      
      setUploadProgress([{
        ...progressItem,
        progress: 0,
        status: 'error'
      }]);
      
      setTimeout(() => setUploadProgress([]), 5000);
      setPendingFile(null);
    }
  };

  const handleDownloadFile = async (code: string, password?: string) => {
    await localShareService.downloadFile(code, password);
  };

  const handleLocalFileDownload = (localFile: LocalFile) => {
    const url = URL.createObjectURL(localFile.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = localFile.file.name;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleLocalFileDelete = (id: string) => {
    setLocalFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleSharedFileDelete = (shareCode: string) => {
    localShareService.deleteSharedFile(shareCode);
    // Force re-render by updating a state
    setUploadError('');
  };

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'download', label: 'Download', icon: Download },
    { id: 'local', label: 'Local Files', icon: HardDrive },
    { id: 'shared', label: 'Shared Files', icon: Share2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4 relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShareTrek
            </h1>
            
            {/* Theme Toggle positioned in top right */}
            <div className="absolute right-0 top-0">
              <ThemeToggle />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Securely share files locally with custom names, optional password protection, and expiration dates. 
            Upload locally for immediate use or share with unique codes for cross-device access within the same browser.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors duration-300">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Files</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setUploadMode('local')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      uploadMode === 'local'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <HardDrive className="w-4 h-4 inline mr-2" />
                    Local Storage
                  </button>
                  <button
                    onClick={() => setUploadMode('share')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      uploadMode === 'share'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Share2 className="w-4 h-4 inline mr-2" />
                    Share Mode
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>
                    {uploadMode === 'local' ? 'Local Storage:' : 'Share Mode:'}
                  </strong>{' '}
                  {uploadMode === 'local'
                    ? 'Files are stored in your browser for immediate access. They won\'t be accessible from other devices.'
                    : 'Files are stored locally with unique codes. You can customize the file name and add optional password protection for enhanced security.'
                  }
                </p>
              </div>

              {uploadError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Upload Error</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{uploadError}</p>
                </div>
              )}
              
              <FileUploader onUpload={handleFileUpload} progress={uploadProgress} />
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Download Shared Files</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Enter the share code and password (if required) to download files that were shared from this browser.
                </p>
                <button
                  onClick={() => setDownloadDialogOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download File</span>
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white">How it works</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>1. Get the share code from someone who shared a file</p>
                  <p>2. If the file is password protected, you'll also need the password</p>
                  <p>3. Click "Download File" and enter the credentials</p>
                  <p>4. The file will be downloaded to your device</p>
                  <p className="text-amber-600 dark:text-amber-400 font-medium">Note: Files are stored locally in this browser only</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'local' && (
            <LocalFilesList
              files={localFiles}
              onDownload={handleLocalFileDownload}
              onDelete={handleLocalFileDelete}
            />
          )}

          {activeTab === 'shared' && (
            <SharedFilesList
              onDelete={handleSharedFileDelete}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Secure local file sharing with custom names, optional password protection, and automatic expiration</p>
        </div>
      </div>

      {/* Dialogs */}
      <ShareSettingsDialog
        isOpen={shareSettingsDialogOpen}
        onClose={() => {
          setShareSettingsDialogOpen(false);
          setPendingFile(null);
        }}
        onConfirm={handleShareSettings}
        originalFileName={pendingFile?.name || ''}
      />

      <ShareDialog
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        sharedFile={currentSharedFile}
      />

      <DownloadDialog
        isOpen={downloadDialogOpen}
        onClose={() => setDownloadDialogOpen(false)}
        onDownload={handleDownloadFile}
      />
    </div>
  );
}

export default App;