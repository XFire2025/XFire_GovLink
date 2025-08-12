// src/components/department/analytics/DepartmentAnalyticsDashboard.tsx
"use client";
import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';
import DepartmentPerformanceMetrics from './DepartmentPerformanceMetrics';
import { FileText, Clock, Check, Smile, BarChart2, BookOpen, Users } from 'lucide-react';

type TimeRange = 'today' | 'week' | 'month' | 'quarter';

export default function DepartmentAnalyticsDashboard() {
  const { t } = useTranslation('department');
  const [activeTab, setActiveTab] = useState<'metrics' | 'reports' | 'leaderboard'>('metrics');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const quickStats = [
    { label: t('analytics.quickStats.totalSubmissions'), value: '8,432', change: '+15%', icon: FileText, color: '#8D153A' },
    { label: t('analytics.quickStats.avgResolutionTime'), value: '2.1 days', change: '-5%', icon: Clock, color: '#FF5722' },
    { label: t('analytics.quickStats.approvalRate'), value: '92.7%', change: '+1.2%', icon: Check, color: '#008060' },
    { label: t('analytics.quickStats.citizenSatisfaction'), value: '96%', change: '+3%', icon: Smile, color: '#FFC72C' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex bg-card/60 border border-border/50 rounded-xl p-1 modern-card">
          {(Object.keys(t('analytics.timeRanges', { returnObjects: true })) as TimeRange[]).map((key) => (
            <button key={key} onClick={() => setTimeRange(key)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${timeRange === key ? 'bg-gradient-to-r from-[#008060] to-[#8D153A] text-white shadow-lg' : 'text-muted-foreground hover:bg-card/30'}`}>
              {t(`analytics.timeRanges.${key}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
        {quickStats.map((stat, index) => (
          <div key={index} className="group bg-card/90 modern-card p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div className="text-sm font-semibold bg-[#008060]/10 text-[#008060] px-2 py-1 rounded-full">{stat.change}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="bg-card/90 modern-card p-2 rounded-2xl border border-border/50 shadow-glow">
        <div className="flex">
          <button onClick={() => setActiveTab('metrics')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'metrics' ? 'bg-gradient-to-r from-[#008060] to-[#8D153A] text-white shadow-lg' : 'text-muted-foreground hover:bg-card/30'}`}>
            <BarChart2 className="w-5 h-5" /> {t('analytics.performanceMetrics')}
          </button>
          <button onClick={() => setActiveTab('reports')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'reports' ? 'bg-gradient-to-r from-[#008060] to-[#8D153A] text-white shadow-lg' : 'text-muted-foreground hover:bg-card/30'}`}>
            <BookOpen className="w-5 h-5" /> {t('analytics.serviceReports')}
          </button>
          <button onClick={() => setActiveTab('leaderboard')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'leaderboard' ? 'bg-gradient-to-r from-[#008060] to-[#8D153A] text-white shadow-lg' : 'text-muted-foreground hover:bg-card/30'}`}>
            <Users className="w-5 h-5" /> {t('analytics.agentLeaderboard')}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up">
        {activeTab === 'metrics' && <DepartmentPerformanceMetrics />}
        {activeTab === 'reports' && <div className="text-center p-12 bg-card/90 modern-card rounded-xl"><p className="text-muted-foreground">Service Reports will be displayed here.</p></div>}
        {activeTab === 'leaderboard' && <div className="text-center p-12 bg-card/90 modern-card rounded-xl"><p className="text-muted-foreground">Agent Leaderboard will be displayed here.</p></div>}
      </div>
    </div>
  );
}