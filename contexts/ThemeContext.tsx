import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark' | 'system';

export interface Colors {
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceSecondary: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Brand colors (preserved from your original design)
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Accent colors
  accent: string;
  accentLight: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Shadow colors
  shadow: string;
  
  // Overlay colors
  overlay: string;
  overlayLight: string;
  
  // Special colors
  tabBarBackground: string;
  tabBarBorder: string;
  cardBackground: string;
  inputBackground: string;
}

export const lightColors: Colors = {
  // Background colors
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F9FAFB',
  surfaceSecondary: '#F3F4F6',
  
  // Text colors
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Brand colors (your original teal)
  primary: '#2DD4BF',
  primaryLight: '#F0FDFA',
  primaryDark: '#0F766E',
  
  // Accent colors
  accent: '#FF6B82',
  accentLight: '#FFF1F3',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Border and divider colors
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  // Shadow colors
  shadow: '#000000',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
  
  // Special colors
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#F1F5F9',
  cardBackground: '#FFFFFF',
  inputBackground: '#F9FAFB',
};

export const darkColors: Colors = {
  // Background colors
  background: '#0F172A',
  surface: '#1E293B',
  surfaceVariant: '#334155',
  surfaceSecondary: '#475569',
  
  // Text colors
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  
  // Brand colors (adjusted for dark theme)
  primary: '#2DD4BF',
  primaryLight: '#1E3A3A',
  primaryDark: '#5EEAD4',
  
  // Accent colors
  accent: '#FF6B82',
  accentLight: '#3D1A20',
  
  // Status colors
  success: '#22C55E',
  warning: '#EAB308',
  error: '#F87171',
  info: '#60A5FA',
  
  // Border and divider colors
  border: '#475569',
  divider: '#334155',
  
  // Shadow colors
  shadow: '#000000',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Special colors
  tabBarBackground: '#1E293B',
  tabBarBorder: '#334155',
  cardBackground: '#1E293B',
  inputBackground: '#334155',
};

interface ThemeContextType {
  theme: Theme;
  colors: Colors;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@fitness_app_theme';

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme as Theme);
        }
      } catch (error) {
        console.warn('Failed to load theme from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
  }, []);
  
  // Save theme to storage when it changes
  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
      setThemeState(newTheme);
    }
  };
  
  // Determine the actual color scheme based on theme setting
  const getActualColorScheme = (themePreference: Theme) => {
    if (themePreference === 'system') {
      return systemColorScheme || 'light';
    }
    return themePreference;
  };
  
  const actualColorScheme = getActualColorScheme(theme);
  const isDark = actualColorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  
  // Toggle between light and dark (skip system)
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  const value: ThemeContextType = {
    theme,
    colors,
    isDark,
    setTheme,
    toggleTheme,
    isLoading,
  };
  
  // Don't render anything while loading theme
  if (isLoading) {
    return null;
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for creating themed styles
export function useThemedStyles<T>(styleCreator: (colors: Colors, isDark: boolean) => T): T {
  const { colors, isDark } = useTheme();
  return styleCreator(colors, isDark);
}
