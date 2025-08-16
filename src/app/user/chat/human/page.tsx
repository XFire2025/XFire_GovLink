"use client";
import React, { Suspense, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LotusIcon } from '@/components/Icons/LotusIcon';

// Types - EXACT SAME as Agent Chat
type Language = 'en' | 'si' | 'ta';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'citizen' | 'system';
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  fileName?: string;
  fileUrl?: string;
}

interface SupportAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'typing' | 'away';
  lastSeen?: string;
}

// lotus icon imported from shared Icons

// EXACT SAME Sri Lankan Background Component as Agent Chat
const SriLankanBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main background image */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95">
        <div 
          className="absolute inset-0 opacity-55 dark:opacity-15 bg-center bg-no-repeat bg-cover transition-opacity duration-1000"
          style={{
            backgroundImage: 'url("/2.png")',
            backgroundPosition: 'center 20%',
            filter: 'saturate(1.2) brightness(1.1)',
          }}
        ></div>
        {/* Overlay gradients for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 dark:from-background/40 dark:via-transparent dark:to-background/60"></div>
      </div>
      
      {/* Enhanced lotus-inspired accent patterns */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FFC72C]/8 dark:bg-[#FFC72C]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#8D153A]/8 dark:bg-[#8D153A]/4 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5722]/6 dark:bg-[#FF5722]/3 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        {/* Additional subtle accents */}
        <div className="absolute top-3/4 right-1/3 w-48 h-48 bg-[#FFA726]/6 dark:bg-[#FFA726]/3 rounded-full blur-2xl animate-pulse" style={{animationDuration: '14s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/6 left-1/5 w-56 h-56 bg-[#FF9800]/5 dark:bg-[#FF9800]/2 rounded-full blur-3xl animate-pulse" style={{animationDuration: '16s', animationDelay: '6s'}}></div>
      </div>
    </div>
  );
};

// Language options - EXACT SAME as Agent Chat
const languageOptions = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' }
];

