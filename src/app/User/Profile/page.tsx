// app/profile/page.tsx
"use client";

import React, { useState, useMemo, useRef, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';

// --- GLOBAL PARTICLE BACKGROUND COMPONENT (Static, no animations) ---
const GlobalParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Light Mode Enhanced Flag Background - Mobile First Responsive */}
      <div className="absolute inset-0 opacity-[0.25] sm:opacity-[0.30] md:opacity-[0.35] dark:opacity-0">
        <Image 
          src="/flag-of-sri-lanka-1.gif" 
          alt="Sri Lankan Flag Background" 
          fill
          className="object-cover object-center scale-110 sm:scale-105 md:scale-100"
          style={{
            filter: 'contrast(2.2) brightness(0.45) saturate(2.2) sepia(0.25) hue-rotate(8deg)',
            mixBlendMode: 'multiply'
          }}
          unoptimized={true}
          priority={false}
        />
      </div>
      
      {/* Dark Mode Flag Background - Mobile First Responsive */}
      <div className="absolute inset-0 opacity-0 dark:opacity-[0.02]">
        <Image 
          src="/flag-of-sri-lanka-1.gif" 
          alt="Sri Lankan Flag Background" 
          fill
          className="object-cover object-center scale-110 sm:scale-105 md:scale-100"
          unoptimized={true}
          priority={false}
        />
      </div>
      
      {/* Subtle static accents (no movement) */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#8D153A]/10 dark:bg-[#FFC72C]/6 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-20 w-20 h-20 bg-[#FF5722]/12 dark:bg-[#FF5722]/6 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-8 h-36 w-36 rounded-full bg-[#008060]/10 dark:bg-[#008060]/6 blur-2xl" />
      <div className="absolute bottom-6 right-10 h-24 w-24 rounded-full bg-[#FFC72C]/15 dark:bg-[#FFC72C]/8 blur-xl" />
    </div>
  );
};

// --- PREMIUM SVG ICON COMPONENTS ---
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

// --- DEFAULT AVATAR (INLINE SVG) ---
const DefaultAvatar = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 144 144"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Default profile avatar"
    className={className}
  >
    <defs>
      <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC72C" />
        <stop offset="60%" stopColor="#FF5722" />
        <stop offset="100%" stopColor="#8D153A" />
      </linearGradient>
    </defs>
    {/* Outer circle */}
    <circle cx="72" cy="72" r="70" fill="url(#avatarGradient)" opacity="0.18" />
    <circle cx="72" cy="72" r="62" fill="currentColor" className="text-card" opacity="0.75" />
    {/* User silhouette */}
    <g fill="none" stroke="url(#avatarGradient)" strokeWidth="6" strokeLinecap="round">
      <circle cx="72" cy="56" r="20" fill="none" />
      <path d="M32 112c6-18 24-30 40-30s34 12 40 30" />
    </g>
  </svg>
);

// --- FOOTER ---
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
    <div className="mb-12 sm:mb-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
        <span className="text-gradient">{title}</span>
      </h1>
      {subtitle && (
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-muted-foreground mb-2">
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

  // Use undefined to indicate "no avatar"; only build object URL when a file exists
  const previewUrl = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : undefined), [avatarFile]);

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
    await new Promise((r) => setTimeout(r, 1500)); 
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const completeness = Object.values(form).filter(Boolean).length;
  const completenessPct = Math.round((completeness / 6) * 100);

  const TABS = [
    { id: 'details', label: 'Personal Details', icon: <UserIcon className="w-5 h-5 mr-3"/> },
    { id: 'documents', label: 'My Documents', icon: <DocumentIcon className="w-5 h-5 mr-3"/> },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen relative">
      <GlobalParticleBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-32 sm:py-40">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* --- SIDEBAR --- */}
            <aside className="lg:col-span-3 mb-12 lg:mb-0">
              <div className="glass-morphism p-4 rounded-2xl border border-border/50 space-y-2">
                {TABS.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id 
                      ? 'bg-card/80 text-foreground'
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
                <div>
                  <SectionTitle 
                    title="Personal Details" 
                    subtitle="Manage your personal information, address, and contact details." 
                  />
                  <form onSubmit={onSubmit} >
                    <div className="glass-morphism rounded-3xl p-6 sm:p-8 border border-border/50">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Left: Avatar + Completeness */}
                        <div className="lg:col-span-1 flex flex-col items-center">
                          <div className="relative group w-48 h-48 sm:w-56 sm:h-56 mb-6">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFC72C]/20 via-[#FF5722]/20 to-[#8D153A]/20 blur-lg"></div>
                            {/* Avatar: show uploaded image if present, otherwise SVG */}
                            {previewUrl ? (
                              <Image 
                                src={previewUrl} 
                                alt="Profile Avatar"
                                width={224}
                                height={224}
                                className="relative w-full h-full object-cover rounded-full border-4 border-card/80"
                              />
                            ) : (
                              <DefaultAvatar className="relative w-full h-full rounded-full border-4 border-card/80" />
                            )}
                            <button
                              type="button"
                              onClick={() => fileRef.current?.click()}
                              className="absolute bottom-2 right-2 w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-border hover:bg-card hover:border-[#FFC72C]"
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
                              <div className="h-full bg-gradient-to-r from-[#FFC72C] to-[#FF5722]" style={{ width: `${completenessPct}%` }}/>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3 text-center">A complete profile helps us serve you better.</p>
                          </div>
                        </div>

                        {/* Right: Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <input id="name" name="name" value={form.name} onChange={onChange} className="form-input-premium" placeholder="e.g. Sanduni Perera" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="nic">National ID (NIC)</Label>
                              <input id="nic" name="nic" value={form.nic} onChange={onChange} className="form-input-premium" placeholder="Enter your NIC number" />
                            </div>
                            <div>
                              <Label htmlFor="dob">Date of Birth</Label>
                              <input id="dob" name="dob" type="date" value={form.dob} onChange={onChange} className="form-input-premium" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="email">Email Address</Label>
                              <input id="email" name="email" type="email" value={form.email} onChange={onChange} className="form-input-premium" placeholder="name@example.com" />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <input id="phone" name="phone" value={form.phone} onChange={onChange} className="form-input-premium" placeholder="+94 7X XXX XXXX" />
                            </div>
                          </div>

                          <div>
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
                <div>
                  <SectionTitle 
                    title="My Documents" 
                    subtitle="Access your saved documents, applications, and official records." 
                  />
                  <div className="glass-morphism rounded-3xl p-6 sm:p-8 border border-border/50 text-center min-h-[400px] flex flex-col justify-center items-center">
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
