"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as LucideIcons from 'lucide-react';

// Sri Lankan Lotus Icon (Custom) - Enhanced for Admin
const AdminLotusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 100 100" fill="none">
    <path d="M50 10C45 15 35 25 30 35C25 45 30 55 40 60C45 62 55 62 60 60C70 55 75 45 70 35C65 25 55 15 50 10Z" fill="url(#admin-lotus-gradient)"/>
    <path d="M50 15C45 20 40 30 35 40C30 50 35 60 45 65C50 67 60 67 65 65C75 60 80 50 75 40C70 30 65 20 50 15Z" fill="url(#admin-lotus-gradient-inner)"/>
    <circle cx="50" cy="45" r="8" fill="url(#admin-lotus-center)" opacity="0.8"/>
    <defs>
      <linearGradient id="admin-lotus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#FFC72C', stopOpacity: 1}} />
        <stop offset="50%" style={{stopColor: '#FF5722', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#8D153A', stopOpacity: 1}} />
      </linearGradient>
      <linearGradient id="admin-lotus-gradient-inner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#FFC72C', stopOpacity: 0.8}} />
        <stop offset="100%" style={{stopColor: '#FF5722', stopOpacity: 0.8}} />
      </linearGradient>
      <radialGradient id="admin-lotus-center" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 0.9}} />
        <stop offset="100%" style={{stopColor: '#FFC72C', stopOpacity: 0.7}} />
      </radialGradient>
    </defs>
  </svg>
);

// --- ADMIN BACKGROUND COMPONENT ---
const AdminBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Light Mode Enhanced Flag Background - Subtle for Admin */}
      <div className="absolute inset-0 opacity-[0.15] sm:opacity-[0.18] md:opacity-[0.20] dark:opacity-0">
        <Image 
          src="/flag-of-sri-lanka-1.gif" 
          alt="Sri Lankan Flag Background" 
          fill
          className="object-cover object-center animate-pulse-move scale-110 sm:scale-105 md:scale-100"
          style={{
            animationDelay: '0s',
            filter: 'contrast(1.8) brightness(0.6) saturate(1.8) sepia(0.15) hue-rotate(5deg)',
            mixBlendMode: 'multiply'
          }}
          unoptimized={true}
          priority={false}
        />
      </div>
      
      {/* Dark Mode Flag Background */}
      <div className="absolute inset-0 opacity-0 dark:opacity-[0.01] sm:dark:opacity-[0.015] md:dark:opacity-[0.02]">
        <Image 
          src="/flag-of-sri-lanka-1.gif" 
          alt="Sri Lankan Flag Background" 
          fill
          className="object-cover object-center animate-pulse-move scale-110 sm:scale-105 md:scale-100"
          style={{
            animationDelay: '0s'
          }}
          unoptimized={true}
          priority={false}
        />
      </div>

      {/* Admin-specific Gradient Overlays */}
      <div className="absolute inset-0 opacity-[0.05] sm:opacity-[0.08] md:opacity-[0.10] dark:opacity-0">
        <div className="w-full h-full bg-gradient-to-br from-[#8D153A]/20 via-transparent to-[#FFC72C]/20 animate-pulse-move"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5722]/15 via-transparent to-[#008060]/15 animate-float"></div>
      </div>

      {/* Subtle Admin Particles - Less Dense than Main Page */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#8D153A]/10 dark:bg-[#FFC72C]/5 rounded-full blur-xl animate-drift"></div>
      <div className="absolute top-40 right-16 w-16 h-16 bg-[#FF5722]/15 dark:bg-[#FF5722]/5 rounded-full blur-lg animate-drift-reverse"></div>
      <div className="absolute bottom-32 left-20 w-20 h-20 bg-[#008060]/12 dark:bg-[#008060]/6 rounded-full blur-lg animate-orbit"></div>
      <div className="absolute bottom-20 right-10 w-18 h-18 bg-[#FFC72C]/18 dark:bg-[#FFC72C]/8 rounded-full blur-md animate-float"></div>
      
      {/* Center Particles for Focus */}
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-[#8D153A]/8 dark:bg-[#8D153A]/4 rounded-full blur-2xl animate-pulse-move"></div>
      <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-[#FFC72C]/10 dark:bg-[#FFC72C]/5 rounded-full blur-xl animate-spiral"></div>
    </div>
  );
};

// --- ADMIN LOGIN PAGE COMPONENT ---
export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string}>({});
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: {username?: string; password?: string} = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes - replace with actual authentication
      if (formData.username === 'admin' && formData.password === 'admin123') {
        router.push('/admin');
      } else {
        setErrors({ 
          password: 'Invalid username or password' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        password: 'Login failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden theme-transition-slow">
      {/* Admin Background */}
      <AdminBackground />
      
      {/* Unified Gradient Mesh Overlay */}
      <div className="fixed inset-0 gradient-mesh opacity-20 pointer-events-none z-[5]"></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 group"
            >
              <LucideIcons.ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>

          {/* Login Card */}
          <div className="glass-morphism rounded-3xl p-6 sm:p-8 shadow-glow">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <AdminLotusIcon />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Admin Portal
              </h1>
              
              <p className="text-muted-foreground">
                Secure access to government administration
              </p>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gradient-to-r from-[#008060]/10 to-[#FFC72C]/10 border border-[#008060]/20 rounded-xl">
              <LucideIcons.Shield className="text-[#008060] w-5 h-5" />
              <span className="text-sm font-medium text-[#008060] dark:text-[#FFC72C]">
                Encrypted & Secure Connection
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LucideIcons.User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-card/50 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.username ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LucideIcons.Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-card/50 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.password ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-foreground transition-colors duration-300"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <LucideIcons.EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <LucideIcons.Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#8D153A] via-[#FF5722] to-[#FFC72C] text-white font-semibold py-3 px-6 rounded-xl shadow-glow transition-all duration-500 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In to Admin Portal'
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Protected by Government of Sri Lanka Security Protocols
              </p>
            </div>
          </div>

          {/* Additional Security Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              This is a secure government portal. All activities are monitored and logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
