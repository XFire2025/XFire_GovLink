// src/components/agent/auth/AgentInputField.tsx
"use client";
import React, { useState } from 'react';

interface AgentInputFieldProps {
  id: string;
  label: string;
  type: 'text' | 'password' | 'email';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  icon?: React.ReactNode;
  helpText?: string;
  error?: string;
}

const AgentInputField: React.FC<AgentInputFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  icon,
  helpText,
  error
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasValue = value.length > 0;

  return (
    <div className="mb-4 sm:mb-6 animate-fade-in-up">
      {/* Label */}
      <label 
        htmlFor={id}
        className="block text-sm font-semibold text-foreground mb-2"
      >
        {label}
        {required && <span className="text-[#FF5722] ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        <div 
          className={`
            relative glass-morphism rounded-xl border transition-all duration-300
            ${isFocused 
              ? 'border-[#FFC72C] shadow-glow scale-[1.02]' 
              : error 
                ? 'border-[#FF5722]' 
                : 'border-border hover:border-[#FFC72C]/50'
            }
            ${hasValue ? 'border-[#FFC72C]/70' : ''}
          `}
        >
          {/* Icon */}
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            id={id}
            type={inputType}
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            required={required}
            className={`
              w-full bg-transparent text-foreground placeholder-muted-foreground 
              p-4 sm:p-5 rounded-xl focus:outline-none transition-all duration-300
              ${icon ? 'pl-12 sm:pl-14' : ''}
              ${type === 'password' ? 'pr-12 sm:pr-14' : ''}
              text-base leading-relaxed
            `}
            autoComplete={type === 'password' ? 'current-password' : 'off'}
          />

          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#FFC72C] transition-colors duration-300 p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                  <path d="m21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="m3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  <path d="m21 21-6-6m0 0L9 9m6 6 6-6M9 9 3 3"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Focused Glow Effect - Same as landing page */}
        {isFocused && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFC72C]/20 to-[#FF5722]/20 blur-xl -z-10 animate-pulse"></div>
        )}
      </div>

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          {helpText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs sm:text-sm text-[#FF5722] mt-2 animate-fade-in-up flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default AgentInputField;