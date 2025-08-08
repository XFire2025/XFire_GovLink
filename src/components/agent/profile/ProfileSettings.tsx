// src/components/agent/profile/ProfileSettings.tsx
"use client";
import React, { useState } from 'react';
import ProfileForm from './ProfileForm';
import PasswordChangeForm from './PasswordChangeForm';

// Types
type Language = 'en' | 'si' | 'ta';

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
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());

  const t = settingsTranslations[language];

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastSaved(new Date());
    setIsLoading(false);
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
      {/* Account Status Overview */}
      <div className="glass-morphism p-6 rounded-2xl border border-border/50 shadow-glow animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">D</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Agent DEMO1234</h3>
              <p className="text-sm text-muted-foreground">Department of Immigration & Emigration</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
                <span className="text-sm text-[#008060] font-medium">{t.activeStatus}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">{t.lastUpdated}</div>
            <div className="text-sm font-medium text-foreground">{formatLastUpdated(lastSaved)}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-morphism p-2 rounded-2xl border border-border/50 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
        <div className="flex">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'personal'
                ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="hidden sm:block">{t.personalInfo}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="16" r="1" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="hidden sm:block">{t.security}</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-2xl border border-border/50 shadow-glow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t.personalInfo}</h3>
                  <p className="text-sm text-muted-foreground">{t.personalInfoDesc}</p>
                </div>
              </div>
              
              <ProfileForm language={language} onSave={handleSave} isLoading={isLoading} />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-2xl border border-border/50 shadow-glow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[#FF5722]/10 to-[#8D153A]/10 rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <circle cx="12" cy="16" r="1" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t.security}</h3>
                  <p className="text-sm text-muted-foreground">{t.securityDesc}</p>
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