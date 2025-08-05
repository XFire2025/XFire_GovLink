"use client";
import React from 'react';

// --- COLOR PALETTE (Inspired by the Sri Lankan Flag) ---
// Maroon:  #8D153A (Deeper, more modern maroon)
// Gold:    #FFC72C
// Orange:  #FF5722 (Vibrant orange for accents)
// Green:   #008060 (Deep, rich green for accents)
// BG Dark: #111827 (Gray-900 for a neutral, dark background)

// --- SVG ICON COMPONENTS ---
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// --- PAGE SECTION COMPONENTS ---

const Header = () => (
  // Enhanced: Added a subtle bottom border for better definition on scroll
  <header className="sticky top-0 bg-[#111827]/60 backdrop-blur-lg border-b border-white/10 z-50">
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-[#FFC72C]">
        GovLink
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <a href="#" className="text-gray-300 hover:text-white transition-colors">Services</a>
        <a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a>
        <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
      </div>
      <button className="hidden md:block bg-transparent border border-[#FFC72C] text-[#FFC72C] px-4 py-2 rounded-md hover:bg-[#FFC72C] hover:text-black transition-colors font-semibold">
        Sign In
      </button>
      <div className="md:hidden">
        <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
      </div>
    </nav>
  </header>
);

const Hero = () => (
  <section className="bg-[#8D153A] text-white relative">
     {/* Decorative element to blend with background */}
    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#111827] to-transparent"></div>
    <div className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center relative z-10">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
        Simplifying Government for <span className="text-[#FFC72C]">Every Sri Lankan</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
        Ask questions, find services, and access information instantly. Your direct link to public services is here.
      </p>
      
      <div className="mt-10 w-full max-w-2xl">
        <form action="/chat" method="GET" className="relative">
          {/* Enhanced: Upgraded to a full glassmorphic input */}
          <textarea
            name="q"
            className="w-full bg-white/5 placeholder-gray-300 p-4 pr-16 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FFC72C] transition-all duration-300 shadow-lg text-lg backdrop-blur-sm border border-white/10"
            placeholder="e.g., How do I renew my passport?"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-[#FFC72C] hover:bg-yellow-400 rounded-lg transition-colors duration-200"
          >
            <ArrowRightIcon className="h-6 w-6 text-[#8D153A]" />
          </button>
        </form>
      </div>
    </div>
  </section>
);

const Features = () => {
  const featuresList = [
    {
      icon: <DocumentIcon className="h-8 w-8 text-[#FF5722]" />,
      title: "Access Forms & Documents",
      description: "Instantly find and download official government forms for passports, licenses, and more.",
      iconBgColor: "bg-[#FF5722]/20"
    },
    {
      icon: <InfoIcon className="h-8 w-8 text-[#008060]" />,
      title: "Get Instant Information",
      description: "Ask any question about public services and get clear, step-by-step guidance.",
      iconBgColor: "bg-[#008060]/20"
    },
    {
      icon: <CalendarIcon className="h-8 w-8 text-[#FFC72C]" />,
      title: "Schedule Appointments",
      description: "Find available slots and book appointments with government departments online.",
      iconBgColor: "bg-[#FFC72C]/20"
    },
  ];
  
  return (
    // Enhanced: Removed solid background to let the main page background show through
    <section className="text-white py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Everything You Need, All in One Place</h2>
          <p className="mt-2 text-gray-400">GovLink is designed to make your life easier.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            // --- GLASSMORPHISM CARD ---
            <div 
              key={index} 
              className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl hover:border-[#FFC72C] hover:-translate-y-2 transition-all duration-300"
            >
              {/* Enhanced: Icon background uses a transparent version of the icon color */}
              <div className={`flex items-center justify-center h-16 w-16 rounded-full mb-6 ${feature.iconBgColor}`}>
                  {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
    // Enhanced: Making it part of the dark theme with a transparent top border
    <footer className="bg-[#111827] text-white relative z-10">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-[#FFC72C]">
                GovLink
            </div>
            <div className="flex mt-4 md:mt-0 space-x-6">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-gray-300 text-sm">
            <p>&copy; {new Date().getFullYear()} GovLink Sri Lanka. An initiative to streamline public services.</p>
        </div>
      </div>
    </footer>
);

// --- New Background Component for GlassMorphism Effect ---
const BackgroundAuras = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
    <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#8D153A]/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
    <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#008060]/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#FF5722]/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
  </div>
);


// --- MAIN PAGE COMPONENT ---
export default function GovLinkPage() {
  return (
    <div className="bg-[#111827] min-h-screen relative">
      <BackgroundAuras />
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