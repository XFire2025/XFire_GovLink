// app/verification/page.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle"; // Assuming ThemeToggle is in this path

// --- GLOBAL PARTICLE BACKGROUND COMPONENT (Consistent with other pages) ---
const GlobalParticleBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Light Mode Flag Background */}
        <div className="absolute inset-0 opacity-[0.25] sm:opacity-[0.30] md:opacity-[0.35] dark:opacity-0">
            <Image src="/flag-of-sri-lanka-1.gif" alt="Sri Lankan Flag Background" fill className="object-cover object-center animate-pulse-move" style={{ filter: 'contrast(2.2) brightness(0.45) saturate(2.2) sepia(0.25) hue-rotate(8deg)', mixBlendMode: 'multiply' }} unoptimized priority={false} />
        </div>
        {/* Dark Mode Flag Background */}
        <div className="absolute inset-0 opacity-0 dark:opacity-[0.02] sm:dark:opacity-[0.025] md:dark:opacity-[0.03]">
            <Image src="/flag-of-sri-lanka-1.gif" alt="Sri Lankan Flag Background" fill className="object-cover object-center animate-pulse-move" unoptimized priority={false} />
        </div>
        {/* Specific particles for this page */}
        <div className="absolute top-20 right-6 h-32 w-32 rounded-full bg-[#FF5722]/20 dark:bg-[#FF5722]/10 blur-xl animate-drift-reverse" />
        <div className="absolute bottom-16 left-10 h-36 w-36 rounded-full bg-[#008060]/15 dark:bg-[#008060]/8 blur-xl animate-orbit" />
    </div>
);

// --- PREMIUM SVG ICON COMPONENTS ---
const LotusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100" fill="none"><path d="M50 10C45 15 35 25 30 35C25 45 30 55 40 60C45 62 55 62 60 60C70 55 75 45 70 35C65 25 55 15 50 10Z" fill="url(#lotus-gradient)"/><path d="M50 15C45 20 40 30 35 40C30 50 35 60 45 65C50 67 60 67 65 65C75 60 80 50 75 40C70 30 65 20 50 15Z" fill="url(#lotus-gradient-inner)"/><defs><linearGradient id="lotus-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor: '#FFC72C', stopOpacity: 1}} /><stop offset="50%" style={{stopColor: '#FF5722', stopOpacity: 1}} /><stop offset="100%" style={{stopColor: '#8D153A', stopOpacity: 1}} /></linearGradient><linearGradient id="lotus-gradient-inner" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor: '#FFC72C', stopOpacity: 0.7}} /><stop offset="100%" style={{stopColor: '#FF5722', stopOpacity: 0.7}} /></linearGradient></defs></svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

const IdCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="6" y1="10" x2="10" y2="10"></line><line x1="14" y1="15" x2="18" y2="15"></line><line x1="6" y1="15" x2="10" y2="15"></line><path d="M14 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 3.03 1.1 5.4 3 7h8c1.9-1.6 3-3.97 3-7a7 7 0 0 0-7-7Z"/></svg>
);

// --- PREMIUM HEADER (Simplified for Verification Flow) ---
const Header = () => (
    <header className="fixed top-0 w-full z-50 transition-all duration-500 bg-transparent">
        <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex justify-between items-center">
                <a href="/" className="flex items-center space-x-2 sm:space-x-3 animate-fade-in-up hover:scale-105 transition-all duration-300">
                    <LotusIcon className="animate-glow w-8 h-8 sm:w-10 sm:h-10" />
                    <div className="text-left">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gradient">GovLink</h1>
                        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Sri Lanka</p>
                    </div>
                </a>
                <ThemeToggle />
            </div>
        </nav>
    </header>
);

// --- PREMIUM FOOTER ---
const Footer = () => (
    <footer className="relative py-20 mt-32">
        <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="pt-8 border-t border-border text-center">
                <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} GovLink Sri Lanka. An initiative to streamline public services.</p>
            </div>
        </div>
    </footer>
);

// --- REUSABLE UI COMPONENTS ---
const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-title-wave"><span className="text-gradient animate-glow">{title}</span></h1>
        {subtitle && <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-subtitle-wave" style={{animationDelay: '0.1s'}}>{subtitle}</p>}
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#FFC72C] to-[#FF5722] animate-wave-buoyancy-1" />
    </div>
);

