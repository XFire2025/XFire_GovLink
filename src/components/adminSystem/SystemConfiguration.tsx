"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            System Configuration
          </h1>
          <p className="text-muted-foreground">
            Manage system-wide settings and preferences
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            General Settings
          </h3>
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Security Settings
          </h3>
          <div className="grid gap-6">
            <div>
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
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Number of failed login attempts before account lockout
              </p>
            </div>

            <div>
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
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Automatic logout after period of inactivity
              </p>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Data Management
          </h3>
          <div>
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
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-sm text-muted-foreground mt-1">
              How long to retain user data and logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
