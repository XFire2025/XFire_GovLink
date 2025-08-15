// Legacy i18n file - replaced by enhanced i18n system
// This file is kept for compatibility but functionality moved to /lib/i18n/

// Re-export the enhanced i18n system
export type { Language } from './i18n/config';
export { 
  SUPPORTED_LANGUAGES, 
  LANGUAGE_NAMES,
  getCurrentLanguage,
  changeLanguage,
  getLanguageName,
  formatNumber,
  formatDate,
  formatCurrency
} from './i18n/config';

export { 
  useTranslation as useI18nTranslation, 
  useLanguage, 
  useFormatting 
} from './i18n/hooks/useTranslation';

export { 
  translationService, 
  TranslationValidator, 
  LanguageUtils 
} from './i18n/utils/translator';

// Initialize the enhanced i18n system
import './i18n/config';
