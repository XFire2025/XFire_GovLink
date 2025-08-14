"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAgentAuth } from '@/lib/auth/useAgentAuthUtils';
import AgentInputField from './AgentInputField';

// Types
type Language = 'en' | 'si' | 'ta';

// Form translations
const formTranslations: Record<Language, any> = {
  en: {
    employeeId: 'Employee ID',
    employeeIdPlaceholder: 'Enter your Employee ID (e.g., ABC1234)',
    employeeIdHelp: 'Your government-issued employee identifier',
    employeeIdRequired: 'Employee ID is required',
    employeeIdInvalid: 'Invalid Employee ID format (e.g., ABC1234)',
    department: 'Department',
    selectDepartment: 'Select Department',
    departmentRequired: 'Please select your department',
    password: 'Password',
    passwordPlaceholder: 'Enter your secure password',
    passwordHelp: 'Minimum 8 characters required',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 8 characters long',
    keepMeSignedIn: 'Keep me signed in',
    accessAgentPortal: 'Access Agent Portal',
    authenticating: 'Authenticating...',
    invalidCredentials: 'Invalid credentials. Please check your Employee ID and password.',
    loginFailed: 'Login failed. Please try again or contact IT support.',
    departments: {
      '': 'Select Department',
      'immigration': 'Department of Immigration and Emigration',
      'registration': 'Registrar General\'s Department',
      'motor_traffic': 'Department of Motor Traffic',
      'customs': 'Customs Department',
      'inland_revenue': 'Inland Revenue Department',
      'labor': 'Department of Labour',
      'police': 'Sri Lanka Police',
      'health': 'Ministry of Health',
      'education': 'Ministry of Education'
    }
  },
  si: {
    employeeId: 'සේවක හැඳුනුම්පත',
    employeeIdPlaceholder: 'ඔබගේ සේවක හැඳුනුම්පත ඇතුළත් කරන්න (උදා: ABC1234)',
    employeeIdHelp: 'ඔබගේ රජය-නිකුත් සේවක හැඳුනුම්පත',
    employeeIdRequired: 'සේවක හැඳුනුම්පත අවශ්‍යයි',
    employeeIdInvalid: 'වලංගු නොවන සේවක හැඳුනුම්පත් ආකෘතිය (උදා: ABC1234)',
    department: 'දෙපාර්තමේන්තුව',
    selectDepartment: 'දෙපාර්තමේන්තුව තෝරන්න',
    departmentRequired: 'කරුණාකර ඔබගේ දෙපාර්තමේන්තුව තෝරන්න',
    password: 'මුර පදය',
    passwordPlaceholder: 'ඔබගේ ආරක්‍ෂිත මුර පදය ඇතුළත් කරන්න',
    passwordHelp: 'අවම අක්‍ෂර 8ක් අවශ්‍යයි',
    passwordRequired: 'මුර පදය අවශ්‍යයි',
    passwordMinLength: 'මුර පදය අවම වායෙන් අක්‍ෂර 8කින් සමන්විත විය යුතුය',
    keepMeSignedIn: 'මා පුරනය වී සිටවන්න',
    accessAgentPortal: 'නිලධාරි පෝටල් වෙත ප්‍රවේශ වන්න',
    authenticating: 'සත්‍යාපනය කරමින්...',
    invalidCredentials: 'වලංගු නොවන අක්තපත්‍ර. කරුණාකර ඔබගේ සේවක හැඳුනුම්පත සහ මුර පදය පරීක්‍ෂා කරන්න.',
    loginFailed: 'පුරනය වීම අසමත්. කරුණාකර නවත උත්සාහ කරන්න හෝ තාක්‍ෂණික සහාය අමතන්න.',
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
    employeeIdPlaceholder: 'உங்கள் பணியாளர் அடையாள எண்ணை உள்ளிடவும் (எ.கா: ABC1234)',
    employeeIdHelp: 'உங்கள் அரசால் வழங்கப்பட்ட பணியாளர் அடையாளங்காட்டி',
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
    keepMeSignedIn: 'என்னை உள்நுழை வைத்திருக்கவும்',
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

interface AgentLoginFormProps {
  language: Language;
}

export default function AgentLoginForm({ language }: AgentLoginFormProps) {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } = useAgentAuth();
  
  const [formData, setFormData] = useState({
    employeeId: '',
    department: '',
    password: '',
    keepMeSignedIn: false
  });
  const [fieldErrors, setFieldErrors] = useState({
    employeeId: '',
    department: '',
    password: ''
  });

  const t = formTranslations[language];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/agent/dashboard');
    }
  }, [isAuthenticated, router]);

  // Clear server errors automatically after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateForm = (): boolean => {
    const errors = { employeeId: '', department: '', password: '' };
    let isValid = true;

    if (!formData.employeeId) {
      errors.employeeId = t.employeeIdRequired;
      isValid = false;
    }

    if (!formData.department) {
      errors.department = t.departmentRequired;
      isValid = false;
    }
    
    if (!formData.password) {
      errors.password = t.passwordRequired;
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = t.passwordMinLength;
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({
        employeeId: formData.employeeId,
        department: formData.department,
        password: formData.password,
        rememberMe: formData.keepMeSignedIn // Assuming the auth hook uses 'rememberMe'
      });

      if (result.success) {
        // Success - navigation will be handled by the useEffect hook
        console.log('Agent login successful');
      }
      // Error from the hook will be caught and displayed automatically
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors when user starts typing
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error from the server
    if (error) {
      clearError();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {error && (
          <div className="animate-fade-in-up bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600 dark:text-red-400">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Employee ID Field */}
        <div className="space-y-2">
          <AgentInputField
            id="agent-employee-id"
            label={t.employeeId}
            type="text"
            placeholder={t.employeeIdPlaceholder}
            value={formData.employeeId}
            onChange={(value) => handleInputChange('employeeId', value)}
            error={fieldErrors.employeeId}
            helpText={t.employeeIdHelp}
            required
          />
        </div>
        
        {/* Department Field */}
        <div className="space-y-2">
            <label htmlFor="agent-department" className="text-sm font-medium text-foreground">{t.department}</label>
            <select
                id="agent-department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                required
                className={`w-full px-4 py-2 bg-background border rounded-lg transition-colors ${fieldErrors.department ? 'border-red-500' : 'border-border focus:border-primary'}`}
            >
                {Object.entries(t.departments).map(([value, label]) => (
                    <option key={value} value={value}>{label as string}</option>
                ))}
            </select>
            {fieldErrors.department && <p className="text-sm text-red-500">{fieldErrors.department}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <AgentInputField
            id="agent-password"
            label={t.password}
            type="password"
            placeholder={t.passwordPlaceholder}
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            error={fieldErrors.password}
            helpText={t.passwordHelp}
            required
          />
        </div>

        {/* Keep Me Signed In */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                id="agent-keep-signed-in"
                checked={formData.keepMeSignedIn}
                onChange={(e) => handleInputChange('keepMeSignedIn', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                formData.keepMeSignedIn
                  ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] border-[#FFC72C]'
                  : 'border-border hover:border-[#FFC72C]/50'
              }`}>
                {formData.keepMeSignedIn && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute top-0.5 left-0.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {t.keepMeSignedIn}
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FFB000] hover:to-[#E64100] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{t.authenticating}</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6"/>
                <path d="M10 14 21 3"/>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              </svg>
              <span>{t.accessAgentPortal}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}