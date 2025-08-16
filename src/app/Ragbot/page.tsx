// src/app/Ragbot/page.tsx
"use client";
import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import { useAuth } from '@/lib/auth/AuthContext';
import { Header } from '@/components/Header';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

// --- BOOKING DETECTION UTILITY ---
const detectBookingIntent = (message: string): boolean => {
  const bookingKeywords = [
    // Direct booking terms
    'book', 'booking', 'appointment', 'schedule', 'session', 'meeting',
    'reserve', 'reservation', 'slot', 'time slot', 'visit', 'consultation',
    
    // Action phrases
    'book a session', 'book appointment', 'schedule appointment', 'book a meeting',
    'make appointment', 'arrange meeting', 'set up meeting', 'schedule a visit',
    'book a consultation', 'reserve a slot', 'get an appointment',
    
    // Intent variations
    'i want to book', 'i need to book', 'can i book', 'how to book',
    'i want an appointment', 'i need an appointment', 'can i schedule',
    'when can i meet', 'arrange a meeting', 'set appointment',
    
    // Sri Lankan context
    'මුණගැසීම', 'හමුවීම', 'කාලය', 'වේලාව', // Sinhala
    'சந்திப்பு', 'நேரம்', 'முன்பதிவு' // Tamil
  ];
  
  const messageWords = message.toLowerCase();
  return bookingKeywords.some(keyword => 
    messageWords.includes(keyword.toLowerCase())
  );
};

const createBookingResponse = (isAuthenticated: boolean, router?: ReturnType<typeof useRouter>): Message => {
  if (isAuthenticated) {
    // Auto-redirect authenticated users after a short delay
    setTimeout(() => {
      if (router) {
        router.push('/user/booking');
      }
    }, 2000);

    return {
      type: 'bot',
      text: `🎯 **Perfect! Redirecting you to the booking system...**

I've detected that you want to book a session or appointment. Since you're logged in, I'm automatically redirecting you to our booking system where you can:

✅ **Choose your preferred service**
✅ **Select available time slots**  
✅ **Pick the right department**
✅ **Get instant confirmation**

🔄 **Redirecting in 2 seconds...**

If the redirect doesn't work, [🔗 **click here to access the booking system**](/user/booking/new)

*You can also continue asking me questions about government services!*`,
      timestamp: new Date(),
      sources: []
    };
  } else {
    return {
      type: 'bot',
      text: `🔐 **I'd love to help you book an appointment!**

To book a session or appointment with government services, you'll need to **create an account** or **log in** first. This ensures:

🛡️ **Secure booking** - Your appointments are protected
📧 **Email confirmations** - Get booking confirmations and reminders  
📱 **Manage appointments** - View, reschedule, or cancel easily
👤 **Personalized service** - Faster booking with saved preferences

**Ready to get started?**

[🚀 **Create Account**](/user/auth/register) | [🔑 **Login**](/user/auth/login)

After logging in, I can redirect you directly to our booking system! 

*Feel free to ask me any other questions about government services in the meantime.*`,
      timestamp: new Date(),
      sources: []
    };
  }
};
type Language = 'en' | 'si' | 'ta';

interface DepartmentContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  services: string[];
  source?: string;
}

interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  departmentContacts?: DepartmentContact[];
  sources?: string[];
}

