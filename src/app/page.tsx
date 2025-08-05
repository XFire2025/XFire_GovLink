"use client";
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

// --- GLOBAL PARTICLE BACKGROUND COMPONENT ---
const GlobalParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top Section Particles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFC72C]/10 rounded-full blur-xl animate-drift"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-[#FF5722]/10 rounded-full blur-xl animate-drift-reverse"></div>
      <div className="absolute top-60 left-1/3 w-20 h-20 bg-[#008060]/15 rounded-full blur-lg animate-orbit"></div>
      <div className="absolute top-10 right-10 w-18 h-18 bg-[#FFC72C]/20 rounded-full blur-sm animate-float" style={{animationDelay: '1.5s'}}></div>
      
      {/* Upper Middle Particles */}
      <div className="absolute top-1/4 left-20 w-40 h-40 bg-[#8D153A]/8 rounded-full blur-2xl animate-pulse-move"></div>
      <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-[#FFC72C]/12 rounded-full blur-xl animate-spiral"></div>
      <div className="absolute top-1/4 left-1/2 w-16 h-16 bg-[#FF5722]/15 rounded-full blur-sm animate-spiral" style={{animationDelay: '2s'}}></div>
      
      {/* Center Section Particles */}
      <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-[#008060]/12 rounded-full blur-lg animate-drift" style={{animationDelay: '5s'}}></div>
      <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-[#FF5722]/10 rounded-full blur-xl animate-drift-reverse" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-[#8D153A]/12 rounded-full blur-md animate-orbit" style={{animationDelay: '6s'}}></div>
      <div className="absolute top-1/2 right-10 w-20 h-20 bg-[#FFC72C]/15 rounded-full blur-lg animate-pulse-move" style={{animationDelay: '4s'}}></div>
      
      {/* Lower Middle Particles */}
      <div className="absolute top-2/3 left-1/3 w-32 h-32 bg-[#008060]/10 rounded-full blur-xl animate-spiral" style={{animationDelay: '7s'}}></div>
      <div className="absolute top-2/3 right-1/2 w-20 h-20 bg-[#8D153A]/12 rounded-full blur-lg animate-drift-reverse" style={{animationDelay: '4s'}}></div>
      <div className="absolute top-2/3 left-1/2 w-28 h-28 bg-[#FF5722]/12 rounded-full blur-xl animate-drift" style={{animationDelay: '8s'}}></div>
      
      {/* Footer Section Particles */}
      <div className="absolute top-3/4 left-1/4 w-40 h-40 bg-[#FFC72C]/8 rounded-full blur-2xl animate-pulse-move" style={{animationDelay: '9s'}}></div>
      <div className="absolute top-3/4 right-1/4 w-28 h-28 bg-[#008060]/10 rounded-full blur-xl animate-orbit" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/3 w-32 h-32 bg-[#8D153A]/10 rounded-full blur-xl animate-drift" style={{animationDelay: '5s'}}></div>
      
      {/* Bottom Section Particles */}
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-[#FF5722]/12 rounded-full blur-xl animate-drift-reverse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 left-1/2 w-24 h-24 bg-[#FFC72C]/15 rounded-full blur-lg animate-spiral" style={{animationDelay: '6s'}}></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 bg-[#008060]/15 rounded-full blur-md animate-float" style={{animationDelay: '3.5s'}}></div>
      <div className="absolute bottom-60 right-20 w-24 h-24 bg-[#8D153A]/12 rounded-full blur-lg animate-orbit" style={{animationDelay: '7s'}}></div>
      
      {/* Edge Particles for Full Coverage */}
      <div className="absolute top-1/3 left-0 w-16 h-16 bg-[#FFC72C]/10 rounded-full blur-sm animate-drift" style={{animationDelay: '10s'}}></div>
      <div className="absolute top-2/3 right-0 w-16 h-16 bg-[#FF5722]/12 rounded-full blur-md animate-drift-reverse" style={{animationDelay: '11s'}}></div>
      <div className="absolute bottom-1/3 left-5 w-20 h-20 bg-[#008060]/10 rounded-full blur-lg animate-pulse-move" style={{animationDelay: '12s'}}></div>
      <div className="absolute bottom-1/4 right-5 w-24 h-24 bg-[#8D153A]/8 rounded-full blur-xl animate-spiral" style={{animationDelay: '13s'}}></div>
    </div>
  );
};

// --- PREMIUM SVG ICON COMPONENTS ---
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// Sri Lankan Lotus Icon (Custom)
const LotusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100" fill="none">
    <path d="M50 10C45 15 35 25 30 35C25 45 30 55 40 60C45 62 55 62 60 60C70 55 75 45 70 35C65 25 55 15 50 10Z" fill="url(#lotus-gradient)"/>
    <path d="M50 15C45 20 40 30 35 40C30 50 35 60 45 65C50 67 60 67 65 65C75 60 80 50 75 40C70 30 65 20 50 15Z" fill="url(#lotus-gradient-inner)"/>
    <defs>
      <linearGradient id="lotus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#FFC72C', stopOpacity: 1}} />
        <stop offset="50%" style={{stopColor: '#FF5722', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#8D153A', stopOpacity: 1}} />
      </linearGradient>
      <linearGradient id="lotus-gradient-inner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: '#FFC72C', stopOpacity: 0.7}} />
        <stop offset="100%" style={{stopColor: '#FF5722', stopOpacity: 0.7}} />
      </linearGradient>
    </defs>
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

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'glass-morphism shadow-glow backdrop-blur-xl' 
        : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo with Animation */}
          <div className="flex items-center space-x-3 animate-fade-in-up">
            <LotusIcon className="animate-glow" />
            <div>
              <h1 className="text-2xl font-bold text-gradient">GovLink</h1>
              <p className="text-xs text-muted-foreground font-medium">Sri Lanka</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 font-medium">Services</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 font-medium">About</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 font-medium">Contact</a>
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="relative overflow-hidden bg-transparent border-2 border-[#FFC72C] text-[#FFC72C] px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:bg-[#FFC72C] hover:text-[#8D153A] hover:scale-105 hover:shadow-glow group">
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foreground hover:text-[#FFC72C] transition-colors duration-300"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full glass-morphism backdrop-blur-xl border-t border-border/50 animate-fade-in-up">
            <div className="container mx-auto px-6 py-6 space-y-4">
              <a href="#services" className="block text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 font-medium">Services</a>
              <a href="#about" className="block text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 font-medium">About</a>
              <a href="#contact" className="block text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 font-medium">Contact</a>
              <button className="w-full bg-transparent border-2 border-[#FFC72C] text-[#FFC72C] px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-[#FFC72C] hover:text-[#8D153A] mt-4">
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
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 gradient-mesh"></div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4">
              Simplifying Government for{' '}
              <span className="text-gradient animate-glow">
                Every Sri Lankan
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] mx-auto rounded-full"></div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Ask questions, find services, and access information instantly. Your direct link to public services is here.
          </p>

          {/* Enhanced Search Interface */}
          <div className="max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <form action="/chat" method="GET" className="relative group">
              <div className="relative glass-morphism rounded-2xl p-2 shadow-glow hover:shadow-2xl transition-all duration-500">
                <textarea
                  name="q"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-transparent text-foreground placeholder-muted-foreground p-6 pr-20 rounded-xl resize-none focus:outline-none text-lg leading-relaxed border-none"
                  placeholder={placeholderTexts[currentPlaceholder]}
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.max(target.scrollHeight, 70)}px`;
                  }}
                />
                <button 
                  type="submit" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 hover:scale-110 shadow-glow group"
                >
                  <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
              
              {/* Quick Suggestions */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                {["Passport Renewal", "Business Registration", "Marriage Certificate", "Driving License"].map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSearchText(suggestion)}
                    className="px-4 py-2 bg-card/50 hover:bg-card border border-border hover:border-[#FFC72C] rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
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
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFC72C]/20 to-[#FF5722]/20 px-4 py-2 rounded-full border border-[#FFC72C]/30 mb-6">
            <span className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-[#FFC72C]">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Everything You Need,{' '}
            <span className="text-gradient">All in One Place</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            GovLink is designed to make your interaction with government services seamless and efficient.
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {featuresList.map((feature, index) => (
            <div 
              key={index} 
              className="group relative glass-morphism p-8 rounded-3xl border border-border hover:border-[#FFC72C] hover-lift shadow-xl hover:shadow-glow transition-all duration-500 animate-fade-in-up"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              {/* Icon Container */}
              <div className={`relative flex items-center justify-center w-20 h-20 rounded-2xl mb-8 transition-all duration-300 group-hover:scale-110`}
                   style={{background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`}}>
                <div className="text-4xl" style={{color: feature.color}}>
                  {feature.icon}
                </div>
                {/* Floating Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                  <CheckIcon className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 group-hover:text-[#FFC72C] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Benefits */}
              <div className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center gap-3 text-sm">
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
            <button className="w-10 h-10 rounded-full bg-card border border-border hover:border-[#FFC72C] flex items-center justify-center transition-colors duration-300">
              <span className="text-sm">FB</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-card border border-border hover:border-[#FFC72C] flex items-center justify-center transition-colors duration-300">
              <span className="text-sm">TW</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-card border border-border hover:border-[#FFC72C] flex items-center justify-center transition-colors duration-300">
              <span className="text-sm">LI</span>
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
    <div className="bg-background text-foreground min-h-screen relative">
      {/* Global Particle Background */}
      <GlobalParticleBackground />
      
      {/* Content with higher z-index */}
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Features />
        </main>
        <Footer />
      </div>
    </div>
  );
}