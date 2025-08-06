// app/profile/page.tsx
"use client";

import React, { useState, useMemo, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle'; // Assuming ThemeToggle is in this path

// --- GLOBAL PARTICLE BACKGROUND COMPONENT (Consistent with Landing Page) ---
const GlobalParticleBackground = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Light Mode Enhanced Flag Background - Mobile First Responsive */}
        <div className="absolute inset-0 opacity-[0.25] sm:opacity-[0.30] md:opacity-[0.35] dark:opacity-0">
          <Image 
            src="/flag-of-sri-lanka-1.gif" 
            alt="Sri Lankan Flag Background" 
            fill
            className="object-cover object-center animate-pulse-move scale-110 sm:scale-105 md:scale-100"
            style={{
              animationDelay: '0s',
              filter: 'contrast(2.2) brightness(0.45) saturate(2.2) sepia(0.25) hue-rotate(8deg)',
              mixBlendMode: 'multiply'
            }}
            unoptimized={true}
            priority={false}
          />
        </div>
        
        {/* Dark Mode Flag Background - Mobile First Responsive */}
        <div className="absolute inset-0 opacity-0 dark:opacity-[0.02] sm:dark:opacity-[0.025] md:dark:opacity-[0.03]">
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
        
        {/* Particle Effects (Subtle for a dashboard view) */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#8D153A]/15 dark:bg-[#FFC72C]/8 rounded-full blur-xl animate-drift"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-[#FF5722]/20 dark:bg-[#FF5722]/8 rounded-full blur-xl animate-drift-reverse"></div>
        <div className="absolute bottom-20 left-8 h-36 w-36 rounded-full bg-[#008060]/15 dark:bg-[#008060]/8 blur-2xl animate-orbit" />
        <div className="absolute bottom-6 right-10 h-24 w-24 rounded-full bg-[#FFC72C]/25 dark:bg-[#FFC72C]/12 blur-xl animate-float" />
      </div>
    );
};

// --- PREMIUM SVG ICON COMPONENTS (Consistent with Landing Page) ---
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
  
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);
  
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);


// --- PREMIUM HEADER COMPONENT (Consistent with Landing Page) ---
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    return (
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-morphism shadow-glow backdrop-blur-xl' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2 sm:space-x-3 animate-fade-in-up hover:scale-105 transition-all duration-300">
              <LotusIcon className="animate-glow w-8 h-8 sm:w-10 sm:h-10" />
              <div className="text-left">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gradient">GovLink</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Sri Lanka</p>
              </div>
            </a>
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a href="/#services" className="text-muted-foreground hover:text-foreground transition-all duration-300">Services</a>
              <a href="/#about" className="text-muted-foreground hover:text-foreground transition-all duration-300">About</a>
              <a href="/#contact" className="text-muted-foreground hover:text-foreground transition-all duration-300">Contact</a>
            </div>
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
                <button className="relative overflow-hidden bg-transparent border-2 border-[#FFC72C] text-[#FFC72C] px-4 xl:px-6 py-2 xl:py-2.5 rounded-full font-semibold text-sm xl:text-base transition-all duration-300 hover:bg-[#FFC72C] hover:text-[#8D153A] hover:scale-105 hover:shadow-glow group">
                    <span className="relative z-10">Sign Out</span>
                </button>
                <ThemeToggle />
            </div>
            <div className="lg:hidden flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 sm:p-2 text-foreground hover:text-[#FFC72C]">
                {isMenuOpen ? <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full glass-morphism backdrop-blur-xl border-t border-border/50 animate-fade-in-up">
              <div className="container mx-auto px-4 sm:px-6 py-4 space-y-3">
                <a href="/#services" className="block w-full text-left text-muted-foreground hover:text-foreground py-2">Services</a>
                <a href="/#about" className="block w-full text-left text-muted-foreground hover:text-foreground py-2">About</a>
                <a href="/#contact" className="block w-full text-left text-muted-foreground hover:text-foreground py-2">Contact</a>
                <button className="w-full block text-center bg-transparent border-2 border-[#FFC72C] text-[#FFC72C] px-4 py-3 rounded-full mt-3">Sign Out</button>
              </div>
            </div>
          )}
        </nav>
      </header>
    );
};

// --- PREMIUM FOOTER COMPONENT (Consistent with Landing Page) ---
const Footer = () => (
    <footer className="relative py-20 mt-32">
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent"></div>
      <div className="container mx-auto px-6 relative z-10">
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

// --- REUSABLE UI COMPONENTS ---
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
      <div className="mb-12 sm:mb-16 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-title-wave">
          <span className="text-gradient animate-glow">{title}</span>
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed animate-subtitle-wave" style={{animationDelay: '0.1s'}}>
            {subtitle}
          </p>
        )}
      </div>
    );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
      <label htmlFor={htmlFor} className="block text-sm font-medium text-muted-foreground mb-2 animate-fade-in-up">
        {children}
      </label>
    );
}
  
const initialFormState = {
    name: "Sanduni Perera",
    nic: "199512345678",
    dob: "1995-08-15",
    email: "sanduni.p@email.com",
    phone: "+94 77 123 4567",
    address: "123 Galle Road, Colombo 03",
};

