// src/app/User/Chat/Bot/page.tsx
"use client";
import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

// Types
type Language = 'en' | 'si' | 'ta';

// Chat translations
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
  };
}> = {
  en: {
    title: 'Live Support',
    subtitle: 'Get instant help with government services and procedures',
    newChat: 'New Chat',
    askFollowUp: 'Ask a follow-up question...',
    analyzing: 'Analyzing your question...',
    preparing: 'GovLink Assistant is preparing your response',
    chatStarted: 'Chat started with GovLink Assistant',
    suggestions: {
      moreDetails: 'More details',
      relatedServices: 'Related services',
      howToApply: 'How to apply',
      contactInfo: 'Contact info'
    }
  },
  si: {
    title: 'සජීවී සහාය',
    subtitle: 'රජයේ සේවා සහ ක්‍රියා පටිපාටි සම්බන්ධයෙන් ක්ෂණික උදව් ලබා ගන්න',
    newChat: 'නව කතාබස්',
    askFollowUp: 'පසු විපරම් ප්‍රශ්නයක් අසන්න...',
    analyzing: 'ඔබගේ ප්‍රශ්නය විශ්ලේෂණය කරමින්...',
    preparing: 'GovLink සහායක ඔබගේ පිළිතුර සූදානම් කරමින්',
    chatStarted: 'GovLink සහායක සමඟ කතාබස් ආරම්භ විය',
    suggestions: {
      moreDetails: 'වැඩි විස්තර',
      relatedServices: 'සම්බන්ධිත සේවා',
      howToApply: 'අයදුම් කරන ආකාරය',
      contactInfo: 'සම්බන්ධතා තොරතුරු'
    }
  },
  ta: {
    title: 'நேரடி ஆதரவு',
    subtitle: 'அரசு சேவைகள் மற்றும் நடைமுறைகளில் உடனடி உதவி பெறுங்கள்',
    newChat: 'புதிய அரட்டை',
    askFollowUp: 'பின்தொடர்ந்து கேள்வி கேளுங்கள்...',
    analyzing: 'உங்கள் கேள்வியை பகுப்பாய்வு செய்கிறது...',
    preparing: 'GovLink உதவியாளர் உங்கள் பதிலை தயாரிக்கிறது',
    chatStarted: 'GovLink உதவியாளருடன் அரட்டை தொடங்கப்பட்டது',
    suggestions: {
      moreDetails: 'மேலும் விவரங்கள்',
      relatedServices: 'தொடர்புடைய சேவைகள்',
      howToApply: 'எப்படி விண்ணபிப்பது',
      contactInfo: 'தொடர்பு தகவல்'
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

const GovLinkBotIcon = () => (
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
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

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

// --- TYPING INDICATOR ---
const TypingIndicator = ({ language = 'en' }: { language?: Language }) => {
  const t = chatTranslations[language];
  return (
    <div className="flex justify-start my-6 animate-fade-in-up">
      <div className="flex gap-4 max-w-4xl">
        <div className="flex-shrink-0">
          <GovLinkBotIcon />
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

const BotMessage = ({ text, timestamp = new Date() }: { text: string; timestamp?: Date }) => {
  return (
    <div className="flex justify-start my-6 animate-fade-in-up">
      <div className="flex gap-4 max-w-4xl">
        <div className="flex-shrink-0">
          <GovLinkBotIcon />
        </div>
        <div className="flex-1">
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl rounded-bl-lg shadow-glow border border-border/50 modern-card hover:border-[#FFC72C]/30 transition-all duration-300">
            <div className="prose prose-lg max-w-none leading-relaxed text-foreground markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                skipHtml={false}
                components={{
                  // Custom components for better rendering
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

// --- PREMIUM CHAT INPUT ---
const ChatInput = ({ onSendMessage, language = 'en' }: { onSendMessage: (message: string) => void; language?: Language }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const t = chatTranslations[language];

  const handleSend = () => {
    if (message.trim()) {
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
    <div className="sticky bottom-0 bg-background/95 dark:bg-card/95 backdrop-blur-md border-t border-border/50 p-4 sm:p-6 z-40">
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
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.max(target.scrollHeight, 60)}px`;
              }}
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!message.trim()}
            >
              <SendIcon className="h-5 w-5 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
          
          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              t.suggestions.moreDetails, 
              t.suggestions.relatedServices, 
              t.suggestions.howToApply, 
              t.suggestions.contactInfo
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setMessage(suggestion)}
                className="px-3 py-1.5 bg-card/50 dark:bg-card/70 hover:bg-card border border-border/50 hover:border-[#FFC72C]/60 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 text-foreground hover:text-[#FFC72C] backdrop-blur-sm"
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
export default function GovLinkChatPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<{type: 'user' | 'bot', text: string, timestamp: Date}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const t = chatTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: message, timestamp: new Date() }]);
    
    // Show typing indicator immediately
    setIsTyping(true);
    
    // Generate bot response
    const generateBotResponse = (query: string) => {
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('passport')) {
        return `# Passport Renewal Information

I'd be happy to help you with passport renewal! Here's a comprehensive guide:

## Required Documents
- **Current passport** (if available)
- **National Identity Card** (original and photocopy)
- **Two recent passport-sized photographs**
- **Completed Application Form 'K'**

## Step-by-Step Process
1. **Download Form 'K'** from the [Department of Immigration website](https://immigration.gov.lk)
2. **Fill out the form** completely and accurately
3. **Visit your nearest** Regional Passport Office
4. **Submit documents** and pay the renewal fee
5. **Collect your new passport** (usually takes 7-10 working days)

## Processing Fees
| Service Type | Fee (LKR) | Processing Time |
|--------------|-----------|-----------------|
| Standard processing | 3,500 | 7-10 working days |
| Express service | 7,000 | 3-5 working days |

## Important Notes
> **Tip:** Make sure all documents are in good condition and photographs meet the specified requirements.

### Contact Information
- **Hotline:** +94 11 532 9200
- **Email:** info@immigration.gov.lk
- **Office Hours:** Monday to Friday, 8:30 AM - 4:15 PM

Would you like me to provide the **direct link** to download Form 'K' or help you find your **nearest passport office**?`;
      }
      
      return `# Thank you for your question!

You asked: **"${query}"**

I'm here to help you with Sri Lankan government services. Here are some popular services I can assist with:

## Available Services
- **Passport services** - Renewal, new applications, and requirements
- **Business registration** - Company formation and licensing
- **Marriage certificates** - Registration process and documentation  
- **Driving licenses** - Applications, renewals, and testing procedures

### Quick Help
| Service | Processing Time |
|---------|----------------|
| Passport | 7-10 days |
| Business | 1-5 days |

> **Tip:** Be specific about what you need help with for the most accurate guidance.

\`\`\`javascript
// Example code block for testing
function govLinkHelper() {
  return "Markdown rendering is working perfectly!";
}
\`\`\`

**Available 24/7** to assist with your government service needs!`;
    };

    // Simulate response generation time (2-4 seconds)
    const responseTime = Math.random() * 2000 + 2000;
    
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateBotResponse(message);
      setMessages(prev => [...prev, { type: 'bot', text: botResponse, timestamp: new Date() }]);
    }, responseTime);
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
    >
      <div className="relative min-h-[70vh]">
        {/* Chat History Area */}
        <div className="pb-32"> {/* Add padding for fixed input */}
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
            <ChatContent messages={messages} isTyping={isTyping} language={currentLanguage} />
          </Suspense>
        </div>

        {/* Fixed Input Area */}
        <div className="absolute bottom-0 left-0 right-0">
          <ChatInput onSendMessage={handleSendMessage} language={currentLanguage} />
        </div>
      </div>
    </UserDashboardLayout>
  );
};

function ChatContent({ messages, isTyping, language = 'en' }: { messages?: {type: 'user' | 'bot', text: string, timestamp: Date}[]; isTyping?: boolean; language?: Language }) {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? undefined;
  const userQuery = q || "How do I renew my passport?";
  const t = chatTranslations[language];

  // Generate dynamic response based on user query
  const generateBotResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('passport')) {
      return `# Passport Renewal Information

I'd be happy to help you with passport renewal! Here's a comprehensive guide:

## Required Documents
- **Current passport** (if available)
- **National Identity Card** (original and photocopy)
- **Two recent passport-sized photographs**
- **Completed Application Form 'K'**

## Step-by-Step Process
1. **Download Form 'K'** from the [Department of Immigration website](https://immigration.gov.lk)
2. **Fill out the form** completely and accurately
3. **Visit your nearest** Regional Passport Office
4. **Submit documents** and pay the renewal fee
5. **Collect your new passport** (usually takes 7-10 working days)

## Processing Fees
| Service Type | Fee (LKR) | Processing Time |
|--------------|-----------|-----------------|
| Standard processing | 3,500 | 7-10 working days |
| Express service | 7,000 | 3-5 working days |

## Important Notes
> **Tip:** Make sure all documents are in good condition and photographs meet the specified requirements.

### Contact Information
- **Hotline:** +94 11 532 9200
- **Email:** info@immigration.gov.lk
- **Office Hours:** Monday to Friday, 8:30 AM - 4:15 PM

Would you like me to provide the **direct link** to download Form 'K' or help you find your **nearest passport office**?`;
    }
    
    if (lowerQuery.includes('business') || lowerQuery.includes('registration')) {
      return `# Business Registration Guide

Here's everything you need to know about registering a business in Sri Lanka:

## Types of Business Registration

### 1. Sole Proprietorship
- **Minimum capital:** No minimum requirement
- **Registration fee:** Rs. 500
- **Processing time:** 1-2 days

### 2. Partnership
- **Minimum capital:** No minimum requirement  
- **Registration fee:** Rs. 1,000
- **Processing time:** 3-5 days

### 3. Private Limited Company
- **Minimum capital:** Rs. 100,000
- **Registration fee:** Rs. 5,000
- **Processing time:** 7-14 days

## Required Documents
- **Application form** (Form No. 1)
- **National Identity Cards** of all directors/partners
- **Proof of registered address**
- **Bank certificate** (for companies)
- **Memorandum and Articles** (for companies)

## Online Registration Process
\`\`\`
Step 1: Visit https://www.businessregistration.lk
Step 2: Create an account
Step 3: Fill the online application
Step 4: Upload required documents
Step 5: Pay registration fees online
Step 6: Submit application
\`\`\`

> **Note:** All businesses must register within **30 days** of commencement of operations.

**Need more help?** Contact the Registrar of Companies at **+94 11 234 7891**.`;
    }
    
    // Default response with simple markdown for testing
    return `# GovLink Assistant

Thank you for your query: **"${query}"**

I'm here to help you with Sri Lankan government services. Here are some popular services I can assist with:

## Available Services
- **Passport services** - Renewal, new applications, and requirements
- **Business registration** - Company formation and licensing
- **Marriage certificates** - Registration process and documentation  
- **Driving licenses** - Applications, renewals, and testing procedures

### Quick Test Table
| Service | Processing Time |
|---------|----------------|
| Passport | 7-10 days |
| Business | 1-5 days |

> **Tip:** Be specific about what you need help with for the most accurate guidance.

\`\`\`javascript
// Example code block for testing
function govLinkHelper() {
  return "Markdown rendering is working perfectly!";
}
\`\`\`

**Available 24/7** to assist with your government service needs!`;
  };

  // If we have messages from props, use them; otherwise show the initial conversation
  if (messages && messages.length > 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Welcome Message */}
        <div className="text-center py-8 mb-8">
          <div className="inline-flex items-center gap-3 glass-morphism px-6 py-3 rounded-full">
            <LotusIcon className="w-8 h-8 animate-glow" />
            <span className="text-sm font-medium text-muted-foreground">
              Chat started with GovLink Assistant
            </span>
          </div>
        </div>

        {/* Render messages */}
        {messages.map((message, index) => (
          <div key={index}>
            {message.type === 'user' ? (
              <UserMessage text={message.text} timestamp={message.timestamp} />
            ) : (
              <BotMessage text={message.text} timestamp={message.timestamp} />
            )}
          </div>
        ))}
        
        {/* Show typing indicator if bot is typing */}
        {isTyping && <TypingIndicator language={language} />}
      </div>
    );
  }

  // Default initial conversation
  const botResponse = generateBotResponse(userQuery);

  return (
    <div className="max-w-4xl mx-auto space-y-2">
      {/* Welcome Message */}
      <div className="text-center py-8 mb-8">
        <div className="inline-flex items-center gap-3 bg-card/90 dark:bg-card/95 backdrop-blur-md px-6 py-3 rounded-full border border-border/50 modern-card shadow-glow">
          <LotusIcon className="w-8 h-8 animate-glow" />
          <span className="text-sm font-medium text-muted-foreground">
            {t.chatStarted}
          </span>
        </div>
      </div>

      <UserMessage text={userQuery} timestamp={new Date()} />
      <BotMessage text={botResponse} timestamp={new Date()} />
    </div>
  );
}