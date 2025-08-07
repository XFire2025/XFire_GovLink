// app/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LotusIcon } from '@/components/Icons/LotusIcon';
import ThreeBackground from '@/components/ThreeBackground'; // Path to our enhanced Three.js component

// --- GLOBAL PARTICLE BACKGROUND COMPONENT ---
// This component now solely relies on the enhanced ThreeBackground
const GlobalParticleBackground = () => {
  // Detect dark mode from document element to pass hint to Three
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Three.js premium background */}
      <ThreeBackground className="absolute inset-0" dark={isDark} />

      {/* Minimal gradient fallback (visible briefly before WebGL mounts or if WebGL fails) */}
      {/* Tweaked colors to align better with the new Three.js theme */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          background:
            'radial-gradient(1000px 700px at 80% 85%, rgba(255,199,44,0.18), transparent 60%),\n             radial-gradient(900px 700px at 15% 20%, rgba(0,128,96,0.12), transparent 65%),\n             conic-gradient(from 210deg at 50% 50%, rgba(141,21,58,0.2), rgba(255,87,34,0.1), rgba(255,199,44,0.1), rgba(0,128,96,0.08), rgba(141,21,58,0.2))',
        }}
      />

      {/* Micro-noise layer to prevent banding */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,\
            <svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'140\\' height=\\'140\\'>\
              <filter id=\\'n\\'>\
                <feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'2\\' stitchTiles=\\'stitch\\'/>\\n                <feColorMatrix type=\\'saturate\\' values=\\'0\\'/>\
              </filter>\
              <rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(#n)\\' opacity=\\'0.4\\'/>\
            </svg>')",
          backgroundSize: '140px 140px',
        }}
      />
    </div>
  );
};
// --- PREMIUM SVG ICON COMPONENTS ---
// (Keep these as they are, they are well-designed)
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// --- PREMIUM HEADER COMPONENT ---
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
        ? 'glass-morphism shadow-glow backdrop-blur-xl' // These classes need definition
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
            <LotusIcon className="animate-glow w-8 h-8 sm:w-10 sm:h-10" /> {/* animate-glow needs definition */}
            <div className="text-left">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gradient">GovLink</h1> {/* text-gradient needs definition */}
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
          <div className="lg:hidden absolute top-full left-0 w-full glass-morphism backdrop-blur-xl border-t border-border/50 animate-fade-in-up"> {/* glass-morphism needs definition */}
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

