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
    primary: '#3b82f6',
    secondary: '#1e293b',
    accent: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#334155',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  },
  ocean: {
    name: 'Ocean Blue',
    primary: '#0ea5e9',
    secondary: '#0c4a6e',
    accent: '#06b6d4',
    background: '#0c1821',
    surface: '#164e63',
    text: '#f0f9ff',
    textSecondary: '#7dd3fc',
    border: '#0e7490',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #0c1821 0%, #164e63 100%)'
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
    secondary: '#9a3412',
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
    return stored && themes[stored] ? stored : 'midnight';
  });

  useEffect(() => {
    const root = document.documentElement;
    const themeColors = themes[theme];
    
    // Apply CSS custom properties
    root.style.setProperty('--color-primary', themeColors.primary);
    root.style.setProperty('--color-secondary', themeColors.secondary);
    root.style.setProperty('--color-accent', themeColors.accent);
    root.style.setProperty('--color-background', themeColors.background);
    root.style.setProperty('--color-surface', themeColors.surface);
    root.style.setProperty('--color-text', themeColors.text);
    root.style.setProperty('--color-text-secondary', themeColors.textSecondary);
    root.style.setProperty('--color-border', themeColors.border);
    root.style.setProperty('--color-success', themeColors.success);
    root.style.setProperty('--color-warning', themeColors.warning);
    root.style.setProperty('--color-error', themeColors.error);
    root.style.setProperty('--gradient-background', themeColors.gradient);
    
    // Set dark class for arctic theme
    if (theme === 'arctic') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    
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