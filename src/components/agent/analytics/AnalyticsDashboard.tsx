// src/components/agent/analytics/AnalyticsDashboard.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import PerformanceMetrics from './PerformanceMetrics';
import ReportGenerator from './ReportGenerator';
import SystemTrends from './SystemTrends';

// Types
type Language = 'en' | 'si' | 'ta';
type TimeRange = 'today' | 'week' | 'month' | 'quarter';

interface DashboardTranslation {
  overview: string;
  performanceMetrics: string;
  reportGenerator: string;
  systemTrends: string;
  performanceDesc: string;
  reportDesc: string;
  trendsDesc: string;
  timeRanges: {
    [key in TimeRange]: string;
  };
  quickStats: string;
  totalInteractions: string;
  avgResponseTime: string;
  satisfactionRate: string;
  resolutionRate: string;
  refreshData: string;
  lastUpdated: string;
}

// Dashboard translations
const dashboardTranslations: Record<Language, DashboardTranslation> = {
  en: {
    overview: 'Analytics Overview',
    performanceMetrics: 'Performance Metrics',
    reportGenerator: 'Report Generator',
    systemTrends: 'System Trends',
    performanceDesc: 'Track your personal and team performance statistics',
    reportDesc: 'Generate comprehensive reports for various time periods',
    trendsDesc: 'Monitor system patterns and operational insights',
    timeRanges: {
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      quarter: 'This Quarter'
    },
    quickStats: 'Quick Statistics',
    totalInteractions: 'Total Interactions',
    avgResponseTime: 'Avg Response Time',
    satisfactionRate: 'Satisfaction Rate',
    resolutionRate: 'Resolution Rate',
    refreshData: 'Refresh Data',
    lastUpdated: 'Last Updated'
  },
  si: {
    overview: 'විශ්ලේෂණ දළ විශ්ලේෂණය',
    performanceMetrics: 'කාර්ය සාධන මිනුම්',
    reportGenerator: 'වාර්තා ජනනකය',
    systemTrends: 'පද්ධති ප්‍රවණතා',
    performanceDesc: 'ඔබගේ පුද්ගලික සහ කණ්ඩායම් කාර්ය සාධන සංඛ්‍යාලේඛන ලුහුබඳින්න',
    reportDesc: 'විවිධ කාල සීමා සඳහා සවිස්තරාත්මක වාර්තා ජනනය කරන්න',
    trendsDesc: 'පද්ධති රටා සහ මෙහෙයුම් තීක්ෂ්ණතා නිරීක්ෂණය කරන්න',
    timeRanges: {
      today: 'අද',
      week: 'මෙම සතිය',
      month: 'මෙම මාසය',
      quarter: 'මෙම කාර්තුව'
    },
    quickStats: 'ඉක්මන් සංඛ්‍යාලේඛන',
    totalInteractions: 'සම්පූර්ණ අන්තර්ක්‍රියා',
    avgResponseTime: 'සාමාන්‍ය ප්‍රතිචාර කාලය',
    satisfactionRate: 'තෘප්තිමත් අනුපාතය',
    resolutionRate: 'විසඳුම් අනුපාතය',
    refreshData: 'දත්ත නැවුම් කරන්න',
    lastUpdated: 'අවසන් යාවත්කාලීන'
  },
  ta: {
    overview: 'பகுப்பாய்வு கண்ணோட்டம்',
    performanceMetrics: 'செயல்திறன் அளவீடுகள்',
    reportGenerator: 'அறிக்கை உருவாக்கி',
    systemTrends: 'கணினி போக்குகள்',
    performanceDesc: 'உங்கள் தனிப்பட்ட மற்றும் குழு செயல்திறன் புள்ளிவிவரங்களைக் கண்காணிக்கவும்',
    reportDesc: 'பல்வேறு கால அளவுகளுக்கு விரிவான அறிக்கைகளை உருவாக்கவும்',
    trendsDesc: 'கணினி வடிவங்கள் மற்றும் செயல்பாட்டு நுண்ணறிவுகளைக் கண்காணிக்கவும்',
    timeRanges: {
      today: 'இன்று',
      week: 'இந்த வாரம்',
      month: 'இந்த மாதம்',
      quarter: 'இந்த காலாண்டு'
    },
    quickStats: 'விரைவு புள்ளிவிவரங்கள்',
    totalInteractions: 'மொத்த தொடர்புகள்',
    avgResponseTime: 'சராசரி பதில் நேரம்',
    satisfactionRate: 'திருப்தி விகிதம்',
    resolutionRate: 'தீர்வு விகிதம்',
    refreshData: 'தரவை புதுப்பிக்கவும்',
    lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது'
  }
};