// --- MAIN PROFILE PAGE COMPONENT ---
export default function ProfilePage() {
  const [form, setForm] = useState(initialFormState);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const previewUrl = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : "/profile-avatar-placeholder.png"), [avatarFile]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const onDiscard = () => {
    setForm(initialFormState);
    setAvatarFile(null);
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaved(false);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500)); 
    setSaving(false);
    setSaved(true);
    // Hide success state after a few seconds
    setTimeout(() => setSaved(false), 2500);
  };

  const completeness = Object.values(form).filter(Boolean).length;
  const completenessPct = Math.round((completeness / 6) * 100);

  const TABS = [
    { id: 'details', label: 'Personal Details', icon: <UserIcon className="w-5 h-5 mr-3"/> },
    { id: 'documents', label: 'My Documents', icon: <DocumentIcon className="w-5 h-5 mr-3"/> },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen relative theme-transition-slow">
      <GlobalParticleBackground />
      <div className="relative z-10 theme-transition-fast">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-32 sm:py-40">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                {/* --- SIDEBAR --- */}
                <aside className="lg:col-span-3 mb-12 lg:mb-0 animate-fade-in-up">
                    <div className="glass-morphism p-4 rounded-2xl border border-border/50 shadow-glow space-y-2">
                        {TABS.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id 
                                    ? 'bg-card/80 text-foreground shadow-inner-glow'
                                    : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <div className="lg:col-span-9">
                    {activeTab === 'details' && (
                        <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                            <SectionTitle 
                                title="Personal Details" 
                                subtitle="Manage your personal information, address, and contact details." 
                            />
                            <form onSubmit={onSubmit} >
                                <div className="glass-morphism rounded-3xl p-6 sm:p-8 border border-border/50 shadow-glow">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                                    
                                    {/* Left: Avatar + Completeness */}
                                    <div className="lg:col-span-1 flex flex-col items-center animate-wave-buoyancy-1">
                                        <div className="relative group w-48 h-48 sm:w-56 sm:h-56 mb-6">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFC72C]/30 via-[#FF5722]/30 to-[#8D153A]/30 blur-lg animate-pulse group-hover:blur-xl transition-all duration-500"></div>
                                            <Image 
                                                src={previewUrl} 
                                                alt="Profile Avatar"
                                                width={224}
                                                height={224}
                                                className="relative w-full h-full object-cover rounded-full border-4 border-card/80 shadow-2xl"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileRef.current?.click()}
                                                className="absolute bottom-2 right-2 w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-border hover:bg-card hover:border-[#FFC72C] transition-all duration-300 hover:scale-110"
                                                aria-label="Upload new profile picture"
                                            >
                                                <UploadIcon />
                                            </button>
                                            <input ref={fileRef} type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
                                        </div>

                                        <div className="w-full glass-morphism p-5 rounded-2xl border border-border/30">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-semibold">Profile Completeness</span>
                                                <span className="font-bold text-gradient">{completenessPct}%</span>
                                            </div>
                                            <div className="h-2.5 w-full bg-card/50 rounded-full overflow-hidden border border-border/30">
                                                <div className="h-full bg-gradient-to-r from-[#FFC72C] to-[#FF5722] transition-all duration-500" style={{ width: `${completenessPct}%` }}/>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-3 text-center">A complete profile helps us serve you better.</p>
                                        </div>
                                    </div>

                                    {/* Right: Form Fields */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="animate-wave-buoyancy-2" style={{animationDelay: '0.1s'}}>
                                        <Label htmlFor="name">Full Name</Label>
                                        <input id="name" name="name" value={form.name} onChange={onChange} className="form-input-premium" placeholder="e.g. Sanduni Perera" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="animate-wave-buoyancy-3" style={{animationDelay: '0.2s'}}>
                                            <Label htmlFor="nic">National ID (NIC)</Label>
                                            <input id="nic" name="nic" value={form.nic} onChange={onChange} className="form-input-premium" placeholder="Enter your NIC number" />
                                        </div>
                                        <div className="animate-wave-buoyancy-1" style={{animationDelay: '0.3s'}}>
                                            <Label htmlFor="dob">Date of Birth</Label>
                                            <input id="dob" name="dob" type="date" value={form.dob} onChange={onChange} className="form-input-premium" />
                                        </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="animate-wave-buoyancy-2" style={{animationDelay: '0.4s'}}>
                                                <Label htmlFor="email">Email Address</Label>
                                                <input id="email" name="email" type="email" value={form.email} onChange={onChange} className="form-input-premium" placeholder="name@example.com" />
                                            </div>
                                            <div className="animate-wave-buoyancy-3" style={{animationDelay: '0.5s'}}>
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <input id="phone" name="phone" value={form.phone} onChange={onChange} className="form-input-premium" placeholder="+94 7X XXX XXXX" />
                                            </div>
                                        </div>

                                        <div className="animate-wave-buoyancy-1" style={{animationDelay: '0.6s'}}>
                                        <Label htmlFor="address">Residential Address</Label>
                                        <textarea id="address" name="address" rows={4} value={form.address} onChange={onChange} className="form-input-premium" placeholder="No, Street, City" />
                                        </div>
                                    </div>
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row justify-end items-center gap-4">
                                        <button type="button" onClick={onDiscard} className="btn-secondary-premium w-full sm:w-auto">
                                            Discard
                                        </button>
                                        <button type="submit" disabled={saving || saved} className="btn-primary-premium w-full sm:w-auto">
                                            {saving ? 'Saving...' : (saved ? <>Saved <CheckIcon className="w-4 h-4 ml-2" /></> : 'Save Changes')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                    {activeTab === 'documents' && (
                        <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                             <SectionTitle 
                                title="My Documents" 
                                subtitle="Access your saved documents, applications, and official records." 
                            />
                            <div className="glass-morphism rounded-3xl p-6 sm:p-8 border border-border/50 shadow-glow text-center min-h-[400px] flex flex-col justify-center items-center">
                                <DocumentIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-6" />
                                <h3 className="text-xl font-bold mb-2">No Documents Found</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">Your uploaded documents and completed forms will appear here for easy access.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}