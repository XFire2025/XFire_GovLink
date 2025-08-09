// src/components/agent/dashboard/StatsOverview.tsx
"use client";
import React from 'react';

// Types
type Language = 'en' | 'si' | 'ta';

interface StatsTranslation {
  pendingAppointments: string;
  newSubmissions: string;
  activeChats: string;
  todayProcessed: string;
  thisWeek: string;
  unread: string;
  live: string;
  completed: string;
}

// Stats translations
const statsTranslations: Record<Language, StatsTranslation> = {
  en: {
    pendingAppointments: 'Pending Appointments',
    newSubmissions: 'New Submissions',
    activeChats: 'Active Chats',
    todayProcessed: 'Today Processed',
    thisWeek: 'This Week',
    unread: 'Unread',
    live: 'Live',
    completed: 'Completed'
  },
  si: {
    pendingAppointments: 'පොරොත්තු නියමයන්',
    newSubmissions: 'නව ගොනුකිරීම්',
    activeChats: 'ක්‍රියාකාරී කතාබස්',
    todayProcessed: 'අද සැකසුණු',
    thisWeek: 'මෙම සතිය',
    unread: 'නොකියවූ',
    live: 'සජීවී',
    completed: 'සම්පූර්ණ'
  },
  ta: {
    pendingAppointments: 'நிலுவையில் உள்ள சந்திப்புகள்',
    newSubmissions: 'புதிய சமர்பிப்புகள்',
    activeChats: 'செயலில் உள்ள அரட்டைகள்',
    todayProcessed: 'இன்று செயலாக்கப்பட்டது',
    thisWeek: 'இந்த வாரம்',
    unread: 'படிக்காதது',
    live: 'நேரலை',
    completed: 'முடிக்கப்பட்டது'
  }
};

interface StatCard {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: string;
  bgColor: string;
}

interface StatsOverviewProps {
  language?: Language;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ language = 'en' }) => {
  const t = statsTranslations[language];

  // Mock stats data with Sri Lankan flag colors
  const stats: StatCard[] = [
    {
      id: 'appointments',
      value: '24',
      label: t.pendingAppointments,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      ),
      trend: { value: '+12%', isPositive: true },
      color: '#FF5722',
      bgColor: 'from-[#FF5722]/10 to-[#FF5722]/5'
    },
    {
      id: 'submissions',
      value: '142',
      label: t.newSubmissions,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      trend: { value: '+8%', isPositive: true },
      color: '#FFC72C',
      bgColor: 'from-[#FFC72C]/10 to-[#FFC72C]/5'
    },
    {
      id: 'chats',
      value: '7',
      label: t.activeChats,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="11" r="1"/>
          <circle cx="8" cy="11" r="1"/>
          <circle cx="16" cy="11" r="1"/>
        </svg>
      ),
      trend: { value: t.live, isPositive: true },
      color: '#008060',
      bgColor: 'from-[#008060]/10 to-[#008060]/5'
    },
    {
      id: 'processed',
      value: '89',
      label: t.todayProcessed,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ),
      trend: { value: '+15%', isPositive: true },
      color: '#8D153A',
      bgColor: 'from-[#8D153A]/10 to-[#8D153A]/5'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
      {stats.map((stat, index) => (
        <div 
          key={stat.id} 
          className={`
            group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:shadow-2xl hover-lift animate-fade-in-up modern-card relative overflow-hidden
          `}
          style={{
            animationDelay: `${0.1 * (index + 1)}s`,
          }}
        >
          {/* Header with Icon */}
          <div className="flex items-center justify-between mb-4">
            <div 
              className={`
                relative p-3 rounded-xl bg-gradient-to-r ${stat.bgColor} transition-all duration-500 group-hover:scale-110
              `}
              style={{
                border: `2px solid ${stat.color}30`,
              }}
            >
              <div style={{color: stat.color}} className="transition-all duration-300 group-hover:scale-110">
                {stat.icon}
              </div>
              
              {/* Icon Glow Effect - SAME as Landing Page */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div 
                  className="absolute inset-0 rounded-xl blur-xl" 
                  style={{background: `radial-gradient(circle, ${stat.color}20 0%, transparent 70%)`}}
                ></div>
              </div>
            </div>
            
            {/* Trend Indicator - Enhanced */}
            {stat.trend && (
              <div className={`
                flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all duration-300 hover:scale-105
                ${stat.trend.isPositive 
                  ? 'text-[#008060] bg-[#008060]/10 border-[#008060]/20' 
                  : 'text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/20'
                }
              `}>
                {stat.trend.isPositive && stat.trend.value.includes('%') && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l10-10"/>
                    <path d="M17 7h-10v10"/>
                  </svg>
                )}
                <span>{stat.trend.value}</span>
              </div>
            )}
          </div>

          {/* Stats Value - Enhanced */}
          <div className="mb-2">
            <div 
              className="text-3xl sm:text-4xl font-bold transition-all duration-500 group-hover:scale-105" 
              style={{color: stat.color}}
            >
              {stat.value}
            </div>
          </div>

          {/* Stats Label - Enhanced */}
          <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">
            {stat.label}
          </div>

          {/* Hover Effect Gradient - EXACT SAME as Landing Page */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(circle at center, ${stat.color}05 0%, transparent 70%)`
              }}
            ></div>
          </div>

          {/* Animated Border Glow */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
            style={{
              boxShadow: `0 0 30px ${stat.color}30`
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;