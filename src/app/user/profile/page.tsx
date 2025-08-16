// src/app/user/profile/page.tsx
"use client";

import React, { useState, useMemo, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import { useAuth } from '@/lib/auth/AuthContext';

// Types
type Language = 'en' | 'si' | 'ta';

// Profile translations
const profileTranslations: Record<Language, {
  title: string;
  subtitle: string;
  backToDashboard: string;
  personalDetails: string;
  personalDetailsDesc: string;
  myDocuments: string;
  myDocumentsDesc: string;
  profileCompleteness: string;
  completeProfileHelp: string;
  fullName: string;
  nationalId: string;
  dateOfBirth: string;
  emailAddress: string;
  phoneNumber: string;
  residentialAddress: string;
  discard: string;
  saveChanges: string;
  saving: string;
  saved: string;
  noDocuments: string;
  noDocumentsDesc: string;
  verificationStatus: string;
  accountNotVerified: string;
  verifyNow: string;
  verificationRequired: string;
  verificationDesc: string;
  verified: string;
  verifiedDesc: string;
}> = {
  en: {
    title: 'Profile Settings',
    subtitle: 'Manage your personal information and account settings',
    backToDashboard: 'Back to Dashboard',
    personalDetails: 'Personal Details',
    personalDetailsDesc: 'Manage your personal information, address, and contact details.',
    myDocuments: 'My Documents',
    myDocumentsDesc: 'Access your saved documents, applications, and official records.',
    profileCompleteness: 'Profile Completeness',
    completeProfileHelp: 'A complete profile helps us serve you better.',
    fullName: 'Full Name',
    nationalId: 'National ID (NIC)',
    dateOfBirth: 'Date of Birth',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    residentialAddress: 'Residential Address',
    discard: 'Discard',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    saved: 'Saved',
    noDocuments: 'No Documents Found',
    noDocumentsDesc: 'Your uploaded documents and completed forms will appear here for easy access.',
    verificationStatus: 'Verification Status',
    accountNotVerified: 'Account Not Verified',
    verifyNow: 'Verify Now',
    verificationRequired: 'Verification Required',
    verificationDesc: 'Verify your identity to access all government services and ensure account security.',
    verified: 'Verified Account',
    verifiedDesc: 'Your account is verified and has full access to all services.'
  },
  si: {
    title: 'පැතිකඩ සැකසුම්',
    subtitle: 'ඔබගේ පුද්ගලික තොරතුරු සහ ගිණුම් සැකසුම් කළමනාකරණය කරන්න',
    backToDashboard: 'පාලනයට ආපසු',
    personalDetails: 'පුද්ගලික විස්තර',
    personalDetailsDesc: 'ඔබගේ පුද්ගලික තොරතුරු, ලිපිනය සහ සම්බන්ධතා විස්තර කළමනාකරණය කරන්න.',
    myDocuments: 'මගේ ලේඛන',
    myDocumentsDesc: 'ඔබගේ සුරකින ලද ලේඛන, අයදුම්පත් සහ නිල වාර්තා වෙත ප්‍රවේශ වන්න.',
    profileCompleteness: 'පැතිකඩ සම්පූර්ණත්වය',
    completeProfileHelp: 'සම්පූර්ණ පැතිකඩක් අපට ඔබට වඩා හොඳින් සේවය කිරීමට උපකාර කරයි.',
    fullName: 'සම්පූර්ණ නම',
    nationalId: 'ජාතික හැඳුනුම්පත (NIC)',
    dateOfBirth: 'උපන් දිනය',
    emailAddress: 'විද්‍යුත් තැපැල් ලිපිනය',
    phoneNumber: 'දුරකථන අංකය',
    residentialAddress: 'පදිංචි ලිපිනය',
    discard: 'ඉවතලන්න',
    saveChanges: 'වෙනස්කම් සුරකින්න',
    saving: 'සුරකිමින්...',
    saved: 'සුරකින ලදී',
    noDocuments: 'ලේඛන හමු නොවීය',
    noDocumentsDesc: 'ඔබ උඩුගත කළ ලේඛන සහ සම්පූර්ණ කළ ආකෘති පහසු ප්‍රවේශය සඳහා මෙහි දිස්වනු ඇත.',
    verificationStatus: 'සත්‍යාපන තත්ත්වය',
    accountNotVerified: 'ගිණුම සත්‍යාපනය කර නැත',
    verifyNow: 'දැන් සත්‍යාපනය කරන්න',
    verificationRequired: 'සත්‍යාපනය අවශ්‍යයි',
    verificationDesc: 'සියලුම රාජ්‍ය සේවා වෙත ප්‍රවේශ වීමට සහ ගිණුම් ආරක්ෂාව සහතික කිරීමට ඔබගේ අනන්‍යතාවය සත්‍යාපනය කරන්න.',
    verified: 'සත්‍යාපිත ගිණුම',
    verifiedDesc: 'ඔබගේ ගිණුම සත්‍යාපනය කර ඇති අතර සියලුම සේවා වෙත සම්පූර්ණ ප්‍රවේශයක් ඇත.'
  },
  ta: {
    title: 'சுயவிவர அமைப்புகள்',
    subtitle: 'உங்கள் தனிப்பட்ட தகவல்கள் மற்றும் கணக்கு அமைப்புகளை நிர்வகிக்கவும்',
    backToDashboard: 'டாஷ்போர்டுக்கு திரும்பவும்',
    personalDetails: 'தனிப்பட்ட விவரங்கள்',
    personalDetailsDesc: 'உங்கள் தனிப்பட்ட தகவல், முகவரி மற்றும் தொடர்பு விவரங்களை நிர்வகிக்கவும்.',
    myDocuments: 'எனது ஆவணங்கள்',
    myDocumentsDesc: 'உங்கள் சேமித்த ஆவணங்கள், விண்ணப்பங்கள் மற்றும் அதிகாரபூர்வ பதிவுகளை அணுகவும்.',
    profileCompleteness: 'சுயவிவர முழுமை',
    completeProfileHelp: 'ஒரு முழுமையான சுயவிவரம் எங்களுக்கு உங்களுக்கு சிறந்த சேவை செய்ய உதவுகிறது.',
    fullName: 'முழு பெயர்',
    nationalId: 'தேசிய அடையாள அட்டை (NIC)',
    dateOfBirth: 'பிறந்த தேதி',
    emailAddress: 'மின்னஞ்சல் முகவரி',
    phoneNumber: 'தொலைபேசி எண்',
    residentialAddress: 'குடியிருப்பு முகவரி',
    discard: 'நிராகரிக்கவும்',
    saveChanges: 'மாற்றங்களைச் சேமிக்கவும்',
    saving: 'சேமிக்கிறது...',
    saved: 'சேமிக்கப்பட்டது',
    noDocuments: 'ஆவணங்கள் எதுவும் கிடைக்கவில்லை',
    noDocumentsDesc: 'உங்கள் பதிவேற்றிய ஆவணங்கள் மற்றும் நிறைவு செய்யப்பட்ட படிவங்கள் எளிதான அணுகலுக்காக இங்கே தோன்றும்.',
    verificationStatus: 'சரிபார்ப்பு நிலை',
    accountNotVerified: 'கணக்கு சரிபார்க்கப்படவில்லை',
    verifyNow: 'இப்போது சரிபார்க்கவும்',
    verificationRequired: 'சரிபார்ப்பு தேவை',
    verificationDesc: 'அனைத்து அரசாங்க சேவைகளையும் அணுகவும் கணக்கு பாதுகாப்பை உறுதிப்படுத்தவும் உங்கள் அடையாளத்தை சரிபார்க்கவும்.',
    verified: 'சரிபார்க்கப்பட்ட கணக்கு',
    verifiedDesc: 'உங்கள் கணக்கு சரிபார்க்கப்பட்டுள்ளது மற்றும் அனைத்து சேவைகளுக்கும் முழு அணுகல் உள்ளது.'
  }
};

// --- PREMIUM SVG ICON COMPONENTS ---
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
);

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M9 12l2 2 4-4"/></svg>
);

