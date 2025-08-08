// src/app/agent/dashboard/page.tsx
"use client";
import { useState } from 'react';
import DashboardLayout from '@/components/agent/dashboard/DashboardLayout';
import StatsOverview from '@/components/agent/dashboard/StatsOverview';
import QuickActions from '@/components/agent/dashboard/QuickActions';

// Types
type Language = 'en' | 'si' | 'ta';

// Dashboard translations
const dashboardTranslations: Record<Language, {
  welcome: string;
  subtitle: string;
  overview: string;
}> = {
  en: {
    welcome: 'Agent Dashboard',
    subtitle: 'Manage citizen services and government operations',
    overview: 'System Overview'
  },
  si: {
    welcome: 'නිලධාරි පාලනය',
    subtitle: 'පුරවැසි සේවා සහ රාජ්‍ය මෙහෙයුම් කළමනාකරණය',
    overview: 'පද්ධති දළ විශ්ලේෂණය'
  },
  ta: {
    welcome: 'அதிகாரி டாஷ்போர்டு',
    subtitle: 'குடிமக்கள் சேவைகள் மற்றும் அரசாங்க நடவடிக்கைகளை நிர்வகிக்கவும்',
    overview: 'கணினி கண்ணோட்டம்'
  }
};

export default function AgentDashboardPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  const t = dashboardTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  return (
    <DashboardLayout
      title={
        <span className="animate-title-wave">
          <span className="text-foreground">{t.welcome.split(' ')[0]}</span>{' '}
          <span className="text-gradient">
            {t.welcome.split(' ')[1] || ''}
          </span>
        </span>
      }
      subtitle={t.subtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="space-y-12">
        {/* Quick Stats Overview */}
        <section>
          <div className="mb-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
              <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-foreground">{t.overview}</span>
            </div>
          </div>
          <StatsOverview language={currentLanguage} />
        </section>

        {/* Main Actions Grid */}
        <section>
          <QuickActions language={currentLanguage} />
        </section>

        {/* Welcome Message - Enhanced with Landing Page Styling */}
        <section className="animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-glow border border-border/50 hover:border-[#FFC72C]/50 hover:shadow-2xl transition-all duration-500 modern-card group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center mx-auto mb-4 animate-glow group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-[#FFC72C] transition-colors duration-300">
                Welcome, Agent DEMO1234
              </h3>
              <p className="text-sm text-muted-foreground">
                Department of Immigration & Emigration
              </p>
              
              {/* Additional Status Indicators */}
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#008060]/10 text-[#008060] rounded-full text-xs font-medium border border-[#008060]/20">
                  <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
                  <span>Active Session</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFC72C]/10 text-[#FFC72C] rounded-full text-xs font-medium border border-[#FFC72C]/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>8:47 AM</span>
                </div>
              </div>
            </div>
            
            {/* Hover Effect Gradient - EXACT SAME as Landing Page */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}