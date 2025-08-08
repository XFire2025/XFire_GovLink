"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";


interface SystemConfig {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  dataRetentionDays: number;
}

export default function SystemConfiguration() {
  const [config, setConfig] = useState<SystemConfig>({
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    dataRetentionDays: 365,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleConfigChange = (
    key: keyof SystemConfig,
    value: boolean | number
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Here you would save the configuration to your backend
    setHasChanges(false);
    // Show success notification
  };

  return (
    <div className="relative min-h-full">
      {/* Main content */}
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-start animate-fade-in-up"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-[#8D153A]" />
                <span className="text-foreground">System</span>{' '}
                <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                  Configuration
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground">
              Manage system-wide settings and preferences
            </p>
          </div>
          {hasChanges && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={handleSave}
              className="flex items-center gap-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 modern-card"
            >
              <Settings className="w-4 h-4" />
              Save Changes
            </motion.button>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="grid gap-6"
        >
          {/* Enhanced General Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-[#8D153A] transition-colors duration-300">
              General Settings
            </h3>
            <div className="grid gap-6">
              <div className="flex items-center justify-between p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 transition-all duration-300">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Maintenance Mode
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable public access to the system
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.maintenanceMode}
                    onChange={(e) =>
                      handleConfigChange("maintenanceMode", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8D153A]/20 dark:peer-focus:ring-[#8D153A]/30 rounded-full peer dark:bg-muted peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-gradient-to-r peer-checked:from-[#8D153A] peer-checked:to-[#FF5722]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 transition-all duration-300">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    User Registration
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register accounts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.registrationEnabled}
                    onChange={(e) =>
                      handleConfigChange("registrationEnabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#008060]/20 dark:peer-focus:ring-[#008060]/30 rounded-full peer dark:bg-muted peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-[#008060]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 transition-all duration-300">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email Verification Required
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Require email verification for new accounts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.emailVerificationRequired}
                    onChange={(e) =>
                      handleConfigChange(
                        "emailVerificationRequired",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFC72C]/20 dark:peer-focus:ring-[#FFC72C]/30 rounded-full peer dark:bg-muted peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-[#FFC72C]"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Security Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-[#FF5722] transition-colors duration-300">
              Security Settings
            </h3>
            <div className="grid gap-6">
              <div className="p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 transition-all duration-300">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Maximum Login Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.maxLoginAttempts}
                  onChange={(e) =>
                    handleConfigChange(
                      "maxLoginAttempts",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722]/50 transition-all duration-300 modern-card"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Number of failed login attempts before account lockout
                </p>
              </div>

              <div className="p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 transition-all duration-300">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={config.sessionTimeout}
                  onChange={(e) =>
                    handleConfigChange("sessionTimeout", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722]/50 transition-all duration-300 modern-card"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Automatic logout after period of inactivity
                </p>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Data Management */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-[#008060] transition-colors duration-300">
              Data Management
            </h3>
            <div className="p-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-card/60 transition-all duration-300">
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Retention Period (days)
              </label>
              <input
                type="number"
                min="30"
                max="2555"
                value={config.dataRetentionDays}
                onChange={(e) =>
                  handleConfigChange(
                    "dataRetentionDays",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]/50 transition-all duration-300 modern-card"
              />
              <p className="text-sm text-muted-foreground mt-1">
                How long to retain user data and logs
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
