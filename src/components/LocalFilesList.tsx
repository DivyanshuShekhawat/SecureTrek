import React from 'react';
import { File, Download, Trash2, Calendar } from 'lucide-react';
import { LocalFile } from '../types';

interface LocalFilesListProps {
  files: LocalFile[];
  onDownload: (file: LocalFile) => void;
  onDelete: (id: string) => void;
}

export function LocalFilesList({ files, onDownload, onDelete }: LocalFilesListProps) {
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

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 mb-2">No local files stored</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Upload files to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Local Files</h3>
      {files.map((localFile) => (
        <div key={localFile.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <File className="w-8 h-8 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">{localFile.file.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{formatFileSize(localFile.file.size)}</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(localFile.uploadedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onDownload(localFile)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(localFile.id)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}