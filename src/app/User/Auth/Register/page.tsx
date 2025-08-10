// src/app/User/Auth/Register/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserAuthLayout from '@/components/user/auth/UserAuthLayout';

// Types
type Language = 'en' | 'si' | 'ta';

// Registration translations
const registerTranslations: Record<Language, {
  title: string;
  subtitle: string;
  fullName: string;
  nicNumber: string;
  dateOfBirth: string;
  mobileNumber: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  createAccount: string;
  creating: string;
  created: string;
  alreadyHaveAccount: string;
  signIn: string;
  fullNamePlaceholder: string;
  nicPlaceholder: string;
  dobPlaceholder: string;
  mobilePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  completeProfileLater: string;
  errors: {
    passwordsDontMatch: string;
    weakPassword: string;
    invalidEmail: string;
    nameRequired: string;
    nicRequired: string;
    invalidNic: string;
    dobRequired: string;
    invalidAge: string;
    mobileRequired: string;
    invalidMobile: string;
  };
}> = {
  en: {
    title: 'Create Account',
    subtitle: 'Join GovLink with essential details. Complete your profile later.',
    fullName: 'Full Name',
    nicNumber: 'NIC Number',
    dateOfBirth: 'Date of Birth',
    mobileNumber: 'Mobile Number',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createAccount: 'Create Account',
    creating: 'Creating...',
    created: 'Account Created!',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    fullNamePlaceholder: 'Enter your full name',
    nicPlaceholder: '123456789V or 200012345678',
    dobPlaceholder: 'Select your date of birth',
    mobilePlaceholder: '0771234567',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: '••••••••',
    confirmPasswordPlaceholder: '••••••••',
    completeProfileLater: 'You can complete your full profile after registration',
    errors: {
      passwordsDontMatch: 'Passwords do not match',
      weakPassword: 'Password must be at least 8 characters',
      invalidEmail: 'Please enter a valid email address',
      nameRequired: 'Full name is required',
      nicRequired: 'NIC number is required',
      invalidNic: 'Please enter a valid Sri Lankan NIC number',
      dobRequired: 'Date of birth is required',
      invalidAge: 'You must be at least 16 years old',
      mobileRequired: 'Mobile number is required',
      invalidMobile: 'Please enter a valid Sri Lankan mobile number'
    }
  },
  si: {
    title: 'ගිණුමක් සාදන්න',
    subtitle: 'අත්‍යවශ්‍ය තොරතුරු සමග GovLink හි ගිණුමක් සාදන්න. පසුව ඔබගේ පැතිකඩ සම්පූර්ණ කරන්න.',
    fullName: 'සම්පූර්ණ නම',
    nicNumber: 'ජා.හැ.ප. අංකය',
    dateOfBirth: 'උපන් දිනය',
    mobileNumber: 'ජංගම දුරකථන අංකය',
    emailAddress: 'විද්‍යුත් තැපැල්',
    password: 'මුර පදය',
    confirmPassword: 'මුර පදය තහවුරු කරන්න',
    createAccount: 'ගිණුම සාදන්න',
    creating: 'සාදමින්...',
    created: 'ගිණුම සාදන ලදී!',
    alreadyHaveAccount: 'දැනටමත් ගිණුමක් තිබේද?',
    signIn: 'ඇතුල් වන්න',
    fullNamePlaceholder: 'ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න',
    nicPlaceholder: '123456789V හෝ 200012345678',
    dobPlaceholder: 'ඔබේ උපන් දිනය තෝරන්න',
    mobilePlaceholder: '0771234567',
    emailPlaceholder: 'ඔබගේ@email.com',
    passwordPlaceholder: '••••••••',
    confirmPasswordPlaceholder: '••••••••',
    completeProfileLater: 'ලියාපදිංචියෙන් පසු ඔබට ඔබේ සම්පූර්ණ පැතිකඩ සම්පූර්ණ කළ හැක',
    errors: {
      passwordsDontMatch: 'මුරපද ගැලපෙන්නේ නැත',
      weakPassword: 'මුරපදය අවම වශයෙන් අක්ෂර 8ක් විය යුතුය',
      invalidEmail: 'කරුණාකර වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න',
      nameRequired: 'සම්පූර්ණ නම අවශ්‍ය වේ',
      nicRequired: 'ජා.හැ.ප. අංකය අවශ්‍ය වේ',
      invalidNic: 'කරුණාකර වලංගු ශ්‍රී ලංකා ජා.හැ.ප. අංකයක් ඇතුළත් කරන්න',
      dobRequired: 'උපන් දිනය අවශ්‍ය වේ',
      invalidAge: 'ඔබගේ වයස අවම වශයෙන් අවුරුදු 16ක් විය යුතුය',
      mobileRequired: 'ජංගම දුරකථන අංකය අවශ්‍ය වේ',
      invalidMobile: 'කරුණාකර වලංගු ශ්‍රී ලංකා ජංගම දුරකථන අංකයක් ඇතුළත් කරන්න'
    }
  },
  ta: {
    title: 'கணக்கு உருவாக்கவும்',
    subtitle: 'அத்தியாவசிய விவரங்களுடன் GovLink இல் கணக்கு உருவாக்கவும். பின்னர் உங்கள் சுயவிவரத்தை முழுமையாக்கவும்.',
    fullName: 'முழு பெயர்',
    nicNumber: 'அ.அ.அ. எண்',
    dateOfBirth: 'பிறந்த தேதி',
    mobileNumber: 'மொபைல் எண்',
    emailAddress: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    createAccount: 'கணக்கு உருவாக்கவும்',
    creating: 'உருவாக்குகிறது...',
    created: 'கணக்கு உருவாக்கப்பட்டது!',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு இருக்கிறதா?',
    signIn: 'உள்நுழைய',
    fullNamePlaceholder: 'உங்கள் முழு பெயரை உள்ளிடவும்',
    nicPlaceholder: '123456789V அல்லது 200012345678',
    dobPlaceholder: 'உங்கள் பிறந்த தேதியைத் தேர்ந்தெடுக்கவும்',
    mobilePlaceholder: '0771234567',
    emailPlaceholder: 'நீங்கள்@email.com',
    passwordPlaceholder: '••••••••',
    confirmPasswordPlaceholder: '••••••••',
    completeProfileLater: 'பதிவுக்குப் பிறகு உங்கள் முழு சுயவிவரத்தை நீங்கள் முழுமையாக்கலாம்',
    errors: {
      passwordsDontMatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
      weakPassword: 'கடவுச்சொல் குறைந்தது 8 எழுத்துகளாக இருக்க வேண்டும்',
      invalidEmail: 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்',
      nameRequired: 'முழு பெயர் தேவை',
      nicRequired: 'அ.அ.அ. எண் தேவை',
      invalidNic: 'தயவுசெய்து சரியான இலங்கை அ.அ.அ. எண்ணை உள்ளிடவும்',
      dobRequired: 'பிறந்த தேதி தேவை',
      invalidAge: 'உங்களுக்கு குறைந்தது 16 வயது இருக்க வேண்டும்',
      mobileRequired: 'மொபைல் எண் தேவை',
      invalidMobile: 'தயவுசெய்து சரியான இலங்கை மொபைல் எண்ணை உள்ளிடவும்'
    }
  }
};

