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
    name: 'Midnight Galaxy',
    primary: '#8b5cf6',
    secondary: '#1a1a2e',
    accent: '#3b82f6',
    background: '#0f0f23',
    surface: 'rgba(139, 92, 246, 0.1)',
    text: '#ffffff',
    textSecondary: '#a78bfa',
    border: 'rgba(139, 92, 246, 0.3)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f172a 75%, #1a1a2e 100%)'
  },
  ocean: {
    name: 'Deep Ocean',
    primary: '#06b6d4',
    secondary: '#0e7490',
    accent: '#67e8f9',
    background: '#0c1821',
    surface: 'rgba(6, 182, 212, 0.1)',
    text: '#f0f9ff',
    textSecondary: '#7dd3fc',
    border: 'rgba(6, 182, 212, 0.3)',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #0c1821 0%, #164e63 25%, #0e7490 50%, #155e75 75%, #164e63 100%)'
  },
  forest: {
    name: 'Emerald Forest',
    primary: '#10b981',
    secondary: '#047857',
    accent: '#34d399',
    background: '#0f1b0f',
    surface: 'rgba(16, 185, 129, 0.1)',
    text: '#f0fdf4',
    textSecondary: '#86efac',
    border: 'rgba(16, 185, 129, 0.3)',
    success: '#16a34a',
    warning: '#eab308',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #0f1b0f 0%, #14532d 25%, #166534 50%, #15803d 75%, #14532d 100%)'
  },
  sunset: {
    name: 'Golden Sunset',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
    background: '#1c1917',
    surface: 'rgba(249, 115, 22, 0.1)',
    text: '#fef7ed',
    textSecondary: '#fed7aa',
    border: 'rgba(249, 115, 22, 0.3)',
    success: '#16a34a',
    warning: '#eab308',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 25%, #451a03 50%, #7c2d12 75%, #292524 100%)'
  },
  lavender: {
    name: 'Royal Lavender',
    primary: '#a855f7',
    secondary: '#7c3aed',
    accent: '#c084fc',
    background: '#1e1b2e',
    surface: 'rgba(168, 85, 247, 0.1)',
    text: '#faf5ff',
    textSecondary: '#d8b4fe',
    border: 'rgba(168, 85, 247, 0.3)',
    success: '#16a34a',
    warning: '#eab308',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #1e1b2e 0%, #2d2438 25%, #581c87 50%, #6b21a8 75%, #2d2438 100%)'
  },
  crimson: {
    name: 'Crimson Fire',
    primary: '#dc2626',
    secondary: '#b91c1c',
    accent: '#f87171',
    background: '#1f1415',
    surface: 'rgba(220, 38, 38, 0.1)',
    text: '#fef2f2',
    textSecondary: '#fca5a5',
    border: 'rgba(220, 38, 38, 0.3)',
    success: '#16a34a',
    warning: '#eab308',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #1f1415 0%, #2d1b1b 25%, #7f1d1d 50%, #991b1b 75%, #2d1b1b 100%)'
  },
  gold: {
    name: 'Royal Gold',
    primary: '#eab308',
    secondary: '#ca8a04',
    accent: '#fbbf24',
    background: '#1c1917',
    surface: 'rgba(234, 179, 8, 0.1)',
    text: '#fffbeb',
    textSecondary: '#fde68a',
    border: 'rgba(234, 179, 8, 0.3)',
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#dc2626',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 25%, #713f12 50%, #a16207 75%, #292524 100%)'
  },
  arctic: {
    name: 'Arctic White',
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    accent: '#60a5fa',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569',
    border: '#cbd5e1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 25%, #f1f5f9 50%, #e2e8f0 75%, #ffffff 100%)'
  }
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('sharetrek-theme') as Theme;
    return stored && themes[stored] ? stored : 'midnight'; // Back to midnight as default
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
    
    // Apply background to body with immediate effect
    document.body.style.background = themeColors.gradient;
    document.body.style.color = themeColors.text;
    document.body.style.transition = 'all 0.3s ease';
    
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