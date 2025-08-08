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


// Enhanced Dashboard Stats Component (following agent dashboard design)
const DashboardStats = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "#8D153A", // Sri Lankan maroon
      bgColor: "from-[#8D153A]/10 to-[#8D153A]/5"
    },
    {
      title: "Active Agents",
      value: "156",
      change: "+5%",
      trend: "up",
      icon: UserCog,
      color: "#008060", // Sri Lankan green
      bgColor: "from-[#008060]/10 to-[#008060]/5"
    },
    {
      title: "Pending Verifications",
      value: "23",
      change: "-8%",
      trend: "down",
      icon: UserCheck,
      color: "#FFC72C", // Sri Lankan gold
      bgColor: "from-[#FFC72C]/10 to-[#FFC72C]/5"
    },
    {
      title: "System Alerts",
      value: "3",
      change: "+2",
      trend: "up",
      icon: AlertCircle,
      color: "#FF5722", // Sri Lankan orange
      bgColor: "from-[#FF5722]/10 to-[#FF5722]/5"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:shadow-2xl hover-lift animate-fade-in-up modern-card relative overflow-hidden"
          style={{animationDelay: `${0.1 * (index + 1)}s`}}
        >
          {/* Header with Icon */}
          <div className="flex items-center justify-between mb-4">
            <div 
              className={`relative p-3 rounded-xl bg-gradient-to-r ${stat.bgColor} transition-all duration-500 group-hover:scale-110`}
              style={{border: `2px solid ${stat.color}30`}}
            >
              <stat.icon 
                className="w-6 h-6 transition-all duration-300 group-hover:scale-110" 
                style={{color: stat.color}}
              />
              
              {/* Icon glow effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div 
                  className="absolute inset-0 rounded-xl blur-xl" 
                  style={{background: `radial-gradient(circle, ${stat.color}20 0%, transparent 70%)`}}
                ></div>
              </div>
            </div>
            
            {/* Enhanced trend indicator */}
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
              stat.trend === "up" 
                ? "text-[#008060] bg-[#008060]/10 border-[#008060]/20" 
                : "text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/20"
            }`}>
              {stat.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {stat.change}
            </div>
          </div>
          
          {/* Enhanced stats display */}
          <div className="mb-2">
            <div 
              className="text-2xl font-bold transition-all duration-500 group-hover:scale-105" 
              style={{color: stat.color}}
            >
              {stat.value}
            </div>
          </div>
          <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">
            {stat.title}
          </div>

          {/* Hover gradient effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{background: `radial-gradient(circle at center, ${stat.color}05 0%, transparent 70%)`}}
            ></div>
          </div>

          {/* Animated border glow */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
            style={{boxShadow: `0 0 30px ${stat.color}30`}}
          ></div>
        </motion.div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="relative min-h-full">
      {/* Main content */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Enhanced header keeping original sizes */}
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="text-foreground">Admin</span>{' '}
              <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-muted-foreground">
              Welcome to the GovLink administration panel. Monitor system status and manage users.
            </p>
          </div>

          <DashboardStats />

          {/* Enhanced Recent Activity following agent dashboard style */}
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group relative overflow-hidden animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            {/* Section header with Sri Lankan accent */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-[#8D153A] transition-colors duration-300">
                  Recent Activity
                </h3>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all duration-300 group/btn">
                <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                Refresh
              </button>
            </div>
            
            {/* Enhanced activity list */}
            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 p-3 bg-muted/20 hover:bg-muted/30 rounded-lg transition-all duration-300 hover:shadow-md group/item"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#008060]/10 to-[#008060]/5 rounded-full flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                  <UserCheck className="w-4 h-4 text-[#008060]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground group-hover/item:text-[#008060] transition-colors duration-300">
                    New user registration: Amal Perera
                  </p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 p-3 bg-muted/20 hover:bg-muted/30 rounded-lg transition-all duration-300 hover:shadow-md group/item"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#8D153A]/10 to-[#8D153A]/5 rounded-full flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-4 h-4 text-[#8D153A]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground group-hover/item:text-[#8D153A] transition-colors duration-300">
                    User verification completed: Saman Silva
                  </p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
                <div className="w-2 h-2 bg-[#8D153A] rounded-full animate-pulse opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-3 bg-muted/20 hover:bg-muted/30 rounded-lg transition-all duration-300 hover:shadow-md group/item"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF5722]/10 to-[#FF5722]/5 rounded-full flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                  <AlertCircle className="w-4 h-4 text-[#FF5722]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground group-hover/item:text-[#FF5722] transition-colors duration-300">
                    System alert: High server load detected
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="w-2 h-2 bg-[#FF5722] rounded-full animate-pulse opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            </div>
            
            {/* Card hover effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8D153A]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
