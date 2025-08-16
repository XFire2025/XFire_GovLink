// src/components/department/analytics/DepartmentAnalyticsDashboard.tsx
"use client";
import React, { useState } from 'react';
import DepartmentPerformanceMetrics from './DepartmentPerformanceMetrics';
import ServiceReports from './ServiceReports';
import AgentLeaderboard from './AgentLeaderboard';
import AppointmentSubmissions from './AppointmentSubmissions';
import { FileText, Clock, Check, Smile, BarChart2, BookOpen, Users, Calendar } from 'lucide-react';

type TimeRange = 'today' | 'week' | 'month' | 'quarter';

export default function DepartmentAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'reports' | 'leaderboard' | 'appointments'>('metrics');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  
  // Dummy data for display
  const quickStats = [
    { 
      label: 'Total Submissions', 
      value: '1,247', 
      change: '+15.2%', 
      icon: FileText, 
      color: '#8D153A' 
    },
    { 
      label: 'Avg Resolution Time', 
      value: '2.3 days', 
      change: '-8.5%', 
      icon: Clock, 
      color: '#FF5722' 
    },
    { 
      label: 'Approval Rate', 
      value: '94.7%', 
      change: '+2.1%', 
      icon: Check, 
      color: '#008060' 
    },
    { 
      label: 'Citizen Satisfaction', 
      value: '96.8%', 
      change: '+4.3%', 
      icon: Smile, 
      color: '#FFC72C' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex bg-card/60 border border-border/50 rounded-xl p-1 modern-card">
          {(['today', 'week', 'month', 'quarter'] as TimeRange[]).map((key) => (
            <button key={key} onClick={() => setTimeRange(key)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${timeRange === key ? 'bg-gradient-to-r from-[#008060] to-[#8D153A] text-white shadow-lg' : 'text-muted-foreground hover:bg-card/30'}`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
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
              <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-[#008060]/10 text-[#008060]' : 'bg-[#FF5722]/10 text-[#FF5722]'
              }`}>
                {stat.change}
              </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button onClick={() => setActiveTab('metrics')} className={`flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'metrics' ? 'bg-gradient-to-r from-[#008060] to-[#8D153A] text-white shadow-lg' : 'text-muted-foreground hover:bg-card/30'}`}>
            <BarChart2 className="w-5 h-5" /> Performance Metrics
          </button>
          <button onClick={() => setActiveTab('reports')} className={`flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'reports' ? 'bg-gradient-to-r from-[#008060] to-[#8D153A] text-white shadow-lg' : 'text-muted-foreground hover:bg-card/30'}`}>
            <BookOpen className="w-5 h-5" /> Service Reports
          </button>
          <button onClick={() => setActiveTab('leaderboard')} className={`flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'leaderboard' ? 'bg-gradient-to-r from-[#008060] to-[#8D153A] text-white shadow-lg' : 'text-muted-foreground hover:bg-card/30'}`}>
            <Users className="w-5 h-5" /> Agent Leaderboard
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-medium transition-all ${activeTab === 'appointments' ? 'bg-gradient-to-r from-[#008060] to-[#8D153A] text-white shadow-lg' : 'text-muted-foreground hover:bg-card/30'}`}>
            <Calendar className="w-5 h-5" /> Appointments
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up">
        {activeTab === 'metrics' && <DepartmentPerformanceMetrics />}
        {activeTab === 'reports' && <ServiceReports />}
        {activeTab === 'leaderboard' && <AgentLeaderboard />}
        {activeTab === 'appointments' && <AppointmentSubmissions />}
      </div>
    </div>
  );
}