function Dropzone({ title, hint, onFile, onRemove, accept = ["image/jpeg", "image/png", "image/webp"], file, icon: Icon }: { title: string; hint?: string; onFile: (file: File) => void; onRemove: () => void; accept?: string[]; file: File | null; icon: React.ElementType }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isOver, setIsOver] = useState(false);
    const previewUrl = file ? URL.createObjectURL(file) : null;
  
    const handleFile = (selectedFile: File | undefined) => {
        if (selectedFile) onFile(selectedFile);
    };

    return (
        <div className="w-full">
            <div 
                className={`relative group glass-morphism p-6 rounded-3xl border border-border hover:border-[#FFC72C] transition-all duration-300 ${isOver ? 'shadow-glow border-[#FFC72C]' : ''}`}
                onDragEnter={(e) => { e.preventDefault(); setIsOver(true); }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={() => setIsOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsOver(false); handleFile(e.dataTransfer.files[0]); }}
            >
                <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-1">{title}</h3>
                    <p className="text-muted-foreground text-sm">{hint}</p>
                </div>
                <div 
                    onClick={() => !file && inputRef.current?.click()}
                    className="relative cursor-pointer w-full h-56 border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center bg-card/30 group-hover:border-[#FFC72C]/70 transition-colors duration-300 overflow-hidden"
                >
                    {previewUrl ? (
                        <>
                            <Image src={previewUrl} alt={`${title} preview`} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end items-center p-4">
                               <div className="w-12 h-12 bg-green-500/80 rounded-full flex items-center justify-center mb-2 border-2 border-white/50 backdrop-blur-sm">
                                   <CheckIcon className="w-6 h-6 text-white"/>
                               </div>
                               <p className="text-white font-semibold text-sm">Upload Successful</p>
                            </div>
                            <button onClick={onRemove} className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors">
                                <CloseIcon className="w-4 h-4"/>
                            </button>
                        </>
                    ) : (
                        <div className="text-center p-4">
                            <Icon className="mx-auto h-12 w-12 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
                            <p className="mt-2 text-sm text-muted-foreground">Drag & drop or <span className="font-semibold text-[#FFC72C] hover:underline">browse files</span></p>
                        </div>
                    )}
                </div>
                <input ref={inputRef} type="file" accept={accept.join(",")} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            </div>
        </div>
    );
}

// --- MAIN VERIFICATION PAGE COMPONENT ---
export default function VerificationPage() {
    const [nicFile, setNicFile] = useState<File | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);

    return (
        <div className="bg-background text-foreground min-h-screen relative theme-transition-slow">
            <GlobalParticleBackground />
            <div className="relative z-10 theme-transition-fast">
                <Header />
                <main className="container mx-auto px-4 sm:px-6 py-32 sm:py-40">
                    <SectionTitle title="Identity Verification" subtitle="To keep your account secure, please upload the required documents." />
                    

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                        {/* Uploaders */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="animate-wave-buoyancy-1 md:col-span-1">
                             <Dropzone title="Upload NIC" hint="Front side of your National ID." onFile={setNicFile} onRemove={() => setNicFile(null)} file={nicFile} icon={IdCardIcon} />
                           </div>
                           <div className="animate-wave-buoyancy-2 md:col-span-1">
                              <Dropzone title="Upload Selfie" hint="Hold your NIC next to your face." onFile={setSelfieFile} onRemove={() => setSelfieFile(null)} file={selfieFile} icon={CameraIcon} />
                           </div>
                        </div>

                        {/* Tips Panel */}
                        <aside className="lg:col-span-2 sticky top-32 glass-morphism p-6 rounded-3xl border border-border/50 shadow-glow animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                            <div className="flex items-center gap-3 mb-4">
                                <LightbulbIcon className="w-6 h-6 text-[#FFC72C]"/>
                                <h3 className="text-xl font-bold text-gradient">Tips for Success</h3>
                            </div>
                            <ul className="space-y-3">
                                {[{icon: '☀️', text: 'Use a well-lit area, avoid shadows.'}, {icon: '🕶️', text: 'Remove glasses and headwear.'}, {icon: '📄', text: 'Ensure all text on the NIC is clear and readable.'}, {icon: '🖼️', text: 'Fit the entire document inside the frame.'}].map(tip => (
                                    <li key={tip.text} className="flex items-start gap-3">
                                        <span className="text-lg mt-0.5">{tip.icon}</span>
                                        <span className="text-muted-foreground text-sm">{tip.text}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#008060]/20 to-[#FFC72C]/20 border border-[#008060]/30 text-center">
                                <p className="font-semibold text-sm text-foreground/80">Your data is encrypted and secure.</p>
                            </div>
                        </aside>
                    </div>
                </main>
                <Footer />

                {/* Sticky Action Bar */}
                <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none">
                   <div className="w-full sm:w-auto animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                     <div className="pointer-events-auto glass-morphism backdrop-blur-xl border-t sm:border border-border/50 sm:rounded-2xl shadow-glow flex items-center gap-4 px-5 py-3 sm:mb-6">
                        <button type="button" className="btn-secondary-premium w-full sm:w-auto">Cancel</button>
                        <button type="button" className="btn-primary-premium w-full sm:w-auto" disabled={!nicFile || !selfieFile} onClick={() => alert("Proceeding to verification...")}>
                            Submit for Verification
                        </button>
                    </div>
                   </div>
                </div>
            </div>
        </div>
    );
}