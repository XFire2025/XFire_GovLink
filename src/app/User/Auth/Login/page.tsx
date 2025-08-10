'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
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
    signUp: 'Sign Up',
    signingIn: 'Signing In...',
    loginError: 'Login failed. Please check your credentials.',
    networkError: 'Network error. Please try again.'
  },
  si: {
    welcomeBack: 'ආයුබෝවන්!',
    signInSubtitle: 'ඔබේ GovLink ගිණුමට ඇතුල් වන්න',
    emailLabel: 'විද්‍යුත් තැපැල් ලිපිනය',
    passwordLabel: 'මුර පදය',
    forgotPassword: 'මුර පදය අමතකද?',
    signInButton: 'ඇතුල් වන්න',
    noAccount: 'ගිණුමක් නොමැතිද?',
    signUp: 'ලියාපදිංචි වන්න',
    signingIn: 'ඇතුල් වෙමින්...',
    loginError: 'ප්‍රවේශනය අසාර්ථකයි. කරුණාකර ඔබේ අක්තපත්‍ර පරීක්ෂා කරන්න.',
    networkError: 'ජාල දෝෂයක්. කරුණාකර නැවත උත්සාහ කරන්න.'
  },
  ta: {
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்!',
    signInSubtitle: 'உங்கள் GovLink கணக்கில் உள்நுழையவும்',
    emailLabel: 'மின்னஞ்சல் முகவரி',
    passwordLabel: 'கடவுச்சொல்',
    forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
    signInButton: 'உள்நுழையவும்',
    noAccount: 'கணக்கு இல்லையா?',
    signUp: 'பதிவு செய்யவும்',
    signingIn: 'உள்நுழைகிறது...',
    loginError: 'உள்நுழைவு தோல்வி. உங்கள் சான்றுகளை சரிபார்க்கவும்.',
    networkError: 'நெட்வொர்க் பிழை. மீண்டும் முயற்சிக்கவும்.'
  }
};

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = translations[currentLanguage];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect to user dashboard on successful login
        router.push('/user/dashboard');
      } else {
        setError(result.message || t.loginError);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t.networkError);
    } finally {
      setIsLoading(false);
    }
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
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

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
            <Link 
              href="/user/auth/forgot-password" 
              className="text-sm text-[#FFC72C] hover:text-[#FF5722] transition-colors duration-300 underline"
            >
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
          {isLoading ? t.signingIn : t.signInButton}
        </button>
      </form>

      <p className="mt-8 text-center text-muted-foreground text-sm">
        {t.noAccount}{' '}
        <Link 
          href="/user/auth/register" 
          className="font-medium text-[#FFC72C] hover:text-[#FF5722] transition-colors duration-300 underline"
        >
          {t.signUp}
        </Link>
      </p>
    </UserAuthLayout>
  );
};

export default LoginPage;
