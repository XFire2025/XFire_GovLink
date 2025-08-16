"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import UserDashboardLayout from "@/components/user/dashboard/UserDashboardLayout";

const UserSettingsPage = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<"en" | "si" | "ta">("en");
  const [emailNotifications, setEmailNotifications] = useState(true);

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
      cancel: "Cancel",
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
      cancel: "අවලංගු කරන්න",
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
      cancel: "ரத்து செய்",
    },
  };

  const t = translations[language];

  const handleSave = () => {
    // Implement save functionality
    console.log("Settings saved");
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
        <div className="flex gap-4 justify-end">
          <button className="px-6 py-2 border border-border rounded-lg hover:bg-card/30 transition-colors duration-200">
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            {t.save}
          </button>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default UserSettingsPage;
