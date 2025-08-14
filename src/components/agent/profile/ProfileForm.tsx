// src/components/agent/profile/ProfileForm.tsx
"use client";
import React, { useState, useEffect } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';

// Agent interface (matching auth utils)
interface Agent {
  id: string;
  officerId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  department: string;
  officeName: string;
  isActive: boolean;
  assignedDistricts: string[];
}

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  agentId: string;
  preferredLanguage: Language;
  workingHours: {
    start: string;
    end: string;
  };
  timezone: string;
  availability: 'available' | 'busy' | 'away';
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

interface FormTranslation {
  contactInformation: string;
  preferences: string;
  availability: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  agentId: string;
  preferredLanguage: string;
  workingHours: string;
  startTime: string;
  endTime: string;
  timezone: string;
  currentStatus: string;
  notificationSettings: string;
  emailNotifications: string;
  smsNotifications: string;
  inAppNotifications: string;
  saveChanges: string;
  saving: string;
  availabilityStatuses: {
    available: string;
    busy: string;
    away: string;
  };
  languages: {
    en: string;
    si: string;
    ta: string;
  };
  successMessage: string;
}

// Form translations
const formTranslations: Record<Language, FormTranslation> = {
  en: {
    contactInformation: 'Contact Information',
    preferences: 'Preferences',
    availability: 'Availability Settings',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    department: 'Department',
    agentId: 'Agent ID',
    preferredLanguage: 'Preferred Language',
    workingHours: 'Working Hours',
    startTime: 'Start Time',
    endTime: 'End Time',
    timezone: 'Timezone',
    currentStatus: 'Current Status',
    notificationSettings: 'Notification Settings',
    emailNotifications: 'Email Notifications',
    smsNotifications: 'SMS Notifications',
    inAppNotifications: 'In-App Notifications',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    availabilityStatuses: {
      available: 'Available',
      busy: 'Busy',
      away: 'Away'
    },
    languages: {
      en: 'English',
      si: 'Sinhala',
      ta: 'Tamil'
    },
    successMessage: 'Profile updated successfully!'
  },
  si: {
    contactInformation: 'සම්බන්ධතා තොරතුරු',
    preferences: 'මනාපයන්',
    availability: 'ලබාගත හැකි සැකසුම්',
    fullName: 'සම්පූර්ණ නම',
    email: 'විද්‍යුත් ලිපිනය',
    phone: 'දුරකථන අංකය',
    department: 'දෙපාර්තමේන්තුව',
    agentId: 'නිලධාරි හැඳුනුම්පත',
    preferredLanguage: 'කැමති භාෂාව',
    workingHours: 'වැඩ කරන වේලාවන්',
    startTime: 'ආරම්භක වේලාව',
    endTime: 'අවසාන වේලාව',
    timezone: 'කාල කලාපය',
    currentStatus: 'වර්තමාන තත්ත්වය',
    notificationSettings: 'දැනුම්දීම් සැකසුම්',
    emailNotifications: 'ඊමේල් දැනුම්දීම්',
    smsNotifications: 'SMS දැනුම්දීම්',
    inAppNotifications: 'යෙදුම් තුළ දැනුම්දීම්',
    saveChanges: 'වෙනස්කම් සුරකින්න',
    saving: 'සුරකිමින්...',
    availabilityStatuses: {
      available: 'ලබා ගත හැකි',
      busy: 'කාර්යබහුල',
      away: 'ඉවතින්'
    },
    languages: {
      en: 'ඉංග්‍රීසි',
      si: 'සිංහල',
      ta: 'දෙමළ'
    },
    successMessage: 'පැතිකඩ සාර්ථකව යාවත්කාලීන කරන ලදී!'
  },
  ta: {
    contactInformation: 'தொடர்பு தகவல்',
    preferences: 'விருப்பத்தேர்வுகள்',
    availability: 'கிடைக்கும் அமைப்புகள்',
    fullName: 'முழு பெயர்',
    email: 'மின்னஞ்சல் முகவரி',
    phone: 'தொலைபேசி எண்',
    department: 'துறை',
    agentId: 'முகவர் அடையாளம்',
    preferredLanguage: 'விருப்பமான மொழி',
    workingHours: 'வேலை நேரம்',
    startTime: 'தொடக்க நேரம்',
    endTime: 'முடிவு நேரம்',
    timezone: 'நேர மண்டலம்',
    currentStatus: 'தற்போதைய நிலை',
    notificationSettings: 'அறிவிப்பு அமைப்புகள்',
    emailNotifications: 'மின்னஞ்சல் அறிவிப்புகள்',
    smsNotifications: 'SMS அறிவிப்புகள்',
    inAppNotifications: 'பயன்பாட்டில் அறிவிப்புகள்',
    saveChanges: 'மாற்றங்களைச் சேமிக்கவும்',
    saving: 'சேமிக்கிறது...',
    availabilityStatuses: {
      available: 'கிடைக்கிறது',
      busy: 'வேலையில்',
      away: 'இல்லை'
    },
    languages: {
      en: 'ஆங்கிலம்',
      si: 'சிங்களம்',
      ta: 'தமிழ்'
    },
    successMessage: 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!'
  }
};