// --- TRANSLATIONS ---
const chatTranslations: Record<Language, {
  title: string;
  subtitle: string;
  newChat: string;
  askFollowUp: string;
  analyzing: string;
  preparing: string;
  chatStarted: string;
  suggestions: {
    moreDetails: string;
    relatedServices: string;
    howToApply: string;
    contactInfo: string;
    bookAppointment: string;
  };
  contactDetails: string;
  sources: string;
}> = {
  en: {
    title: 'GovLink RAG',
    subtitle: 'AI-powered assistant with real-time search for Sri Lankan government services',
    newChat: 'New Chat',
    askFollowUp: 'Ask a question about any government service...',
    analyzing: 'Analyzing your question',
    preparing: 'GovLink Assistant is preparing your response',
    chatStarted: 'Chat started with GovLink Assistant',
    suggestions: {
      moreDetails: 'More details about passport renewal',
      relatedServices: 'Related services for business registration',
      howToApply: 'How do I apply for a marriage certificate?',
      contactInfo: 'Contact info for Ministry of Education',
      bookAppointment: 'Book an appointment with a government office'
    },
    contactDetails: 'Department Contacts',
    sources: 'Sources'
  },
  si: {
    title: 'GovLink RAG',
    subtitle: 'ශ්‍රී ලංකා රජයේ සේවා සඳහා තත්‍ය කාලීන සෙවුම් සහිත AI බලැති සහකාර',
    newChat: 'නව කතාබස්',
    askFollowUp: 'ඕනෑම රජයේ සේවාවක් ගැන ප්‍රශ්නයක් අසන්න...',
    analyzing: 'ඔබගේ ප්‍රශ්නය විශ්ලේෂණය කරමින්...',
    preparing: 'GovLink සහායක ඔබගේ පිළිතුර සූදානම් කරමින්',
    chatStarted: 'GovLink සහායක සමඟ කතාබස් ආරම්භ විය',
    suggestions: {
      moreDetails: 'විදේශ ගමන් බලපත්‍ර අලුත් කිරීම පිළිබඳ වැඩි විස්තර',
      relatedServices: 'ව්‍යාපාර ලියාපදිංචිය සඳහා අදාළ සේවා',
      howToApply: 'විවාහ සහතිකයක් සඳහා අයදුම් කරන්නේ කෙසේද?',
      contactInfo: 'අධ්‍යාපන අමාත්‍යාංශයේ සම්බන්ධතා තොරතුරු',
      bookAppointment: 'රජයේ කාර්යාලයක් සමඟ හමුවීමක් වෙන් කරන්න'
    },
    contactDetails: 'දෙපාර්තමේන්තු සම්බන්ධතා',
    sources: 'මූලාශ්‍ර'
  },
  ta: {
    title: 'GovLink RAG',
    subtitle: 'இலங்கை அரசாங்க சேவைகளுக்கான நேரடி தேடல் கொண்ட AI உதவியாளர்',
    newChat: 'புதிய அரட்டை',
    askFollowUp: 'எந்தவொரு அரசாங்க சேவை பற்றியும் ஒரு கேள்வியைக் கேளுங்கள்...',
    analyzing: 'உங்கள் கேள்வியை பகுப்பாய்வு செய்கிறது...',
    preparing: 'GovLink உதவியாளர் உங்கள் பதிலை தயாரிக்கிறது',
    chatStarted: 'GovLink உதவியாளருடன் அரட்டை தொடங்கப்பட்டது',
    suggestions: {
      moreDetails: 'கடவுச்சீட்டு புதுப்பித்தல் பற்றிய கூடுதல் விவரங்கள்',
      relatedServices: 'வணிகப் பதிவிற்கான தொடர்புடைய சேவைகள்',
      howToApply: 'திருமணச் சான்றிதழுக்கு நான் எப்படி விண்ணப்பிப்பது?',
      contactInfo: 'கல்வி அமைச்சுக்கான தொடர்புத் தகவல்',
      bookAppointment: 'அரசு அலுவலகத்துடன் சந்திப்பை முன்பதிவு செய்யுங்கள்'
    },
    contactDetails: 'துறை தொடர்புகள்',
    sources: 'ஆதாரங்கள்'
  }
};

// --- ICON COMPONENTS ---
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1"/>
    <rect width="7" height="5" x="14" y="3" rx="1"/>
    <rect width="7" height="9" x="14" y="12" rx="1"/>
    <rect width="7" height="5" x="3" y="16" rx="1"/>
  </svg>
);

const LoginIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10,17 15,12 10,7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

// --- NAVIGATION COMPONENT ---
const ChatbotNavigation = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      router.push('/user/dashboard');
    } else {
      router.push('/user/auth/login');
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {/* Home Button */}
      <button
        onClick={handleHomeClick}
        className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-200"
        title="Go to Home"
      >
        <HomeIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Home</span>
      </button>

      {/* Dashboard/Login Button */}
      <button
        onClick={handleDashboardClick}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFC72C]/90 to-[#FF5722]/90 backdrop-blur-md border border-[#FFC72C]/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-white"
        title={isAuthenticated ? "Go to Dashboard" : "Login to Dashboard"}
      >
        {isAuthenticated ? (
          <>
            <DashboardIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </>
        ) : (
          <>
            <LoginIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Login</span>
          </>
        )}
      </button>
    </div>
  );
};

const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0L9.937 15.5Z"/>
  </svg>
);

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

const RAGBotIcon = () => (
  <div className="relative">
    <LotusIcon className="w-10 h-10" />
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center animate-pulse">
      <SparklesIcon className="w-2 h-2 text-white" />
    </div>
  </div>
);

