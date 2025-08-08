// components/Header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

// Types for translations
type Language = 'en' | 'si' | 'ta';

interface HeaderTranslations {
  services: string;
  about: string;
  contact: string;
  startChat: string;
}

// Translation data for Header
const headerTranslations: Record<Language, HeaderTranslations> = {
  en: {
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    startChat: 'Start Chat'
  },
  si: {
    services: 'සේවා',
    about: 'අප ගැන',
    contact: 'සම්බන්ධවීම',
    startChat: 'චැට් ආරම්භ කරන්න'
  },
  ta: {
    services: 'சேவைகள்',
    about: 'எங்களைப் பற்றி',
    contact: 'தொடர்பு',
    startChat: 'அரட்டையைத் தொடங்கு'
  }
};

// Language options
const languageOptions = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' }
];

// Beautiful Lotus Icon for Navbar
const NavbarLotusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 100 100">
    {/* Outer layer petals */}
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(72 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(144 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(216 50 50)"/>
    <path d="M50,20 Q40,35 45,50 Q50,45 55,50 Q60,35 50,20 Z" fill="#8D153A" opacity="0.8" transform="rotate(288 50 50)"/>

    {/* Middle layer petals */}
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(36 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(108 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(180 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(252 50 50)"/>
    <path d="M50,25 Q42,37 46,50 Q50,47 54,50 Q58,37 50,25 Z" fill="#FF5722" opacity="0.9" transform="rotate(324 50 50)"/>

    {/* Inner petals */}
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C"/>
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C" transform="rotate(90 50 50)"/>
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C" transform="rotate(180 50 50)"/>
    <path d="M50,32 Q45,40 47,50 Q50,48 53,50 Q55,40 50,32 Z" fill="#FFC72C" transform="rotate(270 50 50)"/>

    {/* Center */}
    <circle cx="50" cy="50" r="6" fill="#FFC72C"/>
    <circle cx="50" cy="50" r="3" fill="#FF8F00"/>
  </svg>
);

// Language Selector Component for Header
const LanguageSelector = ({ 
  language, 
  onLanguageChange 
}: { 
  language: Language; 
  onLanguageChange: (lang: Language) => void; 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    onLanguageChange(newLanguage);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 hover:border-[#FFC72C]/60 text-sm font-medium text-foreground hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 shadow-md hover:shadow-lg modern-card"
        aria-label={`Current language: ${languageOptions.find(lang => lang.code === language)?.nativeLabel}`}
      >
        <span className="text-xs sm:text-sm">{languageOptions.find(lang => lang.code === language)?.nativeLabel}</span>
        <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 glass-morphism border border-border/50 rounded-xl shadow-glow overflow-hidden animate-fade-in-up z-50">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as Language)}
                className={`w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-card/30 ${
                  language === lang.code 
                    ? 'bg-[#FFC72C]/10 text-[#FFC72C] border-l-2 border-l-[#FFC72C]' 
                    : 'text-foreground'
                }`}
              >
                <div>
                  <div className="font-medium">{lang.nativeLabel}</div>
                  <div className="text-xs text-muted-foreground">{lang.label}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Navigation handled by scroll functions

interface HeaderProps {
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  language = 'en', 
  onLanguageChange 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = headerTranslations[language];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/98 dark:bg-card backdrop-blur-md border-b border-border/30 dark:border-border/50 shadow-sm dark:shadow-lg">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#FFC72C]/10 to-[#FF5722]/10 rounded-xl p-0.5 flex items-center justify-center border border-[#FFC72C]/20 relative overflow-visible backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              <NavbarLotusIcon className="w-11 h-11 absolute transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-gradient leading-none">GovLink</span>
              <span className="text-xs text-muted-foreground/70 font-medium leading-none">Sri Lanka</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => smoothScrollTo('services')} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-300 relative group">
              <span className="relative z-10">{t.services}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C]/0 to-[#FF5722]/0 group-hover:from-[#FFC72C]/5 group-hover:to-[#FF5722]/5 rounded-lg transition-all duration-300"></div>
            </button>
            <button onClick={() => smoothScrollTo('about')} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-300 relative group">
              <span className="relative z-10">{t.about}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C]/0 to-[#FF5722]/0 group-hover:from-[#FFC72C]/5 group-hover:to-[#FF5722]/5 rounded-lg transition-all duration-300"></div>
            </button>
            <button onClick={() => smoothScrollTo('contact')} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-300 relative group">
              <span className="relative z-10">{t.contact}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C]/0 to-[#FF5722]/0 group-hover:from-[#FFC72C]/5 group-hover:to-[#FF5722]/5 rounded-lg transition-all duration-300"></div>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/chat" className="bg-gradient-to-r from-[#FFC72C] via-[#FF5722] to-[#8D153A] hover:from-[#FF5722] hover:via-[#8D153A] hover:to-[#FFC72C] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden group">
              <span className="relative z-10">{t.startChat}</span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </Link>
            <div className="w-px h-6 bg-border/50"></div>
            {/* Language Selector */}
            {onLanguageChange && (
              <>
                <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
                <div className="w-px h-6 bg-border/50"></div>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Language Selector */}
            {onLanguageChange && (
              <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
            )}
            <ThemeToggle />
            <button onClick={toggleMobileMenu} className="p-2.5 hover:bg-accent/70 rounded-xl transition-all duration-300 hover:scale-105 border border-border/30">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </nav>
      </header>
      
      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="fixed inset-x-0 top-0 z-50 origin-top bg-background/98 dark:bg-card backdrop-blur-md p-6 md:hidden border-b border-border/30 dark:border-border/50 shadow-lg dark:shadow-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-9 h-9 bg-gradient-to-br from-[#FFC72C]/10 to-[#FF5722]/10 rounded-xl p-0.5 flex items-center justify-center border border-[#FFC72C]/20 relative overflow-visible backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                  <NavbarLotusIcon className="w-11 h-11 absolute transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gradient leading-none">GovLink</span>
                  <span className="text-xs text-muted-foreground/70 font-medium leading-none">Sri Lanka</span>
                </div>
              </Link>
              <button onClick={toggleMobileMenu} className="p-2.5 hover:bg-accent/70 rounded-xl transition-all duration-300 hover:scale-105 border border-border/30">
                 <X className="h-5 w-5" />
                 <span className="sr-only">Close menu</span>
              </button>
            </div>
            <div className="space-y-3">
              <button onClick={() => smoothScrollTo('services')} className="block w-full text-left px-5 py-3.5 text-base font-medium text-foreground hover:bg-accent/70 rounded-xl transition-all duration-300 hover:translate-x-1 border border-transparent hover:border-border/30">
                {t.services}
              </button>
              <button onClick={() => smoothScrollTo('about')} className="block w-full text-left px-5 py-3.5 text-base font-medium text-foreground hover:bg-accent/70 rounded-xl transition-all duration-300 hover:translate-x-1 border border-transparent hover:border-border/30">
                {t.about}
              </button>
              <button onClick={() => smoothScrollTo('contact')} className="block w-full text-left px-5 py-3.5 text-base font-medium text-foreground hover:bg-accent/70 rounded-xl transition-all duration-300 hover:translate-x-1 border border-transparent hover:border-border/30">
                {t.contact}
              </button>
              <div className="pt-6 border-t border-border/50">
                 <Link href="/chat" className="block w-full text-center bg-gradient-to-r from-[#FFC72C] via-[#FF5722] to-[#8D153A] hover:from-[#FF5722] hover:via-[#8D153A] hover:to-[#FFC72C] text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden group">
                    <span className="relative z-10">{t.startChat}</span>
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};