interface AnalyticsDashboardProps {
  language?: Language;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'reports' | 'trends'>('metrics');
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [analyticsData, setAnalyticsData] = useState<{
    quickStats: {
      totalInteractions: { value: string; change: string; isPositive: boolean };
      avgResponseTime: { value: string; unit: string; change: string; isPositive: boolean };
      satisfactionRate: { value: string; unit: string; change: string; isPositive: boolean };
      resolutionRate: { value: string; unit: string; change: string; isPositive: boolean };
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const t = dashboardTranslations[language];

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`/api/agent/analytics?timeRange=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setAnalyticsData(result.data);
        setLastUpdated(new Date());
      } else {
        console.error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, [timeRange]);

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  // Fetch data when component mounts or timeRange changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, fetchAnalyticsData]);

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString(language === 'en' ? 'en-US' : language === 'si' ? 'si-LK' : 'ta-LK', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Dynamic quick stats data from backend
  const quickStats = analyticsData?.quickStats ? [
    {
      id: 'interactions',
      label: t.totalInteractions,
      value: analyticsData.quickStats.totalInteractions.value,
      change: analyticsData.quickStats.totalInteractions.change,
      isPositive: analyticsData.quickStats.totalInteractions.isPositive,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <path d="M10 9h4"/>
          <path d="M10 13h4"/>
        </svg>
      ),
      color: '#FFC72C',
      bgColor: 'from-[#FFC72C]/10 to-[#FFC72C]/5'
    },
    {
      id: 'responseTime',
      label: t.avgResponseTime,
      value: `${analyticsData.quickStats.avgResponseTime.value}${analyticsData.quickStats.avgResponseTime.unit}`,
      change: analyticsData.quickStats.avgResponseTime.change,
      isPositive: analyticsData.quickStats.avgResponseTime.isPositive,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      color: '#008060',
      bgColor: 'from-[#008060]/10 to-[#008060]/5'
    },
    {
      id: 'satisfaction',
      label: t.satisfactionRate,
      value: `${analyticsData.quickStats.satisfactionRate.value}${analyticsData.quickStats.satisfactionRate.unit}`,
      change: analyticsData.quickStats.satisfactionRate.change,
      isPositive: analyticsData.quickStats.satisfactionRate.isPositive,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      ),
      color: '#FF5722',
      bgColor: 'from-[#FF5722]/10 to-[#FF5722]/5'
    },
    {
      id: 'resolution',
      label: t.resolutionRate,
      value: `${analyticsData.quickStats.resolutionRate.value}${analyticsData.quickStats.resolutionRate.unit}`,
      change: analyticsData.quickStats.resolutionRate.change,
      isPositive: analyticsData.quickStats.resolutionRate.isPositive,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      color: '#8D153A',
      bgColor: 'from-[#8D153A]/10 to-[#8D153A]/5'
    }
  ] : [];

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC72C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 modern-card">
          <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-foreground">{t.overview}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl p-1 modern-card">
            {(Object.keys(t.timeRanges) as TimeRange[]).map((key) => (
              <button
                key={key}
                onClick={() => setTimeRange(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 ${
                  timeRange === key
                    ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
                }`}
              >
                {t.timeRanges[key]}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C]/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 shadow-md hover:shadow-lg modern-card"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`${isRefreshing ? 'animate-spin' : ''}`}
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
            <span className="text-sm hidden sm:block">
              {isRefreshing ? 'Refreshing...' : t.refreshData}
            </span>
          </button>

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground bg-card/30 px-3 py-2 rounded-lg border border-border/50">
            {t.lastUpdated}: {formatLastUpdated(lastUpdated)}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid - EXACT SAME pattern as StatsOverview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
        {quickStats.map((stat, index) => (
          <div 
            key={stat.id}
            className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:shadow-2xl hover-lift animate-fade-in-up modern-card relative overflow-hidden"
            style={{animationDelay: `${0.1 * (index + 1)}s`}}
          >
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-4">
              <div 
                className={`relative p-3 rounded-xl bg-gradient-to-r ${stat.bgColor} transition-all duration-500 group-hover:scale-110`}
                style={{
                  border: `2px solid ${stat.color}30`,
                }}
              >
                <div style={{color: stat.color}} className="transition-all duration-300 group-hover:scale-110">
                  {stat.icon}
                </div>
                
                {/* Icon Glow Effect - SAME as other components */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div 
                    className="absolute inset-0 rounded-xl blur-xl" 
                    style={{background: `radial-gradient(circle, ${stat.color}20 0%, transparent 70%)`}}
                  ></div>
                </div>
              </div>
              
              {/* Trend Indicator */}
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
                stat.isPositive 
                  ? 'text-[#008060] bg-[#008060]/10 border-[#008060]/20' 
                  : 'text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/20'
              }`}>
                {stat.isPositive && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l10-10"/>
                    <path d="M17 7h-10v10"/>
                  </svg>
                )}
                <span>{stat.change}</span>
              </div>
            </div>

            {/* Stats Value */}
            <div className="mb-2">
              <div 
                className="text-3xl sm:text-4xl font-bold transition-all duration-500 group-hover:scale-105" 
                style={{color: stat.color}}
              >
                {stat.value}
              </div>
            </div>

            {/* Stats Label */}
            <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">
              {stat.label}
            </div>

            {/* Hover Effect Gradient - EXACT SAME as other components */}
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

      {/* Tab Navigation - EXACT SAME pattern as other components */}
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-2 rounded-2xl border border-border/50 shadow-glow animate-fade-in-up modern-card" style={{animationDelay: '0.2s'}}>
        <div className="flex">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'metrics'
                ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span className="hidden sm:block">{t.performanceMetrics}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <span className="hidden sm:block">{t.reportGenerator}</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'trends'
                ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
            <span className="hidden sm:block">{t.systemTrends}</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow modern-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t.performanceMetrics}</h3>
                  <p className="text-sm text-muted-foreground">{t.performanceDesc}</p>
                </div>
              </div>
              
              <PerformanceMetrics language={language} timeRange={timeRange} />
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow modern-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[#008060]/10 to-[#FFC72C]/10 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t.reportGenerator}</h3>
                  <p className="text-sm text-muted-foreground">{t.reportDesc}</p>
                </div>
              </div>
              
              <ReportGenerator language={language} />
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow modern-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[#FF5722]/10 to-[#8D153A]/10 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"/>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t.systemTrends}</h3>
                  <p className="text-sm text-muted-foreground">{t.trendsDesc}</p>
                </div>
              </div>
              
              <SystemTrends language={language} timeRange={timeRange} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;