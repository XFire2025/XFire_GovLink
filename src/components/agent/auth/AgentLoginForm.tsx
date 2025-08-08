// src/components/agent/auth/AgentLoginForm.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AgentInputField from './AgentInputField';

// Types for translations
type Language = 'en' | 'si' | 'ta';

interface LoginTranslation {
  employeeId: string;
  employeeIdPlaceholder: string;
  employeeIdHelp: string;
  employeeIdRequired: string;
  employeeIdInvalid: string;
  department: string;
  selectDepartment: string;
  departmentRequired: string;
  password: string;
  passwordPlaceholder: string;
  passwordHelp: string;
  passwordRequired: string;
  passwordMinLength: string;
  keepMeSignedIn: string;
  accessAgentPortal: string;
  authenticating: string;
  invalidCredentials: string;
  loginFailed: string;
  departments: Record<string, string>;
}

// Translation data
const loginTranslations: Record<Language, LoginTranslation> = {
  en: {
    employeeId: 'Employee ID',
    employeeIdPlaceholder: 'Enter your Employee ID (e.g., ABC1234)',
    employeeIdHelp: 'Your government-issued Employee ID',
    employeeIdRequired: 'Employee ID is required',
    employeeIdInvalid: 'Invalid Employee ID format (e.g., ABC1234)',
    department: 'Department',
    selectDepartment: 'Select Department',
    departmentRequired: 'Please select your department',
    password: 'Password',
    passwordPlaceholder: 'Enter your secure password',
    passwordHelp: 'Minimum 8 characters required',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 8 characters',
    keepMeSignedIn: 'Keep me signed in',
    accessAgentPortal: 'Access Agent Portal',
    authenticating: 'Authenticating...',
    invalidCredentials: 'Invalid credentials. Please check your Employee ID and password.',
    loginFailed: 'Login failed. Please try again or contact IT support.',
    departments: {
      '': 'Select Department',
      'immigration': 'Department of Immigration & Emigration',
      'registration': 'Department of Registrar General',
      'motor_traffic': 'Department of Motor Traffic',
      'customs': 'Department of Customs',
      'inland_revenue': 'Department of Inland Revenue',
      'labor': 'Department of Labour',
      'police': 'Sri Lanka Police',
      'health': 'Ministry of Health',
      'education': 'Ministry of Education'
    }
  },
  si: {
    employeeId: 'සේවක හැඳුනුම්පත',
    employeeIdPlaceholder: 'ඔබගේ සේවක හැඳුනුම්පත ඇතුළත් කරන්න (උදා: ABC1234)',
    employeeIdHelp: 'ඔබගේ රාජ්‍ය-නිකුත් සේවක හැඳුනුම්පත',
    employeeIdRequired: 'සේවක හැඳුනුම්පත අවශ්‍යයි',
    employeeIdInvalid: 'වලංගු නොවන සේවක හැඳුනුම්පත් ආකෘතිය (උදා: ABC1234)',
    department: 'දෙපාර්තමේන්තුව',
    selectDepartment: 'දෙපාර්තමේන්තුව තෝරන්න',
    departmentRequired: 'කරුණාකර ඔබගේ දෙපාර්තමේන්තුව තෝරන්න',
    password: 'මුර පදය',
    passwordPlaceholder: 'ඔබගේ ආරක්ෂිත මුර පදය ඇතුළත් කරන්න',
    passwordHelp: 'අවම අක්ෂර 8ක් අවශ්‍යයි',
    passwordRequired: 'මුර පදය අවශ්‍යයි',
    passwordMinLength: 'මුර පදය අවම වශයෙන් අක්ෂර 8කින් සමන්විත විය යුතුය',
    keepMeSignedIn: 'මා පුරනය වී සිටවන්න',
    accessAgentPortal: 'නිලධාරි පෝට්ල් වෙත ප්‍රවේශ වන්න',
    authenticating: 'සත්‍යාපනය කරමින්...',
    invalidCredentials: 'වලංගු නොවන අක්තපත්‍ර. කරුණාකර ඔබගේ සේවක හැඳුනුම්පත සහ මුර පදය පරීක්ෂා කරන්න.',
    loginFailed: 'පුරනය වීම අසමත්. කරුණාකර නැවත උත්සාහ කරන්න හෝ තාක්ෂණික සහාය අමතන්න.',
    departments: {
      '': 'දෙපාර්තමේන්තුව තෝරන්න',
      'immigration': 'ආගමන සහ විගමන දෙපාර්තමේන්තුව',
      'registration': 'මහලේකම් දෙපාර්තමේන්තුව',
      'motor_traffic': 'මෝටර් රථ ගමනාගමන දෙපාර්තමේන්තුව',
      'customs': 'රේගු දෙපාර්තමේන්තුව',
      'inland_revenue': 'අභ්‍යන්තර ආදායම් දෙපාර්තමේන්තුව',
      'labor': 'කම්කරු දෙපාර්තමේන්තුව',
      'police': 'ශ්‍රී ලංකා පොලිසිය',
      'health': 'සෞඛ්‍ය අමාත්‍යාංශය',
      'education': 'අධ්‍යාපන අමාත්‍යාංශය'
    }
  },
  ta: {
    employeeId: 'பணியாளர் அடையாள எண்',
    employeeIdPlaceholder: 'உங்கள் பணியாளர் அடையாள எண்ணை உள்ளிடுங்கள் (எ.கா: ABC1234)',
    employeeIdHelp: 'உங்கள் அரசு-வழங்கிய பணியாளர் அடையாள எண்',
    employeeIdRequired: 'பணியாளர் அடையாள எண் தேவை',
    employeeIdInvalid: 'தவறான பணியாளர் அடையாள எண் வடிவம் (எ.கா: ABC1234)',
    department: 'துறை',
    selectDepartment: 'துறையைத் தேர்ந்தெடுக்கவும்',
    departmentRequired: 'தயவுசெய்து உங்கள் துறையைத் தேர்ந்தெடுக்கவும்',
    password: 'கடவுச்சொல்',
    passwordPlaceholder: 'உங்கள் பாதுகாப்பான கடவுச்சொல்லை உள்ளிடுங்கள்',
    passwordHelp: 'குறைந்தது 8 எழுத்துகள் தேவை',
    passwordRequired: 'கடவுச்சொல் தேவை',
    passwordMinLength: 'கடவுச்சொல் குறைந்தது 8 எழுத்துகளாக இருக்க வேண்டும்',
    keepMeSignedIn: 'என்னை உள்நுழைய வைத்திருக்கவும்',
    accessAgentPortal: 'அதிகாரி போர்டலை அணுகவும்',
    authenticating: 'அங்கீகரித்துக்கொண்டிருக்கிறது...',
    invalidCredentials: 'தவறான நற்சான்றிதழ்கள். தயவுசெய்து உங்கள் பணியாளர் அடையாள எண் மற்றும் கடவுச்சொல்லை சரிபார்க்கவும்.',
    loginFailed: 'உள்நுழைவு தோல்வியடைந்தது. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது IT ஆதரவை தொடர்பு கொள்ளுங்கள்.',
    departments: {
      '': 'துறையைத் தேர்ந்தெடுக்கவும்',
      'immigration': 'குடியேற்றம் மற்றும் குடியகற்றல் துறை',
      'registration': 'பதிவாளர் ஜெனரல் துறை',
      'motor_traffic': 'மோட்டார் போக்குவரத்து துறை',
      'customs': 'சுங்கத் துறை',
      'inland_revenue': 'உள்நாட்டு வருவாய் துறை',
      'labor': 'தொழிலாளர் துறை',
      'police': 'இலங்கை காவல்துறை',
      'health': 'சுகாதார அமைச்சு',
      'education': 'கல்வி அமைச்சு'
    }
  }
};

