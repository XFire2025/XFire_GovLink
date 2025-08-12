// src/app/department/dashboard/page.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Users, FileText, Clock, CheckCircle, ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/hooks/useTranslation";

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

export default function DepartmentDashboardPage() {
  const { t } = useTranslation('department');

  const stats: Stat[] = [
    { index: 0, title: t('dashboard.stats.total_submissions'), value: "1,482", change: "+15%", icon: FileText, color: "#8D153A", bgColor: "from-[#8D153A]/10 to-[#8D153A]/5" },
    { index: 1, title: t('dashboard.stats.assigned_agents'), value: "32", change: "+2", icon: Users, color: "#008060", bgColor: "from-[#008060]/10 to-[#008060]/5" },
    { index: 2, title: t('dashboard.stats.pending_reviews'), value: "76", change: "-5%", icon: Clock, color: "#FFC72C", bgColor: "from-[#FFC72C]/10 to-[#FFC72C]/5" },
    { index: 3, title: t('dashboard.stats.service_uptime'), value: "99.8%", change: "+0.1%", icon: CheckCircle, color: "#FF5722", bgColor: "from-[#FF5722]/10 to-[#FF5722]/5" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          <span className="bg-gradient-to-r from-[#008060] to-[#FF5722] bg-clip-text text-transparent">
            {t('dashboard.title')}
          </span>
        </h1>
        <p className="text-muted-foreground">{t('dashboard.welcome')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => <StatCard key={stat.title} stat={stat} />)}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow modern-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">{t('activity.title')}</h3>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all">
            {t('activity.refresh')}
          </button>
        </div>
        <div className="text-center py-10 border-2 border-dashed border-border/30 rounded-lg">
          <p className="text-muted-foreground">Recent activity will be displayed here.</p>
        </div>
      </motion.div>
    </div>
  );
}