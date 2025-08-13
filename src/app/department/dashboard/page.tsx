// src/app/department/dashboard/page.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Users, FileText, Clock, CheckCircle, ArrowUpRight, RefreshCw, AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/hooks/useTranslation";
import { useDashboardData } from "@/lib/hooks/useDepartmentApi";

// Define a specific interface for a Stat object
interface Stat {
  index: number;
  title: string;
  value: string;
  change: string;
  // THIS IS THE CORRECTED LINE:
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
}

// Reusable Stat Card Component with the correct type
const StatCard = ({ stat }: { stat: Stat }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: stat.index * 0.1 }}
    className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:shadow-2xl hover-lift modern-card relative overflow-hidden"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`relative p-3 rounded-xl bg-gradient-to-r ${stat.bgColor}`} style={{ border: `2px solid ${stat.color}30` }}>
        {/* This line will now be valid because of the corrected interface */}
        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
      </div>
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#008060]/10 text-[#008060] border border-[#008060]/20">
        <ArrowUpRight className="w-4 h-4" />
        {stat.change}
      </div>
    </div>
    <div>
      <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
      <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{stat.title}</div>
    </div>
  </motion.div>
);

// Loading component
const LoadingCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow modern-card"
  >
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-muted rounded-xl"></div>
        <div className="w-16 h-6 bg-muted rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="w-16 h-8 bg-muted rounded"></div>
        <div className="w-24 h-4 bg-muted rounded"></div>
      </div>
    </div>
  </motion.div>
);

// Error component
const ErrorCard = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full bg-red-50 dark:bg-red-900/10 backdrop-blur-md p-6 rounded-2xl border border-red-200 dark:border-red-800 shadow-glow modern-card"
  >
    <div className="flex items-center gap-3">
      <AlertCircle className="w-6 h-6 text-red-500" />
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">Failed to load dashboard data</h3>
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  </motion.div>
);

export default function DepartmentDashboardPage() {
  const { t } = useTranslation('department');
  const { data: dashboardData, loading, error, refetch } = useDashboardData();

  // Create stats array from API data or show loading/error state
  const createStats = (): Stat[] => {
    if (!dashboardData) return [];

    return [
      { 
        index: 0, 
        title: t('dashboard.stats.total_submissions'), 
        value: dashboardData.stats.totalSubmissions.toLocaleString(), 
        change: dashboardData.changes.submissionChange, 
        icon: FileText, 
        color: "#8D153A", 
        bgColor: "from-[#8D153A]/10 to-[#8D153A]/5" 
      },
      { 
        index: 1, 
        title: t('dashboard.stats.assigned_agents'), 
        value: dashboardData.stats.activeAgents.toString(), 
        change: `${dashboardData.stats.totalAgents} total`, 
        icon: Users, 
        color: "#008060", 
        bgColor: "from-[#008060]/10 to-[#008060]/5" 
      },
      { 
        index: 2, 
        title: t('dashboard.stats.pending_reviews'), 
        value: dashboardData.stats.pendingSubmissions.toString(), 
        change: "pending", 
        icon: Clock, 
        color: "#FFC72C", 
        bgColor: "from-[#FFC72C]/10 to-[#FFC72C]/5" 
      },
      { 
        index: 3, 
        title: t('dashboard.stats.service_uptime'), 
        value: `${dashboardData.stats.serviceUptime}%`, 
        change: `${dashboardData.stats.activeServices}/${dashboardData.stats.totalServices}`, 
        icon: CheckCircle, 
        color: "#FF5722", 
        bgColor: "from-[#FF5722]/10 to-[#FF5722]/5" 
      },
    ];
  };

  const stats = createStats();

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="bg-gradient-to-r from-[#008060] to-[#FF5722] bg-clip-text text-transparent">
                {t('dashboard.title')}
              </span>
            </h1>
            <p className="text-muted-foreground">{t('dashboard.welcome')}</p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {t('activity.refresh')}
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {error ? (
          <ErrorCard message={error} onRetry={refetch} />
        ) : loading ? (
          Array.from({ length: 4 }, (_, index) => (
            <LoadingCard key={index} index={index} />
          ))
        ) : (
          stats.map((stat) => <StatCard key={stat.title} stat={stat} />)
        )}
      </div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 0.5 }} 
        className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow modern-card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">{t('activity.title')}</h3>
          <div className="flex items-center gap-2">
            {dashboardData?.recentSubmissions && dashboardData.recentSubmissions.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {dashboardData.recentSubmissions.length} recent submissions
              </span>
            )}
            <button 
              onClick={refetch}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {t('activity.refresh')}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-4 bg-muted rounded"></div>
                    <div className="w-48 h-3 bg-muted rounded"></div>
                  </div>
                  <div className="w-16 h-6 bg-muted rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 border-2 border-dashed border-red-200 rounded-lg">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 dark:text-red-400">Failed to load recent activity</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm text-red-500 hover:text-red-600 underline"
            >
              Try again
            </button>
          </div>
        ) : dashboardData?.recentSubmissions && dashboardData.recentSubmissions.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.recentSubmissions.map((submission, index) => (
              <motion.div
                key={submission.submissionId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#008060] to-[#FF5722] rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{submission.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {submission.applicantName} • {new Date(submission.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  submission.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  submission.status === 'IN_REVIEW' ? 'bg-blue-100 text-blue-700' :
                  submission.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {submission.status}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-border/30 rounded-lg">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No recent submissions found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}