'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd';

export let message: ReturnType<typeof AntdApp.useApp>['message'];
export let notification: ReturnType<typeof AntdApp.useApp>['notification'];
export let modal: ReturnType<typeof AntdApp.useApp>['modal'];

function StaticApp() {
  const { message: msg, notification: notify, modal: mdl } = AntdApp.useApp();
  useEffect(() => {
    message = msg;
    notification = notify;
    modal = mdl;
  }, [msg, notify, mdl]);
  return null;
}

export type Theme =
  | 'system'
  | 'light'
  | 'dark'
  | 'lavender'
  | 'copper-teal'
  | 'coffee'
  | 'ocean'
  | 'cherry-blossom';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  fontSizeOffset: number;
  setFontSizeOffset: (offset: number) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
  fontSizeOffset: 0,
  setFontSizeOffset: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function resolveIsDark(theme: Theme): boolean {
  if (theme === 'system') {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  if (theme === 'light' || theme === 'cherry-blossom') {
    return false;
  }
  return true;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [fontSizeOffset, setFontSizeOffsetState] = useState<number>(0);

  useEffect(() => {
    const stored = getItem<Theme>(STORAGE_KEYS.THEME, 'light');
    setThemeState(stored);
    const storedFont = getItem<number>('proport_font_size_offset', 0);
    setFontSizeOffsetState(storedFont);
  }, []);

  useEffect(() => {
    const isDark = resolveIsDark(theme);
    const resolved = isDark ? 'dark' : 'light';
    setResolvedTheme(resolved);

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    const isCustom = ['lavender', 'copper-teal', 'coffee', 'ocean', 'cherry-blossom'].includes(theme);
    root.setAttribute('data-color-theme', isCustom ? theme : 'default');
    root.setAttribute('data-theme', theme);
  }, [theme]);

  // System media query changes listener
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const isDark = e.matches;
      const resolved = isDark ? 'dark' : 'light';
      setResolvedTheme(resolved);

      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-scale', `${fontSizeOffset}px`);
  }, [fontSizeOffset]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setItem(STORAGE_KEYS.THEME, t);
  }, []);

  const setFontSizeOffset = useCallback((offset: number) => {
    setFontSizeOffsetState(offset);
    setItem('proport_font_size_offset', offset);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, fontSizeOffset, setFontSizeOffset }}>
      <ConfigProvider
        theme={{
          algorithm: resolvedTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: resolvedTheme === 'dark' ? { colorBgElevated: '#18181b' } : undefined,
        }}
      >
        <AntdApp>
          <StaticApp />
          {children}
        </AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
