/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useCallback } from 'react';
import { TelegramWebApp, TelegramUser, ThemeParams } from '../types/telegram';

interface UseTelegramReturn {
  // Core state
  isAvailable: boolean;
  isReady: boolean;
  user: TelegramUser | null;
  themeParams: ThemeParams;
  colorScheme: 'light' | 'dark';
  
  // App state
  isExpanded: boolean;
  isActive: boolean;
  isFullscreen: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  
  // Core methods
  ready: () => void;
  expand: () => void;
  close: () => void;
  
  // UI methods
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBottomBarColor: (color: string) => void;
  
  // Button controls
  showMainButton: (text: string, callback?: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (callback?: () => void) => void;
  hideBackButton: () => void;
  showSettingsButton: (callback?: () => void) => void;
  hideSettingsButton: () => void;
  
  // Haptic feedback
  hapticImpact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  hapticNotification: (type: 'error' | 'success' | 'warning') => void;
  hapticSelection: () => void;
  
  // Storage
  cloudStorage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
  
  // Alerts and popups
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }> }) => void;
  
  // Raw access
  tg: TelegramWebApp | null;
}

function useTelegram(): UseTelegramReturn {
  const [isReady, setIsReady] = useState(false);
  const [tg, setTg] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp;
    
    if (telegramWebApp) {
      setTg(telegramWebApp);
      
      // Initialize the Web App
      telegramWebApp.ready();
      setIsReady(true);
      
      // Set up theme
      if (telegramWebApp.themeParams) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', telegramWebApp.themeParams.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', telegramWebApp.themeParams.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-hint-color', telegramWebApp.themeParams.hint_color || '#999999');
        document.documentElement.style.setProperty('--tg-theme-link-color', telegramWebApp.themeParams.link_color || '#2481cc');
        document.documentElement.style.setProperty('--tg-theme-button-color', telegramWebApp.themeParams.button_color || '#2481cc');
        document.documentElement.style.setProperty('--tg-theme-button-text-color', telegramWebApp.themeParams.button_text_color || '#ffffff');
      }
    } else {
      console.warn('Telegram WebApp is not available');
    }
  }, []);

  const ready = useCallback(() => {
    if (tg) {
      tg.ready();
    }
  }, [tg]);

  const expand = useCallback(() => {
    if (tg) {
      tg.expand();
    }
  }, [tg]);

  const close = useCallback(() => {
    if (tg) {
      tg.close();
    }
  }, [tg]);

  const setHeaderColor = useCallback((color: string) => {
    if (tg) {
      tg.setHeaderColor(color);
    }
  }, [tg]);

  const setBackgroundColor = useCallback((color: string) => {
    if (tg) {
      tg.setBackgroundColor(color);
    }
  }, [tg]);

  const setBottomBarColor = useCallback((color: string) => {
    if (tg) {
      tg.setBottomBarColor(color);
    }
  }, [tg]);

  const showMainButton = useCallback((text: string, callback?: () => void) => {
    if (tg) {
      tg.MainButton.setText(text);
      tg.MainButton.show();
      if (callback) {
        tg.MainButton.onClick(callback);
      }
    }
  }, [tg]);

  const hideMainButton = useCallback(() => {
    if (tg) {
      tg.MainButton.hide();
    }
  }, [tg]);

  const showBackButton = useCallback((callback?: () => void) => {
    if (tg) {
      tg.BackButton.show();
      if (callback) {
        tg.BackButton.onClick(callback);
      }
    }
  }, [tg]);

  const hideBackButton = useCallback(() => {
    if (tg) {
      tg.BackButton.hide();
    }
  }, [tg]);

  const showSettingsButton = useCallback((callback?: () => void) => {
    if (tg) {
      tg.SettingsButton.show();
      if (callback) {
        tg.SettingsButton.onClick(callback);
      }
    }
  }, [tg]);

  const hideSettingsButton = useCallback(() => {
    if (tg) {
      tg.SettingsButton.hide();
    }
  }, [tg]);

  const hapticImpact = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(style);
    }
  }, [tg]);

  const hapticNotification = useCallback((type: 'error' | 'success' | 'warning') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred(type);
    }
  }, [tg]);

  const hapticSelection = useCallback(() => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.selectionChanged();
    }
  }, [tg]);

  const cloudStorage = {
    getItem: useCallback(async (key: string): Promise<string | null> => {
      if (tg?.CloudStorage) {
        return await tg.CloudStorage.getItem(key);
      }
      return null;
    }, [tg]),
    
    setItem: useCallback(async (key: string, value: string): Promise<void> => {
      if (tg?.CloudStorage) {
        await tg.CloudStorage.setItem(key, value);
      }
    }, [tg]),
    
    removeItem: useCallback(async (key: string): Promise<void> => {
      if (tg?.CloudStorage) {
        await tg.CloudStorage.removeItem(key);
      }
    }, [tg]),
  };

  const showAlert = useCallback(async (message: string): Promise<void> => {
    return new Promise((resolve) => {
      if (tg) {
        tg.showAlert(message, resolve);
      } else {
        alert(message);
        resolve();
      }
    });
  }, [tg]);

  const showConfirm = useCallback(async (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (tg) {
        tg.showConfirm(message, resolve);
      } else {
        const confirmed = window.confirm(message);
        resolve(confirmed);
      }
    });
  }, [tg]);

  const showPopup = useCallback((params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }> }) => {
    if (tg) {
      tg.showPopup(params);
    } else {
      alert(params.message);
    }
  }, [tg]);

  return {
    // Core state
    isAvailable: !!tg,
    isReady,
    user: tg?.initDataUnsafe?.user || null,
    themeParams: tg?.themeParams || {},
    colorScheme: tg?.colorScheme || 'light',
    
    // App state
    isExpanded: tg?.isExpanded || false,
    isActive: tg?.isActive || false,
    isFullscreen: tg?.isFullscreen || false,
    viewportHeight: tg?.viewportHeight || 0,
    viewportStableHeight: tg?.viewportStableHeight || 0,
    
    // Core methods
    ready,
    expand,
    close,
    
    // UI methods
    setHeaderColor,
    setBackgroundColor,
    setBottomBarColor,
    
    // Button controls
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showSettingsButton,
    hideSettingsButton,
    
    // Haptic feedback
    hapticImpact,
    hapticNotification,
    hapticSelection,
    
    // Storage
    cloudStorage,
    
    // Alerts and popups
    showAlert,
    showConfirm,
    showPopup,
    
    // Raw access
    tg,
  };
}

export default useTelegram; 