'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

export interface ThemeSettings {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  textPrimary: string;
  textSecondary: string;
}

export const DEFAULT_DARK_THEME: ThemeSettings = {
  mode: 'dark',
  primaryColor: '#10b981',
  secondaryColor: '#14b8a6',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
};

export const DEFAULT_LIGHT_THEME: ThemeSettings = {
  mode: 'light',
  primaryColor: '#059669',
  secondaryColor: '#0d9488',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
};

const STORAGE_KEY = 'escolinha_fut_theme_v1';

interface ThemeContextType {
  theme: ThemeSettings;
  setTheme: React.Dispatch<React.SetStateAction<ThemeSettings>>;
  toggleMode: () => void;
  resetTheme: (mode?: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_DARK_THEME,
  setTheme: () => {},
  toggleMode: () => {},
  resetTheme: () => {},
});

function applyThemeToDom(t: ThemeSettings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const isLight = t.mode === 'light';

  root.setAttribute('data-theme', t.mode);
  root.classList.toggle('dark', !isLight);
  root.classList.toggle('light', isLight);

  root.style.setProperty('--theme-bg', isLight ? '#f1f5f9' : '#0f172a');
  root.style.setProperty('--theme-surface', isLight ? '#ffffff' : '#020617');
  root.style.setProperty('--theme-surface-2', isLight ? '#e2e8f0' : '#1e293b');
  root.style.setProperty('--theme-border', isLight ? '#cbd5e1' : '#1e293b');
  root.style.setProperty('--theme-primary', t.primaryColor);
  root.style.setProperty('--theme-secondary', t.secondaryColor);
  root.style.setProperty('--theme-text-primary', t.textPrimary);
  root.style.setProperty('--theme-text-secondary', t.textSecondary);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_DARK_THEME);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ThemeSettings>;
        const merged = { ...DEFAULT_DARK_THEME, ...parsed };
        setTheme(merged);
        applyThemeToDom(merged);
      } else {
        applyThemeToDom(DEFAULT_DARK_THEME);
      }
    } catch {
      applyThemeToDom(DEFAULT_DARK_THEME);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    applyThemeToDom(theme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      // ignore
    }
  }, [theme, loaded]);

  const toggleMode = () => {
    setTheme((prev) => {
      const nextMode: ThemeMode = prev.mode === 'dark' ? 'light' : 'dark';
      const wasDefaultDarkText = prev.textPrimary === DEFAULT_DARK_THEME.textPrimary && prev.textSecondary === DEFAULT_DARK_THEME.textSecondary;
      const wasDefaultLightText = prev.textPrimary === DEFAULT_LIGHT_THEME.textPrimary && prev.textSecondary === DEFAULT_LIGHT_THEME.textSecondary;

      if (nextMode === 'light' && wasDefaultDarkText) {
        return { ...prev, mode: 'light', textPrimary: DEFAULT_LIGHT_THEME.textPrimary, textSecondary: DEFAULT_LIGHT_THEME.textSecondary };
      }
      if (nextMode === 'dark' && wasDefaultLightText) {
        return { ...prev, mode: 'dark', textPrimary: DEFAULT_DARK_THEME.textPrimary, textSecondary: DEFAULT_DARK_THEME.textSecondary };
      }
      return { ...prev, mode: nextMode };
    });
  };

  const resetTheme = (mode: ThemeMode = theme.mode) => {
    setTheme(mode === 'light' ? DEFAULT_LIGHT_THEME : DEFAULT_DARK_THEME);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMode, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
