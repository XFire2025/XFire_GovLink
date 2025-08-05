// app/page.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header'; // Use the shared header

// --- ICONS (Unchanged) ---
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);


// --- PAGE SECTION COMPONENTS ---

const Hero = () => (
  <section className="relative bg-brand-maroon text-primary-foreground">
    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center relative z-10"
    >
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
        Simplifying Government for <span className="text-brand-gold">Every Sri Lankan</span>
      </h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-4 max-w-2xl text-lg md:text-xl text-gray-300">
        Ask questions, find services, and access information instantly. Your direct link to public services is here.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-10 w-full max-w-2xl">
        <form action="/chat" method="GET" className="relative">
          <textarea
            name="q"
            className="w-full bg-white/10 dark:bg-black/20 placeholder-gray-400 dark:placeholder-gray-500 text-white p-4 pr-20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 shadow-lg text-lg backdrop-blur-sm border border-white/20"
            placeholder="e.g., How do I renew my passport?"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-brand-gold hover:bg-yellow-400 rounded-lg transition-colors duration-200 group">
            <ArrowRightIcon className="h-6 w-6 text-brand-maroon transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </motion.div>
    </motion.div>
  </section>
);

const Features = () => {
  const featuresList = [
    { icon: <DocumentIcon className="h-8 w-8 text-brand-orange" />, title: "Access Forms & Documents", description: "Instantly find and download official government forms for passports, licenses, and more.", iconBgColor: "bg-brand-orange/20" },
    { icon: <InfoIcon className="h-8 w-8 text-brand-green" />, title: "Get Instant Information", description: "Ask any question about public services and get clear, step-by-step guidance.", iconBgColor: "bg-brand-green/20" },
    { icon: <CalendarIcon className="h-8 w-8 text-brand-gold" />, title: "Schedule Appointments", description: "Find available slots and book appointments with government departments online.", iconBgColor: "bg-brand-gold/20" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  return (
    <section className="py-20 lg:py-28 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Everything You Need, All in One Place</h2>
          <p className="mt-3 text-lg text-muted-foreground">GovLink is designed to make your life easier.</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuresList.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-card p-8 rounded-2xl border shadow-lg hover:shadow-xl hover:border-brand-gold hover:-translate-y-2 transition-all duration-300"
              variants={itemVariants}
            >
              <div className={`flex items-center justify-center h-16 w-16 rounded-full mb-6 ${feature.iconBgColor}`}>
                  {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
    <footer className="bg-secondary/50 text-foreground relative z-10">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="text-2xl font-bold text-brand-gold mb-4 md:mb-0">GovLink</div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} GovLink Sri Lanka. An initiative to streamline public services.</p>
        </div>
      </div>
    </footer>
);

const BackgroundAuras = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
    <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-maroon/20 dark:bg-brand-maroon/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
    <div className="absolute top-1/2 -right-40 w-96 h-96 bg-brand-green/20 dark:bg-brand-green/30 rounded-full filter blur-3xl opacity-50 animate-pulse [animation-delay:2s]"></div>
    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-orange/20 dark:bg-brand-orange/30 rounded-full filter blur-3xl opacity-50 animate-pulse [animation-delay:4s]"></div>
  </div>
);

export default function Home() {
  return (
    // The "dark" class is now handled by next-themes on the <html> tag
    <div className="bg-background text-foreground min-h-screen relative isolate">
      <BackgroundAuras />
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}