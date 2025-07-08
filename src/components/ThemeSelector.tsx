import React from 'react';
import { Palette, Check, X } from 'lucide-react';
import { useTheme, Theme, themes } from '../hooks/useTheme';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { theme: currentTheme, changeTheme, currentTheme: currentThemeColors } = useTheme();

  if (!isOpen) return null;

  const handleThemeChange = (theme: Theme) => {
    changeTheme(theme);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="rounded-xl max-w-3xl w-full p-6 border max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: currentThemeColors.surface,
          borderColor: currentThemeColors.border
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(45deg, ${currentThemeColors.primary}, ${currentThemeColors.accent})` }}
            >
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h2 
              className="text-xl font-semibold"
              style={{ color: currentThemeColors.text }}
            >
              Choose Your Theme
            </h2>
          </div>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: currentThemeColors.textSecondary }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(themes).map(([themeKey, themeData]) => (
            <div
              key={themeKey}
              onClick={() => handleThemeChange(themeKey as Theme)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 hover:scale-105`}
              style={{
                borderColor: currentTheme === themeKey ? themeData.primary : currentThemeColors.border,
                boxShadow: currentTheme === themeKey ? `0 0 0 2px ${themeData.primary}30` : 'none'
              }}
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
                  <div 
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: themeData.primary }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div 
                className="p-4 rounded-b-lg"
                style={{ backgroundColor: themeData.surface }}
              >
                <h3 
                  className="font-semibold mb-2"
                  style={{ color: themeData.text }}
                >
                  {themeData.name}
                </h3>
                <div className="flex space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ 
                      backgroundColor: themeData.primary,
                      borderColor: themeData.border
                    }}
                    title="Primary Color"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ 
                      backgroundColor: themeData.accent,
                      borderColor: themeData.border
                    }}
                    title="Accent Color"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ 
                      backgroundColor: themeData.background,
                      borderColor: themeData.border
                    }}
                    title="Background Color"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
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
          className="mt-6 p-4 rounded-lg border"
          style={{ 
            backgroundColor: `${currentThemeColors.primary}10`,
            borderColor: `${currentThemeColors.primary}30`
          }}
        >
          <div 
            className="flex items-center space-x-2 mb-2"
            style={{ color: currentThemeColors.primary }}
          >
            <Palette className="w-4 h-4" />
            <span className="font-medium text-sm">Beautiful Custom Themes</span>
          </div>
          <ul 
            className="text-sm space-y-1"
            style={{ color: currentThemeColors.primary }}
          >
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
            className="px-6 py-2 rounded-lg transition-colors font-medium"
            style={{ 
              backgroundColor: currentThemeColors.primary,
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