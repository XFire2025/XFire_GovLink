"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AgentAuthLayout from '@/components/agent/auth/AgentAuthLayout';
import AgentInputField from '@/components/agent/auth/AgentInputField';

// Types
type Language = 'en' | 'si' | 'ta';

// Translations
const translations: Record<Language, {
  title: string;
  subtitle: string;
  email: string;
  emailPlaceholder: string;
  sendResetLink: string;
  sending: string;
  backToLogin: string;
  emailSent: string;
  emailSentMessage: string;
  emailError: string;
  serverError: string;
}> = {
  en: {
    title: 'Forgot Password',
    subtitle: 'Enter your email to receive a password reset link',
    email: 'Email Address',
    emailPlaceholder: 'Enter your agent email address',
    sendResetLink: 'Send Reset Link',
    sending: 'Sending...',
    backToLogin: 'Back to Login',
    emailSent: 'Email Sent!',
    emailSentMessage: 'If an account with that email exists, a password reset link has been sent.',
    emailError: 'Please enter a valid email address',
    serverError: 'An error occurred. Please try again.'
  },
  si: {
    title: 'මුරපදය අමතකද',
    subtitle: 'මුරපදය යළි සැකසීමේ සබැඳිය ලබා ගැනීමට ඔබේ ඊමේල් ඇතුළත් කරන්න',
    email: 'ඊමේල් ලිපිනය',
    emailPlaceholder: 'ඔබේ නිලධාරි ඊමේල් ලිපිනය ඇතුළත් කරන්න',
    sendResetLink: 'යළි සැකසීමේ සබැඳිය යවන්න',
    sending: 'යවමින්...',
    backToLogin: 'පුරනය වීමට ආපසු',
    emailSent: 'ඊමේල් යවන ලදී!',
    emailSentMessage: 'එම ඊමේල් සමඟ ගිණුමක් තිබේ නම්, මුරපදය යළි සැකසීමේ සබැඳියක් යවා ඇත.',
    emailError: 'කරුණාකර වලංගු ඊමේල් ලිපිනයක් ඇතුළත් කරන්න',
    serverError: 'දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.'
  },
  ta: {
    title: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா',
    subtitle: 'கடவுச்சொல் மீட்டமைப்பு இணைப்பைப் பெற உங்கள் மின்னஞ்சலை உள்ளிடவும்',
    email: 'மின்னஞ்சல் முகவரி',
    emailPlaceholder: 'உங்கள் அதிகாரி மின்னஞ்சல் முகவரியை உள்ளிடவும்',
    sendResetLink: 'மீட்டமைப்பு இணைப்பை அனுப்பவும்',
    sending: 'அனுப்புகிறது...',
    backToLogin: 'உள்நுழைவுக்கு திரும்பு',
    emailSent: 'மின்னஞ்சல் அனுப்பப்பட்டது!',
    emailSentMessage: 'அந்த மின்னஞ்சலுடன் கணக்கு இருந்தால், கடவுச்சொல் மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டுள்ளது.',
    emailError: 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்',
    serverError: 'ஒரு பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
  }
};

export default function AgentForgotPasswordPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const t = translations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email.trim()) {
      setError(t.emailError);
      return;
    }

    if (!validateEmail(email)) {
      setError(t.emailError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/agent/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailSent(true);
      } else {
        setError(data.message || t.serverError);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(t.serverError);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AgentAuthLayout
        title={t.emailSent}
        language={currentLanguage}
        onLanguageChange={handleLanguageChange}
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">{t.emailSentMessage}</p>
          </div>
          
          <button
            onClick={() => router.push('/agent/login')}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            ← {t.backToLogin}
          </button>
        </div>
      </AgentAuthLayout>
    );
  }

  return (
    <AgentAuthLayout
      title={t.title}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AgentInputField
            id="email"
            label={t.email}
            type="email"
            value={email}
            onChange={(value) => setEmail(value)}
            placeholder={t.emailPlaceholder}
            error={error}
            required
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? t.sending : t.sendResetLink}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => router.push('/agent/login')}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            ← {t.backToLogin}
          </button>
        </div>
      </div>
    </AgentAuthLayout>
  );
}
