// src/components/agent/profile/PasswordChangeForm.tsx
"use client";
import React, { useState } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordTranslation {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordRequirements: string;
  requirementLength: string;
  requirementUppercase: string;
  requirementLowercase: string;
  requirementNumber: string;
  requirementSpecial: string;
  changePassword: string;
  changing: string;
  showPassword: string;
  hidePassword: string;
  passwordStrength: string;
  strengthWeak: string;
  strengthMedium: string;
  strengthStrong: string;
  strengthVeryStrong: string;
  lastChanged: string;
  securityTips: string;
  tip1: string;
  tip2: string;
  tip3: string;
  errorCurrentPassword: string;
  errorPasswordMismatch: string;
  errorPasswordRequirements: string;
  successMessage: string;
}

// Password form translations
const passwordTranslations: Record<Language, PasswordTranslation> = {
  en: {
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    passwordRequirements: 'Password Requirements',
    requirementLength: 'At least 8 characters',
    requirementUppercase: 'At least one uppercase letter',
    requirementLowercase: 'At least one lowercase letter',
    requirementNumber: 'At least one number',
    requirementSpecial: 'At least one special character',
    changePassword: 'Change Password',
    changing: 'Changing...',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    passwordStrength: 'Password Strength',
    strengthWeak: 'Weak',
    strengthMedium: 'Medium',
    strengthStrong: 'Strong',
    strengthVeryStrong: 'Very Strong',
    lastChanged: 'Last changed 3 months ago',
    securityTips: 'Security Tips',
    tip1: 'Use a unique password for your government account',
    tip2: 'Enable two-factor authentication when available',
    tip3: 'Change your password regularly (every 3-6 months)',
    errorCurrentPassword: 'Current password is incorrect',
    errorPasswordMismatch: 'Passwords do not match',
    errorPasswordRequirements: 'Password does not meet requirements',
    successMessage: 'Password changed successfully!'
  },
  si: {
    currentPassword: 'වර්තමාන මුරපදය',
    newPassword: 'නව මුරපදය',
    confirmPassword: 'නව මුරපදය තහවුරු කරන්න',
    passwordRequirements: 'මුරපද අවශ්‍යතා',
    requirementLength: 'අවම වශයෙන් අක්ෂර 8ක්',
    requirementUppercase: 'අවම වශයෙන් එක් ලොකු අකුරක්',
    requirementLowercase: 'අවම වශයෙන් එක් කුඩා අකුරක්',
    requirementNumber: 'අවම වශයෙන් එක් අංකයක්',
    requirementSpecial: 'අවම වශයෙන් එක් විශේෂ අක්ෂරයක්',
    changePassword: 'මුරපදය වෙනස් කරන්න',
    changing: 'වෙනස් කරමින්...',
    showPassword: 'මුරපදය පෙන්වන්න',
    hidePassword: 'මුරපදය සඟවන්න',
    passwordStrength: 'මුරපද ශක්තිය',
    strengthWeak: 'දුර්වල',
    strengthMedium: 'මධ්‍යම',
    strengthStrong: 'ශක්තිමත්',
    strengthVeryStrong: 'ඉතා ශක්තිමත්',
    lastChanged: 'මාස 3කට පෙර වෙනස් කරන ලදී',
    securityTips: 'ආරක්ෂක උපදෙස්',
    tip1: 'ඔබගේ රාජ්‍ය ගිණුම සඳහා අද්විතීය මුරපදයක් භාවිතා කරන්න',
    tip2: 'ලබා ගත හැකි විට ද්විත්ව සත්‍යාපන සක්‍රීය කරන්න',
    tip3: 'ඔබගේ මුරපදය නිතිපතා වෙනස් කරන්න (මාස 3-6 කට වරක්)',
    errorCurrentPassword: 'වර්තමාන මුරපදය වැරදිය',
    errorPasswordMismatch: 'මුරපද නොගැලපේ',
    errorPasswordRequirements: 'මුරපදය අවශ්‍යතා සපුරාලන්නේ නැත',
    successMessage: 'මුරපදය සාර්ථකව වෙනස් කරන ලදී!'
  },
  ta: {
    currentPassword: 'தற்போதைய கடவுச்சொல்',
    newPassword: 'புதிய கடவுச்சொல்',
    confirmPassword: 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    passwordRequirements: 'கடவுச்சொல் தேவைகள்',
    requirementLength: 'குறைந்தது 8 எழுத்துகள்',
    requirementUppercase: 'குறைந்தது ஒரு பெரிய எழுத்து',
    requirementLowercase: 'குறைந்தது ஒரு சிறிய எழுத்து',
    requirementNumber: 'குறைந்தது ஒரு எண்',
    requirementSpecial: 'குறைந்தது ஒரு சிறப்பு எழுத்து',
    changePassword: 'கடவுச்சொல்லை மாற்றவும்',
    changing: 'மாற்றுகிறது...',
    showPassword: 'கடவுச்சொல்லைக் காட்டு',
    hidePassword: 'கடவுச்சொல்லை மறை',
    passwordStrength: 'கடவுச்சொல் வலிமை',
    strengthWeak: 'பலவீனமான',
    strengthMedium: 'நடுத்தர',
    strengthStrong: 'வலுவான',
    strengthVeryStrong: 'மிக வலுவான',
    lastChanged: '3 மாதங்களுக்கு முன் மாற்றப்பட்டது',
    securityTips: 'பாதுகாப்பு குறிப்புகள்',
    tip1: 'உங்கள் அரசாங்க கணக்குக்கு தனித்துவமான கடவுச்சொல்லைப் பயன்படுத்தவும்',
    tip2: 'கிடைக்கும் போது இரு-காரணி அங்கீகாரத்தை இயக்கவும்',
    tip3: 'உங்கள் கடவுச்சொல்லை வழக்கமாக மாற்றவும் (3-6 மாதங்களுக்கு ஒருமுறை)',
    errorCurrentPassword: 'தற்போதைய கடவுச்சொல் தவறானது',
    errorPasswordMismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
    errorPasswordRequirements: 'கடவுச்சொல் தேவைகளை பூர்த்தி செய்யவில்லை',
    successMessage: 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!'
  }
};

