// src/components/department/auth/DepartmentLoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Shield } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';
import DepartmentInputField from './DepartmentInputField'; // Correctly import the custom component

// Type definitions for our form state
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function DepartmentLoginForm() {
  const router = useRouter();
  const { t } = useTranslation('department');
  
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field] || errors.general) {
      setErrors(prev => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Department email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/department/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store department info and tokens in localStorage for client-side access
        localStorage.setItem('department', JSON.stringify(result.department));
        
        // Store authentication tokens
        if (result.tokens) {
          localStorage.setItem('department_access_token', result.tokens.accessToken);
          localStorage.setItem('department_refresh_token', result.tokens.refreshToken);
        }
        
        // Redirect to dashboard
        router.push('/department/dashboard');
      } else {
        setErrors({ 
          general: result.message || 'Invalid credentials. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: 'Connection error. Please check your internet connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gradient-to-r from-[#008060]/10 to-[#FF5722]/10 border border-[#008060]/20 rounded-xl">
        <Shield className="text-[#008060] w-5 h-5" />
        <span className="text-sm font-medium text-[#008060] dark:text-[#FFC72C]">
          {t('login.form_title')}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <p className="text-sm text-center font-medium text-destructive">{errors.general}</p>
        )}
        
        <DepartmentInputField
          id="email"
          label={t('login.email_label')}
          type="email"
          placeholder={t('login.email_placeholder')}
          value={formData.email}
          onChange={(value) => updateFormData('email', value)}
          icon={<Mail className="h-5 w-5" />}
          error={errors.email}
          required
        />

        <DepartmentInputField
          id="password"
          label={t('login.password_label')}
          type="password"
          placeholder={t('login.password_placeholder')}
          value={formData.password}
          onChange={(value) => updateFormData('password', value)}
          icon={<Lock className="h-5 w-5" />}
          error={errors.password}
          required
        />
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 flex items-center justify-center bg-gradient-to-r from-[#008060] via-[#8D153A] to-[#FF5722] hover:from-[#8D153A] hover:via-[#008060] hover:to-[#FFC72C] text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            t('login.submit_button')
          )}
        </button>
      </form>
    </div>
  );
}