// Chat translations - EXACT SAME structure as Agent Chat but from citizen perspective
const chatTranslations: Record<Language, {

  backToDashboard: string;
  connecting: string;
  connectedTo: string;
  online: string;
  typing: string;
  away: string;
  generatingResponse: string;
  isPreparingResponse: string;
  typeMessage: string;
  attachFile: string;
  sendMessage: string;
  chatSupport: string;
  liveSupport: string;
  citizenPortal: string;
  sessionInfo: string;
  duration: string;
  status: string;
  quickReplies: {
    help1: string;
    help2: string;
    help3: string;
    help4: string;
  };
  fileAttachment: string;
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  now: string;
  you: string;
  fileSent: string;
}> = {
  en: {
    backToDashboard: '← Back to Dashboard',
    connecting: 'Connecting to agent...',
    connectedTo: 'Connected to',
    online: 'Online',
    typing: 'is typing...',
    away: 'Away',
    generatingResponse: 'Generating response...',
    isPreparingResponse: 'is preparing your response',
    typeMessage: 'Type your message...',
    attachFile: 'Attach file',
    sendMessage: 'Send message',
    chatSupport: 'Chat Support',
    liveSupport: 'Live Support',
    citizenPortal: 'Citizen Portal',
    sessionInfo: 'Session Information',
    duration: 'Duration',
    status: 'Status',
    quickReplies: {
      help1: 'I need help with passport renewal',
      help2: 'Can you guide me through the process?',
      help3: 'What documents do I need?',
      help4: 'Thank you for your help'
    },
    fileAttachment: 'File attachment',
    justNow: 'Just now',
    minutesAgo: 'm ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',
    now: 'Just now',
    you: 'You',
    fileSent: 'File sent'
  },
  si: {
    backToDashboard: '← පාලනයට ආපසු',
    connecting: 'නිලධාරියා සමඟ සම්බන්ධ වෙමින්...',
    connectedTo: 'සම්බන්ධ වී ඇත',
    online: 'සබැඳි',
    typing: 'ටයිප් කරමින්...',
    away: 'ඈත',
    generatingResponse: 'ප්‍රතිචාරය ජනනය කරමින්...',
    isPreparingResponse: 'ඔබගේ ප්‍රතිචාරය සකස් කරමින්',
    typeMessage: 'ඔබගේ පණිවිඩය ටයිප් කරන්න...',
    attachFile: 'ගොනුව ඇමුණන්න',
    sendMessage: 'පණිවිඩය යවන්න',
    chatSupport: 'කතාබස් සහාය',
    liveSupport: 'සජීවී සහාය',
    citizenPortal: 'පුරවැසි පෝට්ලය',
    sessionInfo: 'සැසි තොරතුරු',
    duration: 'කාලසීමාව',
    status: 'තත්ත්වය',
    quickReplies: {
      help1: 'මට ගමන් බලපත්‍ර අලුත් කිරීමට උදව් අවශ්‍යයි',
      help2: 'ඔබට මාව ක්‍රියාවලිය හරහා මඟ පෙන්විය හැකිද?',
      help3: 'මට කුමන ලේඛන අවශ්‍යද?',
      help4: 'ඔබගේ උදව්වට ස්තූතියි'
    },
    fileAttachment: 'ගොනුව අමුණා ඇත',
    justNow: 'දැන්',
    minutesAgo: 'මි පෙර',
    hoursAgo: 'පැය පෙර',
    daysAgo: 'දින පෙර',
    now: 'දැන්',
    you: 'ඔබ',
    fileSent: 'ගොනුව යවන ලදී'
  },
  ta: {
    backToDashboard: '← டாஷ்போர்டுக்கு திரும்பவும்',
    connecting: 'முகவருடன் இணைக்கிறது...',
    connectedTo: 'இணைக்கப்பட்டது',
    online: 'ஆன்லைன்',
    typing: 'டைப் செய்கிறது...',
    away: 'தொலைவில்',
    generatingResponse: 'பதிலை உருவாக்குகிறது...',
    isPreparingResponse: 'உங்கள் பதிலைத் தயாரிக்கிறது',
    typeMessage: 'உங்கள் செய்தியை டைப் செய்யுங்கள்...',
    attachFile: 'கோப்பை இணைக்கவும்',
    sendMessage: 'செய்தி அனுப்பு',
    chatSupport: 'அரட்டை ஆதரவு',
    liveSupport: 'நேரடி ஆதரவு',
    citizenPortal: 'குடிமக்கள் போர்டல்',
    sessionInfo: 'அமர்வு தகவல்',
    duration: 'கால அளவு',
    status: 'நிலை',
    quickReplies: {
      help1: 'எனக்கு பாஸ்போர்ட் புதுப்பிப்புக்கு உதவி தேவை',
      help2: 'செயல்முறையின் மூலம் எனக்கு வழிகாட்ட முடியுமா?',
      help3: 'எனக்கு என்ன ஆவணங்கள் தேவை?',
      help4: 'உங்கள் உதவிக்கு நன்றி'
    },
    fileAttachment: 'கோப்பு இணைப்பு',
    justNow: 'இப்போது',
    minutesAgo: 'மி முன்',
    hoursAgo: 'மணி முன்',
    daysAgo: 'நாள் முன்',
    now: 'இப்போது',
    you: 'நீங்கள்',
    fileSent: 'கோப்பு அனுப்பப்பட்டது'
  }
};

// Mock agent data
const getAgentById = (agentId: string): SupportAgent => {
  const agents: Record<string, SupportAgent> = {
    'agent-1': {
      id: 'agent-1',
      name: 'Nirma Perera',
      role: 'Senior Support Specialist',
      avatar: '/Agent.png',
      status: 'online'
    },
    'agent-2': {
      id: 'agent-2',
      name: 'Kamal Silva',
      role: 'Business Registration Expert',
      avatar: '/Agent.png',
      status: 'online'
    },
    'agent-3': {
      id: 'agent-3',
      name: 'Priya Fernando',
      role: 'Legal Documentation Officer',
      avatar: '/Agent.png',
      status: 'online'
    }
  };
  
  return agents[agentId] || agents['agent-1'];
};