// --- MESSAGE COMPONENTS ---
const TimeAgo = ({ timestamp }: { timestamp: Date }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

      if (diff < 60) {
        setTimeAgo('Just now');
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        setTimeAgo(`${minutes}m ago`);
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        setTimeAgo(`${hours}h ago`);
      } else {
        const days = Math.floor(diff / 86400);
        setTimeAgo(`${days}d ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span className="text-xs text-muted-foreground">{timeAgo}</span>;
};

const TopicTag = ({ text }: { text: string }) => (
  <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#FFC72C]/20 to-[#FF5722]/20 border border-[#FFC72C]/30 rounded-full text-sm font-medium text-[#FFC72C] backdrop-blur-sm">
    <div className="w-2 h-2 bg-[#FFC72C] rounded-full mr-2 animate-pulse"></div>
    {text}
  </div>
);

const UserMessage = ({ text, timestamp = new Date() }: { text: string; timestamp?: Date }) => (
  <div className="flex justify-end my-6 animate-fade-in-up">
    <div className="max-w-2xl">
      <div className="bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white p-6 rounded-2xl rounded-br-lg shadow-lg hover:shadow-2xl transition-all duration-300">
        <p className="leading-relaxed font-medium">{text}</p>
      </div>
      <div className="text-right mt-2">
        <TimeAgo timestamp={timestamp} />
      </div>
    </div>
  </div>
);

const TypingIndicator = ({ language = 'en' }: { language?: Language }) => {
  const t = chatTranslations[language];
  return (
    <div className="flex justify-start my-6 animate-fade-in-up">
      <div className="flex gap-4 max-w-4xl">
        <div className="flex-shrink-0">
          <RAGBotIcon />
        </div>
        <div className="flex-1">
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl rounded-bl-lg shadow-glow border border-border/50 modern-card">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#FFC72C] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-[#FF5722] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-[#8D153A] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
              <span className="text-muted-foreground text-sm">{t.analyzing}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DepartmentContactCard = ({ contact }: { contact: DepartmentContact }) => (
  <div className="bg-card/60 dark:bg-card/80 backdrop-blur-sm p-4 rounded-lg border border-border/30 hover:border-[#FFC72C]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
    <h4 className="font-semibold text-[#FFC72C] mb-2 text-sm">{contact.name}</h4>
    <div className="space-y-1 text-xs text-muted-foreground">
      {contact.phone && <p>📞 {contact.phone}</p>}
      {contact.email && <p>✉️ {contact.email}</p>}
      {contact.website && (
        <p>🌐 <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-[#FFC72C] hover:text-[#FF5722] underline decoration-dotted underline-offset-2">{contact.website}</a></p>
      )}
    </div>
  </div>
);

const SourcesSection = ({ sources, language = 'en' }: { sources: string[]; language?: Language }) => {
  const t = chatTranslations[language];
  
  if (!sources || sources.length === 0) return null;
  
  return (
    <div className="mt-6 pt-4 border-t border-border/20">
      <h4 className="text-sm font-semibold text-[#FFC72C] mb-3 flex items-center gap-2">
        📚 {t.sources}
      </h4>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-black/20 hover:bg-black/30 text-xs text-[#FFC72C] hover:text-[#FF5722] rounded-full border border-[#FFC72C]/20 hover:border-[#FFC72C]/40 transition-all duration-300 hover:scale-105 font-mono"
          >
            🔗 {new URL(source).hostname}
          </a>
        ))}
      </div>
    </div>
  );
};

const BotMessage = ({ message, language = 'en' }: { message: Message; language?: Language }) => {
  const { text, timestamp, departmentContacts, sources } = message;
  return (
    <div className="flex justify-start my-6 animate-fade-in-up">
      <div className="flex gap-4 max-w-4xl">
        <div className="flex-shrink-0">
          <RAGBotIcon />
        </div>
        <div className="flex-1">
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl rounded-bl-lg shadow-glow border border-border/50 modern-card hover:border-[#FFC72C]/30 transition-all duration-300">
            <div className="prose prose-lg max-w-none leading-relaxed text-foreground markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                skipHtml={false}
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-[#FFC72C] border-b-2 border-[#FFC72C] pb-2 mb-4 mt-6 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-[#FFC72C] mb-3 mt-6">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold text-[#FF5722] mb-2 mt-4">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-[#FFC72C]">{children}</strong>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 border border-[#FFC72C]/30 text-[#FFC72C] hover:text-[#FF5722] hover:border-[#FF5722]/50 transition-all duration-300 font-medium text-sm shadow-sm hover:shadow-md backdrop-blur-sm"
                    >
                      <span className="text-xs">🔗</span>
                      {children}
                      <span className="text-xs opacity-70">↗</span>
                    </a>
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            </div>

            {departmentContacts && departmentContacts.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border/20">
                <h4 className="text-sm font-semibold text-[#FFC72C] mb-3 flex items-center gap-2">
                  🏛️ {chatTranslations[language].contactDetails}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {departmentContacts.map((contact) => (
                    <DepartmentContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
              </div>
            )}

            {sources && <SourcesSection sources={sources} language={language} />}
          </div>
          <div className="mt-2">
            <TimeAgo timestamp={timestamp} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CHAT INPUT COMPONENT ---
const ChatInput = ({ onSendMessage, language = 'en', disabled = false }: { onSendMessage: (message: string) => void; language?: Language; disabled?: boolean }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = chatTranslations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/20 bg-background/95 dark:bg-background/95 backdrop-blur-md shadow-2xl">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative bg-card/90 dark:bg-card/95 backdrop-blur-md border-2 border-border/50 hover:border-[#FFC72C]/70 rounded-xl p-1.5 transition-all duration-500 hover:shadow-2xl shadow-lg modern-card focus-within:border-[#FFC72C] focus-within:shadow-2xl">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.askFollowUp}
              disabled={disabled}
              className="w-full bg-transparent text-foreground placeholder-muted-foreground p-3 pr-14 rounded-lg resize-none focus:outline-none text-base leading-relaxed border-none font-medium min-h-[50px] max-h-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.max(target.scrollHeight, 50)}px`;
              }}
            />
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-[#FFC72C] via-[#FF5722] to-[#8D153A] hover:from-[#FF5722] hover:via-[#8D153A] hover:to-[#FFC72C] rounded-lg transition-all duration-300 hover:scale-110 shadow-xl group hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <SendIcon className="h-5 w-5 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            {Object.values(t.suggestions).slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(suggestion)}
                disabled={disabled}
                className="px-3 py-1.5 bg-card/50 dark:bg-card/70 hover:bg-card border border-border/50 hover:border-[#FFC72C]/60 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 text-foreground hover:text-[#FFC72C] backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

// --- VISITOR LAYOUT COMPONENT ---
const VisitorLayout = ({ 
  children, 
  title, 
  subtitle
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle?: string;
}) => {
  const [showNotice, setShowNotice] = useState(true);
  
  return (
    <div className="min-h-screen bg-background relative">
      {/* Sri Lankan Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95">
          <div 
            className="absolute inset-0 opacity-55 dark:opacity-15 bg-center bg-no-repeat bg-cover transition-opacity duration-1000"
            style={{
              backgroundImage: 'url("/2.png")',
              backgroundPosition: 'center 20%',
              filter: 'saturate(1.2) brightness(1.1)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 dark:from-background/40 dark:via-transparent dark:to-background/60" />
        </div>
        
        {/* Lotus-inspired accent patterns */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FFC72C]/8 dark:bg-[#FFC72C]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}} />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#8D153A]/8 dark:bg-[#8D153A]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5722]/6 dark:bg-[#FF5722]/3 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}} />
        </div>
      </div>

      {/* Header */}
      <Header />

      {/* Visitor Notice */}
      {showNotice && (
        <div className="relative z-10 bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 border-b border-[#FFC72C]/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FFC72C] rounded-full animate-pulse" />
                <p className="text-sm text-foreground/80">
                  <span className="font-medium">Visitor Mode:</span> You&apos;re using GovLink AI as a guest. 
                  <a href="/user/auth/login" className="ml-1 text-[#FFC72C] hover:text-[#FF5722] font-medium underline decoration-dotted underline-offset-2">
                    Login
                  </a> for a personalized experience.
                </p>
              </div>
              <button 
                onClick={() => setShowNotice(false)}
                className="text-foreground/60 hover:text-foreground/80 text-lg leading-none p-1"
                aria-label="Close notice"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="px-6 py-8 border-b border-border/20 backdrop-blur-sm bg-card/30">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-3">{title}</h1>
              {subtitle && (
                <p className="text-lg text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Page Content */}
          <div className="min-h-[calc(100vh-300px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CHAT CONTENT COMPONENT ---
function ChatContent({ messages, isTyping, language = 'en', onSendMessage }: { 
  messages: Message[]; 
  isTyping: boolean; 
  language: Language; 
  onSendMessage: (message: string) => void; 
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const t = chatTranslations[language];

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }, [messages.length, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8 px-4 text-center pb-48">
        <div className="flex justify-center mb-4">
          <RAGBotIcon />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Welcome to {t.title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        
        <div className="mt-8 pt-6 border-t border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Try asking me about:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {Object.values(t.suggestions).slice(0, 4).map((question, index) => (
              <button
                key={index}
                className="p-4 text-left bg-card/50 hover:bg-card/80 rounded-lg border border-border/50 transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
                onClick={() => onSendMessage(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-2 px-4 pb-48">
      <div className="py-6 mb-2 flex justify-center">
        <TopicTag text={t.chatStarted} />
      </div>

      {messages.map((message, index) => (
        <div key={`${message.type}-${index}`}>
          {message.type === 'user' ? (
            <UserMessage text={message.text} timestamp={message.timestamp} />
          ) : (
            <BotMessage message={message} language={language} />
          )}
        </div>
      ))}
      
      {isTyping && <TypingIndicator language={language} />}
      <div ref={bottomRef} />
    </div>
  );
}

// --- MAIN COMPONENT ---
function RAGBotPageContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [sessionId] = useState(`rag_session_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  const initialQueryProcessedRef = useRef(false);
  const lastProcessedQueryRef = useRef<string | null>(null);
  const { user, isAuthenticated, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = chatTranslations[currentLanguage];

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { type: 'user', text: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Check for booking intent first
      if (detectBookingIntent(messageText)) {
        const bookingResponse = createBookingResponse(isAuthenticated, router);
        setMessages(prev => [...prev, bookingResponse]);
        setIsTyping(false);
        return;
      }

      // Continue with normal RAG processing
      const response = await fetch('/api/ragbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to get response from server');
      }

      const data = await response.json();
      const botMessage: Message = {
        type: 'bot',
        text: data.response,
        timestamp: new Date(),
        departmentContacts: data.departmentContacts,
        sources: data.sources,
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        type: 'bot',
        text: `I apologize, but I encountered an error. Please try again later. 

*Details: ${error instanceof Error ? error.message : 'Unknown error'}*`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [sessionId, isAuthenticated, router]);

  // Handle initial query from URL parameters
  useEffect(() => {
    const query = searchParams?.get('q');
    if (query && 
        !initialQueryProcessedRef.current && 
        messages.length === 0 && 
        lastProcessedQueryRef.current !== query) {
      
      console.log('Processing initial query from URL:', query);
      initialQueryProcessedRef.current = true;
      lastProcessedQueryRef.current = query;
      
      // Add a small delay to ensure the component is fully mounted
      setTimeout(() => {
        handleSendMessage(query);
      }, 500);
    }
  }, [searchParams, messages.length, handleSendMessage]);

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RAGBotIcon />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const titleElement = (
    <span className="animate-title-wave">
      <span className="text-foreground">{t.title.split(' ')[0]}</span>{' '}
      <span className="text-gradient">
        {t.title.split(' ')[1] || ''}
      </span>
    </span>
  );

  // Render based on authentication status
  if (isAuthenticated && user) {
    // Authenticated user - show full dashboard layout
    return (
      <>
        <ChatbotNavigation isAuthenticated={true} />
        <UserDashboardLayout
          title={titleElement}
          subtitle={t.subtitle}
          language={currentLanguage}
          onLanguageChange={handleLanguageChange}
        >
          <div className="h-full overflow-y-auto overscroll-contain pr-1">
            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl shadow-glow modern-card">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-[#FFC72C] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-muted-foreground">Loading conversation...</span>
                  </div>
                </div>
              </div>
            }>
              <ChatContent messages={messages} isTyping={isTyping} language={currentLanguage} onSendMessage={handleSendMessage} />
            </Suspense>
          </div>
        </UserDashboardLayout>
        <ChatInput onSendMessage={handleSendMessage} language={currentLanguage} disabled={isTyping} />
      </>
    );
  } else {
    // Visitor - show visitor layout
    return (
      <>
        <ChatbotNavigation isAuthenticated={false} />
        <VisitorLayout
          title={titleElement}
          subtitle={t.subtitle}
        >
          <div className="overflow-y-auto overscroll-contain">
            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl shadow-glow modern-card">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-[#FFC72C] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-muted-foreground">Loading conversation...</span>
                  </div>
                </div>
              </div>
            }>
              <ChatContent messages={messages} isTyping={isTyping} language={currentLanguage} onSendMessage={handleSendMessage} />
            </Suspense>
          </div>
        </VisitorLayout>
        <ChatInput onSendMessage={handleSendMessage} language={currentLanguage} disabled={isTyping} />
      </>
    );
  }
}

// --- MAIN EXPORT ---
export default function RAGBotPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RAGBotIcon />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <RAGBotPageContent />
    </Suspense>
  );
}
