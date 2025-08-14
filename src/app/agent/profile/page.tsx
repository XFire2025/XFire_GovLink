// src/app/agent/profile/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentAuth } from '@/lib/auth/useAgentAuthUtils';
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
  const router = useRouter();
  const { agent, isLoading, isAuthenticated } = useAgentAuth();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  const t = pageTranslations[currentLanguage];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/agent/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#FFC72C]/30 border-t-[#FFC72C] rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  // Don't render profile if not authenticated
  if (!isAuthenticated || !agent) {
    return null;
  }

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
      <ProfileSettings 
        language={currentLanguage} 
        agent={agent}
      />
    </ProfileLayout>
  );
}
