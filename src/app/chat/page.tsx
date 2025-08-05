// app/chat/page.tsx
"use client";
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';

// --- ICONS ---
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GovLinkBotIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--brand-gold)]">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-4.3-7.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm8.6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

// --- UI COMPONENTS (Animated) ---

const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

const UserMessage = ({ text }: { text: string }) => (
  <motion.div
    className="flex justify-end my-2"
    variants={messageVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="bg-[var(--brand-maroon)] text-white p-3 md:p-4 rounded-xl rounded-br-none max-w-sm md:max-w-xl lg:max-2xl shadow-md">
      <p className="text-sm md:text-base">{text}</p>
    </div>
  </motion.div>
);

const BotMessage = ({ text }: { text: string }) => (
  <motion.div
    className="flex justify-start my-2 gap-3"
    variants={messageVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.3 }}
  >
    <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-full flex items-center justify-center border">
      <GovLinkBotIcon className="h-7 w-7" />
    </div>
    <div className="bg-muted text-muted-foreground p-3 md:p-4 rounded-xl rounded-bl-none max-w-sm md:max-w-xl lg:max-w-2xl shadow-md">
       <p className="text-sm md:text-base">{text}</p>
    </div>
  </motion.div>
);

const ChatInput = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;
    
    if (question.trim()) {
      // Here you would typically send the question to your chat API
      console.log('Sending question:', question);
      
      // Clear the textarea
      const textarea = e.currentTarget.querySelector('textarea');
      if (textarea) {
        textarea.value = '';
        textarea.style.height = 'auto';
      }
    }
  };

  return (
    <motion.div 
      layoutId="search-container"
      className="sticky bottom-0 bg-background/80 backdrop-blur-xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4 border-t border-border">
        <form onSubmit={handleSubmit} className="relative">
          <motion.textarea
            layoutId="search-input"
            name="question"
            className="w-full bg-input text-foreground placeholder-muted-foreground p-4 pr-16 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all duration-300 shadow-inner"
            placeholder="Ask a follow-up question..."
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.closest('form');
                if (form) {
                  form.requestSubmit();
                }
              }
            }}
          />
          <motion.button 
            layoutId="submit-button"
            type="submit" 
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-[var(--brand-gold)] hover:bg-yellow-400 rounded-lg transition-colors duration-200 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRightIcon className="h-6 w-6 text-[var(--brand-maroon)] transition-transform group-hover:translate-x-1" />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

function ChatContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const userQuery = q || "You haven't asked a question yet. Try asking one from the home page!";
  const botResponse = `Of course! To renew your Sri Lankan passport, you will need to submit the 'K' form, along with your current passport, National Identity Card, and two recent passport-sized photos. You can download the form from the Department of Immigration and Emigration website or collect one from our head office. Would you like a direct link to the form?`;

  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-8 border-b border-border/50"
      >
        <motion.h1 
          layoutId="main-title"
          className="text-2xl md:text-3xl font-bold text-foreground mb-2"
        >
          Chat with <span className="text-[var(--brand-gold)]">GovLink Assistant</span>
        </motion.h1>
        <p className="text-muted-foreground">Get instant answers to your government service questions</p>
      </motion.div>

      {/* Chat Messages */}
      <div className="space-y-4 pb-8">
        <UserMessage text={userQuery} />
        <BotMessage text={botResponse} />
      </div>
    </div>
  );
}

export default function GovLinkChatPage() {
  return (
    <motion.div 
      className="flex flex-col h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <motion.main 
        className="flex-1 overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container mx-auto p-4 md:p-6">
          <Suspense fallback={
            <motion.div 
              className="text-center text-muted-foreground p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Loading chat…
            </motion.div>
          }>
            <ChatContent />
          </Suspense>
        </div>
      </motion.main>
      <ChatInput />
    </motion.div>
  );
}