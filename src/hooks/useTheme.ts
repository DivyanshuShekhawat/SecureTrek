import { useState, useEffect } from 'react';

export type Theme = 'midnight' | 'ocean' | 'forest' | 'sunset' | 'lavender' | 'crimson' | 'gold' | 'arctic';

export interface ThemeColors {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  gradient: string;
}

export const themes: Record<Theme, ThemeColors> = {
  midnight: {
    name: 'Midnight Black',
    primary: '#000000',
    secondary: '#1a1a1a',
    accent: '#333333',
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#333333',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
  },
  ocean: {
    name: 'Ocean Blue',
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#60a5fa',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e40af 100%)',
    surface: 'rgba(59, 130, 246, 0.1)',
    text: '#ffffff',
    textSecondary: '#cbd5e1',
    border: 'rgba(59, 130, 246, 0.3)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e40af 100%)'
  },
  forest: {
    name: 'Forest Green',
    primary: '#22c55e',
    secondary: '#14532d',
    accent: '#84cc16',
    background: '#0f1b0f',
    surface: '#1a2e1a',
    text: '#f0fdf4',
    textSecondary: '#86efac',
    border: '#166534',
    success: '#16a34a',
    warning: '#eab308',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #0f1b0f 0%, #1a2e1a 100%)'
  },
  sunset: {
    name: 'Sunset Orange',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
    background: '#1c1917',
    surface: '#292524',
    text: '#fef7ed',
    textSecondary: '#fed7aa',
    border: '#a16207',
    success: '#16a34a',
    warning: '#eab308',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)'
  },
  lavender: {
    name: 'Lavender Purple',
    primary: '#a855f7',
    secondary: '#581c87',
    accent: '#c084fc',
    background: '#1e1b2e',
    surface: '#2d2438',
    text: '#faf5ff',
    textSecondary: '#d8b4fe',
    border: '#7c3aed',
    success: '#16a34a',
    warning: '#eab308',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #1e1b2e 0%, #2d2438 100%)'
  },
  crimson: {
    name: 'Crimson Red',
    primary: '#dc2626',
    secondary: '#7f1d1d',
    accent: '#f87171',
    background: '#1f1415',
    surface: '#2d1b1b',
    text: '#fef2f2',
    textSecondary: '#fca5a5',
    border: '#991b1b',
    success: '#16a34a',
    warning: '#eab308',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #1f1415 0%, #2d1b1b 100%)'
  },
  gold: {
    name: 'Royal Gold',
    primary: '#eab308',
    secondary: '#713f12',
    accent: '#fbbf24',
    background: '#1c1917',
    surface: '#292524',
    text: '#fffbeb',
    textSecondary: '#fde68a',
    border: '#a16207',
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)'
  },
  arctic: {
    name: 'Arctic White',
    primary: '#3b82f6',
    secondary: '#e2e8f0',
    accent: '#06b6d4',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569',
    border: '#cbd5e1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
  }
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('sharetrek-theme') as Theme;
    return stored && themes[stored] ? stored : 'ocean'; // Changed default to ocean (blue)
  });

  useEffect(() => {
    const root = document.documentElement;
    const themeColors = themes[theme];
    
    // Apply CSS custom properties to root
    Object.entries({
      '--color-primary': themeColors.primary,
      '--color-secondary': themeColors.secondary,
      '--color-accent': themeColors.accent,
      '--color-background': themeColors.background,
      '--color-surface': themeColors.surface,
      '--color-text': themeColors.text,
      '--color-text-secondary': themeColors.textSecondary,
      '--color-border': themeColors.border,
      '--color-success': themeColors.success,
      '--color-warning': themeColors.warning,
      '--color-error': themeColors.error,
      '--gradient-background': themeColors.gradient,
    }).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Set dark class for all themes except arctic
    if (theme === 'arctic') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    
    // Apply background to body
    document.body.style.background = themeColors.gradient;
    document.body.style.color = themeColors.text;
    
    localStorage.setItem('sharetrek-theme', theme);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { 
    theme, 
    changeTheme, 
    currentTheme: themes[theme],
    allThemes: themes 
  };
}