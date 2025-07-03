import React, { useState } from 'react';
import { X, Settings, Lock, Code, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { ShareSettings } from '../types';

interface ShareSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: ShareSettings) => void;
  originalFileName: string;
}

export function ShareSettingsDialog({ isOpen, onClose, onConfirm, originalFileName }: ShareSettingsDialogProps) {
  const [customShareCode, setCustomShareCode] = useState('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomShareCode(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settings: ShareSettings = {
      customShareCode: customShareCode.trim().toUpperCase() || undefined,
      password: usePassword ? password.trim() : undefined,
      usePassword
    };
    
    onConfirm(settings);
    handleClose();
  };

  const handleClose = () => {
    setCustomShareCode('');
    setPassword('');
    setUsePassword(false);
    setShowPassword(false);
    onClose();
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-4 sm:p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Share Settings</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* File Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>File:</strong> {originalFileName}
            </p>
          </div>

          {/* Custom Share Code */}
          <div>
            <label htmlFor="shareCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Code className="w-4 h-4 inline mr-2" />
              Custom Share Code <span className="text-gray-500 dark:text-gray-400">(optional)</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="shareCode"
                value={customShareCode}
                onChange={(e) => setCustomShareCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20))}
                placeholder="Enter custom code or leave empty for auto-generated"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm whitespace-nowrap flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Use letters and numbers only. Leave empty for auto-generated code.
            </p>
          </div>

          {/* Password Protection Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePassword}
                  onChange={(e) => setUsePassword(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password Protection
                </span>
              </label>
            </div>

            {usePassword && (
              <div className="space-y-3 pl-4 sm:pl-7">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm whitespace-nowrap flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Generate</span>
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300">
                    <strong>Security:</strong> Password protection adds an extra layer of security. 
                    Without a password, anyone with the share code can download the file.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={usePassword && !password.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              Share File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}