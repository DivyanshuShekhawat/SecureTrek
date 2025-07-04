import React from 'react';
import { Download, Infinity } from 'lucide-react';

interface DownloadLimitSettingsProps {
  value: number;
  onChange: (limit: number) => void;
  className?: string;
}

export function DownloadLimitSettings({ value, onChange, className = '' }: DownloadLimitSettingsProps) {
  const presetLimits = [1, 5, 10, 25, 50, 100, -1]; // -1 for unlimited

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <Download className="w-4 h-4 inline mr-2" />
          Download Limit
        </label>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {presetLimits.map((limit) => (
            <button
              key={limit}
              type="button"
              onClick={() => onChange(limit)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                value === limit
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {limit === -1 ? (
                <span className="flex items-center justify-center">
                  <Infinity className="w-4 h-4" />
                </span>
              ) : (
                limit
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Custom:</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={value === -1 ? '' : value}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              if (!isNaN(num) && num > 0) {
                onChange(num);
              }
            }}
            placeholder="Enter limit"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-2 text-green-800 dark:text-green-200 mb-1">
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Download Limit</span>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300">
          {value === -1 ? 'Unlimited downloads' : `Maximum ${value} download${value !== 1 ? 's' : ''}`}
        </p>
      </div>
    </div>
  );
}