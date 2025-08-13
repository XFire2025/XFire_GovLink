"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';
import { Building, Mail, Phone, Clock, ToggleRight, Save, CheckCircle, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { useDepartmentProfile, useProfileMutations } from '@/lib/hooks/useDepartmentApi';

interface ConfigData {
  departmentName: string;
  publicAddress: string;
  contactEmail: string;
  contactPhone: string;
  officeHours: string;
  isAcceptingSubmissions: boolean;
}

export default function DepartmentConfigForm() {
  const { t } = useTranslation('department');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [configData, setConfigData] = useState<ConfigData>({
    departmentName: "",
    publicAddress: "",
    contactEmail: "",
    contactPhone: "",
    officeHours: "",
    isAcceptingSubmissions: true,
  });

  // Use API hooks
  const { data: profileData, loading: profileLoading, error: profileError, refetch } = useDepartmentProfile();
  const { updateProfile, loading: updateLoading } = useProfileMutations();

  // Load profile data when available
  useEffect(() => {
    if (profileData) {
      setConfigData({
        departmentName: profileData.name || "",
        publicAddress: "", // Not available in current API
        contactEmail: profileData.email || "",
        contactPhone: "", // Not available in current API
        officeHours: "8:30 AM - 4:30 PM", // Default value
        isAcceptingSubmissions: profileData.status === 'ACTIVE',
      });
    }
  }, [profileData]);

  const handleInputChange = (field: keyof Omit<ConfigData, 'isAcceptingSubmissions'>, value: string) => {
    setConfigData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field: keyof Pick<ConfigData, 'isAcceptingSubmissions'>, value: boolean) => {
    setConfigData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile({
        name: configData.departmentName,
        email: configData.contactEmail,
        // Only update fields that exist in the API
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await refetch(); // Refresh the profile data
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "w-full bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/20 transition-all duration-300 backdrop-blur-sm hover:border-[#FFC72C]/50";
  const labelStyles = "block text-sm font-semibold text-foreground mb-3 flex items-center gap-2";

  if (profileError) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">{t('config.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('config.description')}</p>
        </motion.div>

        <div className="bg-red-50 dark:bg-red-900/10 backdrop-blur-md p-6 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Failed to load department profile</h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{profileError}</p>
            </div>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('config.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('config.description')}</p>
          </div>
          <button 
            onClick={refetch}
            disabled={profileLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${profileLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-[#008060]/20 border border-[#008060]/30 text-[#008060] p-4 rounded-xl animate-fade-in-up flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{t('config.successMessage')}</span>
        </div>
      )}

      {profileLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader className="w-6 h-6 animate-spin text-[#008060]" />
            <span className="text-muted-foreground">Loading department profile...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information */}
          <div className="space-y-6 p-6 bg-card/30 rounded-xl border border-border/30">
            <h4 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full animate-pulse"></div>
              {t('config.sections.general')}
              <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
            </h4>
            <div>
              <label className={labelStyles}>
                <Building className="w-4 h-4" />{t('config.labels.departmentName')}
              </label>
              <input 
                type="text" 
                value={configData.departmentName} 
                onChange={(e) => handleInputChange('departmentName', e.target.value)}
                className={inputStyles}
                placeholder="Department name"
                required 
              />
            </div>
            <div>
              <label className={labelStyles}>{t('config.labels.publicAddress')}</label>
              <input 
                type="text" 
                value={configData.publicAddress} 
                onChange={(e) => handleInputChange('publicAddress', e.target.value)} 
                className={inputStyles} 
                placeholder={t('config.placeholders.publicAddress')} 
                required 
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-6 p-6 bg-card/30 rounded-xl border border-border/30">
            <h4 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-gradient-to-r from-[#FF5722] to-[#8D153A] rounded-full animate-pulse"></div>
              {t('config.sections.contact')}
              <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}><Mail className="w-4 h-4" />{t('config.labels.contactEmail')}</label>
                <input 
                  type="email" 
                  value={configData.contactEmail} 
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)} 
                  className={inputStyles} 
                  placeholder={t('config.placeholders.contactEmail')} 
                  required 
                />
              </div>
              <div>
                <label className={labelStyles}><Phone className="w-4 h-4" />{t('config.labels.contactPhone')}</label>
                <input 
                  type="tel" 
                  value={configData.contactPhone} 
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)} 
                  className={inputStyles} 
                  placeholder={t('config.placeholders.contactPhone')} 
                  required 
                />
              </div>
            </div>
          </div>
          
          {/* Operational Settings */}
          <div className="space-y-6 p-6 bg-card/30 rounded-xl border border-border/30">
            <h4 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FF5722] rounded-full animate-pulse"></div>
              {t('config.sections.operational')}
              <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}><Clock className="w-4 h-4" />{t('config.labels.officeHours')}</label>
                <input 
                  type="text" 
                  value={configData.officeHours} 
                  onChange={(e) => handleInputChange('officeHours', e.target.value)} 
                  className={inputStyles} 
                  placeholder={t('config.placeholders.officeHours')} 
                  required 
                />
              </div>
              <div>
                <label className={labelStyles}><ToggleRight className="w-4 h-4" />{t('config.labels.acceptingSubmissions')}</label>
                <label className="flex items-center justify-between p-4 bg-card/50 border border-border/50 rounded-xl cursor-pointer hover:bg-card/70 transition-all">
                  <span className={`font-medium ${configData.isAcceptingSubmissions ? 'text-green-500' : 'text-red-500'}`}>
                    {configData.isAcceptingSubmissions ? 'Active' : 'Inactive'}
                  </span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={configData.isAcceptingSubmissions} 
                      onChange={(e) => handleToggleChange('isAcceptingSubmissions', e.target.checked)} 
                      className="sr-only" 
                    />
                    <div className={`w-14 h-7 rounded-full transition-all duration-300 ${configData.isAcceptingSubmissions ? 'bg-gradient-to-r from-[#008060] to-[#8D153A]' : 'bg-muted/50'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${configData.isAcceptingSubmissions ? 'translate-x-7' : 'translate-x-0.5'} mt-0.5`}></div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-8 border-t border-border/30 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading || updateLoading} 
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#008060] to-[#8D153A] text-white rounded-xl hover:from-[#8D153A] hover:to-[#008060] transition-all font-bold text-lg hover:scale-105 hover:shadow-2xl disabled:opacity-50"
            >
              {isLoading || updateLoading ? (
                <span className="flex items-center gap-2">
                  <Loader className="animate-spin h-5 w-5" />
                  {t('config.saving')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  {t('config.saveChanges')}
                </span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
