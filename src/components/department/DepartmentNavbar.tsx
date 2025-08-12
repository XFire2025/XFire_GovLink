// src/components/department/DepartmentNavbar.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';

export default function DepartmentNavbar() {
  const router = useRouter();
  const { t } = useTranslation('department');
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-[100] bg-gradient-to-b from-card/95 via-card/90 to-card/80 dark:from-card/98 dark:via-card/95 dark:to-card/90 backdrop-blur-md border-b border-border/50 shadow-sm modern-card overflow-visible">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-25 dark:opacity-15 bg-center bg-no-repeat bg-cover transition-opacity duration-1000" style={{ backgroundImage: 'url("/2.png")', filter: 'saturate(1.1) brightness(1.05)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/30 dark:from-background/70 dark:via-background/50 dark:to-background/80"></div>
      </div>
      
      <div className="z-10 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <div>
              <h1 className="text-lg lg:text-xl font-bold">
                <span className="text-foreground">{t('navbar.title')}</span>{' '}
                <span className="bg-gradient-to-r from-[#008060] to-[#FF5722] bg-clip-text text-transparent">{t('navbar.portal')}</span>
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block font-medium">{t('navbar.description')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 p-2.5 hover:bg-card/60 rounded-xl transition-all duration-300 hover:shadow-md modern-card hover:scale-105">
                <div className="w-8 h-8 bg-gradient-to-r from-[#008060]/20 to-[#FF5722]/20 rounded-full flex items-center justify-center border border-[#008060]/30 shadow-md">
                  <span className="text-sm font-medium text-[#008060]">D</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hover:text-[#008060] transition-colors duration-300" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card/95 dark:bg-card/98 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl z-[110] modern-card">
                  <div className="p-4 border-b border-border/30 bg-gradient-to-r from-[#008060]/5 to-[#FF5722]/5">
                    <h3 className="font-medium bg-gradient-to-r from-[#008060] to-[#FF5722] bg-clip-text text-transparent">{t('navbar.profile_label')}</h3>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-card/60 hover:shadow-sm rounded-xl transition-all modern-card">
                      <User className="w-4 h-4 text-[#008060]" />
                      <span className="text-foreground">{t('navbar.profile_settings')}</span>
                    </button>
                    <hr className="my-2 border-border/30" />
                    <button onClick={() => router.push('/department/login')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#FF5722] hover:bg-[#FF5722]/10 hover:shadow-sm rounded-xl transition-all modern-card">
                      <LogOut className="w-4 h-4" />
                      {t('navbar.sign_out')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showProfileMenu && <div className="fixed inset-0 z-[105]" onClick={() => setShowProfileMenu(false)} />}
    </header>
  );
}