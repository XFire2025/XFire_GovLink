"use client";
import React, { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

// Types
type Language = 'en' | 'si' | 'ta';

// Chat translations
const chatTranslations: Record<Language, {
  title: string;
  subtitle: string;
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
}> = {
  en: {
    title: 'Live Support',
    subtitle: 'Get real-time assistance from our government service specialists',
    backToDashboard: 'Back to Dashboard',
    connecting: 'Connecting to agent...',
    connectedTo: 'Connected to',
    online: 'Online',
    typing: 'Typing...',
    away: 'Away',
    generatingResponse: 'Generating response...',
    isPreparingResponse: 'is preparing your response',
    typeMessage: 'Type your message...',
    attachFile: 'Attach file',
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
    now: 'Just now'
  },
  si: {
    title: 'සජීවී සහාය',
    subtitle: 'අපගේ රජයේ සේවා විශේෂඥයන්ගෙන් තත්‍ය කාලීන සහාය ලබා ගන්න',
    backToDashboard: 'පාලනයට ආපසු',
    connecting: 'නිලධාරියා සමඟ සම්බන්ධ වෙමින්...',
    connectedTo: 'සම්බන්ධ වී ඇත',
    online: 'මාර්ගගතව',
    typing: 'ටයිප් කරමින්...',
    away: 'ඈත',
    generatingResponse: 'ප්‍රතිචාරය ජනනය කරමින්...',
    isPreparingResponse: 'ඔබගේ ප්‍රතිචාරය සකස් කරමින්',
    typeMessage: 'ඔබගේ පණිවිඩය ටයිප් කරන්න...',
    attachFile: 'ගොනුව අමුණන්න',
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
    now: 'දැන්'
  },
  ta: {
    title: 'நேரடி ஆதரவு',
    subtitle: 'எங்கள் அரசு சேவை நிபுணர்களிடமிருந்து நிகழ்நேர உதவியைப் பெறுங்கள்',
    backToDashboard: 'டாஷ்போர்டுக்கு திரும்பவும்',
    connecting: 'முகவருடன் இணைக்கிறது...',
    connectedTo: 'இணைக்கப்பட்டது',
    online: 'ஆன்லைன்',
    typing: 'டைப் செய்கிறது...',
    away: 'தொலைவில்',
    generatingResponse: 'பதிலை உருவாக்குகிறது...',
    isPreparingResponse: 'உங்கள் பதிலைத் தயாரிக்கிறது',
    typeMessage: 'உங்கள் செய்தியை டைப் செய்யுங்கள்...',
    attachFile: 'கோப்பை இணைக்கவும்',
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
    now: 'இப்போது'
  }
};

// --- PREMIUM SVG ICON COMPONENTS ---
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const FileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);

const PaperclipIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
  </svg>
);

const MoreVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"/>
    <circle cx="12" cy="5" r="1"/>
    <circle cx="12" cy="19" r="1"/>
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const CheckCheck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11 12 14l4-4"/>
    <path d="m21 12-3 3-3-3"/>
  </svg>
);


// Support Agent Interface
interface SupportAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'typing' | 'away';
  lastSeen?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'user' | 'agent';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
}

// Mock agent data
const getAgentById = (agentId: string): SupportAgent => {
  const agents: Record<string, SupportAgent> = {
    'agent-1': {
      id: 'agent-1',
      name: 'Nirma Perera',
      role: 'Senior Support Specialist',
      avatar: '/api/placeholder/64/64',
      status: 'online'
    },
    'agent-2': {
      id: 'agent-2',
      name: 'Kamal Silva',
      role: 'Business Registration Expert',
      avatar: '/api/placeholder/64/64',
      status: 'online'
    },
    'agent-3': {
      id: 'agent-3',
      name: 'Priya Fernando',
      role: 'Legal Documentation Officer',
      avatar: '/api/placeholder/64/64',
      status: 'online'
    }
  };
  
  return agents[agentId] || agents['agent-1'];
};

