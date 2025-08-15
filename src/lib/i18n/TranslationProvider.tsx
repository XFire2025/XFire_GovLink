import React, { createContext, useState, ReactNode } from 'react';
import { Language, changeLanguage, getCurrentLanguage } from './config';

// Translation Context
interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  isChanging: boolean;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

// Translation Provider Component
interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => getCurrentLanguage());
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (language: Language) => {
    if (language === currentLanguage || isChanging) return;
    
    setIsChanging(true);
    try {
      await changeLanguage(language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const value: TranslationContextType = {
    currentLanguage,
    setLanguage: handleLanguageChange,
    isChanging
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export { TranslationContext };
export type { TranslationContextType };
