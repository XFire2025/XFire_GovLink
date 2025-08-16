"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAdminAuth } from '@/lib/auth/AdminAuthContext';
import * as LucideIcons from 'lucide-react';
import { LotusIcon } from '@/components/Icons/LotusIcon';

// Sri Lankan Background Component - Same as Agent Login
const AdminBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main background image */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95">
        <div 
          className="absolute inset-0 opacity-75 dark:opacity-20 bg-center bg-no-repeat bg-cover transition-opacity duration-1000"
          style={{
            backgroundImage: 'url("/Admin.png")',
            backgroundPosition: 'center 20%',
            filter: 'saturate(1.2) brightness(1.1)',
          }}
        ></div>
        {/* Overlay gradients for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 dark:from-background/40 dark:via-transparent dark:to-background/60"></div>
      </div>
      
      {/* Enhanced admin-inspired accent patterns */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#8D153A]/8 dark:bg-[#8D153A]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#FF5722]/8 dark:bg-[#FF5722]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFC72C]/6 dark:bg-[#FFC72C]/3 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        {/* Additional subtle accents */}
        <div className="absolute top-3/4 right-1/3 w-48 h-48 bg-[#008060]/6 dark:bg-[#008060]/3 rounded-full blur-2xl animate-pulse" style={{animationDuration: '14s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/6 left-1/5 w-56 h-56 bg-[#8D153A]/5 dark:bg-[#8D153A]/2 rounded-full blur-3xl animate-pulse" style={{animationDuration: '16s', animationDelay: '6s'}}></div>
      </div>
    </div>
  );
};

// --- ADMIN LOGIN PAGE COMPONENT ---
export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const router = useRouter();
  const { login, isAuthenticated, admin } = useAdminAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && admin) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, admin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: {email?: string; password?: string} = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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

    // Call admin login
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        setErrors({ 
          password: result.message || 'Login failed. Please check your credentials.' 
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

      {/* Header - Fixed positioning */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/98 dark:bg-card backdrop-blur-md border-b border-border/30 dark:border-border/50 shadow-sm dark:shadow-lg">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#8D153A]/10 to-[#FF5722]/10 rounded-xl p-0.5 flex items-center justify-center border border-[#8D153A]/20 relative overflow-visible backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              <LotusIcon className="w-11 h-11 absolute transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent leading-none">GovLink</span>
              <span className="text-xs text-muted-foreground/70 font-medium leading-none">Admin Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/" 
              className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors duration-300 hover:scale-105 font-medium"
            >
              ← Back to Home
            </Link>
            
            <div className="w-px h-6 bg-border/50"></div>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 pt-20 sm:pt-24 md:pt-28 relative z-10">
        <div className="w-full max-w-md">
          {/* Title Section - Same as Agent Login */}
          <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 sm:mb-6 modern-card">
              <div className="w-2 h-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-foreground">Government Access</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
              <span className="text-foreground">Admin</span>{' '}
              <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">Portal</span>
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Secure access for authorized government administrators
            </p>
          </div>

          {/* Form Container - Same as Agent Login cards */}
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 hover:border-[#8D153A]/70 hover:shadow-2xl transition-all duration-500 animate-fade-in-up modern-card p-6 sm:p-8 shadow-glow" style={{animationDelay: '0.2s'}}>
            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gradient-to-r from-[#8D153A]/10 to-[#FF5722]/10 border border-[#8D153A]/20 rounded-xl">
              <LucideIcons.Shield className="text-[#8D153A] w-5 h-5" />
              <span className="text-sm font-medium text-[#8D153A] dark:text-[#FF5722]">
                Encrypted & Secure Connection
              </span>
            </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <LucideIcons.Mail className="h-5 w-5 text-muted-foreground/80 hover:text-[#8D153A] transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-card/60 dark:bg-card/40 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card ${
                    errors.email ? 'border-destructive' : 'border-border/50'
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <LucideIcons.Lock className="h-5 w-5 text-muted-foreground/80 hover:text-[#8D153A] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 bg-card/60 dark:bg-card/40 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card ${
                    errors.password ? 'border-destructive' : 'border-border/50'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-[#8D153A] transition-colors duration-300 z-10"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <LucideIcons.EyeOff className="h-5 w-5 text-muted-foreground/80 hover:text-[#8D153A] transition-colors" />
                  ) : (
                    <LucideIcons.Eye className="h-5 w-5 text-muted-foreground/80 hover:text-[#8D153A] transition-colors" />
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
                className="w-full bg-gradient-to-r from-[#8D153A] via-[#FF5722] to-[#FFC72C] hover:from-[#FF5722] hover:via-[#8D153A] hover:to-[#FFC72C] text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-2 border-[#8D153A]/20 hover:border-[#8D153A]/40"
                style={{
                  boxShadow: '0 4px 14px 0 rgba(141, 21, 58, 0.3), 0 8px 32px rgba(255, 87, 34, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
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

          {/* Additional Security Notice - Outside the card */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/30">
              This is a secure government portal. All activities are monitored and logged.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Section - Same as Agent Login */}
      <footer className="relative z-10 py-8 border-t border-border/30 bg-background/95 dark:bg-card/95 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs text-muted-foreground">
                © 2025 Government of Sri Lanka • Authorized Personnel Only
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Need technical assistance?</span>
              <Link 
                href="/contact" 
                className="text-xs text-[#8D153A] hover:text-[#8D153A]/80 transition-colors font-medium"
              >
                Contact IT Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
