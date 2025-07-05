import React, { useState } from 'react';
import { Palette, Check, X } from 'lucide-react';
import { useTheme, Theme, themes } from '../hooks/useTheme';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { theme: currentTheme, changeTheme } = useTheme();

  if (!isOpen) return null;

  const handleThemeChange = (theme: Theme) => {
    changeTheme(theme);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Choose Your Theme</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(themes).map(([themeKey, themeData]) => (
            <div
              key={themeKey}
              onClick={() => handleThemeChange(themeKey as Theme)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                currentTheme === themeKey
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {/* Theme Preview */}
              <div 
                className="h-32 rounded-t-lg relative overflow-hidden"
                style={{ background: themeData.gradient }}
              >
                {/* Mock UI Elements */}
                <div className="absolute top-3 left-3 right-3">
                  <div 
                    className="h-2 rounded-full mb-2"
                    style={{ backgroundColor: themeData.primary, opacity: 0.8 }}
                  />
                  <div 
                    className="h-1.5 rounded-full w-3/4 mb-1"
                    style={{ backgroundColor: themeData.accent, opacity: 0.6 }}
                  />
                  <div 
                    className="h-1 rounded-full w-1/2"
                    style={{ backgroundColor: themeData.textSecondary, opacity: 0.4 }}
                  />
                </div>
                
                {/* Mock Cards */}
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <div 
                    className="h-4 rounded opacity-90"
                    style={{ backgroundColor: themeData.surface }}
                  />
                  <div 
                    className="h-3 rounded w-2/3 opacity-70"
                    style={{ backgroundColor: themeData.surface }}
                  />
                </div>

                {/* Selection Indicator */}
                {currentTheme === themeKey && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {themeData.name}
                </h3>
                <div className="flex space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: themeData.primary }}
                    title="Primary Color"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: themeData.accent }}
                    title="Accent Color"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: themeData.background }}
                    title="Background Color"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: themeData.surface }}
                    title="Surface Color"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200 mb-2">
            <Palette className="w-4 h-4" />
            <span className="font-medium text-sm">Beautiful Custom Themes</span>
          </div>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Handcrafted color palettes with perfect harmony</li>
            <li>• Instant theme switching with smooth transitions</li>
            <li>• Consistent design across all components</li>
            <li>• Professional gradients and beautiful aesthetics</li>
            <li>• Optimized for readability and visual appeal</li>
          </ul>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Perfect!
          </button>
        </div>
      </div>
    </div>
  );
}