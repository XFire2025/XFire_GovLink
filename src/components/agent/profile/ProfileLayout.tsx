// src/components/agent/profile/ProfileLayout.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

// Types
type Language = 'en' | 'si' | 'ta';

interface Translation {
  profile: string;
  agentPortal: string;
  backToDashboard: string;
  logout: string;
  settings: string;
  help: string;
  notifications: string;
}

// Translation data
const translations: Record<Language, Translation> = {
  en: {
    profile: 'Profile',
    agentPortal: 'Agent Portal',
    backToDashboard: '← Back to Dashboard',
    logout: 'Logout',
    settings: 'Settings',
    help: 'Help',
    notifications: 'Notifications'
  },
  si: {
    profile: 'පැතිකඩ',
    agentPortal: 'නිලධාරි පෝට්ලය',
    backToDashboard: '← පාලනයට ආපසු',
    logout: 'ඉවත්වන්න',
    settings: 'සැකසුම්',
    help: 'උදව්',
    notifications: 'දැනුම්දීම්'
  },
  ta: {
    profile: 'சுயவிவரம்',
    agentPortal: 'அதிகாரி போர்டல்',
    backToDashboard: '← டாஷ்போர்டுக்கு திரும்பு',
    logout: 'வெளியேறு',
    settings: 'அமைப்புகள்',
    help: 'உதவி',
    notifications: 'அறிவிப்புகள்'
  }
};

// Language options
const languageOptions = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' }
];

// Profile Icon Component
const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 100 100">
    {/* User silhouette with modern styling */}
    <defs>
      <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC72C"/>
        <stop offset="50%" stopColor="#FF5722"/>
        <stop offset="100%" stopColor="#8D153A"/>
      </linearGradient>
    </defs>
    
    {/* Head */}
    <circle cx="50" cy="35" r="18" fill="url(#profileGradient)" opacity="0.8"/>
    
    {/* Body */}
    <path d="M20 85 Q20 65 35 60 Q50 55 65 60 Q80 65 80 85 L20 85 Z" fill="url(#profileGradient)" opacity="0.8"/>
    
    {/* Settings gear overlay */}
    <g transform="translate(65, 20)" opacity="0.9">
      <circle cx="8" cy="8" r="6" fill="none" stroke="#FFC72C" strokeWidth="1.5"/>
      <circle cx="8" cy="8" r="2" fill="#FFC72C"/>
      <line x1="8" y1="2" x2="8" y2="4" stroke="#FFC72C" strokeWidth="1.5"/>
      <line x1="8" y1="12" x2="8" y2="14" stroke="#FFC72C" strokeWidth="1.5"/>
      <line x1="14" y1="8" x2="12" y2="8" stroke="#FFC72C" strokeWidth="1.5"/>
      <line x1="4" y1="8" x2="2" y2="8" stroke="#FFC72C" strokeWidth="1.5"/>
    </g>
  </svg>
);

