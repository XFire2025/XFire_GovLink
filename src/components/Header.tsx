// components/Header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Services", href: "#" },
  { name: "About Us", href: "#" },
  { name: "Contact", href: "#" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between p-4 md:p-6">
          <Link href="/" className="text-2xl font-bold text-brand-gold">
            GovLink
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/chat" className="bg-transparent border border-brand-gold text-brand-gold px-4 py-2 rounded-md hover:bg-brand-gold hover:text-black transition-colors font-semibold text-sm">
              Start Chat
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button onClick={toggleMobileMenu} className="p-2 -mr-2">
              <Menu className="h-6 w-6" />
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
            className="fixed inset-x-0 top-0 z-50 origin-top bg-background p-4 md:hidden"
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-brand-gold">
                GovLink
              </Link>
              <button onClick={toggleMobileMenu} className="p-2 -mr-2">
                 <X className="h-6 w-6" />
                 <span className="sr-only">Close menu</span>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="space-y-2 py-6">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted">
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                 <Link href="/chat" className="w-full text-center bg-transparent border border-brand-gold text-brand-gold px-4 py-2.5 rounded-md hover:bg-brand-gold hover:text-black transition-colors font-semibold text-base -mx-3 block">
                    Start Chat
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};