// --- STUNNING HERO SECTION ---
const Hero = () => {
  const [searchText, setSearchText] = useState('');

  const placeholderTexts = [
    "How do I renew my passport?",
    "Where can I register my business?",
    "How to apply for a driving license?",
    "What documents do I need for marriage registration?"
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholderTexts.length]);

  // Allow Shift+Enter to insert newline, Enter (without Shift) will submit the form
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Insert newline without submitting the form
      e.stopPropagation();
      // Let the default newline behavior happen
      return;
    }
    if (e.key === 'Enter') {
      // Prevent adding a newline so the form can submit cleanly
      e.preventDefault();
      // Find the closest form and submit it
      const form = (e.currentTarget as HTMLTextAreaElement).closest('form') as HTMLFormElement | null;
      if (form) form.requestSubmit();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-24 md:py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading - Mobile First */}
          <div className="mb-6 sm:mb-8 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-3 sm:mb-4 animate-title-wave" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.1)'}}>
              <span className="animate-wave-buoyancy-1">Simplifying</span>{' '}
              <span className="animate-wave-buoyancy-2">Government</span>{' '}
              <span className="animate-wave-buoyancy-3">for</span>{' '}
              <span className="text-gradient animate-glow animate-wave-float-center"> {/* text-gradient, animate-glow needs definition */}
                Every Sri Lankan
              </span>
            </h1>
            <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] mx-auto rounded-full animate-wave-buoyancy-1"></div>
          </div>
          
          {/* Subtitle - Mobile Responsive */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-subtitle-wave px-2 sm:px-0" style={{animationDelay: '0.2s', textShadow: '0 1px 4px rgba(0,0,0,0.2)'}}>
            <span className="animate-wave-float-left">Ask questions,</span>{' '}
            <span className="animate-wave-float-center">find services,</span>{' '}
            <span className="animate-wave-float-right">and access information instantly.</span>{' '}
            <span className="animate-wave-buoyancy-2">Your direct link to public services is here.</span>
          </p>
          
          {/* Enhanced Search Interface - Mobile First */}
          <div className="max-w-3xl mx-auto animate-fade-in-up animate-wave-buoyancy-3 px-2 sm:px-0" style={{animationDelay: '0.4s'}}>
            <form action="/chat" method="GET" className="relative group">
              <div className="relative glass-morphism rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-glow hover:shadow-2xl transition-all duration-500 animate-wave-float-center"> {/* glass-morphism, shadow-glow needs definition */}
                <textarea
                  name="q"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-foreground placeholder-muted-foreground p-4 sm:p-5 md:p-6 pr-16 sm:pr-20 rounded-lg sm:rounded-xl resize-none focus:outline-none text-base sm:text-lg leading-relaxed border-none"
                  placeholder={placeholderTexts[currentPlaceholder]}
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.max(target.scrollHeight, 60)}px`;
                  }}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 md:p-4 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 shadow-glow group animate-wave-buoyancy-1" // shadow-glow needs definition
                >
                  <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
              
              {/* Quick Suggestions - Mobile Responsive */}
              <div className="mt-4 sm:mt-5 md:mt-6 flex flex-wrap gap-2 sm:gap-3 justify-center">
                {["Passport Renewal", "Business Registration", "Marriage Certificate", "Driving License"].map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSearchText(suggestion)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-card/50 hover:bg-card border border-border hover:border-[#FFC72C] rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md animate-wave-buoyancy-${(index % 3) + 1}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Mobile Responsive */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-muted-foreground rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

// --- PREMIUM FEATURES SECTION ---
const Features = () => {
  const featuresList = [
    { 
      icon: <DocumentIcon />, 
      title: "Access Forms & Documents", 
      description: "Instantly find and download official government forms for passports, licenses, and more.",
      color: "#FF5722",
      benefits: ["Instant Downloads", "24/7 Availability", "Multiple Formats"]
    },
    { 
      icon: <InfoIcon />, 
      title: "Get Instant Information", 
      description: "Ask any question about public services and get clear, step-by-step guidance.",
      color: "#008060",
      benefits: ["Real-time Answers", "Step-by-step Guides", "Multi-language Support"]
    },
    { 
      icon: <CalendarIcon />, 
      title: "Schedule Appointments", 
      description: "Find available slots and book appointments with government departments online.",
      color: "#FFC72C",
      benefits: ["Online Booking", "SMS Reminders", "Easy Rescheduling"]
    },
  ];
  
  return (
    <section id="services" className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFC72C]/20 to-[#FF5722]/20 px-4 py-2 rounded-full border border-[#FFC72C]/30 mb-6 animate-wave-buoyancy-2">
            <span className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-[#FFC72C]">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-title-wave"> {/* animate-title-wave needs definition */}
            <span className="animate-wave-float-left">Everything You Need,</span>{' '}
            <span className="text-gradient animate-wave-float-right">All in One Place</span> {/* text-gradient needs definition */}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-subtitle-wave"> {/* animate-subtitle-wave needs definition */}
            <span className="animate-wave-buoyancy-1">GovLink is designed to make your interaction</span>{' '}
            <span className="animate-wave-buoyancy-3">with government services seamless and efficient.</span>
          </p>
        </div>        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {featuresList.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative glass-morphism p-8 rounded-3xl border border-border hover:border-[#FFC72C] hover-lift shadow-xl hover:shadow-glow transition-all duration-500 animate-fade-in-up animate-wave-buoyancy-${(index % 3) + 1}`} // glass-morphism, shadow-glow, hover-lift needs definition
              style={{animationDelay: `${index * 0.2}s`}}
            >              {/* Icon Container */}
              <div className={`relative flex items-center justify-center w-20 h-20 rounded-2xl mb-8 transition-all duration-300 group-hover:scale-110`}
                   style={{background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`}}>
                <div className="text-4xl" style={{color: feature.color}}>
                  {feature.icon}
                </div>
                {/* Floating Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 animate-wave-buoyancy-2">
                  <CheckIcon className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 group-hover:text-[#FFC72C] transition-colors duration-300 animate-wave-buoyancy-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed animate-subtitle-wave">
                {feature.description}
              </p>

              {/* Benefits */}
              <div className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className={`flex items-center gap-3 text-sm animate-wave-buoyancy-${(benefitIndex % 3) + 1}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FFC72C] to-[#FF5722]"></div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- ABOUT SECTION ---
const About = () => (
  <section id="about" className="py-20 sm:py-24 md:py-32 relative">
    <div className="container mx-auto px-4 sm:px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Content */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#008060]/20 to-[#FFC72C]/20 px-4 py-2 rounded-full border border-[#008060]/30 mb-6 animate-wave-buoyancy-1">
            <span className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-[#008060]">About GovLink</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-title-wave">
            <span className="animate-wave-float-left">Bridging the Gap</span>{' '}
            <span className="text-gradient animate-wave-float-right">Between Citizens & Government</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed animate-subtitle-wave">
            <span className="animate-wave-buoyancy-2">GovLink was born from a simple vision:</span>{' '}
            <span className="animate-wave-buoyancy-3">making government services accessible, transparent, and efficient for every Sri Lankan citizen.</span>
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 animate-wave-buoyancy-1">
              <div className="w-6 h-6 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Simplified Access</h3>
                <p className="text-muted-foreground">One platform for all government services, forms, and information.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 animate-wave-buoyancy-2">
              <div className="w-6 h-6 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">24/7 Availability</h3>
                <p className="text-muted-foreground">Access services anytime, anywhere, without queuing or waiting.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 animate-wave-buoyancy-3">
              <div className="w-6 h-6 bg-gradient-to-r from-[#FF5722] to-[#8D153A] rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Transparent Process</h3>
                <p className="text-muted-foreground">Clear step-by-step guidance for every government procedure.</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-glow animate-wave-float-center"> {/* shadow-glow needs definition */}
              Learn More
            </button>
            <button className="border-2 border-[#008060] text-[#008060] hover:bg-[#008060] hover:text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 animate-wave-buoyancy-1">
              Our Mission
            </button>
          </div>
        </div>
        
        {/* Right Content - Stats */}
        <div className="grid grid-cols-2 gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="text-center p-6 glass-morphism rounded-2xl animate-wave-buoyancy-1"> {/* glass-morphism needs definition */}
            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">50K+</div> {/* text-gradient needs definition */}
            <div className="text-muted-foreground">Citizens Served</div>
          </div>
          
          <div className="text-center p-6 glass-morphism rounded-2xl animate-wave-buoyancy-2">
            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">200+</div>
            <div className="text-muted-foreground">Government Forms</div>
          </div>
          
          <div className="text-center p-6 glass-morphism rounded-2xl animate-wave-buoyancy-3">
            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">25</div>
            <div className="text-muted-foreground">Departments</div>
          </div>
          
          <div className="text-center p-6 glass-morphism rounded-2xl animate-wave-buoyancy-1">
            <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">99.8%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- CONTACT SECTION ---
const Contact = () => (
  <section id="contact" className="py-20 sm:py-24 md:py-32 relative">
    <div className="container mx-auto px-4 sm:px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8D153A]/20 to-[#FF5722]/20 px-4 py-2 rounded-full border border-[#8D153A]/30 mb-6 animate-wave-buoyancy-2">
            <span className="w-2 h-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-[#8D153A]">Get in Touch</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-title-wave">
            <span className="animate-wave-float-left">Need Help?</span>{' '}
            <span className="text-gradient animate-wave-float-right">We&apos;re Here for You</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-subtitle-wave">
            <span className="animate-wave-buoyancy-1">Have questions about government services?</span>{' '}
            <span className="animate-wave-buoyancy-3">Our support team is ready to assist you.</span>
          </p>
        </div>
        
        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Phone */}
          <div className="text-center p-6 glass-morphism rounded-2xl animate-wave-buoyancy-1 hover:scale-105 transition-transform duration-300"> {/* glass-morphism needs definition */}
            <div className="w-16 h-16 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="text-muted-foreground mb-2">+94 11 234 5678</p>
            <p className="text-sm text-muted-foreground">Mon - Fri, 8AM - 6PM</p>
          </div>
          
          {/* Email */}
          <div className="text-center p-6 glass-morphism rounded-2xl animate-wave-buoyancy-2 hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Email Us</h3>
            <p className="text-muted-foreground mb-2">support@govlink.lk</p>
            <p className="text-sm text-muted-foreground">24/7 Support</p>
          </div>
          
          {/* Location */}
          <div className="text-center p-6 glass-morphism rounded-2xl animate-wave-buoyancy-3 hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FF5722] to-[#8D153A] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Visit Us</h3>
            <p className="text-muted-foreground mb-2">Colombo, Sri Lanka</p>
            <p className="text-sm text-muted-foreground">Government Services Hub</p>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="glass-morphism rounded-2xl p-8 animate-wave-float-center"> {/* glass-morphism needs definition */}
          <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-wave-buoyancy-1">
              <h4 className="font-semibold mb-2">How do I access government forms?</h4>
              <p className="text-muted-foreground text-sm">Simply search for the form you need or browse our services section. All forms are available for instant download.</p>
            </div>
            
            <div className="animate-wave-buoyancy-2">
              <h4 className="font-semibold mb-2">Is GovLink an official platform?</h4>
              <p className="text-muted-foreground text-sm">Yes, GovLink is officially endorsed by the Government of Sri Lanka for digital service delivery.</p>
            </div>
            
            <div className="animate-wave-buoyancy-3">
              <h4 className="font-semibold mb-2">Can I track my application status?</h4>
              <p className="text-muted-foreground text-sm">Absolutely! Use your application reference number to track the progress of your submissions.</p>
            </div>
            
            <div className="animate-wave-buoyancy-1">
              <h4 className="font-semibold mb-2">What if I need technical support?</h4>
              <p className="text-muted-foreground text-sm">Our technical support team is available 24/7 via phone, email, or live chat to assist you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- PREMIUM FOOTER ---
const Footer = () => (
  <footer className="relative py-20 mt-32">
    <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent"></div>
    <div className="container mx-auto px-6 relative z-10">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <LotusIcon className="w-12 h-12" />
            <div>
              <h3 className="text-2xl font-bold text-gradient">GovLink</h3>
              <p className="text-sm text-muted-foreground">Sri Lanka</p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
            Simplifying government services for every Sri Lankan. Access information, download forms, 
            and complete procedures with ease through our modern digital platform.
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-card border border-border hover:border-[#FFC72C] flex items-center justify-center transition-colors duration-300" aria-label="Follow on Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.21 10.44 22v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.91h-2.33V22C18.34 21.21 22 17.08 22 12.06z"/>
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-card border border-border hover:border-[#FFC72C] flex items-center justify-center transition-colors duration-300" aria-label="Follow on X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
                <path d="M18.244 2H21l-6.5 7.43L22 22h-6.828l-4.78-6.24L4.8 22H2l7.02-8.02L2 2h6.914l4.33 5.77L18.244 2Zm-1.196 18h1.884L7.07 4H5.092l11.956 16Z"/>
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-card border border-border hover:border-[#FFC72C] flex items-center justify-center transition-colors duration-300" aria-label="Connect on LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
                <path d="M20.447 20.452H17.2v-5.569c0-1.328-.027-3.036-1.85-3.036-1.853 0-2.136 1.445-2.136 2.94v5.665H9.07V9h3.116v1.561h.045c.435-.824 1.498-1.692 3.083-1.692 3.298 0 3.906 2.171 3.906 4.995v6.588zM5.337 7.433a1.81 1.81 0 1 1 0-3.62 1.81 1.81 0 0 1 0 3.62zM6.96 20.452H3.71V9h3.25v11.452z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-6">Quick Links</h4>
          <div className="space-y-3">
            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors duration-300">Services</a>
            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors duration-300">About Us</a>
            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors duration-300">Contact</a>
            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors duration-300">Help Center</a>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-6">Legal</h4>
          <div className="space-y-3">
            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors duration-300">Terms of Service</a>
            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors duration-300">Cookie Policy</a>
            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors duration-300">Accessibility</a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="pt-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} GovLink Sri Lanka. An initiative to streamline public services.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>for Sri Lanka</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen relative theme-transition-slow">
      {/* Global Particle Background */}
      <GlobalParticleBackground />
      
      {/* Unified Gradient Mesh Overlay for Entire Page */}
      {/* Adjusted colors and opacity to blend better with the new Three.js background */}
      <div className="fixed inset-0 gradient-mesh opacity-20 dark:opacity-15 pointer-events-none z-[5]"></div>
      
      {/* Content with higher z-index */}
      <div className="relative z-10 theme-transition-fast">
        <Header />
        <main className="theme-transition-fast">
          <Hero />
          <Features />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}