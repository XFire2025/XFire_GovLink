// src/components/user/chat/AuthPrompt.tsx
"use client";
import React from 'react';
import { User, ArrowRight, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthPromptProps {
  message: string;
  language?: 'en' | 'si' | 'ta';
  redirectPath?: string;
}

const translations = {
  en: {
    loginRequired: 'Login Required',
    loginPrompt: 'Please login to continue with booking appointments and accessing personalized services.',
    loginButton: 'Login to Continue',
    registerPrompt: "Don't have an account?",
    registerButton: 'Register Now',
    secureMessage: 'Your data is secure and encrypted'
  },
  si: {
    loginRequired: 'ප්‍රවේශය අවශ්‍යයි',
    loginPrompt: 'හමුවීම් වෙන්කරවීම සහ පුද්ගලිකත සේවා වලට ප්‍රවේශ වීමට කරුණාකර ප්‍රවේශ වන්න.',
    loginButton: 'ඉදිරියට යාමට ප්‍රවේශ වන්න',
    registerPrompt: 'ගිණුමක් නැත?',
    registerButton: 'දැන් ලියාපදිංචි වන්න',
    secureMessage: 'ඔබගේ දත්ත ආරක්ෂිත සහ සංකේතනය කර ඇත'
  },
  ta: {
    loginRequired: 'உள்நுழைவு தேவை',
    loginPrompt: 'சந்திப்பு முன்பதிவு மற்றும் தனிப்பயன் சேவைகளைப் பெற உள்நுழையவும்.',
    loginButton: 'தொடர உள்நுழையவும்',
    registerPrompt: 'கணக்கு இல்லையா?',
    registerButton: 'இப்போது பதிவு செய்யவும்',
    secureMessage: 'உங்கள் தரவு பாதுகாப்பானது மற்றும் மறைகுறியாக்கப்பட்டுள்ளது'
  }
};

export const AuthPrompt: React.FC<AuthPromptProps> = ({
  message,
  language = 'en',
  redirectPath = '/Ragbot'
}) => {
  const router = useRouter();
  const t = translations[language];

  const handleLogin = () => {
    router.push(`/user/auth/login?redirect=${encodeURIComponent(redirectPath)}`);
  };

  const handleRegister = () => {
    router.push(`/user/auth/register?redirect=${encodeURIComponent(redirectPath)}`);
  };

  return (
    <div className="mt-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-md rounded-xl border border-blue-200/50 dark:border-blue-800/50">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {t.loginRequired}
            </h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
              {message || t.loginPrompt}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLogin}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl group"
            >
              <User className="w-4 h-4" />
              <span className="font-medium">{t.loginButton}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            
            <button
              onClick={handleRegister}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              <span className="font-medium">{t.registerButton}</span>
            </button>
          </div>

          <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>{t.secureMessage}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
