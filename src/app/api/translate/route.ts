import { NextRequest, NextResponse } from 'next/server';
import { Language } from '@/lib/i18n/config';

// This would integrate with your chosen translation service (Azure, Google, etc.)
// For now, this is a mock implementation

interface TranslationRequest {
  text: string;
  from: Language;
  to: Language;
}

interface TranslationResponse {
  translatedText: string;
  originalText: string;
  fromLanguage: Language;
  toLanguage: Language;
  confidence?: number;
}

// Mock translation data for demonstration
const mockTranslations: Record<string, Record<Language, string>> = {
  'Hello': {
    en: 'Hello',
    si: 'ආයුබෝවන්',
    ta: 'வணக்கம்'
  },
  'Thank you': {
    en: 'Thank you',
    si: 'ස්තූතියි',
    ta: 'நன்றி'
  },
  'How can I help you?': {
    en: 'How can I help you?',
    si: 'මම ඔබට කෙසේ උදව් කරන්නද?',
    ta: 'நான் உங்களுக்கு எப்படி உதவ முடியும்?'
  },
  'Good morning': {
    en: 'Good morning',
    si: 'සුබ උදෑසනක්',
    ta: 'காலை வணக்கம்'
  },
  'Good afternoon': {
    en: 'Good afternoon',
    si: 'සුබ මධ්‍යාහ්නයක්',
    ta: 'மதிய வணக்கம்'
  },
  'Good evening': {
    en: 'Good evening',
    si: 'සුබ සන්ධ්‍යාවක්',
    ta: 'மாலை வணக்கம்'
  },
  'Goodbye': {
    en: 'Goodbye',
    si: 'ගිහින් එන්නම්',
    ta: 'பிரியாவிடை'
  },
  'Please wait': {
    en: 'Please wait',
    si: 'කරුණාකර රැඳී සිටින්න',
    ta: 'தயவு செய்து காத்திருங்கள்'
  },
  'I understand': {
    en: 'I understand',
    si: 'මට තේරෙනවා',
    ta: 'எனக்கு புரிகிறது'
  },
  'Can you repeat that?': {
    en: 'Can you repeat that?',
    si: 'ඔබට එය නැවත කිව හැකිද?',
    ta: 'அதை மீண்டும் சொல்ல முடியுமா?'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: TranslationRequest = await request.json();
    const { text, from, to } = body;

    // Validate input
    if (!text || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: text, from, to' },
        { status: 400 }
      );
    }

    if (!['en', 'si', 'ta'].includes(from) || !['en', 'si', 'ta'].includes(to)) {
      return NextResponse.json(
        { error: 'Unsupported language. Supported: en, si, ta' },
        { status: 400 }
      );
    }

    // If same language, return original text
    if (from === to) {
      const response: TranslationResponse = {
        translatedText: text,
        originalText: text,
        fromLanguage: from,
        toLanguage: to,
        confidence: 1.0
      };
      return NextResponse.json(response);
    }

    // Try to find exact match in mock data first
    let translatedText = text;
    if (mockTranslations[text] && mockTranslations[text][to]) {
      translatedText = mockTranslations[text][to];
    } else {
      // For real implementation, call your translation service here
      // Example: Azure Translator, Google Translate, etc.
      translatedText = await translateWithService(text, from, to);
    }

    const response: TranslationResponse = {
      translatedText,
      originalText: text,
      fromLanguage: from,
      toLanguage: to,
      confidence: 0.95
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock translation service function
// Replace this with actual service integration
async function translateWithService(text: string, from: Language, to: Language): Promise<string> {
  // This is where you'd integrate with Azure Translator, Google Translate, etc.
  // For now, return a placeholder
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simple word-by-word translation attempt
  const words = text.toLowerCase().split(' ');
  const translatedWords = words.map(word => {
    // Check if word exists in our mock translations
    for (const [key, translations] of Object.entries(mockTranslations)) {
      if (key.toLowerCase().includes(word)) {
        return translations[to] || word;
      }
    }
    return word;
  });
  
  return translatedWords.join(' ');
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    supportedLanguages: ['en', 'si', 'ta'],
    version: '1.0.0'
  });
}
