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
    name: 'Ocean Depths',
    primary: '#00d4ff',
    secondary: '#0891b2',
    accent: '#38bdf8',
    background: '#0a1628',
    surface: 'rgba(0, 212, 255, 0.08)',
    text: '#f0f9ff',
    textSecondary: '#7dd3fc',
    border: 'rgba(0, 212, 255, 0.25)',
    success: '#06d6a0',
    warning: '#ffd23f',
    error: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #164e63 20%, #0891b2 40%, #0e7490 60%, #164e63 80%, #0a1628 100%)'
  },
  forest: {
    name: 'Mystic Forest',
    primary: '#00ff88',
    secondary: '#065f46',
    accent: '#4ade80',
    background: '#0d1b0d',
    surface: 'rgba(0, 255, 136, 0.08)',
    text: '#f0fdf4',
    textSecondary: '#86efac',
    border: 'rgba(0, 255, 136, 0.25)',
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #0d1b0d 0%, #14532d 20%, #166534 40%, #15803d 60%, #14532d 80%, #0d1b0d 100%)'
  },
  sunset: {
    name: 'Phoenix Sunset',
    primary: '#ff6b35',
    secondary: '#c2410c',
    accent: '#fb923c',
    background: '#1a0f0a',
    surface: 'rgba(255, 107, 53, 0.08)',
    text: '#fef7ed',
    textSecondary: '#fed7aa',
    border: 'rgba(255, 107, 53, 0.25)',
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #1a0f0a 0%, #431407 20%, #9a3412 40%, #ea580c 60%, #431407 80%, #1a0f0a 100%)'
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
    name: 'Dragon Fire',
    primary: '#ff3366',
    secondary: '#b91c1c',
    accent: '#f87171',
    background: '#1a0a0f',
    surface: 'rgba(255, 51, 102, 0.08)',
    text: '#fef2f2',
    textSecondary: '#fca5a5',
    border: 'rgba(255, 51, 102, 0.25)',
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #1a0a0f 0%, #450a0a 20%, #7f1d1d 40%, #dc2626 60%, #450a0a 80%, #1a0a0f 100%)'
  },
  gold: {
    name: 'Golden Empire',
    primary: '#ffb800',
    secondary: '#ca8a04',
    accent: '#fbbf24',
    background: '#1a1611',
    surface: 'rgba(255, 184, 0, 0.08)',
    text: '#fffbeb',
    textSecondary: '#fde68a',
    border: 'rgba(255, 184, 0, 0.25)',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #1a1611 0%, #451a03 20%, #92400e 40%, #d97706 60%, #451a03 80%, #1a1611 100%)'
  },
  arctic: {
    name: 'Arctic Frost',
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#38bdf8',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569',
    border: '#e2e8f0',
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
    const body = document.body;
    const themeColors = themes[theme];
    
    // Force immediate update by removing transitions temporarily
    root.style.transition = 'none';
    body.style.transition = 'none';
    
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
    body.style.background = themeColors.gradient;
    body.style.color = themeColors.text;
    
    // Re-enable transitions after a brief delay
    setTimeout(() => {
      root.style.transition = '';
      body.style.transition = 'all 0.3s ease';
    }, 50);
    
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