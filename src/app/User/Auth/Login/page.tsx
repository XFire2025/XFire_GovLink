'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserAuthLayout from '@/components/user/auth/UserAuthLayout';

type Language = 'en' | 'si' | 'ta';

const translations = {
  en: {
    welcomeBack: 'Welcome Back!',
    signInSubtitle: 'Sign in to your GovLink account',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot Password?',
    signInButton: 'Sign In',
    noAccount: 'Don\'t have an account?',
    signUp: 'Sign Up'
  },
  si: {
    welcomeBack: 'ආයුබෝවන්!',
    signInSubtitle: 'ඔබේ GovLink ගිණුමට ඇතුල් වන්න',
    emailLabel: 'විද්‍යුත් තැපැල් ලිපිනය',
    passwordLabel: 'මුර පදය',
    forgotPassword: 'මුර පදය අමතකද?',
    signInButton: 'ඇතුල් වන්න',
    noAccount: 'ගිණුමක් නොමැතිද?',
    signUp: 'ලියාපදිංචි වන්න'
  },
  ta: {
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்!',
    signInSubtitle: 'உங்கள் GovLink கணக்கில் உள்நுழையவும்',
    emailLabel: 'மின்னஞ்சல் முகவரி',
    passwordLabel: 'கடவுச்சொல்',
    forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
    signInButton: 'உள்நுழையவும்',
    noAccount: 'கணக்கு இல்லையா?',
    signUp: 'பதிவு செய்யவும்'
  }
};

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[currentLanguage];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement your authentication logic (e.g., API call, NextAuth)
    console.log('Login attempt:', { email, password });
    
    // Simulate loading and authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // After successful login, redirect to user dashboard
    router.push('/User/Dashboard');
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
  };

  return (
    <UserAuthLayout
      title={t.welcomeBack}
      subtitle={t.signInSubtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
            {t.emailLabel}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-md text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
              {t.passwordLabel}
            </label>
            <Link href="/User/Auth/ForgotPassword" className="text-sm text-[#FFC72C] hover:text-[#FF5722] transition-colors duration-300 underline">
              {t.forgotPassword}
            </Link>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-md text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-xl hover:from-[#FF5722] hover:to-[#8D153A] focus:outline-none focus:ring-4 focus:ring-[#FFC72C]/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl"
        >
          {isLoading ? 'Signing In...' : t.signInButton}
        </button>
      </form>

      <p className="mt-8 text-center text-muted-foreground text-sm">
        {t.noAccount}{' '}
        <Link href="/User/Auth/Register" className="font-medium text-[#FFC72C] hover:text-[#FF5722] transition-colors duration-300 underline">
          {t.signUp}
        </Link>
      </p>
    </UserAuthLayout>
  );
};

export default LoginPage;