// Icons
const UserPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// Form Components
const PasswordStrengthIndicator = ({ password, language = 'en' }: { password: string; language?: Language }) => {
  const getStrength = () => {
    if (password.length === 0) return { score: 0, label: '', color: '' };
    if (password.length < 6) return { score: 1, label: 'Weak', color: '#FF5722' };
    if (password.length < 10) return { score: 2, label: 'Fair', color: '#FFC72C' };
    return { score: 3, label: 'Strong', color: '#008060' };
  };

  const strength = getStrength();
  
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength.score ? 'opacity-100' : 'opacity-20'
            }`}
            style={{ backgroundColor: i <= strength.score ? strength.color : '#444' }}
          />
        ))}
      </div>
      {strength.label && (
        <p className="text-xs" style={{ color: strength.color }}>
          {strength.label}
        </p>
      )}
    </div>
  );
};

const PasswordInput = ({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  className = '',
  showStrength = false,
  language = 'en'
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
  showStrength?: boolean;
  language?: Language;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        required
        autoComplete={id === 'password' ? 'new-password' : 'new-password'}
        className={`w-full px-4 py-3 pr-12 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-md text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60 ${className}`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-[#FFC72C] transition-colors duration-200"
      >
        {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
      </button>
      {showStrength && <PasswordStrengthIndicator password={value} language={language} />}
    </div>
  );
};

// Main Register Page Component
export default function RegisterPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [formData, setFormData] = useState({
    name: '',
    nicNumber: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const t = registerTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return t.errors.nameRequired;
    if (!formData.nicNumber.trim()) return t.errors.nicRequired;
    if (!/^(\d{9}[VvXx]|\d{12})$/.test(formData.nicNumber.replace(/\s+/g, ''))) return t.errors.invalidNic;
    if (!formData.dateOfBirth) return t.errors.dobRequired;
    
    // Check age (must be at least 16)
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 16) return t.errors.invalidAge;
    
    if (!formData.mobileNumber.trim()) return t.errors.mobileRequired;
    if (!/^(\+94|0)([7][01245678]\d{7})$/.test(formData.mobileNumber.replace(/\s+/g, ''))) return t.errors.invalidMobile;
    if (!formData.email.includes('@')) return t.errors.invalidEmail;
    if (formData.password.length < 8) return t.errors.weakPassword;
    if (formData.password !== formData.confirmPassword) return t.errors.passwordsDontMatch;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitting(false);
    setSuccess(true);
    
    // Redirect to login after success
    setTimeout(() => {
      router.push('/User/Auth/Login');
    }, 1500);
  };

  return (
    <UserAuthLayout
      title={t.title}
      subtitle={t.subtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
              {t.fullName}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-md text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60"
              placeholder={t.fullNamePlaceholder}
            />
          </div>

          {/* NIC Number Field */}
          <div>
            <label htmlFor="nicNumber" className="block text-sm font-medium text-muted-foreground mb-2">
              {t.nicNumber} <span className="text-[#FF5722]">*</span>
            </label>
            <input
              type="text"
              id="nicNumber"
              name="nicNumber"
              value={formData.nicNumber}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-md text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60"
              placeholder={t.nicPlaceholder}
            />
          </div>

          {/* Date of Birth Field */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-muted-foreground mb-2">
              {t.dateOfBirth} <span className="text-[#FF5722]">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-md text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60"
            />
          </div>

          {/* Mobile Number Field */}
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-muted-foreground mb-2">
              {t.mobileNumber} <span className="text-[#FF5722]">*</span>
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              autoComplete="tel"
              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-md text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60"
              placeholder={t.mobilePlaceholder}
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
              {t.emailAddress}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-md text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60"
              placeholder={t.emailPlaceholder}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">
              {t.password}
            </label>
            <PasswordInput
              id="password"
              value={formData.password}
              onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'password' }})}
              placeholder={t.passwordPlaceholder}
              showStrength={true}
              language={currentLanguage}
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-2">
              {t.confirmPassword}
            </label>
            <PasswordInput
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'confirmPassword' }})}
              placeholder={t.confirmPasswordPlaceholder}
              language={currentLanguage}
            />
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              {t.completeProfileLater}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-[#FF5722]/30 flex items-center gap-3 shadow-glow modern-card animate-fade-in-up">
            <div className="w-6 h-6 text-[#FF5722] flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-[#FF5722]">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-[#008060]/30 flex items-center gap-3 shadow-glow modern-card animate-fade-in-up">
            <CheckCircleIcon className="w-6 h-6 text-[#008060] flex-shrink-0" />
            <p className="text-sm font-medium text-[#008060]">{t.created}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || success}
          className="w-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {t.creating}
            </>
          ) : success ? (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              {t.created}
            </>
          ) : (
            <>
              <UserPlusIcon className="w-5 h-5" />
              {t.createAccount}
            </>
          )}
        </button>

        {/* Login Link */}
        <div className="text-center pt-6 border-t border-border/30">
          <p className="text-sm text-muted-foreground mb-2">{t.alreadyHaveAccount}</p>
          <Link 
            href="/User/Auth/Login" 
            className="font-medium text-[#FFC72C] hover:text-[#FF5722] transition-colors duration-200 hover:underline"
          >
            {t.signIn}
          </Link>
        </div>
      </form>
    </UserAuthLayout>
  );
}