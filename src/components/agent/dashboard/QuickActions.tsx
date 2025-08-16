// src/components/agent/dashboard/QuickActions.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardCard from './DashboardCard';

// Types
type Language = 'en' | 'si' | 'ta';

interface ActionsTranslation {
  quickActions: string;
  viewAppointments: {
    title: string;
    description: string;
  };
  liveChat: {
    title: string;
    description: string;
  };
  analytics: {
    title: string;
    description: string;
  };
}

// Actions translations
const actionsTranslations: Record<Language, ActionsTranslation> = {
  en: {
    quickActions: 'Quick Actions',
    viewAppointments: {
      title: 'View Appointments',
      description: 'Manage citizen appointment bookings, schedules, and confirmations across all government departments.'
    },
    liveChat: {
      title: 'Live Chat Support',
      description: 'Provide real-time assistance to citizens with their government service inquiries and issues.'
    },
    analytics: {
      title: 'Analytics Dashboard',
      description: 'Monitor service performance, citizen satisfaction metrics, and departmental efficiency reports.'
    }
  },
  si: {
    quickActions: 'ඉක්මන් ක්‍රියා',
    viewAppointments: {
      title: 'නියමයන් බලන්න',
      description: 'සියලුම රාජ්‍ය දෙපාර්තමේන්තු හරහා පුරවැසි නියමයන්, කාල සටහන් සහ තහවුරු කිරීම් කළමනාකරණය කරන්න.'
    },
    liveChat: {
      title: 'සජීවී කතාබස් සහාය',
      description: 'පුරවැසියන්ට ඔවුන්ගේ රාජ්‍ය සේවා විමසීම් සහ ගැටලු සම්බන්ධයෙන් තත්‍ය කාලීන සහාය ලබා දීම.'
    },
    analytics: {
      title: 'විශ්ලේෂණ පුවරුව',
      description: 'සේවා කාර්ය සාධනය, පුරවැසි තෘප්තිමත් මිනුම් සහ දෙපාර්තමේන්තු කාර්යක්ෂමතා වාර්තා නිරීක්ෂණය කරන්න.'
    }
  },
  ta: {
    quickActions: 'விரைவு நடவடிக்கைகள்',
    viewAppointments: {
      title: 'சந்திப்புகளைப் பார்க்கவும்',
      description: 'அனைத்து அரசாங்க துறைகளிலும் குடிமக்கள் சந்திப்பு முன்பதிவுகள், அட்டவணைகள் மற்றும் உறுதிப்படுத்தல்களை நிர்வகிக்கவும்.'
    },
    liveChat: {
      title: 'நேரடி அரட்டை ஆதரவு',
      description: 'குடிமக்களுக்கு அவர்களின் அரசாங்க சேவை விசாரணைகள் மற்றும் பிரச்சினைகளுக்கு நிகழ்நேர உதவி வழங்கவும்.'
    },
    analytics: {
      title: 'பகுப்பாய்வு டாஷ்போர்டு',
      description: 'சேவை செயல்திறன், குடிமக்கள் திருப்தி அளவீடுகள் மற்றும் துறை செயல்திறன் அறிக்கைகளை கண்காணிக்கவும்.'
    }
  }
};

interface QuickActionsProps {
  language?: Language;
}

const QuickActions: React.FC<QuickActionsProps> = ({ language = 'en' }) => {
  const router = useRouter();
  const t = actionsTranslations[language];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <section className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
      {/* Section Header - EXACT SAME as Landing Page */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
          <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-foreground">{t.quickActions}</span>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* View Appointments Card */}
        <DashboardCard
          title={t.viewAppointments.title}
          description={t.viewAppointments.description}
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <path d="M8 14h.01"/>
              <path d="M12 14h.01"/>
              <path d="M16 14h.01"/>
              <path d="M8 18h.01"/>
              <path d="M12 18h.01"/>
            </svg>
          }
          onClick={() => handleNavigation('/agent/appointments')}
          badge="24"
          badgeColor="warning"
          animationDelay="0.1s"
        />

        {/* Live Chat Support Card */}
        <DashboardCard
          title={t.liveChat.title}
          description={t.liveChat.description}
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="11" r="1"/>
              <circle cx="8" cy="11" r="1"/>
              <circle cx="16" cy="11" r="1"/>
            </svg>
          }
          onClick={() => handleNavigation('/agent/chat')}
          badge="7"
          badgeColor="success"
          animationDelay="0.2s"
        />

        {/* Analytics Dashboard Card */}
        <DashboardCard
          title={t.analytics.title}
          description={t.analytics.description}
          icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          }
          onClick={() => handleNavigation('/agent/analytics')}
          badge="New"
          badgeColor="primary"
          animationDelay="0.3s"
        />
      </div>

      {/* Additional Quick Actions Row - Enhanced with Landing Page Styling */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats Card */}
        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow animate-fade-in-up modern-card hover:shadow-2xl hover:border-[#FFC72C]/50 transition-all duration-500 group" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 rounded-xl group-hover:from-[#FFC72C]/20 group-hover:to-[#FF5722]/20 transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                <path d="M12 2v20m8-10H4"/>
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">Quick Stats</div>
              <div className="text-sm text-muted-foreground">Today&apos;s Overview</div>
            </div>
          </div>
        </div>

        {/* Department Status Card */}
        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow animate-fade-in-up modern-card hover:shadow-2xl hover:border-[#008060]/50 transition-all duration-500 group" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#008060]/10 to-[#FFC72C]/10 rounded-xl group-hover:from-[#008060]/20 group-hover:to-[#FFC72C]/20 transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                <path d="M3 21h18"/>
                <path d="M5 21V7l8-4v18"/>
                <path d="M19 21V11l-6-4"/>
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground group-hover:text-[#008060] transition-colors duration-300">Department</div>
              <div className="text-sm text-muted-foreground">Immigration & Emigration</div>
            </div>
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow animate-fade-in-up modern-card hover:shadow-2xl hover:border-[#008060]/50 transition-all duration-500 group" style={{animationDelay: '0.7s'}}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#008060]/10 to-[#008060]/5 rounded-xl group-hover:from-[#008060]/20 group-hover:to-[#008060]/15 transition-all duration-300">
              <div className="w-3 h-3 bg-[#008060] rounded-full animate-pulse group-hover:scale-125 transition-transform duration-300"></div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground group-hover:text-[#008060] transition-colors duration-300">System Status</div>
              <div className="text-sm text-[#008060] font-medium">All Systems Operational</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;