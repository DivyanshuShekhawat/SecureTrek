import React, { useState } from 'react';
import { X, Copy, Check, Share2, Lock, Calendar, Download, Shield, QrCode } from 'lucide-react';
import { SharedFile } from '../types';
import { QRCodeGenerator } from './QRCodeGenerator';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sharedFile: SharedFile | null;
}

export function ShareDialog({ isOpen, onClose, sharedFile }: ShareDialogProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  if (!isOpen || !sharedFile) return null;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

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

  const shareUrl = `${window.location.origin}?code=${sharedFile.shareCode}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">File Shared Successfully</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 space-y-3 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{sharedFile.fileName}</p>
                {sharedFile.hasPassword && (
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400" title="Password protected" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{formatFileSize(sharedFile.fileSize)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share Code
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={sharedFile.shareCode}
                readOnly
                className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(sharedFile.shareCode, 'code')}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {copiedField === 'code' ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Share URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={() => copyToClipboard(shareUrl, 'url')}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {copiedField === 'url' ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
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
                  type="text"
                  value={sharedFile.password}
                  readOnly
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(sharedFile.password!, 'password')}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  {copiedField === 'password' ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                </button>
              </div>
            </div>
          )}

          {!sharedFile.hasPassword && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                <Shield className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">No password required</span>
              </div>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-1">
                Anyone with the share code can download this file.
              </p>
            </div>
          )}

          {/* QR Code Section */}
          <div className="border-t dark:border-gray-600 pt-4">
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>{showQRCode ? 'Hide QR Code' : 'Show QR Code'}</span>
            </button>
            
            {showQRCode && (
              <div className="mt-4 text-center">
                <QRCodeGenerator value={shareUrl} size={150} />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Scan to access the download page
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 space-y-3 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
            <Lock className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">File Information</span>
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-blue-700 dark:text-blue-300">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Expires: {formatDate(sharedFile.expiresAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Max downloads: {sharedFile.maxDownloads === 999999 ? 'Unlimited' : sharedFile.maxDownloads}</span>
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-600 pt-4">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
            Share the {sharedFile.hasPassword ? 'code and password' : 'code or URL'} with the recipient to allow them to download the file across any device.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base"
        >
          Done
        </button>
      </div>
    </div>
  );
}