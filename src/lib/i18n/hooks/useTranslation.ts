import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLanguage as useLanguageProvider } from '@/components/TranslationProvider';

// Enhanced useTranslation hook with type safety
export function useTranslation(namespace?: string) {
  const { t, i18n } = useI18nTranslation(namespace);
  const { language, setLanguage, isLoading } = useLanguageProvider();
  
  return {
    t,
    i18n,
    currentLanguage: language,
    setLanguage,
    isChanging: false,
    isLoading: isLoading || !i18n.isInitialized
  };
}

// Hook specifically for language management
export function useLanguage() {
  const { language, setLanguage, isLoading } = useLanguageProvider();
  
  return {
    currentLanguage: language,
    setLanguage,
    isChanging: isLoading
  };
}

// Hook for formatting utilities
export function useFormatting() {
  const { language } = useLanguageProvider();
  
  const formatNumber = (number: number): string => {
    const locale = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-LK';
    return new Intl.NumberFormat(locale).format(number);
  };
  
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const locale = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-LK';
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat(locale, options || defaultOptions).format(date);
  };
  
  const formatCurrency = (amount: number): string => {
    const locale = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-LK';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };
  
  const formatTime = (date: Date): string => {
    const locale = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-LK';
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return {
    formatNumber,
    formatDate,
    formatCurrency,
    formatTime,
    currentLanguage: language
  };
}
