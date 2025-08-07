"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  AlertCircle,
  UserCog,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

// Dashboard Stats Component
const DashboardStats = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Agents",
      value: "156",
      change: "+5%",
      trend: "up",
      icon: UserCog,
      color: "green",
    },
    {
      title: "Pending Verifications",
      value: "23",
      change: "-8%",
      trend: "down",
      icon: UserCheck,
      color: "orange",
    },
    {
      title: "System Alerts",
      value: "3",
      change: "+2",
      trend: "up",
      icon: AlertCircle,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-morphism p-6 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
            </div>
            <div
              className={`flex items-center gap-1 text-sm ${
                stat.trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {stat.change}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to the GovLink administration panel. Monitor system status and
          manage users.
        </p>
      </div>

      <DashboardStats />

      {/* Recent Activity */}
      <div className="glass-morphism p-6 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h3>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">
                New user registration: Amal Perera
              </p>
              <p className="text-xs text-muted-foreground">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">
                User verification completed: Saman Silva
              </p>
              <p className="text-xs text-muted-foreground">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">
                System alert: High server load detected
              </p>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