interface ProfileFormProps {
  language?: Language;
  onSave: (formData?: ProfileData) => Promise<void>;
  isLoading: boolean;
  agent: Agent;
  onDataChange?: (data: ProfileData) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  language = 'en', 
  onSave, 
  isLoading, 
  agent,
  onDataChange
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: agent.fullName,
    email: agent.email,
    phone: agent.phoneNumber || '',
    department: agent.department || 'Department of Immigration & Emigration',
    agentId: agent.officerId,
    preferredLanguage: language,
    workingHours: {
      start: '08:00',
      end: '17:00'
    },
    timezone: 'Asia/Colombo',
    availability: agent.isActive ? 'available' : 'away',
    notifications: {
      email: true,
      sms: false,
      inApp: true
    }
  });

  // Update profile data when agent changes
  useEffect(() => {
    setProfileData(prev => ({
      ...prev,
      fullName: agent.fullName,
      email: agent.email,
      department: agent.department || 'Department of Immigration & Emigration',
      agentId: agent.officerId,
      availability: agent.isActive ? 'available' : 'away'
    }));
  }, [agent]);

  const t = formTranslations[language];

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    const newData = {
      ...profileData,
      [field]: value
    };
    setProfileData(newData);
    
    // Notify parent component of data change
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const handleNestedInputChange = (field: 'workingHours' | 'notifications', subField: string, value: string | boolean) => {
    const newData = {
      ...profileData,
      [field]: {
        ...(profileData[field]),
        [subField]: value
      }
    };
    setProfileData(newData);
    
    // Notify parent component of data change
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(profileData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const inputStyles = "w-full bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/20 transition-all duration-300 backdrop-blur-sm hover:border-[#FFC72C]/50";
  const labelStyles = "block text-sm font-semibold text-foreground mb-3 flex items-center gap-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-[#008060]/20 border border-[#008060]/30 text-[#008060] p-4 rounded-xl animate-fade-in-up flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-medium">{t.successMessage}</span>
        </div>
      )}

      {/* Contact Information */}
      <div className="space-y-6 p-6 bg-card/30 rounded-xl border border-border/30">
        <h4 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
          {t.contactInformation}
          <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {t.fullName}
            </label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={inputStyles}
              required
            />
          </div>
          
          <div>
            <label className={labelStyles}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              {t.agentId}
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.agentId}
                className={`${inputStyles} opacity-60 cursor-not-allowed`}
                disabled
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#008060]">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className={labelStyles}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22 6 12 13 2 6"/>
              </svg>
              {t.email}
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={inputStyles}
              required
            />
          </div>
          
          <div>
            <label className={labelStyles}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {t.phone}
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={inputStyles}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className={labelStyles}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"/>
                <path d="M5 21V7l8-4v18"/>
                <path d="M19 21V11l-6-4"/>
              </svg>
              {t.department}
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.department}
                className={`${inputStyles} opacity-60 cursor-not-allowed`}
                disabled
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#008060]">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-6 p-6 bg-card/30 rounded-xl border border-border/30">
        <h4 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full animate-pulse"></div>
          {t.preferences}
          <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {t.preferredLanguage}
            </label>
            <select
              value={profileData.preferredLanguage}
              onChange={(e) => handleInputChange('preferredLanguage', e.target.value as Language)}
              className={inputStyles}
            >
              <option value="en">{t.languages.en}</option>
              <option value="si">{t.languages.si}</option>
              <option value="ta">{t.languages.ta}</option>
            </select>
          </div>
          
          <div>
            <label className={labelStyles}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {t.timezone}
            </label>
            <select
              value={profileData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className={inputStyles}
            >
              <option value="Asia/Colombo">Asia/Colombo (UTC+05:30)</option>
              <option value="UTC">UTC (UTC+00:00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="space-y-6 p-6 bg-card/30 rounded-xl border border-border/30">
        <h4 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-gradient-to-r from-[#FF5722] to-[#8D153A] rounded-full animate-pulse"></div>
          {t.workingHours}
          <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 8 10"/>
              </svg>
              {t.startTime}
            </label>
            <input
              type="time"
              value={profileData.workingHours.start}
              onChange={(e) => handleNestedInputChange('workingHours', 'start', e.target.value)}
              className={inputStyles}
            />
          </div>
          
          <div>
            <label className={labelStyles}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {t.endTime}
            </label>
            <input
              type="time"
              value={profileData.workingHours.end}
              onChange={(e) => handleNestedInputChange('workingHours', 'end', e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* Availability Status */}
      <div className="space-y-6 p-6 bg-card/30 rounded-xl border border-border/30">
        <h4 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#008060] rounded-full animate-pulse"></div>
          {t.currentStatus}
          <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(t.availabilityStatuses).map(([key, label]) => (
            <label key={key} className="relative group cursor-pointer">
              <input
                type="radio"
                name="availability"
                value={key}
                checked={profileData.availability === key}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="sr-only"
              />
              <div className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                profileData.availability === key
                  ? 'border-[#FFC72C] bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/5 text-[#FFC72C] shadow-lg'
                  : 'border-border/50 bg-card/30 text-muted-foreground hover:border-[#FFC72C]/50 hover:bg-card/50'
              }`}>
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    key === 'available' ? 'bg-[#008060]' :
                    key === 'busy' ? 'bg-[#FFC72C]' : 'bg-[#FF5722]'
                  } ${profileData.availability === key ? 'animate-pulse scale-125' : ''} transition-all duration-300`}>
                    {profileData.availability === key && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span className="font-semibold text-center">{label}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="space-y-6 p-6 bg-card/30 rounded-xl border border-border/30">
        <h4 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
          <div className="w-2 h-2 bg-gradient-to-r from-[#8D153A] to-[#FFC72C] rounded-full animate-pulse"></div>
          {t.notificationSettings}
          <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
        </h4>
        
        <div className="space-y-4">
          {[
            { key: 'email', label: t.emailNotifications, icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22 6 12 13 2 6"/>
              </svg>
            )},
            { key: 'sms', label: t.smsNotifications, icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            )},
            { key: 'inApp', label: t.inAppNotifications, icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            )}
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center justify-between p-5 bg-card/50 border border-border/50 rounded-xl cursor-pointer hover:bg-card/70 hover:border-[#FFC72C]/30 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="text-[#FFC72C] group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <div>
                  <span className="font-semibold text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">{label}</span>
                  <div className="text-sm text-muted-foreground">
                    {key === 'email' && 'Receive alerts via email'}
                    {key === 'sms' && 'Get SMS notifications'}
                    {key === 'inApp' && 'Show in-app notifications'}
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={profileData.notifications[key as keyof typeof profileData.notifications]}
                  onChange={(e) => handleNestedInputChange('notifications', key, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-14 h-7 rounded-full transition-all duration-300 ${
                  profileData.notifications[key as keyof typeof profileData.notifications]
                    ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722]'
                    : 'bg-muted/50'
                }`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                    profileData.notifications[key as keyof typeof profileData.notifications]
                      ? 'translate-x-7'
                      : 'translate-x-0.5'
                  } mt-0.5 flex items-center justify-center`}>
                    {profileData.notifications[key as keyof typeof profileData.notifications] && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Enhanced Save Button */}
      <div className="pt-8 border-t border-border/30">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-8 py-5 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-2xl hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-500 font-bold text-lg hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {t.saving}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {t.saveChanges}
            </div>
          )}
          
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
