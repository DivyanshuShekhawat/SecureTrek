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
      <div 
        className="rounded-xl max-w-3xl w-full p-6 border max-h-[90vh] overflow-y-auto transition-all duration-300 shadow-2xl"
        style={{ 
          backgroundColor: themes[currentTheme].background,
          borderColor: themes[currentTheme].border,
          color: themes[currentTheme].text
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg, ${themes[currentTheme].primary}, ${themes[currentTheme].accent})` }}
            >
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: themes[currentTheme].text }}>Choose Your Theme</h2>
          </div>
          <button
            onClick={onClose}
            className="transition-colors hover:opacity-70 p-2 rounded-lg"
            style={{ 
              color: themes[currentTheme].textSecondary,
              backgroundColor: `${themes[currentTheme].surface}50`
            }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(themes).map(([themeKey, themeData]) => (
            <div
              key={themeKey}
              onClick={() => handleThemeChange(themeKey as Theme)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                currentTheme === themeKey
                  ? 'ring-2 shadow-lg'
                  : 'hover:border-opacity-70'
              }`}
              style={{
                borderColor: currentTheme === themeKey ? themeData.primary : themes[currentTheme].border,
                ringColor: currentTheme === themeKey ? `${themeData.primary}50` : 'transparent',
                backgroundColor: currentTheme === themeKey ? `${themeData.primary}10` : 'transparent'
              }}
            >
              {/* Theme Preview */}
              <div 
                className="h-28 rounded-t-lg relative overflow-hidden"
                style={{ background: themeData.gradient }}
              >
                {/* Mock UI Elements */}
                <div className="absolute top-2 left-2 right-2">
                  <div 
                    className="h-1.5 rounded-full mb-1.5"
                    style={{ backgroundColor: themeData.primary, opacity: 0.9 }}
                  />
                  <div 
                    className="h-1 rounded-full w-3/4 mb-1"
                    style={{ backgroundColor: themeData.accent, opacity: 0.7 }}
                  />
                  <div 
                    className="h-0.5 rounded-full w-1/2"
                    style={{ backgroundColor: themeData.textSecondary, opacity: 0.5 }}
                  />
                </div>
                
                {/* Mock Cards */}
                <div className="absolute bottom-2 left-2 right-2 space-y-1">
                  <div 
                    className="h-3 rounded opacity-90"
                    style={{ backgroundColor: themeData.surface }}
                  />
                  <div 
                    className="h-2 rounded w-2/3 opacity-70"
                    style={{ backgroundColor: themeData.surface }}
                  />
                </div>

                {/* Selection Indicator */}
                {currentTheme === themeKey && (
                  <div 
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: themeData.primary }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div 
                className="p-3 rounded-b-lg"
                style={{ 
                  backgroundColor: themeData.surface,
                  color: themeData.text
                }}
              >
                <h3 className="font-semibold text-sm mb-2">
                  {themeData.name}
                </h3>
                <div className="flex space-x-1.5">
                  <div 
                    className="w-3 h-3 rounded-full border shadow-sm"
                    style={{ 
                      backgroundColor: themeData.primary,
                      borderColor: themeData.border
                    }}
                    title="Primary Color"
                  />
                  <div 
                    className="w-3 h-3 rounded-full border shadow-sm"
                    style={{ 
                      backgroundColor: themeData.accent,
                      borderColor: themeData.border
                    }}
                    title="Accent Color"
                  />
                  <div 
                    className="w-3 h-3 rounded-full border shadow-sm"
                    style={{ 
                      backgroundColor: themeData.background,
                      borderColor: themeData.border
                    }}
                    title="Background Color"
                  />
                  <div 
                    className="w-3 h-3 rounded-full border shadow-sm"
                    style={{ 
                      backgroundColor: themeData.surface,
                      borderColor: themeData.border
                    }}
                    title="Surface Color"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div 
          className="mt-6 p-4 rounded-lg border shadow-sm"
          style={{ 
            backgroundColor: themes[currentTheme].surface,
            borderColor: themes[currentTheme].border
          }}
        >
          <div className="flex items-center space-x-2 mb-2" style={{ color: themes[currentTheme].primary }}>
            <Palette className="w-4 h-4" />
            <span className="font-medium text-sm">Beautiful Custom Themes</span>
          </div>
          <ul className="text-sm space-y-1" style={{ color: themes[currentTheme].textSecondary }}>
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
            className="px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            style={{ 
              backgroundColor: themes[currentTheme].primary,
              color: 'white'
            }}
          >
            Perfect!
          </button>
        </div>
      </div>
    </div>
  );
}