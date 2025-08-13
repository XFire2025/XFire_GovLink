// src/components/agent/profile/ProfileSettings.tsx
"use client";
import React, { useState } from 'react';
import ProfileForm from './ProfileForm';
import PasswordChangeForm from './PasswordChangeForm';

// Types
type Language = 'en' | 'si' | 'ta';

// Agent interface (matching auth utils)
interface Agent {
  id: string;
  officerId: string;
  fullName: string;
  email: string;
  position: string;
  department: string;
  officeName: string;
  isActive: boolean;
  assignedDistricts: string[];
}

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  agentId: string;
  preferredLanguage: string;
  workingHours: {
    start: string;
    end: string;
  };
  timezone: string;
  availability: string;
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

interface SettingsTranslation {
  personalInfo: string;
  security: string;
  personalInfoDesc: string;
  securityDesc: string;
  saveChanges: string;
  lastUpdated: string;
  accountStatus: string;
  activeStatus: string;
}

// Settings translations
const settingsTranslations: Record<Language, SettingsTranslation> = {
  en: {
    personalInfo: 'Personal Information',
    security: 'Security & Password',
    personalInfoDesc: 'Update your contact details, language preferences, and availability settings.',
    securityDesc: 'Manage your password and account security settings.',
    saveChanges: 'Save Changes',
    lastUpdated: 'Last Updated',
    accountStatus: 'Account Status',
    activeStatus: 'Active'
  },
  si: {
    personalInfo: 'පුද්ගලික තොරතුරු',
    security: 'ආරක්ෂාව සහ මුරපදය',
    personalInfoDesc: 'ඔබගේ සම්බන්ධතා විස්තර, භාෂා මනාපයන් සහ ලබාගත හැකි සැකසුම් යාවත්කාලීන කරන්න.',
    securityDesc: 'ඔබගේ මුරපදය සහ ගිණුම් ආරක්ෂක සැකසුම් කළමනාකරණය කරන්න.',
    saveChanges: 'වෙනස්කම් සුරකින්න',
    lastUpdated: 'අවසන් යාවත්කාලීන',
    accountStatus: 'ගිණුම් තත්ත්වය',
    activeStatus: 'ක්‍රියාකාරී'
  },
  ta: {
    personalInfo: 'தனிப்பட்ட தகவல்',
    security: 'பாதுகாப்பு மற்றும் கடவுச்சொல்',
    personalInfoDesc: 'உங்கள் தொடர்பு விவரங்கள், மொழி விருப்பங்கள் மற்றும் கிடைக்கும் அமைப்புகளை புதுப்பிக்கவும்.',
    securityDesc: 'உங்கள் கடவுச்சொல் மற்றும் கணக்கு பாதுகாப்பு அமைப்புகளை நிர்வகிக்கவும்.',
    saveChanges: 'மாற்றங்களைச் சேமிக்கவும்',
    lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
    accountStatus: 'கணக்கு நிலை',
    activeStatus: 'செயலில்'
  }
};