// --- PREMIUM HEADER COMPONENT ---
const ChatHeader = ({ agent, onBack, t }: { agent: SupportAgent; onBack: () => void; t: typeof chatTranslations.en }) => (
  <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border-b border-border/50 p-4 modern-card">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-card/50 rounded-xl transition-all duration-300 hover:scale-105 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={agent.avatar} 
              alt={agent.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#FFC72C]/30 shadow-lg"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background shadow-lg ${
              agent.status === 'online' ? 'bg-[#008060]' : 
              agent.status === 'typing' ? 'bg-[#FFC72C]' : 'bg-muted-foreground'
            }`}></div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{agent.name}</h1>
            <p className="text-sm text-muted-foreground">{agent.role}</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                agent.status === 'online' ? 'bg-[#008060]' : 
                agent.status === 'typing' ? 'bg-[#FFC72C]' : 'bg-muted-foreground'
              }`}></div>
              <span className="text-xs text-muted-foreground">
                {agent.status === 'online' ? t.online : 
                 agent.status === 'typing' ? t.typing : t.away}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 bg-card/50 hover:bg-[#FFC72C]/10 rounded-xl transition-all duration-300 hover:scale-105 group modern-card">
          <PhoneIcon className="text-muted-foreground group-hover:text-[#FFC72C]" />
        </button>
        <button className="p-2 bg-card/50 hover:bg-[#FFC72C]/10 rounded-xl transition-all duration-300 hover:scale-105 group modern-card">
          <VideoIcon className="text-muted-foreground group-hover:text-[#FFC72C]" />
        </button>
        <button className="p-2 bg-card/50 hover:bg-[#FFC72C]/10 rounded-xl transition-all duration-300 hover:scale-105 group modern-card">
          <MoreVerticalIcon className="text-muted-foreground group-hover:text-[#FFC72C]" />
        </button>
      </div>
    </div>
  </div>
);

// --- MESSAGE COMPONENTS ---
const TimeAgo = ({ timestamp, t }: { timestamp: Date; t: typeof chatTranslations.en }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

      if (diff < 60) {
        setTimeAgo(t.now);
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        setTimeAgo(`${minutes} ${t.minutesAgo}`);
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        setTimeAgo(`${hours} ${t.hoursAgo}`);
      } else {
        const days = Math.floor(diff / 86400);
        setTimeAgo(`${days} ${t.daysAgo}`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timestamp, t]);

  return <span className="text-xs text-muted-foreground">{timeAgo}</span>;
};

const UserMessage = ({ message, t }: { message: ChatMessage; t: typeof chatTranslations.en }) => (
  <div className="flex justify-end my-4 animate-fade-in-up">
    <div className="max-w-2xl">
      <div className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white p-4 rounded-2xl rounded-br-lg shadow-glow">
        {message.type === 'file' ? (
          <div className="flex items-center gap-3">
            <FileIcon className="w-5 h-5" />
            <div>
              <p className="font-medium">{message.fileName}</p>
              <p className="text-sm opacity-80">File attachment</p>
            </div>
          </div>
        ) : (
          <p className="leading-relaxed">{message.content}</p>
        )}
      </div>
      <div className="flex items-center justify-end gap-2 mt-1">
        <TimeAgo timestamp={message.timestamp} t={t} />
        <div className="flex items-center">
          {message.status === 'sent' && <CheckIcon className="text-muted-foreground" />}
          {message.status === 'delivered' && <CheckCheck className="text-muted-foreground" />}
          {message.status === 'read' && <CheckCheck className="text-[#FFC72C]" />}
        </div>
      </div>
    </div>
  </div>
);

