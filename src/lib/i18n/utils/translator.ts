import { Language } from '../config';

// Translation API service for dynamic content
export class TranslationService {
  private static instance: TranslationService;
  private cache: Map<string, string> = new Map();
  private apiEndpoint = '/api/translate';
  
  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }
  
  // Translate dynamic content (chat messages, user input, etc.)
  async translateText(
    text: string, 
    fromLang: Language, 
    toLang: Language
  ): Promise<string> {
    if (fromLang === toLang) return text;
    
    const cacheKey = `${fromLang}-${toLang}-${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          from: fromLang,
          to: toLang
        })
      });
      
      if (!response.ok) {
        throw new Error('Translation failed');
      }
      
      const data = await response.json();
      const translatedText = data.translatedText || text;
      
      // Cache the translation
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }
  
  // Translate multiple texts at once
  async translateBatch(
    texts: string[], 
    fromLang: Language, 
    toLang: Language
  ): Promise<string[]> {
    const promises = texts.map(text => this.translateText(text, fromLang, toLang));
    return Promise.all(promises);
  }
  
  // Clear translation cache
  clearCache(): void {
    this.cache.clear();
  }
  
  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}

// Validation utilities for translations
export class TranslationValidator {
  // Check if translation key exists
  static hasTranslation(key: string): boolean {
    // This would integrate with your i18n instance
    // For now, return true as placeholder
    return Boolean(key);
  }
  
  // Validate translation completeness across languages
  static validateLanguageCompleteness(
    translations: Record<string, Record<string, unknown>>,
    referenceLanguage: Language = 'en'
  ): {
    language: Language;
    missingKeys: string[];
    completeness: number;
  }[] {
    const results: {
      language: Language;
      missingKeys: string[];
      completeness: number;
    }[] = [];
    
    const referenceKeys = this.flattenKeys(translations[referenceLanguage]);
    const totalKeys = referenceKeys.length;
    
    (['en', 'si', 'ta'] as Language[]).forEach(lang => {
      if (translations[lang]) {
        const langKeys = this.flattenKeys(translations[lang]);
        const missingKeys = referenceKeys.filter(key => !langKeys.includes(key));
        const completeness = ((totalKeys - missingKeys.length) / totalKeys) * 100;
        
        results.push({
          language: lang,
          missingKeys,
          completeness
        });
      }
    });
    
    return results;
  }
  
  // Flatten nested translation keys
  private static flattenKeys(obj: Record<string, unknown>, prefix: string = ''): string[] {
    let keys: string[] = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          keys = keys.concat(this.flattenKeys(obj[key] as Record<string, unknown>, newKey));
        } else {
          keys.push(newKey);
        }
      }
    }
    
    return keys;
  }
}

// Language direction utilities
export class LanguageUtils {
  // Get text direction for language
  static getTextDirection(): 'ltr' | 'rtl' {
    // All supported languages are LTR
    return 'ltr';
  }
  
  // Get locale string for language
  static getLocale(language: Language): string {
    switch (language) {
      case 'si':
        return 'si-LK';
      case 'ta':
        return 'ta-LK';
      case 'en':
      default:
        return 'en-LK';
    }
  }
  
  // Get language flag emoji
  static getLanguageFlag(language: Language): string {
    switch (language) {
      case 'si':
      case 'ta':
        return '🇱🇰'; // Sri Lankan flag for both Sinhala and Tamil
      case 'en':
      default:
        return '🇬🇧'; // UK flag for English
    }
  }
  
  // Check if language requires special font handling
  static requiresSpecialFont(language: Language): boolean {
    return language === 'si' || language === 'ta';
  }
  
  // Get appropriate font family for language
  static getFontFamily(language: Language): string {
    switch (language) {
      case 'si':
        return '"Noto Sans Sinhala", "Iskoola Pota", sans-serif';
      case 'ta':
        return '"Noto Sans Tamil", "Latha", sans-serif';
      case 'en':
      default:
        return 'system-ui, -apple-system, sans-serif';
    }
  }
}

// Export singleton instance
export const translationService = TranslationService.getInstance();
