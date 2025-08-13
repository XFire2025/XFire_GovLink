"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentAuth } from '@/lib/auth/useAgentAuthUtils';
import AgentInputField from './AgentInputField';

// Types
type Language = 'en' | 'si' | 'ta';

// Form translations
const formTranslations: Record<Language, {
  email: string;
  password: string;
  rememberMe: string;
  signIn: string;
  signingIn: string;
  forgotPassword: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  emailError: string;
  passwordError: string;
  emailHint: string;
  passwordHint: string;
}> = {
  en: {
    email: 'Email Address',
    password: 'Password',
    rememberMe: 'Remember me',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    forgotPassword: 'Forgot your password?',
    emailPlaceholder: 'Enter your email address',
    passwordPlaceholder: 'Enter your password',
    emailError: 'Please enter a valid email address',
    passwordError: 'Password must be at least 8 characters long',
    emailHint: 'Use your official government email address',
    passwordHint: 'Enter your secure agent password'
  },
  si: {
    email: 'ඊමේල් ලිපිනය',
    password: 'මුරපදය',
    rememberMe: 'මතක තබා ගන්න',
    signIn: 'පුරනය වන්න',
    signingIn: 'පුරනය වෙමින්...',
    forgotPassword: 'මුරපදය අමතකද?',
    emailPlaceholder: 'ඔබේ ඊමේල් ලිපිනය ඇතුළත් කරන්න',
    passwordPlaceholder: 'ඔබේ මුරපදය ඇතුළත් කරන්න',
    emailError: 'කරුණාකර වලංගු ඊමේල් ලිපිනයක් ඇතුළත් කරන්න',
    passwordError: 'මුරපදය අක්ෂර 8 කට වඩා දිගු විය යුතුය',
    emailHint: 'ඔබේ නිල රාජ්‍ය ඊමේල් ලිපිනය භාවිතා කරන්න',
    passwordHint: 'ඔබේ ආරක්ෂිත නිලධාරි මුරපදය ඇතුළත් කරන්න'
  },
  ta: {
    email: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    rememberMe: 'என்னை நினைவில் வைத்துக் கொள்ளுங்கள்',
    signIn: 'உள்நுழைய',
    signingIn: 'உள்நுழைகிறது...',
    forgotPassword: 'உங்கள் கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
    emailPlaceholder: 'உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்',
    passwordPlaceholder: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்',
    emailError: 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்',
    passwordError: 'கடவுச்சொல் குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்',
    emailHint: 'உங்கள் அதிகாரப்பூர்வ அரசு மின்னஞ்சல் முகவரியைப் பயன்படுத்தவும்',
    passwordHint: 'உங்கள் பாதுகாப்பான அதிகாரி கடவுச்சொல்லை உள்ளிடவும்'
  }
};

interface AgentLoginFormProps {
  language: Language;
}

export default function AgentLoginForm({ language }: AgentLoginFormProps) {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } = useAgentAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });

  const t = formTranslations[language];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/agent/dashboard');
    }
  }, [isAuthenticated, router]);

  // Clear errors when user types
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateForm = (): boolean => {
    const errors = { email: '', password: '' };
    let isValid = true;

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = t.emailError;
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = t.passwordError;
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      if (result.success) {
        // Success - navigation will be handled by useEffect
        console.log('Agent login successful');
      }
      // Error handling is done by the hook
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field errors when user starts typing
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error
    if (error) {
      clearError();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="animate-fade-in-up bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600 dark:text-red-400">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <AgentInputField
            id="agent-email"
            label={t.email}
            type="email"
            placeholder={t.emailPlaceholder}
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            error={fieldErrors.email}
            helpText={t.emailHint}
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <AgentInputField
            id="agent-password"
            label={t.password}
            type="password"
            placeholder={t.passwordPlaceholder}
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            error={fieldErrors.password}
            helpText={t.passwordHint}
            required
          />
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                formData.rememberMe
                  ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] border-[#FFC72C]'
                  : 'border-border hover:border-[#FFC72C]/50'
              }`}>
                {formData.rememberMe && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute top-0.5 left-0.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {t.rememberMe}
            </span>
          </label>

          <button
            type="button"
            className="text-sm text-[#FFC72C] hover:text-[#FF5722] transition-colors font-medium"
          >
            {t.forgotPassword}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FFB000] hover:to-[#E64100] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{t.signingIn}</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6"/>
                <path d="M10 14 21 3"/>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              </svg>
              <span>{t.signIn}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}