const AgentMessage = ({ message, agent, t }: { message: ChatMessage; agent: SupportAgent; t: typeof chatTranslations.en }) => (
  <div className="flex justify-start my-4 animate-fade-in-up">
    <div className="flex gap-3 max-w-4xl">
      <div className="flex-shrink-0">
        <Image
          src={agent.avatar} 
          alt={agent.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#FFC72C]/20"
        />
      </div>
      <div className="flex-1">
        <div className="glass-morphism backdrop-blur-xl p-4 rounded-2xl rounded-bl-lg shadow-xl border border-border/50">
          {message.type === 'file' ? (
            <div className="flex items-center gap-3">
              <FileIcon className="w-5 h-5 text-[#FFC72C]" />
              <div>
                <p className="font-medium text-foreground">{message.fileName}</p>
                <p className="text-sm text-muted-foreground">File attachment</p>
              </div>
            </div>
          ) : message.type === 'system' ? (
            <p className="text-sm text-muted-foreground italic">{message.content}</p>
          ) : (
            <p className="leading-relaxed text-foreground">{message.content}</p>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {agent.name} • <TimeAgo timestamp={message.timestamp} t={t} />
        </div>
      </div>
    </div>
  </div>
);

// --- TYPING INDICATOR ---
const TypingIndicator = ({ agent }: { agent: SupportAgent }) => (
  <div className="flex justify-start my-4 animate-fade-in-up">
    <div className="flex gap-3 max-w-4xl">
      <div className="flex-shrink-0">
        <Image
          src={agent.avatar} 
          alt={agent.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#FFC72C]/20"
        />
      </div>
      <div className="flex-1">
        <div className="glass-morphism backdrop-blur-xl p-4 rounded-2xl rounded-bl-lg shadow-xl border border-border/50">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <span className="animate-pulse">•</span>
            <span className="animate-pulse" style={{animationDelay: '0.2s'}}>•</span>
            <span className="animate-pulse" style={{animationDelay: '0.4s'}}>•</span>
            <span className="ml-2 text-sm">Generating response...</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {agent.name} is preparing your response
        </div>
      </div>
    </div>
  </div>
);

// --- CHAT INPUT ---
const ChatInput = ({ onSendMessage }: { onSendMessage: (message: string, type?: 'text' | 'file') => void }) => {
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

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onSendMessage(file.name, 'file');
      }
    };
    input.click();
  };

  return (
    <div className="glass-morphism backdrop-blur-xl border-t border-border/50 p-6">
      <div className="container mx-auto">
        <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
          <div className="relative glass-morphism rounded-2xl p-2 shadow-glow hover:shadow-2xl transition-all duration-500">
            <button 
              onClick={handleFileUpload}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-[#FFC72C] transition-colors duration-300 z-10"
              title="Attach file"
            >
              <PaperclipIcon />
            </button>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              className="w-full bg-transparent text-foreground placeholder-muted-foreground p-4 pl-12 pr-16 rounded-xl resize-none focus:outline-none leading-relaxed border-none"
              placeholder="Type your message..."
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
          
          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "I need help with passport renewal",
              "Can you guide me through the process?",
              "What documents do I need?",
              "Thank you for your help"
            ].map((suggestion, index) => (
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

// --- MAIN CHAT COMPONENT ---
function HumanChatContent({ agentId }: { agentId: string }) {
  const router = useRouter();
  const [language] = useState<Language>('en');
  const t = chatTranslations[language];
  
  const [agent] = useState<SupportAgent>(getAgentById(agentId));
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: agent.id,
      senderType: 'agent',
      content: `Hello! I'm ${agent.name}, your ${agent.role}. I'm here to help you with your government service needs. How can I assist you today?`,
      timestamp: new Date(),
      status: 'read',
      type: 'system'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleBack = () => {
    router.push('/User/Dashboard');
  };

  const handleSendMessage = (content: string, type: 'text' | 'file' = 'text') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderType: 'user',
      content,
      timestamp: new Date(),
      status: 'sent',
      type,
      ...(type === 'file' && { fileName: content })
    };

    setMessages(prev => [...prev, newMessage]);

    // Show typing indicator immediately and start generating response
    setIsTyping(true);
    
    // Simulate response generation time (1.5-3 seconds)
    const responseTime = Math.random() * 1500 + 1500; // 1.5-3 seconds
    
    setTimeout(() => {
      setIsTyping(false);
      
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: agent.id,
        senderType: 'agent',
        content: getAgentResponse(content, type),
        timestamp: new Date(),
        status: 'read',
        type: 'text'
      };
      
      // Add the complete response all at once
      setMessages(prev => [...prev, agentResponse]);
    }, responseTime);

    // Update user message status progression
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 800);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 1200);
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
    <div className="flex flex-col h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#FFC72C]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#FF5722]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <ChatHeader agent={agent} onBack={handleBack} t={t} />

        {/* Chat Messages Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-2">
              {/* Connection Notice */}
              <div className="text-center py-8 mb-8">
                <div className="inline-flex items-center gap-3 glass-morphism px-6 py-3 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Connected to {agent.name}
                  </span>
                </div>
              </div>

              {/* Messages */}
              {messages.map((message) => (
                message.senderType === 'user' ? (
                  <UserMessage key={message.id} message={message} t={t} />
                ) : (
                  <AgentMessage key={message.id} message={message} agent={agent} t={t} />
                )
              ))}
              
              {/* Typing Indicator */}
              {isTyping && <TypingIndicator agent={agent} />}
            </div>
          </div>
        </main>

        {/* Fixed Input Area */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default function HumanChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="glass-morphism p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#FFC72C] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-muted-foreground">Connecting to agent...</span>
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

  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => {
      // Connection established
    }, 1000);

    return () => clearTimeout(timer);
  }, [agentId]);

  return <HumanChatContent agentId={agentId} />;
}