interface ProfileSettingsProps {
  language?: Language;
  agent: Agent;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  language = 'en', 
  agent 
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [updateStatus, setUpdateStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const t = settingsTranslations[language];

  const handleSave = async (formData?: ProfileFormData) => {
    setIsLoading(true);
    setUpdateStatus({ type: null, message: '' });
    
    try {
      // Use either passed formData or stored profileData
      const dataToSend = formData || profileData;
      
      if (!dataToSend) {
        setUpdateStatus({
          type: 'error',
          message: 'No data to update'
        });
        return;
      }
      
      // Call the profile update API
      const response = await fetch('/api/auth/agent/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: dataToSend.fullName,
          phoneNumber: dataToSend.phone,
          // Add other fields that can be updated
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setLastSaved(new Date());
        setUpdateStatus({
          type: 'success',
          message: 'Profile updated successfully!'
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUpdateStatus({ type: null, message: '' });
        }, 3000);
      } else {
        console.error('Profile update failed:', result.message);
        setUpdateStatus({
          type: 'error',
          message: result.message || 'Failed to update profile'
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setUpdateStatus({
        type: 'error',
        message: 'Network error: Unable to update profile'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to receive form data from ProfileForm
  const handleFormDataChange = (newData: ProfileFormData) => {
    setProfileData(newData);
  };

  // Show update status
  const renderUpdateStatus = () => {
    if (!updateStatus.type) return null;
    
    return (
      <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
        updateStatus.type === 'success' 
          ? 'bg-[#008060]/20 border border-[#008060]/30 text-[#008060]'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
      }`}>
        {updateStatus.type === 'success' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        )}
        <span className="font-medium">{updateStatus.message}</span>
      </div>
    );
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language === 'si' ? 'si-LK' : 'ta-LK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Account Status Overview */}
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border/50 shadow-glow animate-fade-in-up modern-card group hover:shadow-2xl transition-all duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <span className="text-white text-2xl font-bold">D</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#008060] rounded-full border-2 border-background flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">{agent.fullName}</h3>
              <p className="text-lg text-muted-foreground mb-1">{agent.position} - {agent.officeName}</p>
              <p className="text-lg text-muted-foreground mb-2">{agent.department || 'Department of Immigration & Emigration'}</p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#008060]/10 text-[#008060] rounded-full text-sm font-medium border border-[#008060]/20">
                  <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
                  <span>{agent.isActive ? t.activeStatus : 'Inactive'}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFC72C]/10 text-[#FFC72C] rounded-full text-sm font-medium border border-[#FFC72C]/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>Agent ID: {agent.officerId}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:text-right">
            <div className="text-sm text-muted-foreground mb-1">{t.lastUpdated}</div>
            <div className="text-lg font-semibold text-foreground">{formatLastUpdated(lastSaved)}</div>
            <div className="mt-2 flex lg:justify-end">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FF5722]/10 text-[#FF5722] rounded-full text-sm font-medium border border-[#FF5722]/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Session Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-2 rounded-2xl border border-border/50 shadow-glow animate-fade-in-up modern-card" style={{animationDelay: '0.1s'}}>
        <div className="flex bg-card/30 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
              activeTab === 'personal'
                ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-xl scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeTab === 'personal' ? 'animate-pulse' : ''}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="hidden sm:block">{t.personalInfo}</span>
            <span className="sm:hidden">Info</span>
            {activeTab === 'personal' && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C]/20 to-[#FF5722]/20 rounded-lg blur-xl"></div>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-[#FF5722] to-[#8D153A] text-white shadow-xl scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeTab === 'security' ? 'animate-pulse' : ''}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="16" r="1" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="hidden sm:block">{t.security}</span>
            <span className="sm:hidden">Security</span>
            {activeTab === 'security' && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF5722]/20 to-[#8D153A]/20 rounded-lg blur-xl"></div>
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Tab Content */}
      <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border/50 shadow-glow modern-card hover:shadow-2xl transition-all duration-500 group">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 rounded-xl group-hover:from-[#FFC72C]/20 group-hover:to-[#FF5722]/20 transition-all duration-300 border border-[#FFC72C]/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-[#FFC72C] transition-colors duration-300 mb-2">{t.personalInfo}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t.personalInfoDesc}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
                    <span className="text-[#008060] font-medium">All fields validated</span>
                  </div>
                </div>
              </div>
              
              {/* Update Status */}
              {renderUpdateStatus()}
              
              <ProfileForm 
                language={language} 
                onSave={handleSave} 
                isLoading={isLoading} 
                agent={agent}
                onDataChange={handleFormDataChange}
              />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border/50 shadow-glow modern-card hover:shadow-2xl transition-all duration-500 group">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-[#FF5722]/10 to-[#8D153A]/10 rounded-xl group-hover:from-[#FF5722]/20 group-hover:to-[#8D153A]/20 transition-all duration-300 border border-[#FF5722]/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <circle cx="12" cy="16" r="1" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-[#FF5722] transition-colors duration-300 mb-2">{t.security}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t.securityDesc}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
                    <span className="text-[#008060] font-medium">Security verified</span>
                  </div>
                </div>
              </div>
              
              <PasswordChangeForm language={language} onSave={handleSave} isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;