// Form state interface
interface LoginFormData {
  employeeId: string;
  password: string;
  department: string;
  rememberMe: boolean;
}

// Form errors interface
interface FormErrors {
  employeeId?: string;
  password?: string;
  department?: string;
  general?: string;
}

interface AgentLoginFormProps {
  language?: Language;
}

const AgentLoginForm: React.FC<AgentLoginFormProps> = ({ language = 'en' }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<LoginFormData>({
    employeeId: '',
    password: '',
    department: '',
    rememberMe: false
  });

  const t = loginTranslations[language];

  // Get department options for the current language
  const departmentOptions = Object.entries(t.departments).map(([value, label]) => ({
    value,
    label
  }));

  // Update form data
  const updateFormData = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Employee ID validation
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = t.employeeIdRequired;
    } else if (!/^[A-Z]{2,3}\d{4,6}$/.test(formData.employeeId.toUpperCase())) {
      newErrors.employeeId = t.employeeIdInvalid;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t.passwordRequired;
    } else if (formData.password.length < 8) {
      newErrors.password = t.passwordMinLength;
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = t.departmentRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate authentication (replace with actual API call)
      // For demo purposes, you can implement actual authentication logic here
      router.push('/agent/dashboard');
    } catch (error) {
      setErrors({
        general: t.loginFailed
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message - Enhanced with Landing Page Styling */}
      {errors.general && (
        <div className="bg-[#FF5722]/10 border border-[#FF5722]/20 rounded-xl p-4 animate-fade-in-up backdrop-blur-md modern-card">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#FF5722] rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v2m0 4h.01"/>
              </svg>
            </div>
            <p className="text-[#FF5722] text-sm font-medium">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Employee ID Field */}
      <AgentInputField
        id="employeeId"
        label={t.employeeId}
        type="text"
        placeholder={t.employeeIdPlaceholder}
        value={formData.employeeId}
        onChange={(value) => updateFormData('employeeId', value.toUpperCase())}
        required
        error={errors.employeeId}
        helpText={t.employeeIdHelp}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="m22 2-5 10-7-3z"/>
          </svg>
        }
      />

      {/* Department Selection - Enhanced with Landing Page Styling */}
      <div className="mb-4 sm:mb-6 animate-fade-in-up">
        <label 
          htmlFor="department"
          className="block text-sm font-semibold text-foreground mb-2"
        >
          {t.department}
          <span className="text-[#FF5722] ml-1">*</span>
        </label>
        
        <div className="relative group">
          <div 
            className={`
              relative bg-card/90 dark:bg-card/95 backdrop-blur-md border-2 rounded-xl transition-all duration-500 shadow-lg modern-card
              ${errors.department 
                ? 'border-[#FF5722]/70 shadow-lg' 
                : formData.department 
                  ? 'border-[#FFC72C]/50 shadow-lg' 
                  : 'border-border/50 hover:border-[#FFC72C]/50 hover:shadow-xl'
              }
            `}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"/>
                <path d="M5 21V7l8-4v18"/>
                <path d="M19 21V11l-6-4"/>
                <path d="M9 9v.01"/>
                <path d="M9 12v.01"/>
                <path d="M9 15v.01"/>
                <path d="M9 18v.01"/>
              </svg>
            </div>
            
            <select
              id="department"
              value={formData.department}
              onChange={(e) => updateFormData('department', e.target.value)}
              required
              className="w-full bg-transparent text-foreground p-3 sm:p-4 pl-12 sm:pl-14 pr-12 rounded-xl focus:outline-none transition-all duration-300 text-sm sm:text-base lg:text-lg leading-relaxed appearance-none cursor-pointer font-medium border-none"
            >
              {departmentOptions.map((dept) => (
                <option 
                  key={dept.value} 
                  value={dept.value}
                  className="bg-card text-foreground py-2"
                  disabled={dept.value === ''}
                >
                  {dept.label}
                </option>
              ))}
            </select>
            
            {/* Dropdown Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
          
          {/* Glow Effect for Department Dropdown */}
          {formData.department && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFC72C]/20 to-[#FF5722]/20 blur-xl -z-10 animate-pulse"></div>
          )}
        </div>
        
        {errors.department && (
          <p className="text-xs sm:text-sm text-[#FF5722] mt-2 animate-fade-in-up flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {errors.department}
          </p>
        )}
      </div>

      {/* Password Field */}
      <AgentInputField
        id="password"
        label={t.password}
        type="password"
        placeholder={t.passwordPlaceholder}
        value={formData.password}
        onChange={(value) => updateFormData('password', value)}
        required
        error={errors.password}
        helpText={t.passwordHelp}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
            <circle cx="12" cy="16" r="1"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        }
      />

      {/* Remember Me Checkbox - Enhanced with Landing Page Styling */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => updateFormData('rememberMe', e.target.checked)}
              className="sr-only"
            />
            <div 
              className={`
                w-5 h-5 rounded border-2 transition-all duration-300 shadow-sm
                ${formData.rememberMe 
                  ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] border-[#FFC72C] scale-110 shadow-lg' 
                  : 'border-border hover:border-[#FFC72C]/50 group-hover:scale-105'
                }
              `}
            >
              {formData.rememberMe && (
                <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5 animate-scale-in" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{t.keepMeSignedIn}</span>
        </label>
      </div>

      {/* Login Button - EXACT SAME as Landing Page buttons */}
      <button
        type="submit"
        disabled={isLoading}
        className={`
          group w-full relative overflow-hidden rounded-xl font-semibold text-base sm:text-lg py-4 sm:py-5 transition-all duration-300 shadow-glow hover:shadow-2xl
          ${isLoading 
            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
            : 'bg-gradient-to-r from-[#FFC72C] via-[#FF5722] to-[#8D153A] hover:from-[#FF5722] hover:via-[#8D153A] hover:to-[#FFC72C] text-white hover:scale-[1.02]'
          }
          animate-fade-in-up
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
            <span>{t.authenticating}</span>
          </div>
        ) : (
          <span className="relative z-10 flex items-center justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {t.accessAgentPortal}
          </span>
        )}
        
        {/* Button Hover Effect - EXACT SAME as Landing Page */}
        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
      </button>
    </form>
  );
};

export default AgentLoginForm;