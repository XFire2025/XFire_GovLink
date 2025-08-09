import { useTranslation as useI18nTranslation } from 'react-i18next';
import { Language, changeLanguage, getCurrentLanguage } from '../config';

// Enhanced useTranslation hook with type safety
export function useTranslation(namespace?: string) {
  const { t, i18n } = useI18nTranslation(namespace);
  
  return {
    t,
    i18n,
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    isLoading: !i18n.isInitialized
  };
}

// Hook specifically for language management
export function useLanguage() {
  const { i18n } = useI18nTranslation();
  
  const setLanguage = async (language: Language) => {
    await changeLanguage(language);
    // Trigger a re-render after language change
    window.location.reload();
  };
  
  return {
    currentLanguage: getCurrentLanguage(),
    setLanguage,
    isChanging: i18n.isInitialized && i18n.isInitialized
  };
}

// Hook for formatting utilities
export function useFormatting() {
  const currentLanguage = getCurrentLanguage();
  
  const formatNumber = (number: number): string => {
    const locale = currentLanguage === 'si' ? 'si-LK' : currentLanguage === 'ta' ? 'ta-LK' : 'en-LK';
    return new Intl.NumberFormat(locale).format(number);
  };
  
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const locale = currentLanguage === 'si' ? 'si-LK' : currentLanguage === 'ta' ? 'ta-LK' : 'en-LK';
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat(locale, options || defaultOptions).format(date);
  };
  
  const formatCurrency = (amount: number): string => {
    const locale = currentLanguage === 'si' ? 'si-LK' : currentLanguage === 'ta' ? 'ta-LK' : 'en-LK';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };
  
  const formatTime = (date: Date): string => {
    const locale = currentLanguage === 'si' ? 'si-LK' : currentLanguage === 'ta' ? 'ta-LK' : 'en-LK';
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
    currentLanguage
  };
}
