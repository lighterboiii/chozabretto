/* eslint-disable @typescript-eslint/no-explicit-any */

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

interface TelegramWebApp {
  close: () => void;
  expand: () => void;
  ready: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  colorScheme: 'light' | 'dark';
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  platform: string;
  version: string;
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    photo_url?: string;
  };
}

function useTelegram() {
  const tg = (window as any).Telegram?.WebApp as TelegramWebApp;

  if (!tg) {
    console.warn('Telegram WebApp is not available');
    return {
      isAvailable: false,
      onAppClose: () => {},
      tg: null,
      user: null,
      queryId: null,
      userPhoto: null,
      themeParams: {},
      colorScheme: 'light' as const,
      isExpanded: false,
      expand: () => {},
      ready: () => {},
      close: () => {},
    };
  }

  const onAppClose = () => {
    tg.close();
  };

  const expand = () => {
    tg.expand();
  };

  const ready = () => {
    tg.ready();
  };

  return {
    isAvailable: true,
    onAppClose,
    tg,
    user: tg.initDataUnsafe?.user || null,
    queryId: tg.initDataUnsafe?.query_id || null,
    userPhoto: tg.initDataUnsafe?.user?.photo_url || null,
    themeParams: tg.themeParams || {},
    colorScheme: tg.colorScheme || 'light',
    isExpanded: tg.isExpanded || false,
    expand,
    ready,
    close: onAppClose,
  };
}

export default useTelegram;
export type { TelegramUser, TelegramWebApp }; 