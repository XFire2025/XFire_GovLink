import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../lib/i18n/hooks/useTranslation';
import { LANGUAGE_NAMES, Language } from '../lib/i18n/config';
import { LanguageUtils } from '../lib/i18n/utils/translator';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full';
  showFlag?: boolean;
}

export function LanguageSwitcher({ 
  className = '', 
  variant = 'compact',
  showFlag = true 
}: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, isChanging } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const languages: Language[] = ['en', 'si', 'ta'];
  
  const handleLanguageChange = async (language: Language) => {
    if (language !== currentLanguage && !isChanging) {
      await setLanguage(language);
      setIsOpen(false);
    }
  };
  
  const getCurrentLanguageName = () => {
    return LANGUAGE_NAMES[currentLanguage as Language].native;
  };
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border
          bg-white dark:bg-gray-800 
          border-gray-200 dark:border-gray-700
          text-gray-700 dark:text-gray-300
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-200
          ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'ring-2 ring-blue-500' : ''}
        `}
      >
        {showFlag && (
          <span className="text-lg">
            {LanguageUtils.getLanguageFlag(currentLanguage as Language)}
          </span>
        )}
        {variant === 'compact' ? (
          <span className="text-sm font-medium">
            {getCurrentLanguageName()}
          </span>
        ) : (
          <>
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              {getCurrentLanguageName()}
            </span>
          </>
        )}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 z-20 min-w-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  disabled={isChanging}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-colors duration-150
                    ${currentLanguage === lang 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300'
                    }
                    ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {showFlag && (
                    <span className="text-lg">
                      {LanguageUtils.getLanguageFlag(lang)}
                    </span>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">
                      {LANGUAGE_NAMES[lang].native}
                    </div>
                    {variant === 'full' && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {LANGUAGE_NAMES[lang].english}
                      </div>
                    )}
                  </div>
                  {currentLanguage === lang && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Compact version for mobile/tight spaces
export function CompactLanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <LanguageSwitcher 
      className={className}
      variant="compact"
      showFlag={true}
    />
  );
}

// Full version for desktop/prominent placement
export function FullLanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <LanguageSwitcher 
      className={className}
      variant="full"
      showFlag={true}
    />
  );
}
