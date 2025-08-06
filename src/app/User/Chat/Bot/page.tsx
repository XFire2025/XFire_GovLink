// app/chat/page.tsx
"use client";
import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

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

// --- PREMIUM HEADER COMPONENT ---
const Header = () => (
  <header className="glass-morphism backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
    <nav className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LotusIcon className="animate-glow" />
          <div>
            <h1 className="text-2xl font-bold text-gradient">GovLink</h1>
            <p className="text-xs text-muted-foreground font-medium">Chat Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/User/Chat/Bot" 
            className="text-muted-foreground hover:text-foreground transition-colors duration-300 px-4 py-2 rounded-full hover:bg-card/30 text-sm font-medium"
          >
            New Chat
          </Link>
          <Link 
            href="/" 
            className="relative overflow-hidden bg-transparent border-2 border-[#FFC72C] text-[#FFC72C] px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:bg-[#FFC72C] hover:text-[#8D153A] hover:scale-105 hover:shadow-glow group"
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  </header>
);

// --- PREMIUM MESSAGE COMPONENTS ---
const UserMessage = ({ text }: { text: string }) => (
  <div className="flex justify-end my-6 animate-fade-in-up">
    <div className="max-w-2xl">
      <div className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white p-6 rounded-3xl rounded-br-lg shadow-glow">
        <p className="leading-relaxed">{text}</p>
      </div>
      <div className="text-xs text-muted-foreground mt-2 text-right">Just now</div>
    </div>
  </div>
);

const BotMessage = ({ text, isTyping = false }: { text: string; isTyping?: boolean }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    if (isTyping && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 15); // Faster typing speed
      return () => clearTimeout(timeout);
    } else if (!isTyping) {
      setDisplayText(text);
      setTypingComplete(true);
    } else if (isTyping && currentIndex >= text.length) {
      // Small delay before showing markdown
      const timeout = setTimeout(() => {
        setTypingComplete(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, isTyping]);

  return (
    <div className="flex justify-start my-6 animate-fade-in-up">
      <div className="flex gap-4 max-w-4xl">
        <div className="flex-shrink-0">
          <GovLinkBotIcon />
        </div>
        <div className="flex-1">
          <div className="glass-morphism backdrop-blur-xl p-6 rounded-3xl rounded-bl-lg shadow-xl border border-border/50">
            <div className="prose prose-lg prose-invert max-w-none leading-relaxed text-foreground markdown-content">
              {(isTyping && !typingComplete) ? (
                <div className="whitespace-pre-wrap font-mono text-sm opacity-90">
                  {displayText}
                  {currentIndex < text.length && (
                    <span className="inline-block w-2 h-5 bg-[#FFC72C] ml-1 animate-pulse"></span>
                  )}
                </div>
              ) : (
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
                    code: ({ children, className, ...props }: any) => {
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
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">GovLink Assistant • Just now</div>
        </div>
      </div>
    </div>
  );
};

// --- PREMIUM CHAT INPUT ---
const ChatInput = ({ onSendMessage }: { onSendMessage: (message: string) => void }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="glass-morphism backdrop-blur-xl border-t border-border/50 p-6">
      <div className="container mx-auto">
        <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
          <div className="relative glass-morphism rounded-2xl p-2 shadow-glow hover:shadow-2xl transition-all duration-500">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              className="w-full bg-transparent text-foreground placeholder-muted-foreground p-4 pr-16 rounded-xl resize-none focus:outline-none leading-relaxed border-none"
              placeholder="Ask a follow-up question..."
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.max(target.scrollHeight, 60)}px`;
              }}
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 hover:scale-110 shadow-glow group disabled:opacity-50"
              disabled={!message.trim()}
            >
              <SendIcon className="h-5 w-5 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
          
          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["More details", "Related services", "How to apply", "Contact info"].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setMessage(suggestion)}
                className="px-3 py-1.5 bg-card/50 hover:bg-card border border-border hover:border-[#FFC72C] rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
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
  const [messages, setMessages] = useState<{type: 'user' | 'bot', text: string, isTyping?: boolean}[]>([]);

  const handleSendMessage = (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: message }]);
    
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

    // Add bot response with delay
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      setMessages(prev => [...prev, { type: 'bot', text: botResponse, isTyping: true }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#FFC72C]/5 rounded-full blur-3xl "></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#FF5722]/5 rounded-full blur-3xl " style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <Header />

        {/* Chat History Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <div className="glass-morphism p-6 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-[#FFC72C] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-muted-foreground">Loading conversation...</span>
                  </div>
                </div>
              </div>
            }>
              <ChatContent messages={messages} />
            </Suspense>
          </div>
        </main>

        {/* Fixed Input Area */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

function ChatContent({ messages }: { messages?: {type: 'user' | 'bot', text: string, isTyping?: boolean}[] }) {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? undefined;
  const userQuery = q || "How do I renew my passport?";

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
              <UserMessage text={message.text} />
            ) : (
              <BotMessage text={message.text} isTyping={message.isTyping || false} />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default initial conversation
  const botResponse = generateBotResponse(userQuery);

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

      <UserMessage text={userQuery} />
      <BotMessage text={botResponse} isTyping={true} />
    </div>
  );
}