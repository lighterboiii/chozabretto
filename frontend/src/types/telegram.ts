// Telegram Web App API Types based on https://core.telegram.org/bots/webapps

export interface TelegramUser {
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

export interface ThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
  bottom_bar_bg_color?: string;
  section_separator_color?: string;
}

export interface MainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible: boolean;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive?: boolean) => void;
  hideProgress: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  setText: (text: string) => void;
  setParams: (params: { text?: string; color?: string; text_color?: string; is_visible?: boolean; is_active?: boolean; is_progress_visible?: boolean }) => void;
}

export interface BackButton {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

export interface SettingsButton {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

export interface SecondaryButton {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

export interface HapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged: () => void;
}

export interface CloudStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  getItems: (keys: string[]) => Promise<Record<string, string | null>>;
  setItems: (items: Record<string, string>) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  removeItems: (keys: string[]) => Promise<void>;
  getKeys: () => Promise<string[]>;
}

export interface BiometricManager {
  isInited: boolean;
  isSupported: boolean;
  isEnrolled: boolean;
  isAccessRequested: boolean;
  isAccessGranted: boolean;
  init: () => Promise<void>;
  authenticate: (reason?: string) => Promise<boolean>;
  requestAccess: () => Promise<boolean>;
}

export interface DeviceStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  getKeys: () => Promise<string[]>;
}

export interface SecureStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  getKeys: () => Promise<string[]>;
}

export interface LocationManager {
  isInited: boolean;
  isSupported: boolean;
  isAccessRequested: boolean;
  isAccessGranted: boolean;
  init: () => Promise<void>;
  requestAccess: () => Promise<boolean>;
  getCurrentPosition: () => Promise<{ latitude: number; longitude: number; accuracy?: number }>;
}

export interface Accelerometer {
  isInited: boolean;
  isSupported: boolean;
  isStarted: boolean;
  init: () => Promise<void>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  onChanged: (callback: (data: { x: number; y: number; z: number }) => void) => void;
  offChanged: (callback: (data: { x: number; y: number; z: number }) => void) => void;
}

export interface DeviceOrientation {
  isInited: boolean;
  isSupported: boolean;
  isStarted: boolean;
  init: () => Promise<void>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  onChanged: (callback: (data: { alpha: number; beta: number; gamma: number }) => void) => void;
  offChanged: (callback: (data: { alpha: number; beta: number; gamma: number }) => void) => void;
}

export interface Gyroscope {
  isInited: boolean;
  isSupported: boolean;
  isStarted: boolean;
  init: () => Promise<void>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  onChanged: (callback: (data: { x: number; y: number; z: number }) => void) => void;
  offChanged: (callback: (data: { x: number; y: number; z: number }) => void) => void;
}

export interface TelegramWebApp {
  // Core methods
  ready: () => void;
  expand: () => void;
  close: () => void;
  
  // Buttons
  MainButton: MainButton;
  BackButton: BackButton;
  SettingsButton: SettingsButton;
  SecondaryButton: SecondaryButton;
  
  // UI and theming
  themeParams: ThemeParams;
  colorScheme: 'light' | 'dark';
  headerColor: string;
  backgroundColor: string;
  bottomBarColor: string;
  
  // State
  isExpanded: boolean;
  isActive: boolean;
  isFullscreen: boolean;
  isOrientationLocked: boolean;
  isVerticalSwipesEnabled: boolean;
  isClosingConfirmationEnabled: boolean;
  
  // Viewport
  viewportHeight: number;
  viewportStableHeight: number;
  safeAreaInset: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  contentSafeAreaInset: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Platform info
  platform: string;
  version: string;
  
  // Data
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    photo_url?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date?: number;
    hash?: string;
  };
  
  // Features
  HapticFeedback: HapticFeedback;
  CloudStorage: CloudStorage;
  BiometricManager: BiometricManager;
  DeviceStorage: DeviceStorage;
  SecureStorage: SecureStorage;
  LocationManager: LocationManager;
  Accelerometer: Accelerometer;
  DeviceOrientation: DeviceOrientation;
  Gyroscope: Gyroscope;
  
  // Methods
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBottomBarColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  enableVerticalSwipes: () => void;
  disableVerticalSwipes: () => void;
  lockOrientation: (orientation: 'portrait' | 'landscape') => void;
  unlockOrientation: () => void;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  addToHomeScreen: () => void;
  checkHomeScreenStatus: () => Promise<{ isAdded: boolean; isSupported: boolean }>;
  setEmojiStatus: (emoji: string, duration?: number) => void;
  requestEmojiStatusAccess: () => void;
  shareMessage: (text: string, options?: { url?: string; title?: string; description?: string; image?: string }) => void;
  downloadFile: (url: string, filename?: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  showScanQrPopup: (text?: string) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: () => void;
  requestWriteAccess: () => void;
  requestContact: () => void;
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }> }) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  shareToStory: (params: { url?: string; text?: string; title?: string; description?: string; image?: string }) => void;
  
  // Events
  onEvent: (eventType: string, eventHandler: (event: any) => void) => void;
  offEvent: (eventType: string, eventHandler: (event: any) => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
} 