// components/Header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CompactLanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/hooks/useTranslation";

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

// Scroll functions
const smoothScrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation('home');

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <NavbarLotusIcon className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-500 group-hover:rotate-12" />
              <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#FFC72C]/20 to-[#FF5722]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                GovLink
              </span>
              <span className="text-xs text-muted-foreground -mt-1 hidden sm:block">
                Government Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => smoothScrollTo('services')} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-300 relative group">
              <span className="relative z-10">{t('navigation.services')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C]/0 to-[#FF5722]/0 group-hover:from-[#FFC72C]/5 group-hover:to-[#FF5722]/5 rounded-lg transition-all duration-300"></div>
            </button>
            <button onClick={() => smoothScrollTo('about')} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-300 relative group">
              <span className="relative z-10">{t('navigation.about')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C]/0 to-[#FF5722]/0 group-hover:from-[#FFC72C]/5 group-hover:to-[#FF5722]/5 rounded-lg transition-all duration-300"></div>
            </button>
            <button onClick={() => smoothScrollTo('contact')} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-300 relative group">
              <span className="relative z-10">{t('navigation.contact')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C]/0 to-[#FF5722]/0 group-hover:from-[#FFC72C]/5 group-hover:to-[#FF5722]/5 rounded-lg transition-all duration-300"></div>
            </button>
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/User/Chat/Bot" className="px-6 py-2.5 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white rounded-xl font-medium hover:from-[#7A1235] hover:to-[#E64A19] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 relative group overflow-hidden">
              <span className="relative z-10">{t('navigation.contact')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            <div className="w-px h-6 bg-border/50"></div>
            {/* Language Selector */}
            <CompactLanguageSwitcher className="text-xs sm:text-sm" />
            <div className="w-px h-6 bg-border/50"></div>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Language Selector */}
            <CompactLanguageSwitcher className="text-xs" />
            <ThemeToggle />
            <button onClick={toggleMobileMenu} className="p-2.5 hover:bg-accent/70 rounded-xl transition-all duration-300 hover:scale-105 border border-border/30">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="flex flex-col space-y-3">
                  <button onClick={() => { smoothScrollTo('services'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200">
                    {t('navigation.services')}
                  </button>
                  <button onClick={() => { smoothScrollTo('about'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200">
                    {t('navigation.about')}
                  </button>
                  <button onClick={() => { smoothScrollTo('contact'); setMobileMenuOpen(false); }} className="text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200">
                    {t('navigation.contact')}
                  </button>
                  <Link href="/User/Chat/Bot" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                    <div className="px-6 py-3 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white rounded-xl font-medium text-center hover:from-[#7A1235] hover:to-[#E64A19] transition-all duration-300 shadow-lg relative group overflow-hidden">
                      <span className="relative z-10">{t('navigation.contact')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <button onClick={toggleMobileMenu} className="p-2 hover:bg-accent/50 rounded-lg transition-colors">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
