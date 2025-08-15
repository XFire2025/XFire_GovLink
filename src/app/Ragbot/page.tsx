// src/app/Ragbot/page.tsx
"use client";
import React, { Suspense, useState, useEffect, useRef } from 'react';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import 'highlight.js/styles/github-dark.css';

// --- TYPES ---
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
    waitForAgent: string;
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
      waitForAgent: 'Wait for Agent'
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
      waitForAgent: 'නියෝජිතයෙකු සඳහා රැඳී සිටින්න'
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
      waitForAgent: 'முகவருக்காக காத்திருங்கள்'
    },
    contactDetails: 'துறை தொடர்புகள்',
    sources: 'ஆதாரங்கள்'
  }
};

// --- PREMIUM SVG ICON COMPONENTS ---
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

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

// --- PREMIUM MESSAGE COMPONENTS ---
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
            <div className="flex items-center space-x-1 text-muted-foreground">
              <span className="animate-pulse">•</span>
              <span className="animate-pulse" style={{animationDelay: '0.2s'}}>•</span>
              <span className="animate-pulse" style={{animationDelay: '0.4s'}}>•</span>
              <span className="ml-2 text-sm">{t.analyzing}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {t.preparing}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ contact }: { contact: DepartmentContact }) => {
    return (
      <div className="bg-muted/20 dark:bg-muted/10 rounded-lg p-4 border border-border/30 transition-all hover:border-[#FF5722]/50">
        <h4 className="font-semibold text-[#FFC72C] mb-2">{contact.name}</h4>
        <div className="space-y-1 text-sm text-muted-foreground">
          {contact.phone && <div>📞 {contact.phone}</div>}
          {contact.email && <div>✉️ {contact.email}</div>}
          {contact.website && <div>🌐 <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-[#FF5722] hover:underline">{contact.website}</a></div>}
          {contact.address && <div>📍 {contact.address}</div>}
        </div>
      </div>
    );
  };
  
const SourcesSection = ({ sources, language }: { sources: string[]; language: Language }) => {
    const t = chatTranslations[language];
    
    if (!sources || sources.length === 0) return null;
    
    return (
      <div className="mt-4 pt-4 border-t border-white/10">
        <h3 className="text-lg font-semibold text-[#FF5722] mb-2 mt-4">{t.sources}</h3>
        <div className="space-y-1">
          {sources.map((source, index) => (
            <div key={index} className="text-sm">
              <a 
                href={source} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FFC72C] underline hover:text-[#FF5722] transition-colors duration-200 flex items-center gap-1"
              >
                🔗 {new URL(source).hostname}
              </a>
            </div>
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
                rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                skipHtml={false}
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-[#FFC72C] border-b-2 border-[#FFC72C] pb-2 mb-4 mt-6 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-[#FFC72C] mb-3 mt-6">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold text-[#FF5722] mb-2 mt-4">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-base font-semibold text-[#FF5722] mb-2 mt-3">{children}</h4>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-[#FFC72C]">{children}</strong>,
                  em: ({ children }) => <em className="italic opacity-90">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#FFC72C] bg-[#FFC72C]/5 pl-4 py-3 my-4 italic rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className, ...props }: React.ComponentProps<'code'>) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-black/30 text-[#FFC72C] px-2 py-1 rounded text-sm font-mono border border-white/10">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto my-4 text-sm">
                      {children}
                    </pre>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border border-white/20 rounded-lg overflow-hidden">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-[#FFC72C]/10">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="border border-white/20 px-4 py-3 text-left font-semibold text-[#FFC72C]">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-white/20 px-4 py-3 text-foreground">
                      {children}
                    </td>
                  ),
                  tr: ({ children, ...props }) => (
                    <tr className="even:bg-white/5 hover:bg-white/10 transition-colors" {...props}>
                      {children}
                    </tr>
                  ),
                  a: ({ children, href }) => (
                    <a 
                      href={href} 
                      className="text-[#FFC72C] underline hover:text-[#FF5722] transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
              {departmentContacts && departmentContacts.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-[#FF5722] mb-3 mt-4">{chatTranslations[language].contactDetails}</h3>
                  <div className="grid gap-3">
                    {departmentContacts.map((contact, index) => (
                      <ContactCard key={index} contact={contact} />
                    ))}
                  </div>
                </div>
              )}
              <SourcesSection sources={sources || []} language={language} />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            GovLink Assistant • <TimeAgo timestamp={timestamp} />
          </div>
        </div>
      </div>
    </div>
  );
};

const TopicTag = ({ text }: { text: string }) => (
  <div
    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold tracking-wide select-none
      bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 shadow-sm"
  >
    <span className="text-gradient">{text}</span>
  </div>
);

const ChatInput = ({ onSendMessage, language = 'en', disabled = false }: { onSendMessage: (message: string) => void; language?: Language, disabled?: boolean }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const t = chatTranslations[language];

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-background/95 dark:bg-card/95 backdrop-blur-md border-t border-border/50 p-4 sm:p-6 z-40">
      <div className="container mx-auto max-w-4xl">
        <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
          <div className="relative bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-2 shadow-glow hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-[#FFC72C]/60 modern-card">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              className="w-full bg-transparent text-foreground placeholder-muted-foreground p-4 pr-16 rounded-xl resize-none focus:outline-none leading-relaxed border-none"
              placeholder={t.askFollowUp}
              rows={1}
              disabled={disabled}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.max(target.scrollHeight, 60)}px`;
              }}
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!message.trim() || disabled}
            >
              <SendIcon className="h-5 w-5 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 items-center">
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
        </div>
      </div>
    </div>
  );
};

// --- MAIN CHAT PAGE COMPONENT ---
export default function RAGBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [sessionId] = useState(`rag_session_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  const t = chatTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { type: 'user', text: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
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
  };

  return (
    <UserDashboardLayout
      title={
        <span className="animate-title-wave">
          <span className="text-foreground">{t.title.split(' ')[0]}</span>{' '}
          <span className="text-gradient">
            {t.title.split(' ')[1] || ''}
          </span>
        </span>
      }
      subtitle={t.subtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
      size="dense"
      contentMode="fill"
      headerContent={<div className="hidden" aria-hidden="true" />}
    >
      <div className="grid grid-rows-[1fr_auto] h-full max-h-full">
        <div className="min-h-0 overflow-y-auto overscroll-contain pr-1">
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
        <div>
          <ChatInput onSendMessage={handleSendMessage} language={currentLanguage} disabled={isTyping} />
        </div>
      </div>
    </UserDashboardLayout>
  );
};

function ChatContent({ messages, isTyping, language = 'en', onSendMessage }: { messages: Message[]; isTyping: boolean; language: Language, onSendMessage: (message: string) => void; }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const t = chatTranslations[language];

  useEffect(() => {
    setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }, [messages.length, isTyping]);

  if (messages.length === 0) {
    return (
        <div className="max-w-4xl mx-auto space-y-6 py-8 px-4 text-center">
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
    <div className="max-w-4xl mx-auto space-y-2 px-4">
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