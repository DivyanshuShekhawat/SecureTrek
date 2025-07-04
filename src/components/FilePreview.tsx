import React, { useState, useEffect } from 'react';
import { X, File, Image, FileText, Video, Music, Archive, Eye } from 'lucide-react';

interface FilePreviewProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FilePreview({ file, isOpen, onClose }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewType, setPreviewType] = useState<'image' | 'text' | 'video' | 'audio' | 'pdf' | 'unsupported'>('unsupported');

  useEffect(() => {
    if (!file || !isOpen) {
      setPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Determine preview type
    if (file.type.startsWith('image/')) {
      setPreviewType('image');
    } else if (file.type.startsWith('video/')) {
      setPreviewType('video');
    } else if (file.type.startsWith('audio/')) {
      setPreviewType('audio');
    } else if (file.type === 'application/pdf') {
      setPreviewType('pdf');
    } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      setPreviewType('text');
    } else {
      setPreviewType('unsupported');
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, isOpen]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    switch (previewType) {
      case 'image':
        return <Image className="w-6 h-6 text-green-500" />;
      case 'video':
        return <Video className="w-6 h-6 text-purple-500" />;
      case 'audio':
        return <Music className="w-6 h-6 text-blue-500" />;
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'text':
        return <FileText className="w-6 h-6 text-gray-500" />;
      default:
        return <Archive className="w-6 h-6 text-gray-400" />;
    }
  };

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl max-h-[90vh] w-full overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {getFileIcon()}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{file.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)} • {file.type || 'Unknown type'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
          {previewType === 'image' && (
            <div className="flex justify-center">
              <img
                src={previewUrl}
                alt={file.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          )}

          {previewType === 'video' && (
            <div className="flex justify-center">
              <video
                src={previewUrl}
                controls
                className="max-w-full max-h-full rounded-lg"
              >
                Your browser does not support video playback.
              </video>
            </div>
          )}

          {previewType === 'audio' && (
            <div className="flex justify-center p-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center space-x-3 mb-4">
                  <Music className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Audio File</p>
                  </div>
                </div>
                <audio
                  src={previewUrl}
                  controls
                  className="w-full"
                >
                  Your browser does not support audio playback.
                </audio>
              </div>
            </div>
          )}

          {previewType === 'pdf' && (
            <div className="flex justify-center">
              <iframe
                src={previewUrl}
                className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-lg"
                title={file.name}
              />
            </div>
          )}

          {previewType === 'text' && (
            <TextFilePreview file={file} />
          )}

          {previewType === 'unsupported' && (
            <div className="text-center py-12">
              <Archive className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Preview not available
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                This file type cannot be previewed in the browser.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <File className="w-8 h-8 text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
      setLoading(false);
    };
    
    reader.onerror = () => {
      setError('Failed to read file content');
      setLoading(false);
    };
    
    reader.readAsText(file);
  }, [file]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-red-400 mx-auto mb-2" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-auto max-h-96 font-mono">
        {content}
      </pre>
    </div>
  );
}