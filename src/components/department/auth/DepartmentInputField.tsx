// src/components/department/auth/DepartmentInputField.tsx
"use client";
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Using lucide icons for consistency

interface DepartmentInputFieldProps {
  id: string;
  label: string;
  type: 'text' | 'password' | 'email';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
}

const DepartmentInputField: React.FC<DepartmentInputFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  icon,
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
      <label htmlFor={id} className="block text-sm font-semibold text-foreground mb-2">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div className="relative">
        <div 
          className={`
            relative modern-card rounded-xl border transition-all duration-300
            ${isFocused 
              ? 'border-[#008060] shadow-glow scale-[1.02]' // Department Green for focus
              : error 
                ? 'border-destructive' 
                : 'border-border/50 hover:border-[#008060]/50' // Department Green for hover
            }
            ${hasValue && !error ? 'border-[#008060]/70' : ''}
          `}
        >
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-300">
              {icon}
            </div>
          )}
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
          {type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#008060] transition-colors duration-300 p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
        {isFocused && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#008060]/20 to-[#8D153A]/20 blur-xl -z-10 animate-pulse"></div>
        )}
      </div>
      {error && (
        <p className="text-xs sm:text-sm text-destructive mt-2 animate-fade-in-up flex items-center gap-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default DepartmentInputField;