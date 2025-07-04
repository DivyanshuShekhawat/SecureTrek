import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { ThemeSelector } from './ThemeSelector';

export function ThemeToggle() {
  const { currentTheme } = useTheme();
  const [showSelector, setShowSelector] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowSelector(true)}
        className="relative p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
        style={{ 
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border
        }}
        title="Change Theme"
      >
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ background: currentTheme.gradient }}
        />
        
        <div className="relative w-6 h-6 flex items-center justify-center">
          <Palette 
            className="w-6 h-6 transition-all duration-500 transform group-hover:rotate-12"
            style={{ color: currentTheme.primary }}
          />
        </div>
        
        {/* Theme indicator dots */}
        <div className="absolute -bottom-1 -right-1 flex space-x-0.5">
          <div 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: currentTheme.primary }}
          />
          <div 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: currentTheme.accent }}
          />
        </div>
      </button>

      <ThemeSelector 
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
      />
    </>
  );
}