interface PasswordChangeFormProps {
  language?: Language;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ language = 'en', onSave, isLoading }) => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState<Partial<PasswordData>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const t = passwordTranslations[language];

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const getStrengthLabel = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1: return t.strengthWeak;
      case 2:
      case 3: return t.strengthMedium;
      case 4: return t.strengthStrong;
      case 5: return t.strengthVeryStrong;
      default: return t.strengthWeak;
    }
  };

  const getStrengthColor = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1: return '#FF5722';
      case 2:
      case 3: return '#FFC72C';
      case 4: return '#008060';
      case 5: return '#8D153A';
      default: return '#FF5722';
    }
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^A-Za-z0-9]/.test(password);
  };

  const handleInputChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<PasswordData> = {};
    
    // Validate current password (mock validation)
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = t.errorCurrentPassword;
    }
    
    // Validate new password requirements
    if (!validatePassword(passwordData.newPassword)) {
      newErrors.newPassword = t.errorPasswordRequirements;
    }
    
    // Validate password confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = t.errorPasswordMismatch;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    await onSave();
    setShowSuccess(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const passwordStrength = calculatePasswordStrength(passwordData.newPassword);
  const inputStyles = "w-full bg-card/30 border border-border/50 rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300";
  const labelStyles = "block text-sm font-medium text-foreground mb-2";

  const requirements = [
    { key: 'length', label: t.requirementLength, test: (pwd: string) => pwd.length >= 8 },
    { key: 'uppercase', label: t.requirementUppercase, test: (pwd: string) => /[A-Z]/.test(pwd) },
    { key: 'lowercase', label: t.requirementLowercase, test: (pwd: string) => /[a-z]/.test(pwd) },
    { key: 'number', label: t.requirementNumber, test: (pwd: string) => /[0-9]/.test(pwd) },
    { key: 'special', label: t.requirementSpecial, test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd) }
  ];

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-[#008060]/20 border border-[#008060]/30 text-[#008060] p-4 rounded-xl animate-fade-in-up flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-medium">{t.successMessage}</span>
        </div>
      )}

      {/* Current Password Info */}
      <div className="bg-card/30 border border-border/50 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[#008060]/10 to-[#008060]/5 rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="16" r="1" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-foreground">Password Security</div>
            <div className="text-sm text-muted-foreground">{t.lastChanged}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="w-3 h-3 bg-[#008060] rounded-full animate-pulse"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className={labelStyles}>{t.currentPassword}</label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className={`${inputStyles} ${errors.currentPassword ? 'border-[#FF5722]' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title={showPasswords.current ? t.hidePassword : t.showPassword}
            >
              {showPasswords.current ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-[#FF5722] text-sm mt-2">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className={labelStyles}>{t.newPassword}</label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className={`${inputStyles} ${errors.newPassword ? 'border-[#FF5722]' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title={showPasswords.new ? t.hidePassword : t.showPassword}
            >
              {showPasswords.new ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-[#FF5722] text-sm mt-2">{errors.newPassword}</p>
          )}
          
          {/* Password Strength Indicator */}
          {passwordData.newPassword && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{t.passwordStrength}</span>
                <span className="text-sm font-medium" style={{color: getStrengthColor(passwordStrength)}}>
                  {getStrengthLabel(passwordStrength)}
                </span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(passwordStrength / 5) * 100}%`,
                    backgroundColor: getStrengthColor(passwordStrength)
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className={labelStyles}>{t.confirmPassword}</label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`${inputStyles} ${errors.confirmPassword ? 'border-[#FF5722]' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title={showPasswords.confirm ? t.hidePassword : t.showPassword}
            >
              {showPasswords.confirm ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[#FF5722] text-sm mt-2">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-card/30 border border-border/50 rounded-xl p-4">
          <h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            {t.passwordRequirements}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {requirements.map(({ key, label, test }) => {
              const isValid = test(passwordData.newPassword);
              return (
                <div key={key} className={`flex items-center gap-2 text-sm ${
                  passwordData.newPassword ? (isValid ? 'text-[#008060]' : 'text-[#FF5722]') : 'text-muted-foreground'
                }`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    passwordData.newPassword ? (isValid ? 'bg-[#008060]' : 'bg-[#FF5722]') : 'bg-muted/50'
                  }`}>
                    {passwordData.newPassword && (
                      isValid ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      )
                    )}
                  </div>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#FF5722] to-[#8D153A] text-white rounded-xl hover:from-[#8D153A] hover:to-[#FF5722] transition-all duration-300 font-semibold text-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {t.changing}
            </div>
          ) : (
            t.changePassword
          )}
        </button>
      </form>

      {/* Security Tips */}
      <div className="bg-gradient-to-r from-[#008060]/10 to-[#FFC72C]/10 border border-[#008060]/30 rounded-xl p-6">
        <h5 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <circle cx="12" cy="16" r="1"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          {t.securityTips}
        </h5>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-[#008060] rounded-full mt-2"></div>
            {t.tip1}
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-[#008060] rounded-full mt-2"></div>
            {t.tip2}
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-[#008060] rounded-full mt-2"></div>
            {t.tip3}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordChangeForm;