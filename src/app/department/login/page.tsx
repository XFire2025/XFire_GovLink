// src/app/department/login/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LotusIcon } from '@/components/Icons/LotusIcon';
import DepartmentLoginForm from '@/components/department/auth/DepartmentLoginForm';
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';

// Background component specific to the Department portal aesthetic
const DepartmentBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95">
      <div 
        className="absolute inset-0 opacity-75 dark:opacity-20 bg-center bg-no-repeat bg-cover transition-opacity duration-1000"
        style={{
          backgroundImage: 'url("/Admin.png")', // Re-using admin background for consistency
          backgroundPosition: 'center 20%',
          filter: 'saturate(1.2) brightness(1.1)',
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 dark:from-background/40 dark:via-transparent dark:to-background/60"></div>
    </div>
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#008060]/8 dark:bg-[#008060]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FF5722]/8 dark:bg-[#FF5722]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
    </div>
  </div>
);

export default function DepartmentLoginPage() {
  const { t } = useTranslation('department');

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden theme-transition-slow">
      <DepartmentBackground />

      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/98 dark:bg-card backdrop-blur-md border-b border-border/30 dark:border-border/50 shadow-sm dark:shadow-lg">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#008060]/10 to-[#FF5722]/10 rounded-xl p-0.5 flex items-center justify-center border border-[#008060]/20 relative overflow-visible backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              <LotusIcon className="w-11 h-11 absolute transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#008060] to-[#FF5722] bg-clip-text text-transparent leading-none">GovLink</span>
              <span className="text-xs text-muted-foreground/70 font-medium leading-none">{t('login.page_title')}</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors duration-300 hover:scale-105 font-medium">
              {t('login.back_to_home')}
            </Link>
            <div className="w-px h-6 bg-border/50"></div>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 pt-20 sm:pt-24 md:pt-28 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 sm:mb-6 modern-card">
              <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FF5722] rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-foreground">{t('login.header')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
              <span className="text-foreground">{t('login.title')}</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              {t('login.subtitle')}
            </p>
          </div>

          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 hover:border-[#008060]/70 hover:shadow-2xl transition-all duration-500 animate-fade-in-up modern-card p-6 sm:p-8 shadow-glow" style={{ animationDelay: '0.2s' }}>
            <DepartmentLoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}