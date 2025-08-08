"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';


interface ReportData {
  period: string;
  userRegistrations: number;
  verificationRequests: number;
  chatSessions: number;
  resolvedIssues: number;
  suspensions: number;
  systemUptime: number;
}

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [reportData] = useState<ReportData[]>([
    {
      period: 'week',
      userRegistrations: 45,
      verificationRequests: 23,
      chatSessions: 156,
      resolvedIssues: 142,
      suspensions: 3,
      systemUptime: 99.8
    },
    {
      period: 'month',
      userRegistrations: 234,
      verificationRequests: 145,
      chatSessions: 892,
      resolvedIssues: 823,
      suspensions: 12,
      systemUptime: 99.5
    },
    {
      period: 'quarter',
      userRegistrations: 678,
      verificationRequests: 456,
      chatSessions: 2543,
      resolvedIssues: 2398,
      suspensions: 34,
      systemUptime: 99.7
    }
  ]);

  const currentData = reportData.find(data => data.period === selectedPeriod) || reportData[0];

  const chartData = [
    { name: 'User Registrations', value: currentData.userRegistrations, color: '#8D153A' },
    { name: 'Verification Requests', value: currentData.verificationRequests, color: '#FF5722' },
    { name: 'Chat Sessions', value: currentData.chatSessions, color: '#008060' },
    { name: 'Resolved Issues', value: currentData.resolvedIssues, color: '#FFC72C' }
  ];

  const generateReport = () => {
    // This would generate and download a PDF report
    console.log(`Generating ${selectedPeriod} report...`);
  };

  return (
    <div className="relative min-h-full">
      {/* Main content */}
      <div className="space-y-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-fade-in-up"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-[#8D153A]" />
                <span className="text-foreground">Admin</span>{' '}
                <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                  Reports
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground">
              Comprehensive reports and analytics for system performance and user activity.
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#FFC72C]/50 transition-all duration-300 modern-card hover:shadow-md">
              <RefreshCw className="w-4 h-4 text-[#FFC72C]" />
              Refresh
            </button>
            <button 
              onClick={generateReport}
              className="flex items-center gap-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 modern-card"
            >
              <Download className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </motion.div>

        {/* Enhanced Key Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#8D153A]/20 to-[#8D153A]/10 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-[#8D153A]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{currentData.userRegistrations}</div>
                <div className="text-sm text-muted-foreground">New Users</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-[#008060]" />
              <span className="text-[#008060] font-semibold">+12%</span>
              <span className="text-muted-foreground">vs last {selectedPeriod}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#008060]/20 to-[#008060]/10 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 text-[#008060]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{currentData.chatSessions}</div>
                <div className="text-sm text-muted-foreground">Chat Sessions</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-[#008060]" />
              <span className="text-[#008060] font-semibold">+8%</span>
              <span className="text-muted-foreground">vs last {selectedPeriod}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#FFC72C]/20 to-[#FFC72C]/10 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-[#FFC72C]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{currentData.resolvedIssues}</div>
                <div className="text-sm text-muted-foreground">Resolved Issues</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-[#008060]" />
              <span className="text-[#008060] font-semibold">+15%</span>
              <span className="text-muted-foreground">vs last {selectedPeriod}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#FF5722]/20 to-[#FF5722]/10 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6 text-[#FF5722]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{currentData.systemUptime}%</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-[#008060]" />
              <span className="text-[#008060] font-semibold">Excellent</span>
              <span className="text-muted-foreground">performance</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Charts Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Enhanced Activity Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-[#8D153A] transition-colors duration-300">Activity Overview</h3>
              <BarChart3 className="w-5 h-5 text-[#8D153A]" />
            </div>
            
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2.5 border border-border/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-2.5 rounded-full transition-all duration-500 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-[#8D153A] transition-colors duration-300">System Health</h3>
              <PieChart className="w-5 h-5 text-[#8D153A]" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#008060]/5 border border-[#008060]/20 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#008060]" />
                  <span className="text-sm font-medium text-foreground">Server Status</span>
                </div>
                <span className="text-sm text-[#008060] font-semibold">Healthy</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#008060]/5 border border-[#008060]/20 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#008060]" />
                  <span className="text-sm font-medium text-foreground">Database</span>
                </div>
                <span className="text-sm text-[#008060] font-semibold">Optimal</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#FFC72C]/5 border border-[#FFC72C]/20 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#FFC72C]" />
                  <span className="text-sm font-medium text-foreground">API Response</span>
                </div>
                <span className="text-sm text-[#FFC72C] font-semibold">Slow</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#008060]/5 border border-[#008060]/20 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#008060]" />
                  <span className="text-sm font-medium text-foreground">Chat System</span>
                </div>
                <span className="text-sm text-[#008060] font-semibold">Online</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Detailed Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-[#8D153A] transition-colors duration-300">Available Reports</h3>
            <Filter className="w-5 h-5 text-[#8D153A]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 hover:border-[#8D153A]/50 transition-all duration-300 cursor-pointer hover:scale-105 modern-card">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-[#8D153A]" />
                <h4 className="font-medium text-foreground">User Activity Report</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Detailed analysis of user registrations, logins, and activity patterns.
              </p>
              <button className="text-sm text-[#8D153A] hover:text-[#8D153A]/80 transition-colors font-semibold">
                Generate →
              </button>
            </div>
            
            <div className="p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 hover:border-[#008060]/50 transition-all duration-300 cursor-pointer hover:scale-105 modern-card">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-[#008060]" />
                <h4 className="font-medium text-foreground">Support Performance</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Agent performance metrics, response times, and customer satisfaction.
              </p>
              <button className="text-sm text-[#008060] hover:text-[#008060]/80 transition-colors font-semibold">
                Generate →
              </button>
            </div>
            
            <div className="p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 hover:border-[#FF5722]/50 transition-all duration-300 cursor-pointer hover:scale-105 modern-card">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#FF5722]" />
                <h4 className="font-medium text-foreground">Security Report</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Security incidents, failed login attempts, and account suspensions.
              </p>
              <button className="text-sm text-[#FF5722] hover:text-[#FF5722]/80 transition-colors font-semibold">
                Generate →
              </button>
            </div>
            
            <div className="p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 hover:border-[#FFC72C]/50 transition-all duration-300 cursor-pointer hover:scale-105 modern-card">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-[#FFC72C]" />
                <h4 className="font-medium text-foreground">System Usage</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                System resource usage, peak hours, and performance metrics.
              </p>
              <button className="text-sm text-[#FFC72C] hover:text-[#FFC72C]/80 transition-colors font-semibold">
                Generate →
              </button>
            </div>
            
            <div className="p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 hover:border-[#8D153A]/50 transition-all duration-300 cursor-pointer hover:scale-105 modern-card">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-[#8D153A]" />
                <h4 className="font-medium text-foreground">Verification Metrics</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Account verification processing times and approval rates.
              </p>
              <button className="text-sm text-[#8D153A] hover:text-[#8D153A]/80 transition-colors font-semibold">
                Generate →
              </button>
            </div>
            
            <div className="p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 hover:border-[#008060]/50 transition-all duration-300 cursor-pointer hover:scale-105 modern-card">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-[#008060]" />
                <h4 className="font-medium text-foreground">Monthly Summary</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Comprehensive monthly overview of all system activities.
              </p>
              <button className="text-sm text-[#008060] hover:text-[#008060]/80 transition-colors font-semibold">
                Generate →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReports;