// Chat Layout Component - EXACT SAME structure as Agent Chat Layout
const ChatLayout: React.FC<{
  children: React.ReactNode;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}> = ({ 
  children, 
  language = 'en',
  onLanguageChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const t = chatTranslations[language];

  const handleLanguageChange = (newLanguage: Language) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden theme-transition-slow">
      {/* EXACT SAME Sri Lankan Background as Agent Chat */}
      <SriLankanBackground />
      
      {/* Header - EXACT SAME styling as Agent Dashboard but for citizen */}
      <header className="sticky top-0 z-50 w-full bg-background/98 dark:bg-card backdrop-blur-md border-b border-border/30 dark:border-border/50 shadow-sm dark:shadow-lg">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#FFC72C]/10 to-[#FF5722]/10 rounded-xl p-0.5 flex items-center justify-center border border-[#FFC72C]/20 relative overflow-visible backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              <LotusIcon className="w-11 h-11 absolute transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-gradient leading-none">GovLink</span>
              <span className="text-xs text-muted-foreground/70 font-medium leading-none">{t.citizenPortal}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Back to Dashboard Link */}
            <Link 
              href="/User/Dashboard" 
              className="hidden md:flex text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 hover:scale-105 font-medium"
            >
              {t.backToDashboard}
            </Link>

            {/* Language Dropdown - EXACT SAME as Agent Chat */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 hover:border-[#FFC72C]/60 text-sm font-medium text-foreground hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 shadow-md hover:shadow-lg modern-card"
                aria-label={`Current language: ${languageOptions.find(lang => lang.code === language)?.nativeLabel}`}
              >
                <span className="text-xs sm:text-sm">{languageOptions.find(lang => lang.code === language)?.nativeLabel}</span>
                <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 glass-morphism border border-border/50 rounded-xl shadow-glow overflow-hidden animate-fade-in-up z-50">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as Language)}
                        className={`w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-card/30 ${
                          language === lang.code 
                            ? 'bg-[#FFC72C]/10 text-[#FFC72C] border-l-2 border-l-[#FFC72C]' 
                            : 'text-foreground'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{lang.nativeLabel}</div>
                          <div className="text-xs text-muted-foreground">{lang.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="w-px h-6 bg-border/50"></div>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 h-[calc(100vh-80px)]">
        {children}
      </main>
    </div>
  );
};

// Chat Session Component - Redesigned to match Agent Chat style
const ChatSession: React.FC<{
  agent: SupportAgent;
  messages: ChatMessage[];
  onSendMessage: (content: string, type?: 'text' | 'file', fileName?: string, fileUrl?: string) => void;
  isTyping: boolean;
  language?: Language;
}> = ({
  agent,
  messages,
  onSendMessage,
  isTyping,
  language = 'en'
}) => {
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = chatTranslations[language];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (file: File) => {
    // Mock file upload - in real app would upload to server
    const fileUrl = URL.createObjectURL(file);
    onSendMessage(`${t.fileSent}: ${file.name}`, 'file', file.name, fileUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow h-full flex flex-col animate-fade-in-up modern-card">
      {/* Chat Header - SAME as Agent but from citizen perspective */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Agent Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center text-white font-semibold shadow-lg overflow-hidden">
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background shadow-lg ${
                agent.status === 'online' ? 'bg-[#008060]' : 
                agent.status === 'typing' ? 'bg-[#FFC72C]' : 'bg-muted-foreground'
              } animate-pulse`}></div>
            </div>
            
            {/* Agent Info */}
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                {t.connectedTo} {agent.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
                <span className="text-xs text-[#008060] font-medium">{t.online}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{agent.role}</span>
              </div>
            </div>
          </div>

          {/* Session Actions */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-[#008060]/10 text-[#008060] rounded-lg text-xs font-medium border border-[#008060]/20">
              Active Session
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area - SAME structure as Agent Chat */}
      <div 
        className="flex-1 p-4 overflow-y-auto space-y-3 relative"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
      >
        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-4 bg-[#FFC72C]/10 border-2 border-dashed border-[#FFC72C] rounded-xl flex items-center justify-center z-10">
            <div className="text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p className="text-sm font-medium text-[#FFC72C]">Drop file to share</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'citizen' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}
          >
            {msg.type === 'system' ? (
              /* System Message */
              <div className="max-w-xs px-3 py-2 bg-muted/30 rounded-full text-xs text-muted-foreground text-center">
                {msg.content}
              </div>
            ) : msg.sender === 'citizen' ? (
              /* Citizen Message - RIGHT SIDE like Agent's messages */
              <div className="max-w-xs lg:max-w-md ml-12">
                <div className="p-3 rounded-2xl shadow-md bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white">
                  {msg.type === 'file' ? (
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span className="text-sm">{msg.fileName || msg.content}</span>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                </div>
                
                {/* Message info */}
                <div className="flex items-center gap-2 mt-1 px-1 justify-end">
                  <span className="text-xs text-muted-foreground">{t.you}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ) : (
              /* Agent Message - LEFT SIDE */
              <div className="max-w-xs lg:max-w-md mr-12">
                <div className="p-3 rounded-2xl shadow-md bg-card/80 text-foreground border border-border/30 backdrop-blur-sm">
                  {msg.type === 'file' ? (
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span className="text-sm">{msg.fileName || msg.content}</span>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                </div>
                
                {/* Message info */}
                <div className="flex items-center gap-2 mt-1 px-1 justify-start">
                  <span className="text-xs text-muted-foreground">{agent.name}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator - SAME as Agent Chat */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs mr-12">
              <div className="p-3 bg-card/80 border border-border/30 rounded-2xl backdrop-blur-sm shadow-md">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">{agent.name} {t.typing}</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - SAME as Agent Chat */}
      <div className="p-4 border-t border-border/30">
        {/* Quick Replies */}
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.values(t.quickReplies).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setMessage(suggestion)}
              className="px-3 py-1.5 bg-card/50 hover:bg-card border border-border/50 hover:border-[#FFC72C] rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 text-muted-foreground hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C] transition-all duration-300 flex-shrink-0 shadow-md hover:shadow-lg modern-card"
            title={t.attachFile}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight(e.target);
              }}
              onKeyPress={handleKeyPress}
              placeholder={t.typeMessage}
              className="w-full bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-lg px-4 py-3 pr-12 text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 resize-none overflow-hidden min-h-[48px] max-h-[120px] shadow-md modern-card"
              rows={1}
            />
            
            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-lg hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#FFC72C] disabled:hover:to-[#FF5722] shadow-lg hover:shadow-xl"
              title={t.sendMessage}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Chat Component
function HumanChatContent({ agentId }: { agentId: string }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [agent] = useState<SupportAgent>(getAgentById(agentId));
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'system',
      content: `Connected to ${agent.name} - ${agent.role}`,
      timestamp: new Date().toISOString(),
      type: 'system'
    },
    {
      id: '2',
      sender: 'agent',
      content: `Hello! I'm ${agent.name}, your ${agent.role}. I'm here to help you with your government service needs. How can I assist you today?`,
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const handleSendMessage = (content: string, type: 'text' | 'file' = 'text', fileName?: string, fileUrl?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'citizen',
      content,
      timestamp: new Date().toISOString(),
      type,
      fileName,
      fileUrl
    };

    setMessages(prev => [...prev, newMessage]);

    // Show typing indicator and simulate agent response
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: getAgentResponse(content, type),
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, agentResponse]);
    }, Math.random() * 1500 + 1500); // 1.5-3 seconds
  };

  const getAgentResponse = (userMessage: string, type: string) => {
    if (type === 'file') {
      return "Thank you for sharing the document. I'll review it and get back to you with the next steps. Is there anything specific you'd like me to look for in this document?";
    }

    const lower = userMessage.toLowerCase();
    
    if (lower.includes('passport')) {
      return "I'd be happy to help you with passport services! For passport renewal, you'll need your current passport (if available), National Identity Card, two recent passport-sized photographs, and the completed Application Form 'K'. The standard processing time is 7-10 working days. Would you like me to guide you through the complete process step by step?";
    }
    
    if (lower.includes('thank')) {
      return "You're very welcome! I'm glad I could help. Is there anything else you need assistance with today? I'm here to help with any government service questions you might have.";
    }
    
    if (lower.includes('document')) {
      return "For most government services, the basic documents you'll typically need include your National Identity Card, recent photographs, and any relevant certificates or proof documents. Could you tell me which specific service you're applying for so I can provide you with the exact document requirements?";
    }

    return "I understand your inquiry. Let me help you with that. Could you provide me with more specific details about what you need assistance with? This will help me give you the most accurate guidance for your situation.";
  };

  return (
    <ChatLayout
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      {/* Main Chat Interface - Full height */}
      <div className="h-full p-4">
        <div className="max-w-6xl mx-auto h-full">
          <ChatSession
            agent={agent}
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            language={currentLanguage}
          />
        </div>
      </div>
    </ChatLayout>
  );
}

export default function HumanChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-background">
        <SriLankanBackground />
        <div className="relative z-10 bg-card/90 dark:bg-card/95 backdrop-blur-md p-8 rounded-2xl border border-border/50 shadow-glow modern-card">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#FFC72C] border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Connecting to Agent...</h3>
              <p className="text-sm text-muted-foreground">Please wait while we connect you to a support specialist</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <HumanChatWrapper />
    </Suspense>
  );
}

function HumanChatWrapper() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent') || 'agent-1';

  return <HumanChatContent agentId={agentId} />;
}
