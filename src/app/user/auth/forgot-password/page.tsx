// src/app/user/auth/forgot-password/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import UserAuthLayout from '@/components/user/auth/UserAuthLayout';

// Types
type Language = 'en' | 'si' | 'ta';

// Forgot password translations
const forgotPasswordTranslations: Record<Language, {
  title: string;
  subtitle: string;
  submitSubtitle: string;
  email: string;
  sendResetLink: string;
  sending: string;
  requestSent: string;
  checkInbox: string;
  emailSentMessage: string;
  backToLogin: string;
  tryAgain: string;
  errors: {
    invalidEmail: string;
  };
  placeholders: {
    email: string;
  };
}> = {
  en: {
    title: 'Reset Password',
    subtitle: "No problem. We'll send a password reset link to your email.",
    submitSubtitle: 'Check your inbox for the next steps.',
    email: 'Email Address',
    sendResetLink: 'Send Reset Link',
    sending: 'Sending...',
    requestSent: 'Request Sent',
    checkInbox: 'Check your inbox for the next steps.',
    emailSentMessage: 'If an account with this email exists, you will receive a reset link shortly.',
    backToLogin: 'Back to Login',
    tryAgain: 'Try Again',
    errors: {
      invalidEmail: 'Please enter a valid email address'
    },
    placeholders: {
      email: 'you@example.com'
    }
  },
  si: {
    title: 'මුර පදය නැවත සැකසීම',
    subtitle: 'කණගාටුවක් නැත. අපි ඔබගේ විද්‍යුත් තැපෑලට මුර පදය නැවත සැකසීමේ සබැඳියක් යවමු.',
    submitSubtitle: 'ඊළඟ පියවර සඳහා ඔබගේ ඉන්බොක්ස් පරීක්ෂා කරන්න.',
    email: 'විද්‍යුත් තැපැල් ලිපිනය',
    sendResetLink: 'නැවත සැකසීමේ සබැඳිය යවන්න',
    sending: 'යවමින්...',
    requestSent: 'ඉල්ලීම යවන ලදී',
    checkInbox: 'ඊළඟ පියවර සඳහා ඔබගේ ඉන්බොක්ස් පරීක්ෂා කරන්න.',
    emailSentMessage: 'මෙම ඊමේල් සමඟ ගිණුමක් තිබේ නම්, ඔබට ඉක්මනින් නැවත සැකසීමේ සබැඳියක් ලැබෙනු ඇත.',
    backToLogin: 'ඇතුල්වීමට ආපසු',
    tryAgain: 'නැවත උත්සාහ කරන්න',
    errors: {
      invalidEmail: 'කරුණාකර වලංගු විද්‍යුත් ලිපිනයක් ඇතුළත් කරන්න'
    },
    placeholders: {
      email: 'you@example.com'
    }
  },
  ta: {
    title: 'கடவுச்சொல் மீட்டமை',
    subtitle: 'பரவாயில்லை. உங்கள் மின்னஞ்சலுக்கு கடவுச்சொல் மீட்டமைப்பு இணைப்பை அனுப்புவோம்.',
    submitSubtitle: 'அடுத்த படிகளுக்கு உங்கள் இன்பாக்ஸைச் சரிபார்க்கவும்.',
    email: 'மின்னஞ்சல் முகவரி',
    sendResetLink: 'மீட்டமைப்பு இணைப்பை அனுப்பவும்',
    sending: 'அனுப்புகிறது...',
    requestSent: 'கோரிக்கை அனுப்பப்பட்டது',
    checkInbox: 'அடுத்த படிகளுக்கு உங்கள் இன்பாக்ஸைச் சரிபார்க்கவும்.',
    emailSentMessage: 'இந்த மின்னஞ்சல் கொண்ட கணக்கு இருந்தால், உங்களுக்கு விரைவில் மீட்டமைப்பு இணைப்பு கிடைக்கும்.',
    backToLogin: 'உள்நுழைவுக்கு திரும்பவும்',
    tryAgain: 'மீண்டும் முயற்சி செய்யவும்',
    errors: {
      invalidEmail: 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்'
    },
    placeholders: {
      email: 'you@example.com'
    }
  }
};

// --- PREMIUM SVG ICON COMPONENTS ---
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/>
    <path d="M12 19l-7-7 7-7"/>
  </svg>
);

const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// Themed alert components
const SuccessAlert = ({ message }: { message: string }) => (
  <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-[#008060]/30 shadow-glow modern-card animate-fade-in-up text-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-r from-[#008060]/20 to-[#FFC72C]/20 rounded-full flex items-center justify-center border border-[#008060]/30">
        <CheckCircleIcon className="w-8 h-8 text-[#008060]" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#008060] mb-2">Request Sent Successfully!</h3>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">{message}</p>
      </div>
    </div>
  </div>
);

const ErrorAlert = ({ message }: { message: string }) => (
  <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-[#FF5722]/30 flex items-center gap-3 shadow-glow modern-card animate-fade-in-up">
    <AlertTriangleIcon className="w-5 h-5 text-[#FF5722] flex-shrink-0" />
    <p className="text-sm font-medium text-[#FF5722]">{message}</p>
  </div>
);

// --- MAIN FORGOT PASSWORD COMPONENT ---
export default function ForgotPasswordPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = forgotPasswordTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t.errors.invalidEmail;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setEmail('');
    setError(null);
  };

  return (
    <UserAuthLayout
      title={t.title}
      subtitle={submitted ? t.submitSubtitle : t.subtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="w-full max-w-md mx-auto">
        {submitted ? (
          <div className="space-y-6">
            <SuccessAlert message={`${t.emailSentMessage} ${email ? `(${email})` : ''}`} />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/user/auth/login" 
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                {t.backToLogin}
              </Link>
              <button 
                onClick={handleTryAgain}
                className="flex-1 px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                {t.tryAgain}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {error && <ErrorAlert message={error} />}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                  {t.email}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="w-5 h-5 text-[#FFC72C]" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-sm text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60"
                    placeholder={t.placeholders.email}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t.sending}
                  </>
                ) : (
                  t.sendResetLink
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link 
                href="/user/auth/login" 
                className="inline-flex items-center gap-2 font-medium text-[#FFC72C] hover:text-[#FF5722] transition-colors duration-300 hover:underline"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                {t.backToLogin}
              </Link>
            </div>
          </div>
        )}
      </div>
    </UserAuthLayout>
  );
}