"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import UserDashboardLayout from "@/components/user/dashboard/UserDashboardLayout";

const UserSettingsPage = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<"en" | "si" | "ta">("en");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const translations = {
    en: {
      title: "Account Settings",
      subtitle: "Manage your account preferences and notification settings",
      profileSection: "Profile Information",
      email: "Email Address",
      phone: "Phone Number",
      notificationSection: "Notification Preferences",
      emailNotifications: "Email Notifications",
      save: "Save Changes",
      saving: "Saving...",
      cancel: "Cancel",
      saveSuccess: "Settings saved successfully!",
      saveError: "Failed to save settings. Please try again.",
    },
    si: {
      title: "ගිණුම් සැකසුම්",
      subtitle: "ඔබේ ගිණුම් මනාපයන් සහ දැනුම්දීම් සැකසුම් කළමනාකරණය කරන්න",
      profileSection: "පැතිකඩ තොරතුරු",
      email: "ඊමේල් ලිපිනය",
      phone: "දුරකථන අංකය",
      notificationSection: "දැනුම්දීම් මනාපයන්",
      emailNotifications: "ඊමේල් දැනුම්දීම්",
      save: "වෙනස්කම් සුරකින්න",
      saving: "සුරකිමින්...",
      cancel: "අවලංගු කරන්න",
      saveSuccess: "සැකසුම් සාර්ථකව සුරකින ලදී!",
      saveError: "සැකසුම් සුරැකීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
    },
    ta: {
      title: "கணக்கு அமைப்புகள்",
      subtitle:
        "உங்கள் கணக்கு விருப்பத்தேர்வுகள் மற்றும் அறிவிப்பு அமைப்புகளை நிர்வகிக்கவும்",
      profileSection: "சுயவிவர தகவல்",
      email: "மின்னஞ்சல் முகவரி",
      phone: "தொலைபேசி எண்",
      notificationSection: "அறிவிப்பு விருப்பத்தேர்வுகள்",
      emailNotifications: "மின்னஞ்சல் அறிவிப்புகள்",
      save: "மாற்றங்களை சேமி",
      saving: "சேமிக்கிறது...",
      cancel: "ரத்து செய்",
      saveSuccess: "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!",
      saveError: "அமைப்புகளை சேமிக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    },
  };

  const t = translations[language];

  // Load current settings when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/user/settings', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setEmailNotifications(data.settings.emailNotifications);
            setLanguage(data.settings.language);
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      // Create settings payload
      const settingsData = {
        emailNotifications,
        language,
      };

      // Make API call to save settings
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settingsData),
      });

      if (response.ok) {
        setSaveMessage(t.saveSuccess);
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage(t.saveError);
      // Clear error message after 5 seconds
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UserDashboardLayout
      title={t.title}
      subtitle={t.subtitle}
      language={language}
      onLanguageChange={setLanguage}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Information */}
        <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border/50 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {t.profileSection}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.email}
              </label>
              <input
                type="email"
                value={user?.email || ""}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]/50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.phone}
              </label>
              <input
                type="tel"
                value={user?.mobileNumber || ""}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]/50"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-card/50 backdrop-blur-md rounded-xl border border-border/50 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {t.notificationSection}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {t.emailNotifications}
              </label>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  emailNotifications
                    ? "bg-[#FFC72C]"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    emailNotifications ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Success/Error Message */}
          {saveMessage && (
            <div className={`p-3 rounded-lg text-sm font-medium ${
              saveMessage === t.saveSuccess 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800'
            }`}>
              {saveMessage}
            </div>
          )}
          
          <div className="flex gap-4 justify-end">
            <button 
              disabled={isSaving}
              className="px-6 py-2 border border-border rounded-lg hover:bg-card/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSaving ? t.saving : t.save}
            </button>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default UserSettingsPage;
