"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AgentAuthLayout from '@/components/agent/auth/AgentAuthLayout';
import AgentInputField from '@/components/agent/auth/AgentInputField';

// Types
type Language = 'en' | 'si' | 'ta';

// Translations
const translations: Record<Language, {
  title: string;
  subtitle: string;
  newPassword: string;
  confirmPassword: string;
  newPasswordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  resetPassword: string;
  resetting: string;
  backToLogin: string;
  success: string;
  successMessage: string;
  passwordError: string;
  confirmError: string;
  strengthError: string;
  tokenError: string;
  serverError: string;
  requirements: string;
  requirementsList: string[];
}> = {
  en: {
    title: 'Reset Password',
    subtitle: 'Enter your new password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    newPasswordPlaceholder: 'Enter your new password',
    confirmPasswordPlaceholder: 'Confirm your new password',
    resetPassword: 'Reset Password',
    resetting: 'Resetting...',
    backToLogin: 'Back to Login',
    success: 'Password Reset Successfully!',
    successMessage: 'Your password has been reset. You can now log in with your new password.',
    passwordError: 'Password must be at least 8 characters long',
    confirmError: 'Passwords do not match',
    strengthError: 'Password must contain uppercase, lowercase, number, and special character',
    tokenError: 'Invalid or expired reset token',
    serverError: 'An error occurred. Please try again.',
    requirements: 'Password Requirements:',
    requirementsList: [
      'At least 8 characters long',
      'One uppercase letter (A-Z)',
      'One lowercase letter (a-z)',
      'One number (0-9)',
      'One special character (@$!%*?&)'
    ]
  },
  si: {
    title: 'මුරපදය යළි සකසන්න',
    subtitle: 'ඔබේ නව මුරපදය ඇතුළත් කරන්න',
    newPassword: 'නව මුරපදය',
    confirmPassword: 'මුරපදය තහවුරු කරන්න',
    newPasswordPlaceholder: 'ඔබේ නව මුරපදය ඇතුළත් කරන්න',
    confirmPasswordPlaceholder: 'ඔබේ නව මුරපදය තහවුරු කරන්න',
    resetPassword: 'මුරපදය යළි සකසන්න',
    resetting: 'යළි සකසමින්...',
    backToLogin: 'පුරනය වීමට ආපසු',
    success: 'මුරපදය සාර්ථකව යළි සකසන ලදී!',
    successMessage: 'ඔබේ මුරපදය යළි සකසන ලදී. ඔබට දැන් ඔබේ නව මුරපදය සමඟ පුරනය විය හැක.',
    passwordError: 'මුරපදය අක්ෂර 8 කට වඩා දිගු විය යුතුය',
    confirmError: 'මුරපද නොගැලපේ',
    strengthError: 'මුරපදයේ ලොකු අකුරු, කුඩා අකුරු, අංක සහ විශේෂ අකුරු තිබිය යුතුය',
    tokenError: 'වලංගු නොවන හෝ කල් ඉකුත් වූ යළි සැකසීමේ ටෝකනය',
    serverError: 'දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.',
    requirements: 'මුරපද අවශ්‍යතා:',
    requirementsList: [
      'අක්ෂර 8 කට වඩා දිගු',
      'එක් ලොකු අකුරක් (A-Z)',
      'එක් කුඩා අකුරක් (a-z)',
      'එක් අංකයක් (0-9)',
      'එක් විශේෂ අකුරක් (@$!%*?&)'
    ]
  },
  ta: {
    title: 'கடவுச்சொல்லை மீட்டமைக்கவும்',
    subtitle: 'உங்கள் புதிய கடவுச்சொல்லை உள்ளிடவும்',
    newPassword: 'புதிய கடவுச்சொல்',
    confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    newPasswordPlaceholder: 'உங்கள் புதிய கடவுச்சொல்லை உள்ளிடவும்',
    confirmPasswordPlaceholder: 'உங்கள் புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    resetPassword: 'கடவுச்சொல்லை மீட்டமைக்கவும்',
    resetting: 'மீட்டமைக்கிறது...',
    backToLogin: 'உள்நுழைவுக்கு திரும்பு',
    success: 'கடவுச்சொல் வெற்றிகரமாக மீட்டமைக்கப்பட்டது!',
    successMessage: 'உங்கள் கடவுச்சொல் மீட்டமைக்கப்பட்டது. இப்போது உங்கள் புதிய கடவுச்சொல்லுடன் உள்நுழையலாம்.',
    passwordError: 'கடவுச்சொல் குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்',
    confirmError: 'கடவுச்சொற்கள் பொருந்தவில்லை',
    strengthError: 'கடவுச்சொல்லில் பெரிய எழுத்து, சிறிய எழுத்து, எண் மற்றும் சிறப்பு எழுத்து இருக்க வேண்டும்',
    tokenError: 'தவறான அல்லது காலாவதியான மீட்டமைப்பு டோக்கன்',
    serverError: 'ஒரு பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
    requirements: 'கடவுச்சொல் தேவைகள்:',
    requirementsList: [
      'குறைந்தது 8 எழுத்துகள்',
      'ஒரு பெரிய எழுத்து (A-Z)',
      'ஒரு சிறிய எழுத்து (a-z)',
      'ஒரு எண் (0-9)',
      'ஒரு சிறப்பு எழுத்து (@$!%*?&)'
    ]
  }
};

export default function AgentResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const token = searchParams.get('token');
  const t = translations[currentLanguage];

  useEffect(() => {
    if (!token) {
      router.push('/agent/login');
    }
  }, [token, router]);

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return t.passwordError;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return t.strengthError;
    }
    
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords
    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) {
      setErrors({ newPassword: newPasswordError });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: t.confirmError });
      return;
    }

    if (!token) {
      setErrors({ general: t.tokenError });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/agent/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setErrors({ general: data.message || t.serverError });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: t.serverError });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AgentAuthLayout
        title={t.success}
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
            <p className="text-sm text-muted-foreground">{t.successMessage}</p>
          </div>
          
          <button
            onClick={() => router.push('/agent/login')}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
          >
            {t.backToLogin}
          </button>
        </div>
      </AgentAuthLayout>
    );
  }

  if (!token) {
    return null; // Will redirect
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

        {/* Password Requirements */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">{t.requirements}</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            {t.requirementsList.map((requirement, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                {requirement}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AgentInputField
            id="newPassword"
            label={t.newPassword}
            type="password"
            value={newPassword}
            onChange={(value) => setNewPassword(value)}
            placeholder={t.newPasswordPlaceholder}
            error={errors.newPassword}
            required
          />

          <AgentInputField
            id="confirmPassword"
            label={t.confirmPassword}
            type="password"
            value={confirmPassword}
            onChange={(value) => setConfirmPassword(value)}
            placeholder={t.confirmPasswordPlaceholder}
            error={errors.confirmPassword}
            required
          />

          {errors.general && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? t.resetting : t.resetPassword}
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
