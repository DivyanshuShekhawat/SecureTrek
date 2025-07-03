import React, { useState, useEffect } from 'react';
import { File, Download, Trash2, Calendar, Share2, Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { localShareService } from '../services/localShareService';
import { SharedFile } from '../types';

interface SharedFilesListProps {
  onDelete: (shareCode: string) => void;
}

export function SharedFilesList({ onDelete }: SharedFilesListProps) {
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Clean up expired files first
    localShareService.cleanupExpiredFiles();
    
    // Load shared files
    const files = localShareService.getSharedFilesList();
    setSharedFiles(files);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  const togglePasswordVisibility = (shareCode: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [shareCode]: !prev[shareCode]
    }));
  };

  const handleDelete = (shareCode: string) => {
    onDelete(shareCode);
    setSharedFiles(prev => prev.filter(file => file.shareCode !== shareCode));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (sharedFiles.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <Share2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm sm:text-base">No shared files</p>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">Files you share will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Shared Files</h3>
      {sharedFiles.map((sharedFile) => (
        <div key={sharedFile.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 sm:p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <File className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 dark:text-green-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">{sharedFile.fileName}</h4>
                  {sharedFile.hasPassword && (
                    <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400" title="Password protected">
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0">
                  <span>{formatFileSize(sharedFile.fileSize)}</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Uploaded: {formatDate(sharedFile.uploadedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleDelete(sharedFile.shareCode)}
              className="p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
              title="Delete shared file"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share Code
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={sharedFile.shareCode}
                  readOnly
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs sm:text-sm"
                />
                <button
                  onClick={() => copyToClipboard(sharedFile.shareCode)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>

            {sharedFile.hasPassword && sharedFile.password && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type={showPasswords[sharedFile.shareCode] ? "text" : "password"}
                    value={sharedFile.password}
                    readOnly
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs sm:text-sm"
                  />
                  <button
                    onClick={() => togglePasswordVisibility(sharedFile.shareCode)}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {showPasswords[sharedFile.shareCode] ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(sharedFile.password!)}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {!sharedFile.hasPassword && (
              <div className="flex items-center justify-center bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium">No password required</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Downloads:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{sharedFile.downloadCount} / {sharedFile.maxDownloads}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{formatDate(sharedFile.expiresAt)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`ml-2 font-medium ${
                  sharedFile.expiresAt > new Date() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {sharedFile.expiresAt > new Date() ? 'Active' : 'Expired'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}