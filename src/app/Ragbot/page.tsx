// src/app/Ragbot/page.tsx
"use client";
import React, { Suspense, useState, useEffect, useRef } from 'react';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

// Types
type Language = 'en' | 'si' | 'ta';

interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  departmentContacts?: DepartmentContact[];
  sources?: string[];
}

interface DepartmentContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  services: string[];
}

// Chat translations
const chatTranslations: Record<Language, {
  title: string;
  subtitle: string;
  newChat: string;
  askFollowUp: string;
  analyzing: string;
  preparing: string;
  chatStarted: string;
  contactDetails: string;
  sources: string;
  suggestions: {
    moreDetails: string;
    relatedServices: string;
    howToApply: string;
    contactInfo: string;
    waitForAgent: string;
  };
}> = {
  en: {
    title: 'RAG Assistant',
    subtitle: 'AI-powered assistant with real-time search for Sri Lankan government services',
    newChat: 'New Chat',
    askFollowUp: 'Ask a follow-up question...',
    analyzing: 'Searching government databases...',
    preparing: 'RAG Assistant is gathering information',
    chatStarted: 'Chat started with RAG Assistant',
    contactDetails: 'Department Contacts',
    sources: 'Sources',
    suggestions: {
      moreDetails: 'More details',
      relatedServices: 'Related services',
      howToApply: 'How to apply',
      contactInfo: 'Contact info',
      waitForAgent: 'Wait for Agent'
    }
  },
  si: {
    title: 'RAG සහායක',
    subtitle: 'ශ්‍රී ලංකා රජයේ සේවා සඳහා තත්‍ය කාලීන සෙවුම් සහිත AI සහායක',
    newChat: 'නව කතාබස්',
    askFollowUp: 'පසු විපරම් ප්‍රශ්නයක් අසන්න...',
    analyzing: 'රජයේ දත්ත ගබඩා සොයමින්...',
    preparing: 'RAG සහායක තොරතුරු එකතු කරමින්',
    chatStarted: 'RAG සහායක සමඟ කතාබස් ආරම්භ විය',
    contactDetails: 'දෙපාර්තමේන්තු සම්බන්ධතා',
    sources: 'මූලාශ්‍ර',
    suggestions: {
      moreDetails: 'වැඩි විස්තර',
      relatedServices: 'සම්බන්ධිත සේවා',
      howToApply: 'අයදුම් කරන ආකාරය',
      contactInfo: 'සම්බන්ධතා තොරතුරු',
      waitForAgent: 'නියෝජිතයක් සඳහා රැඳී සිටින්න'
    }
  },
  ta: {
    title: 'RAG உதவியாளர்',
    subtitle: 'இலங்கை அரசாங்க சேவைகளுக்கான நேரடி தேடல் கொண்ட AI உதவியாளர்',
    newChat: 'புதிய அரட்டை',
    askFollowUp: 'பின்தொடர்ந்து கேள்வி கேளுங்கள்...',
    analyzing: 'அரசாங்க தரவுத்தளங்களை தேடுகிறது...',
    preparing: 'RAG உதவியாளர் தகவல்களை சேகரிக்கிறது',
    chatStarted: 'RAG உதவியாளருடன் அரட்டை தொடங்கப்பட்டது',
    contactDetails: 'துறை தொடர்புகள்',
    sources: 'ஆதாரங்கள்',
    suggestions: {
      moreDetails: 'மேலும் விவரங்கள்',
      relatedServices: 'தொடர்புடைய சேவைகள்',
      howToApply: 'எப்படி விண்ணபிப்பது',
      contactInfo: 'தொடர்பு தகவல்',
      waitForAgent: 'முகவர்க்காக காத்திருங்கள்'
    }
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

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

// Sri Lankan Lotus Icon with AI enhancement
const RAGBotIcon = () => (
  <div className="relative">
    <div className="w-10 h-10 bg-gradient-to-br from-[#FFC72C] via-[#FF5722] to-[#8D153A] rounded-xl flex items-center justify-center">
      <SearchIcon className="w-5 h-5 text-white" />
    </div>
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] rounded-full flex items-center justify-center animate-pulse">
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

  return (
    <span className="text-xs text-muted-foreground/60 font-medium ml-2">
      {timeAgo}
    </span>
  );
};

const TopicTag = ({ text }: { text: string }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 dark:bg-muted/30 rounded-full text-sm font-medium text-muted-foreground border border-border/50">
    <div className="w-2 h-2 bg-[#FFC72C] rounded-full animate-pulse"></div>
    {text}
  </div>
);

const ContactCard = ({ contact }: { contact: DepartmentContact }) => {
  return (
    <div className="bg-muted/20 dark:bg-muted/10 rounded-lg p-4 border border-border/30">
      <h4 className="font-semibold text-foreground mb-2">{contact.name}</h4>
      <div className="space-y-1 text-sm text-muted-foreground">
        <div>📞 {contact.phone}</div>
        <div>✉️ {contact.email}</div>
        <div>🌐 <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-[#FF5722] hover:underline">{contact.website}</a></div>
        <div>📍 {contact.address}</div>
      </div>
    </div>
  );
};

const SourcesSection = ({ sources, language }: { sources: string[]; language: Language }) => {
  const t = chatTranslations[language];
  
  if (!sources || sources.length === 0) return null;
  
  return (
    <div className="mt-4 pt-4 border-t border-border/30">
      <h4 className="font-semibold text-foreground mb-2">{t.sources}</h4>
      <div className="space-y-1">
        {sources.map((source, index) => (
          <div key={index} className="text-sm">
            <a 
              href={source} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#FF5722] hover:underline flex items-center gap-1"
            >
              🔗 {source}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserMessage = ({ text, timestamp }: { text: string; timestamp: Date }) => (
  <div className="flex items-start gap-3 mb-6">
    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center text-white font-bold text-sm">
      U
    </div>
    <div className="flex-1 max-w-[85%]">
      <div className="bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 dark:from-[#FFC72C]/5 dark:to-[#FF5722]/5 backdrop-blur-sm p-4 rounded-2xl rounded-tl-md border border-[#FFC72C]/20 dark:border-[#FF5722]/20">
        <p className="text-foreground font-medium leading-relaxed">{text}</p>
      </div>
      <TimeAgo timestamp={timestamp} />
    </div>
  </div>
);

const BotMessage = ({ text, timestamp, departmentContacts, sources, language = 'en' }: { 
  text: string; 
  timestamp: Date; 
  departmentContacts?: DepartmentContact[];
  sources?: string[];
  language?: Language;
}) => {
  const t = chatTranslations[language];
  
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex-shrink-0">
        <RAGBotIcon />
      </div>
      <div className="flex-1 max-w-[85%]">
        <div className="bg-card/50 dark:bg-card/30 backdrop-blur-md p-5 rounded-2xl rounded-tl-md border border-border/50 modern-card">
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border/30">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold text-foreground mb-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold text-foreground mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-semibold text-foreground mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-foreground mb-3 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="text-foreground mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="text-foreground mb-3 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-foreground">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#FF5722] pl-4 py-2 my-4 bg-muted/30 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return (
                      <code className={`${className} text-sm`}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                      {children}
                    </code>
                  );
                },
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="w-full border-collapse border border-border/30 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border/30 bg-muted/50 px-3 py-2 text-left font-semibold text-foreground">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border/30 px-3 py-2 text-foreground">
                    {children}
                  </td>
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
          
          {/* Department Contacts */}
          {departmentContacts && departmentContacts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border/30">
              <h4 className="font-semibold text-foreground mb-3">{t.contactDetails}</h4>
              <div className="grid gap-3">
                {departmentContacts.map((contact, index) => (
                  <ContactCard key={index} contact={contact} />
                ))}
              </div>
            </div>
          )}
          
          {/* Sources */}
          <SourcesSection sources={sources || []} language={language} />
        </div>
        <TimeAgo timestamp={timestamp} />
      </div>
    </div>
  );
};

const TypingIndicator = ({ language = 'en' }: { language?: Language }) => {
  const t = chatTranslations[language];
  
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex-shrink-0">
        <RAGBotIcon />
      </div>
      <div className="flex-1 max-w-[85%]">
        <div className="bg-card/50 dark:bg-card/30 backdrop-blur-md p-5 rounded-2xl rounded-tl-md border border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-[#FFC72C] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#FF5722] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#8D153A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-muted-foreground text-sm">{t.preparing}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat Input Component
const ChatInput = ({ onSendMessage, language = 'en', disabled = false }: { 
  onSendMessage: (message: string) => void; 
  language?: Language;
  disabled?: boolean;
}) => {
  const [inputValue, setInputValue] = useState('');
  const t = chatTranslations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="border-t border-border/30 bg-background/80 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.askFollowUp}
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 bg-card/50 dark:bg-card/30 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50 focus:border-[#FF5722] text-foreground placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
};

export default function RAGBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [sessionId] = useState(`rag_session_${Date.now()}`);

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      type: 'user',
      text: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ragbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add bot response
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
      
      // Add error message
      const errorMessage: Message = {
        type: 'bot',
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const t = chatTranslations[currentLanguage];

  return (
    <UserDashboardLayout
      title={t.title}
      subtitle={t.subtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
      size="dense"
      contentMode="fill"
      headerContent={<div className="hidden" aria-hidden="true" />}
    >
      <div className="grid grid-rows-[1fr_auto] h-full max-h-full">
        {/* Chat History Area (scrollable) */}
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
            <ChatContent 
              messages={messages} 
              isTyping={isTyping} 
              language={currentLanguage} 
            />
          </Suspense>
        </div>
        
        {/* Input Area (anchored at bottom) */}
        <div>
          <ChatInput 
            onSendMessage={handleSendMessage} 
            language={currentLanguage}
            disabled={isTyping}
          />
        </div>
      </div>
    </UserDashboardLayout>
  );
}

function ChatContent({ messages, isTyping, language = 'en' }: { 
  messages: Message[]; 
  isTyping: boolean; 
  language: Language;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const t = chatTranslations[language];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        {/* Welcome Message */}
        <div className="text-center">
          <RAGBotIcon />
          <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">{t.title}</h2>
          <p className="text-muted-foreground mb-6">{t.subtitle}</p>
          
          {/* Example Questions */}
          <div className="grid gap-3 max-w-2xl mx-auto">
            <div className="text-sm text-muted-foreground mb-2">Try asking:</div>
            {[
              "How do I renew my passport?",
              "What are the requirements for starting a business in Sri Lanka?",
              "How can I register for marriage certificate?",
              "What is the process for getting a driving license?"
            ].map((question, index) => (
              <button
                key={index}
                className="p-3 text-left bg-muted/30 hover:bg-muted/50 rounded-lg border border-border/30 transition-colors"
                onClick={() => {
                  // This would be handled by parent component
                  console.log('Suggested question:', question);
                }}
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
    <div className="max-w-4xl mx-auto space-y-2">
      {/* Topic Tag (centered) */}
      <div className="py-6 mb-2 flex justify-center">
        <TopicTag text={t.chatStarted} />
      </div>

      {/* Render messages */}
      {messages.map((message, index) => (
        <div key={index}>
          {message.type === 'user' ? (
            <UserMessage text={message.text} timestamp={message.timestamp} />
          ) : (
            <BotMessage 
              text={message.text} 
              timestamp={message.timestamp}
              departmentContacts={message.departmentContacts}
              sources={message.sources}
              language={language}
            />
          )}
        </div>
      ))}
      
      {/* Show typing indicator if bot is typing */}
      {isTyping && <TypingIndicator language={language} />}
      <div ref={bottomRef} />
    </div>
  );
}
