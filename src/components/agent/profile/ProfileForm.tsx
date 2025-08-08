// src/components/agent/profile/ProfileForm.tsx
"use client";
import React, { useState } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';

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
  onSave: () => Promise<void>;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ language = 'en', onSave, isLoading }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'Demo Agent',
    email: 'demo.agent@immigration.gov.lk',
    phone: '+94 77 123 4567',
    department: 'Department of Immigration & Emigration',
    agentId: 'DEMO1234',
    preferredLanguage: language,
    workingHours: {
      start: '08:00',
      end: '17:00'
    },
    timezone: 'Asia/Colombo',
    availability: 'available',
    notifications: {
      email: true,
      sms: false,
      inApp: true
    }
  });

  const t = formTranslations[language];

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (field: 'workingHours' | 'notifications', subField: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field]),
        [subField]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const inputStyles = "w-full bg-card/30 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300";
  const labelStyles = "block text-sm font-medium text-foreground mb-2";

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
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-foreground flex items-center gap-3">
          <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full"></div>
          {t.contactInformation}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>{t.fullName}</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={inputStyles}
              required
            />
          </div>
          
          <div>
            <label className={labelStyles}>{t.agentId}</label>
            <input
              type="text"
              value={profileData.agentId}
              className={`${inputStyles} opacity-60 cursor-not-allowed`}
              disabled
            />
          </div>
          
          <div>
            <label className={labelStyles}>{t.email}</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={inputStyles}
              required
            />
          </div>
          
          <div>
            <label className={labelStyles}>{t.phone}</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={inputStyles}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className={labelStyles}>{t.department}</label>
            <input
              type="text"
              value={profileData.department}
              className={`${inputStyles} opacity-60 cursor-not-allowed`}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-foreground flex items-center gap-3">
          <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full"></div>
          {t.preferences}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>{t.preferredLanguage}</label>
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
            <label className={labelStyles}>{t.timezone}</label>
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
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-foreground flex items-center gap-3">
          <div className="w-2 h-2 bg-gradient-to-r from-[#FF5722] to-[#8D153A] rounded-full"></div>
          {t.workingHours}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>{t.startTime}</label>
            <input
              type="time"
              value={profileData.workingHours.start}
              onChange={(e) => handleNestedInputChange('workingHours', 'start', e.target.value)}
              className={inputStyles}
            />
          </div>
          
          <div>
            <label className={labelStyles}>{t.endTime}</label>
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
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-foreground flex items-center gap-3">
          <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#008060] rounded-full animate-pulse"></div>
          {t.currentStatus}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(t.availabilityStatuses).map(([key, label]) => (
            <label key={key} className="relative">
              <input
                type="radio"
                name="availability"
                value={key}
                checked={profileData.availability === key}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="sr-only"
              />
              <div className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                profileData.availability === key
                  ? 'border-[#FFC72C] bg-[#FFC72C]/10 text-[#FFC72C]'
                  : 'border-border/50 bg-card/30 text-muted-foreground hover:border-[#FFC72C]/50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    key === 'available' ? 'bg-[#008060]' :
                    key === 'busy' ? 'bg-[#FFC72C]' : 'bg-[#FF5722]'
                  } ${profileData.availability === key ? 'animate-pulse' : ''}`}></div>
                  <span className="font-medium">{label}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-foreground flex items-center gap-3">
          <div className="w-2 h-2 bg-gradient-to-r from-[#8D153A] to-[#FFC72C] rounded-full"></div>
          {t.notificationSettings}
        </h4>
        
        <div className="space-y-4">
          {[
            { key: 'email', label: t.emailNotifications, icon: '📧' },
            { key: 'sms', label: t.smsNotifications, icon: '📱' },
            { key: 'inApp', label: t.inAppNotifications, icon: '🔔' }
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center justify-between p-4 bg-card/30 border border-border/50 rounded-xl cursor-pointer hover:bg-card/50 transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="font-medium text-foreground">{label}</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={profileData.notifications[key as keyof typeof profileData.notifications]}
                  onChange={(e) => handleNestedInputChange('notifications', key, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                  profileData.notifications[key as keyof typeof profileData.notifications]
                    ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722]'
                    : 'bg-muted/50'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    profileData.notifications[key as keyof typeof profileData.notifications]
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  } mt-0.5`}></div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6 border-t border-border/30">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-xl hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 font-semibold text-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {t.saving}
            </div>
          ) : (
            t.saveChanges
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
