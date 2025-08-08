// src/app/agent/profile/page.tsx
"use client";
import { useState } from 'react';
import ProfileLayout from '@/components/agent/profile/ProfileLayout';
import ProfileSettings from '@/components/agent/profile/ProfileSettings';

// Types
type Language = 'en' | 'si' | 'ta';

// Page translations
const pageTranslations: Record<Language, {
  title: string;
  subtitle: string;
}> = {
  en: {
    title: 'Profile Settings',
    subtitle: 'Manage your account information and preferences'
  },
  si: {
    title: 'පැතිකඩ සැකසුම්',
    subtitle: 'ඔබගේ ගිණුම් තොරතුරු සහ මනාපයන් කළමනාකරණය කරන්න'
  },
  ta: {
    title: 'சுயவிவர அமைப்புகள்',
    subtitle: 'உங்கள் கணக்கு தகவல் மற்றும் விருப்பங்களை நிர்வகிக்கவும்'
  }
};

export default function ProfilePage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  const t = pageTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  return (
    <ProfileLayout
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
      <ProfileSettings language={currentLanguage} />
    </ProfileLayout>
  );
}
