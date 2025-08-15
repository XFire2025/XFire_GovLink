'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '../lib/i18n/config';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'en',
  setLanguage: () => {},
  isLoading: true,
});

export const useLanguage = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useLanguage must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18next.changeLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('govlink-language', newLanguage);
    }
  };

  useEffect(() => {
    // Initialize i18next
    const initI18n = async () => {
      try {
        // Check for saved language preference (only on client side)
        const savedLanguage = typeof window !== 'undefined' 
          ? localStorage.getItem('govlink-language') || 'en'
          : 'en';
        
        // Initialize i18next if not already initialized
        if (!i18next.isInitialized) {
          await i18next.init();
        }
        
        // Set the language
        await i18next.changeLanguage(savedLanguage);
        setLanguage(savedLanguage);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing i18n:', error);
        setIsLoading(false);
      }
    };

    initI18n();
  }, []);

  const contextValue: TranslationContextType = {
    language,
    setLanguage: handleLanguageChange,
    isLoading,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <TranslationContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18next}>
        {children}
      </I18nextProvider>
    </TranslationContext.Provider>
  );
};
