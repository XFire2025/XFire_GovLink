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
    { name: 'User Registrations', value: currentData.userRegistrations, color: '#3B82F6' },
    { name: 'Verification Requests', value: currentData.verificationRequests, color: '#EF4444' },
    { name: 'Chat Sessions', value: currentData.chatSessions, color: '#10B981' },
    { name: 'Resolved Issues', value: currentData.resolvedIssues, color: '#F59E0B' }
  ];

  const generateReport = () => {
    // This would generate and download a PDF report
    console.log(`Generating ${selectedPeriod} report...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive reports and analytics for system performance and user activity.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button 
            onClick={generateReport}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism p-6 rounded-2xl border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{currentData.userRegistrations}</div>
              <div className="text-sm text-muted-foreground">New Users</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500">+12%</span>
            <span className="text-muted-foreground">vs last {selectedPeriod}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-morphism p-6 rounded-2xl border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{currentData.chatSessions}</div>
              <div className="text-sm text-muted-foreground">Chat Sessions</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500">+8%</span>
            <span className="text-muted-foreground">vs last {selectedPeriod}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-morphism p-6 rounded-2xl border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{currentData.resolvedIssues}</div>
              <div className="text-sm text-muted-foreground">Resolved Issues</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500">+15%</span>
            <span className="text-muted-foreground">vs last {selectedPeriod}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-morphism p-6 rounded-2xl border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{currentData.systemUptime}%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-500">Excellent</span>
            <span className="text-muted-foreground">performance</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-morphism p-6 rounded-2xl border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Activity Overview</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-morphism p-6 rounded-2xl border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">System Health</h3>
            <PieChart className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Server Status</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Healthy</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Database</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Optimal</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">API Response</span>
              </div>
              <span className="text-sm text-yellow-600 font-medium">Slow</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Chat System</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-morphism p-6 rounded-2xl border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Available Reports</h3>
          <Filter className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-foreground">User Activity Report</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Detailed analysis of user registrations, logins, and activity patterns.
            </p>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Generate →
            </button>
          </div>
          
          <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-foreground">Support Performance</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Agent performance metrics, response times, and customer satisfaction.
            </p>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Generate →
            </button>
          </div>
          
          <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h4 className="font-medium text-foreground">Security Report</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Security incidents, failed login attempts, and account suspensions.
            </p>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Generate →
            </button>
          </div>
          
          <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <h4 className="font-medium text-foreground">System Usage</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              System resource usage, peak hours, and performance metrics.
            </p>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Generate →
            </button>
          </div>
          
          <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-yellow-500" />
              <h4 className="font-medium text-foreground">Verification Metrics</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Account verification processing times and approval rates.
            </p>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Generate →
            </button>
          </div>
          
          <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h4 className="font-medium text-foreground">Monthly Summary</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Comprehensive monthly overview of all system activities.
            </p>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Generate →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminReports;
