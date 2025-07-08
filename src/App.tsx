import React, { useState, useEffect } from 'react';
import { Cloud, Download, Upload, HardDrive, Share2, Settings, Eye, Utensils as Extension } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { ShareDialog } from './components/ShareDialog';
import { ShareSettingsDialog } from './components/ShareSettingsDialog';
import { DownloadDialog } from './components/DownloadDialog';
import { LocalFilesList } from './components/LocalFilesList';
import { ThemeToggle } from './components/ThemeToggle';
import { FilePreview } from './components/FilePreview';
import { BrowserExtension } from './components/BrowserExtension';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { supabaseShareService } from './services/supabaseShareService';
import { LocalFile, SharedFile, UploadProgress, ShareSettings } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'download' | 'local' | 'extension'>('upload');
  const [localFiles, setLocalFiles] = useLocalStorage<LocalFile[]>('localFiles', []);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareSettingsDialogOpen, setShareSettingsDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [currentSharedFile, setCurrentSharedFile] = useState<SharedFile | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'local' | 'share'>('local');
  const [uploadError, setUploadError] = useState<string>('');
  
  const { currentTheme, isInitialized } = useTheme();

  // Check for share code in URL on load
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const shareCode = urlParams.get('code');
      if (shareCode) {
        setActiveTab('download');
        setDownloadDialogOpen(true);
      }
    } catch (error) {
      console.error('Error checking URL params:', error);
    }
  }, []);

  // Show loading screen while theme initializes
  if (!isInitialized) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0f0f23', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid #ffffff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading ShareTrek...</p>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (files: FileList) => {
    try {
      const fileArray = Array.from(files);
      setUploadError('');
      
      if (uploadMode === 'local') {
        const newLocalFiles: LocalFile[] = fileArray.map(file => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          uploadedAt: new Date()
        }));
        
        setLocalFiles(prev => [...prev, ...newLocalFiles]);
        
        const progressItems: UploadProgress[] = fileArray.map(file => ({
          fileName: file.name,
          progress: 0,
          status: 'uploading'
        }));
        
        setUploadProgress(progressItems);
        
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
        if (fileArray.length > 1) {
          setUploadError('Please select only one file for sharing');
          return;
        }
        
        const file = fileArray[0];
        
        if (file.size > 10 * 1024 * 1024 * 1024) {
          setUploadError('File size must be less than 10GB');
          return;
        }
        
        setPendingFile(file);
        setShareSettingsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error handling file upload:', error);
      setUploadError('Failed to upload file. Please try again.');
    }
  };

  const handleShareSettings = async (settings: ShareSettings) => {
    if (!pendingFile) return;

    // Check if we should use local storage instead of cloud
    const useLocalFallback = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

    const progressItem: UploadProgress = {
      fileName: pendingFile.name,
      progress: 0,
      status: 'uploading'
    };
    
    setUploadProgress([progressItem]);
    
    try {
      let sharedFile: SharedFile;
      
      if (useLocalFallback) {
        // Use local storage service as fallback
        const { localShareService } = await import('./services/localShareService');
        sharedFile = await localShareService.shareFile(pendingFile, settings, (progress) => {
          setUploadProgress([{ ...progressItem, progress, status: 'uploading' }]);
        });
      } else {
        sharedFile = await supabaseShareService.shareFile(pendingFile, settings, (progress) => {
        setUploadProgress([{
          ...progressItem,
          progress,
          status: 'uploading'
        }]);
      });
      }
      
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
    try {
      // Check if we should use local storage instead of cloud
      const useLocalFallback = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (useLocalFallback) {
        // Use local storage service as fallback
        const { localShareService } = await import('./services/localShareService');
        await localShareService.downloadFile(code, password);
      } else {
        await supabaseShareService.downloadFile(code, password);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  };

  const handleLocalFileDownload = (localFile: LocalFile) => {
    try {
      const url = URL.createObjectURL(localFile.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = localFile.file.name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading local file:', error);
    }
  };

  const handleLocalFileDelete = (id: string) => {
    try {
      setLocalFiles(prev => prev.filter(file => file.id !== id));
    } catch (error) {
      console.error('Error deleting local file:', error);
    }
  };

  const handleLocalFilePreview = (localFile: LocalFile) => {
    try {
      setPreviewFile(localFile.file);
      setPreviewDialogOpen(true);
    } catch (error) {
      console.error('Error previewing local file:', error);
    }
  };

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'download', label: 'Download', icon: Download },
    { id: 'local', label: 'Local Files', icon: HardDrive },
    { id: 'extension', label: 'Extension', icon: Extension }
  ];

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ 
        background: currentTheme.gradient,
        color: currentTheme.text
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4 relative">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`
              }}
            >
              <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 
              className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`
              }}
            >
              ShareTrek
            </h1>
            
            <div className="absolute right-0 top-0">
              <ThemeToggle />
            </div>
          </div>
          <p 
            className="max-w-2xl mx-auto transition-colors duration-300 text-sm sm:text-base px-4"
            style={{ color: currentTheme.textSecondary }}
          >
            Securely share files across devices with custom codes, QR codes, expiration settings, and cloud storage. 
            Upload locally for immediate use or share globally with unique codes for true cross-device access.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div 
          className="rounded-xl shadow-sm border mb-6 sm:mb-8 transition-all duration-300 overflow-hidden"
          style={{ 
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.border
          }}
        >
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-0 flex items-center justify-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-3 sm:px-6 font-medium transition-all duration-200 whitespace-nowrap border-b-2`}
                  style={{
                    color: isActive ? currentTheme.primary : currentTheme.textSecondary,
                    borderBottomColor: isActive ? currentTheme.primary : 'transparent',
                    backgroundColor: isActive ? `${currentTheme.primary}10` : 'transparent'
                  }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div 
          className="rounded-xl shadow-sm border p-4 sm:p-6 transition-all duration-300"
          style={{ 
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.border
          }}
        >
          {activeTab === 'upload' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 
                  className="text-lg sm:text-xl font-semibold"
                  style={{ color: currentTheme.text }}
                >
                  Upload Files
                </h2>
                <div className="flex items-center space-x-2 overflow-x-auto">
                  <button
                    onClick={() => setUploadMode('local')}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap`}
                    style={{
                      backgroundColor: uploadMode === 'local' ? currentTheme.primary : `${currentTheme.border}50`,
                      color: uploadMode === 'local' ? 'white' : currentTheme.textSecondary
                    }}
                  >
                    <HardDrive className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    Local Storage
                  </button>
                  <button
                    onClick={() => setUploadMode('share')}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap`}
                    style={{
                      backgroundColor: uploadMode === 'share' ? currentTheme.primary : `${currentTheme.border}50`,
                      color: uploadMode === 'share' ? 'white' : currentTheme.textSecondary
                    }}
                  >
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    Cloud Share
                  </button>
                </div>
              </div>
              
              <div 
                className="rounded-lg p-3 sm:p-4 border"
                style={{ 
                  backgroundColor: `${currentTheme.primary}10`,
                  borderColor: `${currentTheme.primary}30`
                }}
              >
                <p 
                  className="text-xs sm:text-sm"
                  style={{ color: currentTheme.primary }}
                >
                  <strong>
                    {uploadMode === 'local' ? 'Local Storage:' : 'Cloud Share:'}
                  </strong>{' '}
                  {uploadMode === 'local'
                    ? 'Files are stored in your browser for immediate access. They won\'t be accessible from other devices.'
                    : (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) 
                      ? 'Cloud sharing is currently unavailable. Files will be stored locally in your browser.'
                      : 'Files are stored in the cloud with custom codes for true cross-device access. Only you will see the share code - it\'s completely private.'
                  }
                </p>
              </div>

              {uploadError && (
                <div 
                  className="border rounded-lg p-3 sm:p-4"
                  style={{ 
                    backgroundColor: `${currentTheme.error}10`,
                    borderColor: `${currentTheme.error}30`
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 flex-shrink-0" style={{ color: currentTheme.error }} />
                    <span className="font-medium text-sm" style={{ color: currentTheme.error }}>Upload Error</span>
                  </div>
                  <p className="text-xs sm:text-sm mt-1" style={{ color: currentTheme.error }}>{uploadError}</p>
                </div>
              )}
              
              <FileUploader 
                onUpload={handleFileUpload} 
                progress={uploadProgress}
                maxFileSize={uploadMode === 'share' ? 10 * 1024 * 1024 * 1024 : 100 * 1024 * 1024}
              />
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 
                  className="text-lg sm:text-xl font-semibold mb-2"
                  style={{ color: currentTheme.text }}
                >
                  Download Shared Files
                </h2>
                <p 
                  className="mb-4 sm:mb-6 text-sm sm:text-base px-4"
                  style={{ color: currentTheme.textSecondary }}
                >
                  Enter the share code and password (if required) to download files shared from anywhere in the world.
                </p>
                <button
                  onClick={() => setDownloadDialogOpen(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:opacity-90 transition-all duration-200 font-medium inline-flex items-center space-x-2 text-sm sm:text-base"
                  style={{ backgroundColor: currentTheme.primary, color: 'white' }}
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Download File</span>
                </button>
              </div>

              <div 
                className="rounded-lg p-4 sm:p-6 border"
                style={{ 
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: currentTheme.textSecondary }} />
                  <h3 className="font-medium text-sm sm:text-base" style={{ color: currentTheme.text }}>How it works</h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm" style={{ color: currentTheme.textSecondary }}>
                  <p>1. Get the share code from someone who shared a file</p>
                  <p>2. If the file is password protected, you'll also need the password</p>
                  <p>3. Click "Download File" and enter the credentials</p>
                  <p>4. The file will be downloaded to your device</p>
                  <p className="font-medium" style={{ color: currentTheme.success }}>✨ Now with QR codes and custom expiration!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'local' && (
            <LocalFilesList
              files={localFiles}
              onDownload={handleLocalFileDownload}
              onDelete={handleLocalFileDelete}
              onPreview={handleLocalFilePreview}
            />
          )}

          {activeTab === 'extension' && (
            <BrowserExtension />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm px-4" style={{ color: currentTheme.textSecondary }}>
          <p>Secure cross-device file sharing with cloud storage, QR codes, custom expiration, and browser extension support</p>
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
        fileSize={pendingFile?.size || 0}
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

      <FilePreview
        file={previewFile}
        isOpen={previewDialogOpen}
        onClose={() => {
          setPreviewDialogOpen(false);
          setPreviewFile(null);
        }}
      />
    </div>
  );
}

export default App;