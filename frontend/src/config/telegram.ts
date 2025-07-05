export const TELEGRAM_CONFIG = {
  APP_URL: process.env.REACT_APP_TELEGRAM_APP_URL || 'https://your-domain.com',
  
  // Название приложения
  APP_NAME: 'Lookiano - Мой гардероб',
  
  // Описание приложения
  APP_DESCRIPTION: 'Приложение для управления гардеробом в Telegram',
  
  // Настройки темы по умолчанию
  DEFAULT_THEME: {
    bg_color: '#ffffff',
    text_color: '#000000',
    hint_color: '#999999',
    link_color: '#2481cc',
    button_color: '#2481cc',
    button_text_color: '#ffffff',
    secondary_bg_color: '#f1f1f1',
    header_bg_color: '#ffffff',
    accent_text_color: '#2481cc',
    section_bg_color: '#ffffff',
    section_header_text_color: '#000000',
    subtitle_text_color: '#999999',
    destructive_text_color: '#ff3b30',
    bottom_bar_bg_color: '#ffffff',
    section_separator_color: '#e5e5e5',
  },
  
  // Настройки для темной темы
  DARK_THEME: {
    bg_color: '#1c1c1e',
    text_color: '#ffffff',
    hint_color: '#8e8e93',
    link_color: '#0a84ff',
    button_color: '#0a84ff',
    button_text_color: '#ffffff',
    secondary_bg_color: '#2c2c2e',
    header_bg_color: '#1c1c1e',
    accent_text_color: '#0a84ff',
    section_bg_color: '#2c2c2e',
    section_header_text_color: '#ffffff',
    subtitle_text_color: '#8e8e93',
    destructive_text_color: '#ff453a',
    bottom_bar_bg_color: '#1c1c1e',
    section_separator_color: '#38383a',
  },
  
  // Настройки кнопок
  BUTTONS: {
    MAIN_BUTTON: {
      text: 'Сохранить',
      color: '#2481cc',
      textColor: '#ffffff',
    },
    BACK_BUTTON: {
      text: 'Назад',
    },
  },
  
  // Настройки уведомлений
  NOTIFICATIONS: {
    SUCCESS: {
      title: 'Успешно',
      message: 'Операция выполнена успешно',
    },
    ERROR: {
      title: 'Ошибка',
      message: 'Произошла ошибка',
    },
    CONFIRM: {
      title: 'Подтверждение',
      message: 'Вы уверены?',
    },
  },
  
  // Настройки загрузки
  LOADING: {
    TEXT: 'Загрузка...',
    TIMEOUT: 10000, // 10 секунд
  },
  
  // Настройки хранилища
  STORAGE: {
    PREFIX: 'lookiano_',
    KEYS: {
      USER_PREFERENCES: 'user_preferences',
      CLOTHING_CACHE: 'clothing_cache',
      OUTFITS_CACHE: 'outfits_cache',
      THEME_PREFERENCES: 'theme_preferences',
    },
  },
  
  // Настройки API
  API: {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },
  
  // Настройки изображений
  IMAGES: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    COMPRESSION_QUALITY: 0.8,
  },
  
  // Настройки валидации
  VALIDATION: {
    CLOTHING_NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    OUTFIT_NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50,
    },
    DESCRIPTION: {
      MAX_LENGTH: 500,
    },
  },
  
  // Настройки пагинации
  PAGINATION: {
    ITEMS_PER_PAGE: 20,
    MAX_PAGES: 50,
  },
  
  // Настройки анимаций
  ANIMATIONS: {
    DURATION: 300,
    EASING: 'ease-in-out',
  },
  
  // Настройки отладки
  DEBUG: {
    ENABLED: process.env.NODE_ENV === 'development',
    LOG_LEVEL: 'info',
  },
};

// Функции для работы с конфигурацией
export const getThemeConfig = (colorScheme: 'light' | 'dark') => {
  return colorScheme === 'dark' ? TELEGRAM_CONFIG.DARK_THEME : TELEGRAM_CONFIG.DEFAULT_THEME;
};

export const getStorageKey = (key: string) => {
  return `${TELEGRAM_CONFIG.STORAGE.PREFIX}${key}`;
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const getApiUrl = (endpoint: string) => {
  return `${TELEGRAM_CONFIG.API.BASE_URL}${endpoint}`;
};

// Типы для конфигурации
export interface TelegramThemeConfig {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
  secondary_bg_color: string;
  header_bg_color: string;
  accent_text_color: string;
  section_bg_color: string;
  section_header_text_color: string;
  subtitle_text_color: string;
  destructive_text_color: string;
  bottom_bar_bg_color: string;
  section_separator_color: string;
}

export interface TelegramButtonConfig {
  text: string;
  color?: string;
  textColor?: string;
}

export interface TelegramNotificationConfig {
  title: string;
  message: string;
} 