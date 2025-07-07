import { useState, useEffect } from 'react';

export type Theme = 'midnight' | 'ocean' | 'forest' | 'lavender' | 'crimson' | 'coastal' | 'berry' | 'mint' | 'plum' | 'rose';

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
    secondary: '#1e1b4b',
    accent: '#3b82f6',
    background: '#0f0f23',
    surface: '#1e1b4b',
    text: '#ffffff',
    textSecondary: '#a78bfa',
    border: '#374151',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gradient: 'linear-gradient(135deg, #0f0f23 0%, #1e1b4b 100%)'
  },
  ocean: {
    name: 'Ocean Depths',
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
    name: 'Mystic Forest',
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
  lavender: {
    name: 'Royal Lavender',
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
    name: 'Dragon Fire',
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
  coastal: {
    name: 'Coastal Breeze',
    primary: '#1B3C53',
    secondary: '#2d5a7b',
    accent: '#66D2CE',
    background: '#0f1419',
    surface: '#1B3C53',
    text: '#FCD8CD',
    textSecondary: '#90D1CA',
    border: '#2d5a7b',
    success: '#66D2CE',
    warning: '#FCD8CD',
    error: '#901E3E',
    gradient: 'linear-gradient(135deg, #0f1419 0%, #1B3C53 100%)'
  },
  berry: {
    name: 'Berry Fusion',
    primary: '#511D43',
    secondary: '#901E3E',
    accent: '#C599B6',
    background: '#1a0f17',
    surface: '#511D43',
    text: '#FCC6FF',
    textSecondary: '#C599B6',
    border: '#901E3E',
    success: '#66D2CE',
    warning: '#FCD8CD',
    error: '#780C28',
    gradient: 'linear-gradient(135deg, #1a0f17 0%, #511D43 100%)'
  },
  mint: {
    name: 'Mint Paradise',
    primary: '#90D1CA',
    secondary: '#66D2CE',
    accent: '#AA60C8',
    background: '#0f1a19',
    surface: '#1a2e2d',
    text: '#FCD8CD',
    textSecondary: '#C599B6',
    border: '#66D2CE',
    success: '#90D1CA',
    warning: '#FCD8CD',
    error: '#901E3E',
    gradient: 'linear-gradient(135deg, #0f1a19 0%, #1a2e2d 100%)'
  },
  plum: {
    name: 'Mystic Plum',
    primary: '#AA60C8',
    secondary: '#511D43',
    accent: '#FCC6FF',
    background: '#1a0f1a',
    surface: '#2d1a2d',
    text: '#FCC6FF',
    textSecondary: '#C599B6',
    border: '#AA60C8',
    success: '#90D1CA',
    warning: '#FCD8CD',
    error: '#780C28',
    gradient: 'linear-gradient(135deg, #1a0f1a 0%, #2d1a2d 100%)'
  },
  rose: {
    name: 'Rose Garden',
    primary: '#FCC6FF',
    secondary: '#C599B6',
    accent: '#FCD8CD',
    background: '#1a171a',
    surface: '#2d252d',
    text: '#FCC6FF',
    textSecondary: '#C599B6',
    border: '#C599B6',
    success: '#90D1CA',
    warning: '#FCD8CD',
    error: '#780C28',
    gradient: 'linear-gradient(135deg, #1a171a 0%, #2d252d 100%)'
  }
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('midnight');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sharetrek-theme') as Theme;
      const initialTheme = stored && themes[stored] ? stored : 'midnight';
      setTheme(initialTheme);
    } catch (error) {
      console.error('Error loading theme:', error);
      setTheme('midnight');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    try {
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
      
      // Set dark class for all themes
      root.classList.add('dark');
      
      // Apply background to body
      document.body.style.background = themeColors.gradient;
      document.body.style.color = themeColors.text;
      document.body.style.minHeight = '100vh';
      
      localStorage.setItem('sharetrek-theme', theme);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme, isInitialized]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { 
    theme, 
    changeTheme, 
    currentTheme: themes[theme],
    allThemes: themes,
    isInitialized
  };
}