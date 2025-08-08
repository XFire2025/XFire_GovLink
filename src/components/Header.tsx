import React, { useState, useEffect } from 'react';
import { LotusIcon } from '@/components/Icons/LotusIcon'; // Adjust the import path as necessary
import { MenuIcon } from '@/components/Icons/MenuIcon'; // Adjust the import path as necessary
import { CloseIcon } from '@/components/Icons/CloseIcon'; // Adjust the import path as necessary
import { ThemeToggle } from '@/components/ThemeToggle'; // Assuming ThemeToggle is in this path

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80; // Account for fixed header
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      setIsMenuOpen(false);
    }
  };

  // Smooth scroll to top function
  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'glass-morphism shadow-glow backdrop-blur-xl' 
        : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo with Animation - Mobile Optimized */}
          <button 
            onClick={smoothScrollToTop}
            className="flex items-center space-x-2 sm:space-x-3 animate-fade-in-up hover:scale-105 transition-all duration-300 cursor-pointer bg-transparent border-none p-1 rounded-lg hover:bg-card/30 focus:outline-none"
            aria-label="Scroll to top"
          >
            <LotusIcon className="animate-glow w-8 h-8 sm:w-10 sm:h-10" />
            <div className="text-left">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gradient">GovLink</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Sri Lanka</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <button 
              onClick={() => smoothScrollTo('services')} 
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 font-medium text-sm xl:text-base cursor-pointer"
            >
              Services
            </button>
            <button 
              onClick={() => smoothScrollTo('about')} 
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 font-medium text-sm xl:text-base cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={() => smoothScrollTo('contact')} 
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 font-medium text-sm xl:text-base cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Action Buttons - Mobile Responsive */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <button className="relative overflow-hidden bg-transparent border-2 border-[#FFC72C] text-[#FFC72C] px-4 xl:px-6 py-2 xl:py-2.5 rounded-full font-semibold text-sm xl:text-base transition-all duration-300 hover:bg-[#FFC72C] hover:text-[#8D153A] hover:scale-105 hover:shadow-glow group">
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button - Mobile First */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 sm:p-2 text-foreground hover:text-[#FFC72C] transition-colors duration-300"
            >
              {isMenuOpen ? <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced Mobile Design */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full glass-morphism backdrop-blur-xl border-t border-border/50 animate-fade-in-up">
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
              <button 
                onClick={() => smoothScrollTo('services')} 
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 font-medium text-base sm:text-lg"
              >
                Services
              </button>
              <button 
                onClick={() => smoothScrollTo('about')} 
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 font-medium text-base sm:text-lg"
              >
                About
              </button>
              <button 
                onClick={() => smoothScrollTo('contact')} 
                className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 font-medium text-base sm:text-lg"
              >
                Contact
              </button>
              <button className="w-full bg-transparent border-2 border-[#FFC72C] text-[#FFC72C] px-4 sm:px-6 py-3 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-[#FFC72C] hover:text-[#8D153A] mt-3 sm:mt-4">
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export { Header };