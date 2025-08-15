import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation resources
import enCommon from './resources/en/common.json';
import enAuth from './resources/en/auth.json';
import enHome from './resources/en/home.json';
import enUser from './resources/en/user.json';
import enAgent from './resources/en/agent.json';
import enAdmin from './resources/en/admin.json';
import enDepartment from './resources/en/department.json';

import siCommon from './resources/si/common.json';
import siAuth from './resources/si/auth.json';
import siHome from './resources/si/home.json';
// import siDepartment from './resources/si/department.json'; // Add when created

import taCommon from './resources/ta/common.json';
import taAuth from './resources/ta/auth.json';
import taHome from './resources/ta/home.json';
// import taDepartment from './resources/ta/department.json'; // Add when created

// Language configuration
export const SUPPORTED_LANGUAGES = ['en', 'si', 'ta'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];

export const LANGUAGE_NAMES = {
  en: { native: 'English', english: 'English' },
  si: { native: 'සිංහල', english: 'Sinhala' },
  ta: { native: 'தமிழ்', english: 'Tamil' }
} as const;

// Translation resources
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    home: enHome,
    user: enUser,
    agent: enAgent,
    admin: enAdmin,
    department: enDepartment
  },
  si: {
    common: siCommon,
    auth: siAuth,
    home: siHome,
    user: enUser, // Fallback to English for incomplete translations
    agent: enAgent,
    admin: enAdmin,
    department: enDepartment // Fallback to English for now
  },
  ta: {
    common: taCommon,
    auth: taAuth,
    home: taHome,
    user: enUser, // Fallback to English for incomplete translations
    agent: enAgent,
    admin: enAdmin,
    department: enDepartment // Fallback to English for now
  }
};

// Language detection options
const languageDetectorOptions = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: 'govlink-language',
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  checkWhitelist: true
};

// i18next configuration
const i18nConfig = {
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  
  // Interpolation settings
  interpolation: {
    escapeValue: false, // React already does escaping
    formatSeparator: ',',
    format: function(value: string | number, format?: string): string {
      if (!format) return String(value);
      if (format === 'uppercase') return String(value).toUpperCase();
      if (format === 'lowercase') return String(value).toLowerCase();
      if (format === 'capitalize') return String(value).charAt(0).toUpperCase() + String(value).slice(1);
      return String(value);
    }
  },
  
  // React specific settings
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span']
  },
  
  // Detection settings
  detection: languageDetectorOptions,
  
  // Namespace settings
  defaultNS: 'common',
  ns: ['common', 'auth', 'home', 'user', 'agent', 'admin', 'department'],
  
  // Backend settings for dynamic loading
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    allowMultiLoading: false,
    crossDomain: false
  },
  
  // Language whitelist
  supportedLngs: SUPPORTED_LANGUAGES,
  nonExplicitSupportedLngs: false,
  
  // Key separator
  keySeparator: '.',
  nsSeparator: ':',
  
  // Missing key handling
  saveMissing: process.env.NODE_ENV === 'development',
  missingKeyHandler: function(lngs: readonly string[], ns: string, key: string) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation key: ${lngs[0]}:${ns}:${key}`);
    }
  }
};

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig);

// Helper functions
export const getCurrentLanguage = (): Language => {
  return i18n.language as Language || 'en';
};

export const changeLanguage = async (language: Language): Promise<void> => {
  await i18n.changeLanguage(language);
};

export const getLanguageName = (language: Language, inLanguage?: Language): string => {
  const names = LANGUAGE_NAMES[language];
  if (inLanguage && inLanguage !== 'en') {
    return names.native;
  }
  return names.english;
};

// RTL language check
export const isRTL = (): boolean => {
  return false; // None of our supported languages are RTL
};

// Number formatting
export const formatNumber = (number: number, language: Language): string => {
  const locale = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-LK';
  return new Intl.NumberFormat(locale).format(number);
};

// Date formatting
export const formatDate = (date: Date, language: Language, options?: Intl.DateTimeFormatOptions): string => {
  const locale = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-LK';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(date);
};

// Currency formatting
export const formatCurrency = (amount: number, language: Language): string => {
  const locale = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-LK';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'LKR'
  }).format(amount);
};

export default i18n;