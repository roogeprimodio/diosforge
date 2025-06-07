import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    error: string;
    border: string;
    card: string;
    shadow: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemColorScheme as ThemeType || 'light');
  
  useEffect(() => {
    // Update theme based on system preference changes
    setTheme(systemColorScheme as ThemeType || 'light');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const lightColors = {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#212121',
    primary: '#6200EE',
    secondary: '#03DAC6',
    accent: '#FF4081',
    error: '#B00020',
    border: '#E0E0E0',
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)'
  };

  const darkColors = {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#F5F5F5',
    primary: '#BB86FC',
    secondary: '#03DAC6',
    accent: '#FF7597',
    error: '#CF6679',
    border: '#333333',
    card: '#2A2A2A',
    shadow: 'rgba(0, 0, 0, 0.3)'
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};