const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

// --- DEFAULT AVATAR (INLINE SVG) ---
const DefaultAvatar = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 144 144"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Default profile avatar"
    className={className}
  >
    <defs>
      <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC72C" />
        <stop offset="60%" stopColor="#FF5722" />
        <stop offset="100%" stopColor="#8D153A" />
      </linearGradient>
    </defs>
    {/* Outer circle */}
    <circle cx="72" cy="72" r="70" fill="url(#avatarGradient)" opacity="0.18" />
    <circle cx="72" cy="72" r="62" fill="currentColor" className="text-card" opacity="0.75" />
    {/* User silhouette */}
    <g fill="none" stroke="url(#avatarGradient)" strokeWidth="6" strokeLinecap="round">
      <circle cx="72" cy="56" r="20" fill="none" />
      <path d="M32 112c6-18 24-30 40-30s34 12 40 30" />
    </g>
  </svg>
);


// --- REUSABLE UI COMPONENTS ---
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-muted-foreground mb-2">
      {children}
    </label>
  );
}

// User profile form state interface
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profilePicture: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  nic: string;
}
  
const initialFormState: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  profilePicture: "",
  nationality: "Sri Lankan",
  dateOfBirth: "",
  gender: "",
  nic: "",
};

// --- MAIN PROFILE PAGE COMPONENT ---
export default function ProfilePage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [form, setForm] = useState<UserProfile>(initialFormState);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [isVerified] = useState(false); // For demo - normally from API
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();
  const t = profileTranslations[currentLanguage];

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        console.log('Loading profile for user:', user); // Debug log
        
        const response = await fetch('/api/auth/user/profile', {
          credentials: 'include',
        });

        console.log('Profile API response status:', response.status); // Debug log

        if (response.ok) {
          const result = await response.json();
          console.log('API Response:', result); // Debug log
          
          // The API returns user data under result.user
          const userData = result.user || result;
          console.log('User Data:', userData); // Debug log
          
          setForm({
            firstName: userData.firstName || (userData.fullName ? userData.fullName.split(' ')[0] : ''),
            lastName: userData.lastName || (userData.fullName ? userData.fullName.split(' ').slice(1).join(' ') : ''),
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || userData.mobileNumber || '',
            address: userData.address || '',
            profilePicture: userData.profilePicture || '',
            nationality: userData.nationality || 'Sri Lankan',
            dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
            gender: userData.gender || '',
            nic: userData.nic || userData.nicNumber || '',
          });
        } else {
          console.error('Profile API error:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    } else {
      console.log('No user authenticated, skipping profile load');
      setLoading(false);
    }
  }, [user]);

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  // Use undefined to indicate "no avatar"; only build object URL when a file exists
  const previewUrl = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : undefined), [avatarFile]);

  // Debug log the current form state (only when it changes)
  useEffect(() => {
    if (form.firstName || form.profilePicture) { // Only log if we have some data
      console.log('Profile form state updated:', form);
      if (form.profilePicture) {
        console.log('Profile picture URL:', form.profilePicture);
      }
    }
  }, [form]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Upload the file first
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/file/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        
        // Update profile with new picture URL
        const profileResponse = await fetch('/api/auth/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profilePicture: uploadResult.url
          }),
          credentials: 'include',
        });

        if (profileResponse.ok) {
          setForm(prev => ({ ...prev, profilePicture: uploadResult.url }));
          setAvatarFile(file); // For preview
        }
      }
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
    }
  };

  const onDiscard = () => {
    // Reset to the initial loaded state from API
    setForm(initialFormState);
    setAvatarFile(null);
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    
    setSaving(true);
    setSaved(false);
    
    try {
      const response = await fetch('/api/auth/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        credentials: 'include',
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  // Calculate completeness based on filled fields
  const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'nic'];
  const completeness = requiredFields.filter(field => form[field as keyof UserProfile]).length;
  const completenessPct = Math.round((completeness / requiredFields.length) * 100);

  const TABS = [
    { id: 'details', label: t.personalDetails, icon: <UserIcon className="w-5 h-5 mr-3"/> },
    { id: 'documents', label: t.myDocuments, icon: <DocumentIcon className="w-5 h-5 mr-3"/> },
  ];

  if (loading) {
    return (
      <UserDashboardLayout
        title="Loading..."
        subtitle="Please wait"
        language={currentLanguage}
        onLanguageChange={handleLanguageChange}
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC72C]"></div>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout
      title={
        <span className="animate-title-wave">
          <span className="text-foreground">{t.title.split(' ')[0]}</span>{' '}
          <span className="text-gradient">
            {t.title.split(' ')[1] || ''}
          </span>
        </span>
      }
      subtitle={t.subtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/user/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {t.backToDashboard}
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* --- SIDEBAR --- */}
          <aside className="lg:col-span-3 mb-12 lg:mb-0">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-glow modern-card space-y-2">
              {TABS.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-[#FFC72C]/20 to-[#FF5722]/20 text-[#FFC72C] border border-[#FFC72C]/30 shadow-lg'
                      : 'text-muted-foreground hover:bg-card/50 hover:text-foreground hover:border-border/60 border border-transparent'
                  }`}
                >
                  <div className={`transition-colors duration-300 ${activeTab === tab.id ? 'text-[#FFC72C]' : 'text-muted-foreground'}`}>
                    {tab.icon}
                  </div>
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <div className="lg:col-span-9">
            {activeTab === 'details' && (
              <div>
                <div className="mb-8 animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm font-medium text-foreground">{t.personalDetails}</span>
                  </div>
                  <p className="text-muted-foreground">{t.personalDetailsDesc}</p>
                </div>
                <form onSubmit={onSubmit}>
                  <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-border/50 shadow-glow modern-card hover:border-[#FFC72C]/30 transition-all duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                      {/* Left: Avatar + Completeness */}
                      <div className="lg:col-span-1 flex flex-col items-center">
                        <div className="relative group w-48 h-48 sm:w-56 sm:h-56 mb-6">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFC72C]/20 via-[#FF5722]/20 to-[#8D153A]/20 blur-lg animate-pulse"></div>
                          {/* Avatar: show uploaded preview, saved profile picture, or default */}
                          {previewUrl ? (
                            <Image 
                              src={previewUrl} 
                              alt="Profile Avatar"
                              width={224}
                              height={224}
                              className="relative w-full h-full object-cover rounded-full border-4 border-[#FFC72C]/30 shadow-xl transition-all duration-300 group-hover:border-[#FFC72C]/60 group-hover:scale-[1.02]"
                            />
                          ) : form.profilePicture ? (
                            <Image 
                              src={`/api/file/retrieve?url=${encodeURIComponent(form.profilePicture)}`}
                              alt="Profile Avatar"
                              width={224}
                              height={224}
                              className="relative w-full h-full object-cover rounded-full border-4 border-[#FFC72C]/30 shadow-xl transition-all duration-300 group-hover:border-[#FFC72C]/60 group-hover:scale-[1.02]"
                              unoptimized
                            />
                          ) : (
                            <DefaultAvatar className="relative w-full h-full rounded-full border-4 border-[#FFC72C]/30 shadow-xl transition-all duration-300 group-hover:border-[#FFC72C]/60 group-hover:scale-[1.02]" />
                          )}
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center border border-border hover:from-[#FF5722] hover:to-[#8D153A] shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 group"
                            aria-label="Upload new profile picture"
                          >
                            <UploadIcon className="text-white group-hover:scale-110 transition-transform duration-300" />
                          </button>
                          <input ref={fileRef} type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
                        </div>

                        <div className="w-full space-y-4">
                          {/* Profile Completeness */}
                          <div className="bg-card/80 dark:bg-card/90 backdrop-blur-md p-5 rounded-2xl border border-border/30 shadow-glow modern-card hover:border-[#FFC72C]/40 transition-all duration-300">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold text-foreground">{t.profileCompleteness}</span>
                              <span className="font-bold text-gradient">{completenessPct}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-muted/30 rounded-full overflow-hidden border border-border/20">
                              <div className="h-full bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full transition-all duration-700 ease-out shadow-sm" style={{ width: `${completenessPct}%` }}/>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3 text-center leading-relaxed">{t.completeProfileHelp}</p>
                          </div>

                          {/* Verification Status */}
                          <div className={`
                            bg-card/80 dark:bg-card/90 backdrop-blur-md p-5 rounded-2xl border shadow-glow modern-card transition-all duration-300
                            ${isVerified 
                              ? 'border-[#008060]/30 hover:border-[#008060]/50' 
                              : 'border-[#FF5722]/30 hover:border-[#FF5722]/50'
                            }
                          `}>
                            <div className="flex items-center gap-3 mb-3">
                              {isVerified ? (
                                <div className="p-2 bg-[#008060]/10 rounded-xl">
                                  <ShieldCheckIcon className="w-5 h-5 text-[#008060]" />
                                </div>
                              ) : (
                                <div className="p-2 bg-[#FF5722]/10 rounded-xl">
                                  <AlertTriangleIcon className="w-5 h-5 text-[#FF5722]" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-foreground">{t.verificationStatus}</span>
                                  <div className={`
                                    w-2 h-2 rounded-full animate-pulse
                                    ${isVerified ? 'bg-[#008060]' : 'bg-[#FF5722]'}
                                  `}></div>
                                </div>
                                <p className={`text-xs mt-1 ${isVerified ? 'text-[#008060]' : 'text-[#FF5722]'}`}>
                                  {isVerified ? t.verified : t.accountNotVerified}
                                </p>
                              </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                              {isVerified ? t.verifiedDesc : t.verificationDesc}
                            </p>
                            
                            {!isVerified && (
                              <Link 
                                href="/user/profile/verification"
                                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FF5722] to-[#8D153A] hover:from-[#8D153A] hover:to-[#FF5722] rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl group"
                              >
                                <ShieldIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                {t.verifyNow}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Form Fields */}
                      <div className="lg:col-span-2 space-y-6">
                        <div>
                          <Label htmlFor="firstName">{t.fullName}</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input 
                              id="firstName" 
                              name="firstName" 
                              value={form.firstName} 
                              onChange={onChange} 
                              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-sm text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60" 
                              placeholder="First name" 
                            />
                            <input 
                              id="lastName" 
                              name="lastName" 
                              value={form.lastName} 
                              onChange={onChange} 
                              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-sm text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60" 
                              placeholder="Last name" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="nic">{t.nationalId}</Label>
                            <input 
                              id="nic" 
                              name="nic" 
                              value={form.nic} 
                              onChange={onChange} 
                              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-sm text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60" 
                              placeholder="Enter your NIC number" 
                            />
                          </div>
                          <div>
                            <Label htmlFor="dateOfBirth">{t.dateOfBirth}</Label>
                            <input 
                              id="dateOfBirth" 
                              name="dateOfBirth" 
                              type="date" 
                              value={form.dateOfBirth} 
                              onChange={onChange} 
                              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-sm text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="email">{t.emailAddress}</Label>
                            <input 
                              id="email" 
                              name="email" 
                              type="email" 
                              value={form.email} 
                              onChange={onChange} 
                              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-sm text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60" 
                              placeholder="name@example.com" 
                            />
                          </div>
                          <div>
                            <Label htmlFor="phoneNumber">{t.phoneNumber}</Label>
                            <input 
                              id="phoneNumber" 
                              name="phoneNumber" 
                              value={form.phoneNumber} 
                              onChange={onChange} 
                              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-sm text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60" 
                              placeholder="+94 7X XXX XXXX" 
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address">{t.residentialAddress}</Label>
                          <textarea 
                            id="address" 
                            name="address" 
                            rows={4} 
                            value={form.address} 
                            onChange={onChange} 
                            className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-sm text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60 resize-none" 
                            placeholder="No, Street, City" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row justify-end items-center gap-4">
                      <button 
                        type="button" 
                        onClick={onDiscard} 
                        className="w-full sm:w-auto px-6 py-3 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
                      >
                        {t.discard}
                      </button>
                      <button 
                        type="submit" 
                        disabled={saving || saved} 
                        className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                      >
                        {saving ? t.saving : (saved ? <>{t.saved} <CheckIcon className="w-4 h-4" /></> : t.saveChanges)}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            {activeTab === 'documents' && (
              <div>
                <div className="mb-8 animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm font-medium text-foreground">{t.myDocuments}</span>
                  </div>
                  <p className="text-muted-foreground">{t.myDocumentsDesc}</p>
                </div>
                <div className="space-y-8">
                  {/* Verification Card */}
                  {!isVerified && (
                    <div className="bg-gradient-to-r from-[#FF5722]/10 to-[#8D153A]/10 rounded-2xl p-6 border border-[#FF5722]/20 animate-fade-in-up">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-[#FF5722]/10 rounded-xl flex-shrink-0">
                          <AlertTriangleIcon className="w-6 h-6 text-[#FF5722]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground mb-2">{t.verificationRequired}</h3>
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {t.verificationDesc}
                          </p>
                          <Link 
                            href="/user/profile/verification"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#FF5722] to-[#8D153A] hover:from-[#8D153A] hover:to-[#FF5722] rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl group"
                          >
                            <ShieldIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            {t.verifyNow}
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14"/>
                              <path d="M12 5l7 7-7 7"/>
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Documents Section */}
                  <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-border/50 shadow-glow modern-card text-center min-h-[400px] flex flex-col justify-center items-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#FFC72C]/20">
                      <DocumentIcon className="w-10 h-10 text-muted-foreground/60" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{t.noDocuments}</h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{t.noDocumentsDesc}</p>
                    
                    {isVerified && (
                      <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#008060]/10 rounded-xl border border-[#008060]/20">
                        <ShieldCheckIcon className="w-4 h-4 text-[#008060]" />
                        <span className="text-sm font-medium text-[#008060]">{t.verified}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
