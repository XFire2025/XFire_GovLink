// src/components/agent/auth/AgentAuthLayout.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LotusIcon } from '@/components/Icons/LotusIcon';

// Types for translations
type Language = 'en' | 'si' | 'ta';

interface Translation {
  governmentAccess: string;
  agentPortal: string;
  subtitle: string;
  backToHome: string;
  technicalAssistance: string;
  contactItSupport: string;
  copyright: string;
}

// Translation data
const translations: Record<Language, Translation> = {
  en: {
    governmentAccess: 'Government Access',
    agentPortal: 'Agent Portal',
    subtitle: 'Secure access for authorized government personnel',
    backToHome: '← Back to Home',
    technicalAssistance: 'Need technical assistance?',
    contactItSupport: 'Contact IT Support',
    copyright: '© 2025 Government of Sri Lanka • Authorized Personnel Only'
  },
  si: {
    governmentAccess: 'රාජ්‍ය ප්‍රවේශය',
    agentPortal: 'නිලධාරි පෝට්ලය',
    subtitle: 'බලයලත් රාජ්‍ය නිලධාරීන් සඳහා ආරක්ෂිත ප්‍රවේශය',
    backToHome: '← මුල් පිටුවට',
    technicalAssistance: 'තාක්ෂණික සහායක අවශ්‍යද?',
    contactItSupport: 'තාක්ෂණික සහාය අමතන්න',
    copyright: '© 2025 ශ්‍රී ලංකා රජය • බලයලත් කර්මිකයන් පමණි'
  },
  ta: {
    governmentAccess: 'அரசு அணுகல்',
    agentPortal: 'அதிகாரி போர்டல்',
    subtitle: 'அங்கீகரிக்கப்பட்ட அரசு ஊழியர்களுக்கான பாதுகாப்பான அணுகல்',
    backToHome: '← முகப்புக்கு திரும்பு',
    technicalAssistance: 'தொழில்நுட்ப உதவி தேவையா?',
    contactItSupport: 'IT ஆதரவை தொடர்பு கொள்ளுங்கள்',
    copyright: '© 2025 இலங்கை அரசாங்கம் • அங்கீகரிக்கப்பட்ட ஊழியர்கள் மட்டுமே'
  }
};

// Language options
const languageOptions = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ්' }
];

// Use centralized LotusIcon

// EXACT SAME Sri Lankan Background Component as Landing Page
const SriLankanBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main background image */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95">
        <div 
          className="absolute inset-0 opacity-55 dark:opacity-15 bg-center bg-no-repeat bg-cover transition-opacity duration-1000"
          style={{
            backgroundImage: 'url("/2.png")',
            backgroundPosition: 'center 20%',
            filter: 'saturate(1.2) brightness(1.1)',
          }}
        ></div>
        {/* Overlay gradients for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 dark:from-background/40 dark:via-transparent dark:to-background/60"></div>
      </div>
      
      {/* Enhanced lotus-inspired accent patterns */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FFC72C]/8 dark:bg-[#FFC72C]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#8D153A]/8 dark:bg-[#8D153A]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5722]/6 dark:bg-[#FF5722]/3 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        {/* Additional subtle accents */}
        <div className="absolute top-3/4 right-1/3 w-48 h-48 bg-[#FFA726]/6 dark:bg-[#FFA726]/3 rounded-full blur-2xl animate-pulse" style={{animationDuration: '14s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/6 left-1/5 w-56 h-56 bg-[#FF9800]/5 dark:bg-[#FF9800]/2 rounded-full blur-3xl animate-pulse" style={{animationDuration: '16s', animationDelay: '6s'}}></div>
      </div>
    </div>
  );
};

interface AgentAuthLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle?: string;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

const AgentAuthLayout: React.FC<AgentAuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  language = 'en',
  onLanguageChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const t = translations[language];

  const handleLanguageChange = (newLanguage: Language) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden theme-transition-slow">
      {/* EXACT SAME Sri Lankan Background as Landing Page */}
      <SriLankanBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/98 dark:bg-card backdrop-blur-md border-b border-border/30 dark:border-border/50 shadow-sm dark:shadow-lg">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#FFC72C]/10 to-[#FF5722]/10 rounded-xl p-0.5 flex items-center justify-center border border-[#FFC72C]/20 relative overflow-visible backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              <LotusIcon className="w-11 h-11 absolute transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-gradient leading-none">GovLink</span>
              <span className="text-xs text-muted-foreground/70 font-medium leading-none">{t.agentPortal}</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/" 
              className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors duration-300 hover:scale-105 font-medium"
            >
              {t.backToHome}
            </Link>
            
            {/* Language Dropdown - EXACT SAME as Landing Page */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 hover:border-[#FFC72C]/60 text-sm font-medium text-foreground hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 shadow-md hover:shadow-lg modern-card"
                aria-label={`Current language: ${languageOptions.find(lang => lang.code === language)?.nativeLabel}`}
              >
                <span className="text-xs sm:text-sm">{languageOptions.find(lang => lang.code === language)?.nativeLabel}</span>
                <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 glass-morphism border border-border/50 rounded-xl shadow-glow overflow-hidden animate-fade-in-up z-50">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as Language)}
                        className={`w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-card/30 ${
                          language === lang.code 
                            ? 'bg-[#FFC72C]/10 text-[#FFC72C] border-l-2 border-l-[#FFC72C]' 
                            : 'text-foreground'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{lang.nativeLabel}</div>
                          <div className="text-xs text-muted-foreground">{lang.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="w-px h-6 bg-border/50"></div>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 pt-20 sm:pt-24 md:pt-28 relative z-10">
        <div className="w-full max-w-md">
          {/* Title Section */}
          <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 sm:mb-6 modern-card">
              <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-foreground">{t.governmentAccess}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
              {title}
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              {subtitle || t.subtitle}
            </p>
          </div>

          {/* Form Container - EXACT SAME as Landing Page cards */}
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 hover:border-[#FFC72C]/70 hover:shadow-2xl transition-all duration-500 animate-fade-in-up modern-card p-6 sm:p-8 shadow-glow" style={{animationDelay: '0.2s'}}>
            {children}
          </div>

          {/* Support Information */}
          <div className="text-center mt-6 sm:mt-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.technicalAssistance}{' '}
              <Link 
                href="/user/chat/bot" 
                className="text-[#FFC72C] hover:text-[#FF5722] transition-all duration-300 underline font-medium hover:scale-105 inline-block"
              >
                {t.contactItSupport}
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-6 sm:pb-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgentAuthLayout;