import React, { useState, useEffect } from 'react';
import { File, Download, Trash2, Calendar, Share2, Eye, EyeOff } from 'lucide-react';
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
      <div className="text-center py-12">
        <Share2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">No shared files</p>
        <p className="text-sm text-gray-400">Files you share will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shared Files</h3>
      {sharedFiles.map((sharedFile) => (
        <div key={sharedFile.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <File className="w-8 h-8 text-green-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 truncate">{sharedFile.fileName}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span>{formatFileSize(sharedFile.fileSize)}</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Uploaded: {formatDate(sharedFile.uploadedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleDelete(sharedFile.shareCode)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete shared file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Code
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={sharedFile.shareCode}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(sharedFile.shareCode)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type={showPasswords[sharedFile.shareCode] ? "text" : "password"}
                  value={sharedFile.password}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
                />
                <button
                  onClick={() => togglePasswordVisibility(sharedFile.shareCode)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {showPasswords[sharedFile.shareCode] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(sharedFile.password)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Downloads:</span>
                <span className="ml-2 font-medium">{sharedFile.downloadCount} / {sharedFile.maxDownloads}</span>
              </div>
              <div>
                <span className="text-gray-600">Expires:</span>
                <span className="ml-2 font-medium">{formatDate(sharedFile.expiresAt)}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 font-medium ${
                  sharedFile.expiresAt > new Date() ? 'text-green-600' : 'text-red-600'
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