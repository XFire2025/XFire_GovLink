// src/app/agent/login/page.tsx
"use client";
import { useState } from 'react';
import AgentAuthLayout from '@/components/agent/auth/AgentAuthLayout';
import AgentLoginForm from '@/components/agent/auth/AgentLoginForm';

// Types
type Language = 'en' | 'si' | 'ta';

// Title translations
const titleTranslations: Record<Language, { agent: string; portal: string }> = {
  en: { agent: 'Agent', portal: 'Portal' },
  si: { agent: 'නිලධාරි', portal: 'පෝට්ලය' },
  ta: { agent: 'அதிকாரி', portal: 'போர்டல்' }
};

export default function AgentLoginPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  const titleText = titleTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  return (
    <AgentAuthLayout
      title={
        <span className="animate-title-wave">
          <span className="text-foreground">{titleText.agent}</span>{' '}
          <span className="text-gradient">{titleText.portal}</span>
        </span>
      }
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <AgentLoginForm language={currentLanguage} />
    </AgentAuthLayout>
  );
}