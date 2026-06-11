import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof lightColors;
}

export const lightColors = {
  background: '#F8F7F4',
  card: '#FFFFFF',
  subtle: '#F0EEE9',
  inputBg: '#FFFFFF',
  primary: '#2563EB',
  primaryLight: '#EFF4FF',
  green: '#16A34A',
  greenLight: '#F0FDF4',
  text: '#1A1917',
  textSecondary: '#6B6862',
  textMuted: '#A09D98',
  border: 'rgba(0,0,0,0.08)',
  borderStrong: 'rgba(0,0,0,0.14)',
  headerBg: '#2563EB',
  tabBg: '#FFFFFF',
  danger: '#DC2626',
  dangerLight: 'rgba(220,38,38,0.08)',
  white: '#FFFFFF',
  success: '#16A34A',
  successLight: '#F0FDF4',
};

export type AppColors = typeof lightColors;

export const darkColors: typeof lightColors = {
  background: '#111110',
  card: '#1C1C1A',
  subtle: '#252522',
  inputBg: '#1C1C1A',
  primary: '#3B82F6',
  primaryLight: '#1E2B45',
  green: '#22C55E',
  greenLight: '#0F2318',
  text: '#F5F4F0',
  textSecondary: '#9D9B95',
  textMuted: '#6B6862',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.12)',
  headerBg: '#1A1917',
  tabBg: '#1C1C1A',
  danger: '#F87171',
  dangerLight: 'rgba(248,113,113,0.1)',
  white: '#FFFFFF',
  success: '#22C55E',
  successLight: '#0F2318',
};

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  isDark: false,
  setThemeMode: () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then((val) => {
      if (val === 'light' || val === 'dark' || val === 'system') {
        setThemeModeState(val);
      }
    });
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem('themeMode', mode);
  };

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, setThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