interface ProfileLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode; // Made optional since we're using fixed text
  subtitle?: string;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ 
  children, 
  subtitle,
  language = 'en',
  onLanguageChange
}) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const t = translations[language];

  const handleLanguageChange = (newLanguage: Language) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    router.push('/agent/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden theme-transition-slow">
      {/* Modern Sri Lankan Background with Enhanced Profile Styling */}
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
        
        {/* Enhanced profile-specific accent patterns */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FFC72C]/8 dark:bg-[#FFC72C]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#8D153A]/8 dark:bg-[#8D153A]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5722]/6 dark:bg-[#FF5722]/3 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
          {/* Additional profile-specific accents */}
          <div className="absolute top-3/4 right-1/3 w-48 h-48 bg-[#FFA726]/6 dark:bg-[#FFA726]/3 rounded-full blur-2xl animate-pulse" style={{animationDuration: '14s', animationDelay: '1s'}}></div>
          <div className="absolute top-1/6 left-1/5 w-56 h-56 bg-[#FF9800]/5 dark:bg-[#FF9800]/2 rounded-full blur-3xl animate-pulse" style={{animationDuration: '16s', animationDelay: '6s'}}></div>
        </div>
      </div>
      
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full bg-card/95 dark:bg-card/98 backdrop-blur-md border-b border-border/50 shadow-glow modern-card">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#FFC72C]/10 to-[#FF5722]/10 rounded-xl p-0.5 flex items-center justify-center border border-[#FFC72C]/20 relative overflow-visible backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              <ProfileIcon className="w-11 h-11 absolute transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <Link href="/agent/dashboard" className="text-xl md:text-2xl font-bold text-gradient leading-none hover:scale-105 transition-transform duration-300">
                GovLink
              </Link>
              <span className="text-xs text-muted-foreground/70 font-medium leading-none">{t.agentPortal}</span>
            </div>
            <div className="h-8 w-px bg-border/50 ml-2"></div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{t.profile}</span>
              <span className="text-xs text-muted-foreground">Settings & Configuration</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Back to Dashboard Button */}
            <Link 
              href="/agent/dashboard" 
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 hover:border-[#FFC72C]/60 text-sm font-medium text-foreground hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 shadow-md hover:shadow-lg modern-card"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5m7-7-7 7 7 7"/>
              </svg>
              <span>{t.backToDashboard.replace('← ', '')}</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                className="p-2.5 rounded-xl bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 hover:border-[#FFC72C]/60 text-foreground hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 shadow-md hover:shadow-lg modern-card hover:scale-105"
                aria-label={t.notifications}
                title={t.notifications}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FF5722] to-[#8D153A] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  1
                </span>
              </button>
            </div>

            {/* Language Dropdown */}
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
                  <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 bg-card/95 dark:bg-card/98 backdrop-blur-md border border-border/50 rounded-xl shadow-glow overflow-hidden animate-fade-in-up z-50 modern-card">
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
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 hover:border-[#FFC72C]/60 text-sm font-medium text-foreground hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 shadow-md hover:shadow-lg modern-card"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="hidden sm:block">DEMO1234</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card/95 dark:bg-card/98 backdrop-blur-md border border-border/50 rounded-xl shadow-glow overflow-hidden animate-fade-in-up z-50 modern-card">
                    <div className="px-4 py-3 border-b border-border/30 bg-gradient-to-r from-[#FFC72C]/5 to-[#FF5722]/5">
                      <div className="font-medium text-foreground">DEMO1234</div>
                      <div className="text-xs text-muted-foreground">Immigration & Emigration</div>
                    </div>
                    <Link href="/agent/profile" className="w-full text-left px-4 py-3 text-sm font-medium text-[#FFC72C] bg-[#FFC72C]/10 border-l-2 border-l-[#FFC72C] transition-all duration-200 flex items-center gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {t.profile}
                    </Link>
                    <button className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-card/30 transition-all duration-200 flex items-center gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                      </svg>
                      {t.settings}
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-card/30 transition-all duration-200 flex items-center gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                      {t.help}
                    </button>
                    <div className="border-t border-border/30">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-[#FF5722] hover:bg-[#FF5722]/10 transition-all duration-200 flex items-center gap-3"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        {t.logout}
                      </button>
                    </div>
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
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {/* Enhanced Title Section with Profile Focus */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="mb-6 relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C]/20 to-[#FF5722]/20 rounded-2xl blur-xl animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-[#FFC72C]/10 to-[#FF5722]/10 rounded-2xl p-1 border border-[#FFC72C]/30 backdrop-blur-sm shadow-2xl">
                <ProfileIcon className="w-full h-full animate-glow" />
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
              <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-foreground">Agent Profile Settings</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight animate-title-wave">
            <span className="text-foreground">Profile</span>{' '}
            <span className="text-gradient">Settings</span>
          </h1>
          
          {subtitle && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
          
          {/* Agent Info Card */}
          <div className="mt-8 inline-block">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-glow modern-card hover:shadow-2xl transition-all duration-500 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-lg font-bold">D</span>
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">Agent DEMO1234</div>
                  <div className="text-sm text-muted-foreground">Immigration & Emigration</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
                    <span className="text-xs text-[#008060] font-medium">Active Session</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {children}
      </main>

      {/* Click outside to close dropdowns */}
      {(isDropdownOpen || isProfileDropdownOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsDropdownOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ProfileLayout;