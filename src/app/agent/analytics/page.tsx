// src/app/agent/analytics/page.tsx
"use client";
import { useState } from 'react';
import AnalyticsLayout from '@/components/agent/analytics/AnalyticsLayout';
import AnalyticsDashboard from '@/components/agent/analytics/AnalyticsDashboard';

// Types
type Language = 'en' | 'si' | 'ta';

// Page translations
const pageTranslations: Record<Language, {
  title: string;
  subtitle: string;
}> = {
  en: {
    title: 'Analytics Dashboard',
    subtitle: 'Monitor performance metrics, generate reports, and analyze system trends'
  },
  si: {
    title: 'විශ්ලේෂණ පුවරුව',
    subtitle: 'කාර්ය සාධන මිනුම් නිරීක්ෂණය, වාර්තා ජනනය සහ පද්ධති ප්‍රවණතා විශ්ලේෂණය'
  },
  ta: {
    title: 'பகுப்பாய்வு டாஷ்போர்டு',
    subtitle: 'செயல்திறன் அளவீடுகளைக் கண்காணிக்கவும், அறிக்கைகளை உருவாக்கவும் மற்றும் கணினி போக்குகளை பகுப்பாய்வு செய்யவும்'
  }
};

export default function AnalyticsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  const t = pageTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  return (
    <AnalyticsLayout
      title={
        <>
          <span>{t.title.split(' ')[0]}</span>{' '}
          <span className="text-gradient">{t.title.split(' ')[1] || ''}</span>
        </>
      }
      subtitle={t.subtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <AnalyticsDashboard language={currentLanguage} />
    </AnalyticsLayout>
  );
}
