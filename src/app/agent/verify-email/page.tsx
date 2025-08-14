"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AgentAuthLayout from '@/components/agent/auth/AgentAuthLayout';

// Types
type Language = 'en' | 'si' | 'ta';

// Translations
const translations: Record<Language, {
  verifying: string;
  success: string;
  error: string;
  successMessage: string;
  errorMessage: string;
  backToLogin: string;
}> = {
  en: {
    verifying: 'Verifying Email...',
    success: 'Email Verified!',
    error: 'Verification Failed',
    successMessage: 'Your email has been successfully verified. You can now log in to your agent account.',
    errorMessage: 'The verification link is invalid or has expired. Please request a new verification email.',
    backToLogin: 'Go to Login'
  },
  si: {
    verifying: 'ඊමේල් සත්‍යාපනය කරමින්...',
    success: 'ඊමේල් සත්‍යාපනය කළා!',
    error: 'සත්‍යාපනය අසාර්ථකයි',
    successMessage: 'ඔබේ ඊමේල් සාර්ථකව සත්‍යාපනය කර ඇත. ඔබට දැන් ඔබේ නිලධාරි ගිණුමට පුරනය විය හැක.',
    errorMessage: 'සත්‍යාපන සබැඳිය වලංගු නොවේ හෝ කල් ඉකුත් වී ඇත. කරුණාකර නව සත්‍යාපන ඊමේල් ඉල්ලන්න.',
    backToLogin: 'පුරනය වීමට යන්න'
  },
  ta: {
    verifying: 'மின்னஞ்சலை சரிபார்க்கிறது...',
    success: 'மின்னஞ்சல் சரிபார்க்கப்பட்டது!',
    error: 'சரிபார்ப்பு தோல்வியடைந்தது',
    successMessage: 'உங்கள் மின்னஞ்சல் வெற்றிகரமாக சரிபார்க்கப்பட்டது. இப்போது உங்கள் அதிகாரி கணக்கில் உள்நுழையலாம்.',
    errorMessage: 'சரிபார்ப்பு இணைப்பு தவறானது அல்லது காலாவதியானது. புதிய சரிபார்ப்பு மின்னஞ்சலைக் கோரவும்.',
    backToLogin: 'உள்நுழைவுக்கு செல்லவும்'
  }
};

export default function AgentEmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  const token = searchParams.get('token');
  const t = translations[currentLanguage];

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch(`/api/auth/agent/verify-email?token=${token}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const getTitle = () => {
    switch (status) {
      case 'verifying':
        return t.verifying;
      case 'success':
        return t.success;
      case 'error':
        return t.error;
      default:
        return t.verifying;
    }
  };

  const getMessage = () => {
    switch (status) {
      case 'success':
        return t.successMessage;
      case 'error':
        return t.errorMessage;
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="w-12 h-12 border-4 border-[#FFC72C]/30 border-t-[#FFC72C] rounded-full animate-spin mx-auto mb-4"></div>
        );
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
    }
  };

  return (
    <AgentAuthLayout
      title={getTitle()}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="space-y-6">
        <div className="text-center">
          {getIcon()}
          {status !== 'verifying' && (
            <p className="text-sm text-muted-foreground">{getMessage()}</p>
          )}
        </div>
        
        {status !== 'verifying' && (
          <button
            onClick={() => router.push('/agent/login')}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
          >
            {t.backToLogin}
          </button>
        )}
      </div>
    </AgentAuthLayout>
  );
}
