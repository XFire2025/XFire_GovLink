"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LotusIcon } from '@/components/Icons/LotusIcon';

// Types
type Language = 'en' | 'si' | 'ta';
type AgentStatus = 'available' | 'busy' | 'away' | 'offline';

interface SupportAgent {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  status: AgentStatus;
  avatar: string;
  responseTime: string;
  languages: string[];
  currentQueue: number;
}

// Lotus icon imported from shared Icons

// Icon components
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="m22 21-3-3M14.5 6.5C15.3 6.5 16 7.2 16 8s-.7 1.5-1.5 1.5S13 8.8 13 8s.7-1.5 1.5-1.5"/>
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

// EXACT SAME Sri Lankan Background Component as other user pages
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

// Language options
const languageOptions = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமිழ්' }
];

// Translations
const translations: Record<Language, {
  pageTitle: string;
  pageSubtitle: string;
  backToDashboard: string;
  citizenPortal: string;
  available: string;
  busy: string;
  away: string;
  offline: string;
  connectNow: string;
  joinQueue: string;
  unavailable: string;
  responseTime: string;
  inQueue: string;
  languages: string;
  specialties: string;
  filterAll: string;
  searchPlaceholder: string;
  noAgentsFound: string;
  noAgentsDescription: string;
  needHelp: string;
  needHelpDescription: string;
  tryAIAssistant: string;
  requestCallback: string;
  avgResponse: string;
}> = {
  en: {
    pageTitle: 'Connect with Support Agents',
    pageSubtitle: 'Get personalized assistance from our expert support team for all your government service needs',
    backToDashboard: '← Back to Dashboard',
    citizenPortal: 'Citizen Portal',
    available: 'Available',
    busy: 'Busy', 
    away: 'Away',
    offline: 'Offline',
    connectNow: 'Connect Now',
    joinQueue: 'Join Queue',
    unavailable: 'Unavailable',
    responseTime: 'Response',
    inQueue: 'in queue',
    languages: 'Languages',
    specialties: 'Specialties',
    filterAll: 'All',
    searchPlaceholder: 'Search by name or specialty...',
    noAgentsFound: 'No agents found',
    noAgentsDescription: 'Try adjusting your filters or search terms to find available support agents.',
    needHelp: 'Need Immediate Help?',
    needHelpDescription: 'If all agents are busy, you can try our AI assistant for instant help or join the queue for the next available agent.',
    tryAIAssistant: 'Try AI Assistant',
    requestCallback: 'Request Callback',
    avgResponse: 'Avg 3min response'
  },
  si: {
    pageTitle: 'සහාය නියෝජිතයන් සමඟ සම්බන්ධ වන්න',
    pageSubtitle: 'ඔබගේ සියලුම රජයේ සේවා අවශ්‍යතා සඳහා අපගේ ප්‍රවීණ සහාය කණ්ඩායමෙන් පුද්ගලීකරණය කළ සහාය ලබා ගන්න',
    backToDashboard: '← පාලනයට ආපසු',
    citizenPortal: 'පුරවැසි පෝට්ලය',
    available: 'ලබා ගත හැකි',
    busy: 'කාර්යබහුල',
    away: 'ඈත',
    offline: 'නොබැඳි',
    connectNow: 'දැන් සම්බන්ධ වන්න',
    joinQueue: 'පෝලිමට සම්බන්ධ වන්න',
    unavailable: 'ලබා ගත නොහැක',
    responseTime: 'ප්‍රතිචාරය',
    inQueue: 'පෝලිමේ',
    languages: 'භාෂා',
    specialties: 'විශේෂතා',
    filterAll: 'සියල්ල',
    searchPlaceholder: 'නම හෝ විශේෂත්වය අනුව සොයන්න...',
    noAgentsFound: 'නියෝජිතයන් හමු නොවිය',
    noAgentsDescription: 'ලබා ගත හැකි සහාය නියෝජිතයන් සොයා ගැනීමට ඔබගේ ෆිල්ටර හෝ සෙවුම් යෙදුම් සකස් කිරීමට උත්සාහ කරන්න.',
    needHelp: 'ක්ෂණික උදව් අවශ්‍යද?',
    needHelpDescription: 'සියලුම නියෝජිතයන් කාර්යබහුල නම්, ඔබට ක්ෂණික උදව් සඳහා අපගේ AI සහායක උත්සාහ කළ හැකිය.',
    tryAIAssistant: 'AI සහායක උත්සාහ කරන්න',
    requestCallback: 'ආපසු ඇමතුමක් ඉල්ලන්න',
    avgResponse: 'සාමාන්‍ය මිනිත්තු 3 ප්‍රතිචාරය'
  },
  ta: {
    pageTitle: 'ஆதரவு முகவர்களுடன் இணைக்கவும்',
    pageSubtitle: 'உங்கள் அனைத்து அரசு சேவை தேவைகளுக்கும் எங்கள் நிபுணத்துவ ஆதரவு குழுவிடமிருந்து தனிப்பயனாக்கப்பட்ட உதவியைப் பெறுங்கள்',
    backToDashboard: '← டாஷ்போர்டுக்கு திரும்பவும்',
    citizenPortal: 'குடிமக்கள் போர்டல்',
    available: 'கிடைக்கிறது',
    busy: 'பிஸியாக',
    away: 'தொலைவில்',
    offline: 'ஆஃப்லைன்',
    connectNow: 'இப்போது இணைக்கவும்',
    joinQueue: 'வரிசையில் சேரவும்',
    unavailable: 'கிடைக்கவில்லை',
    responseTime: 'பதில்',
    inQueue: 'வரிசையில்',
    languages: 'மொழிகள்',
    specialties: 'சிறப்புகள்',
    filterAll: 'அனைத்தும்',
    searchPlaceholder: 'பெயர் அல்லது சிறப்பு மூலம் தேடுங்கள்...',
    noAgentsFound: 'முகவர்கள் கிடைக்கவில்லை',
    noAgentsDescription: 'கிடைக்கக்கூடிய ஆதரவு முகவர்களைக் கண்டறிய உங்கள் வடிப்பான்கள் அல்லது தேடல் சொற்களை மாற்ற முயற்சிக்கவும்.',
    needHelp: 'உடனடி உதவி தேவையா?',
    needHelpDescription: 'அனைத்து முகவர்களும் பிஸியாக இருந்தால், உடனடி உதவிக்காக எங்கள் AI உதவியாளரை முயற்சிக்கலாம்.',
    tryAIAssistant: 'AI உதவியாளரை முயற்சிக்கவும்',
    requestCallback: 'திரும்ப அழைக்க கோருங்கள்',
    avgResponse: 'சராசரி 3 நிமிட பதில்'
  }
};

// Modern Layout Component - matching other user pages
const WaitPageLayout: React.FC<{
  children: React.ReactNode;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}> = ({ 
  children, 
  language = 'en',
  onLanguageChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const t = translations[language];

  const handleLanguageChange = (newLanguage: Language) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden theme-transition-slow">
      {/* EXACT SAME Sri Lankan Background as other user pages */}
      <SriLankanBackground />
      
      {/* Header - EXACT SAME styling as other user pages */}
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
              href="/user/dashboard" 
              className="hidden md:flex text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 hover:scale-105 font-medium"
            >
              {t.backToDashboard}
            </Link>

            {/* Language Dropdown */}
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
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};

// Mock support agents data
const supportAgents: SupportAgent[] = [
  {
    id: 'agent-1',
    name: 'Nirma Perera',
    role: 'Senior Support Specialist',
    specialties: ['Passport Services', 'Immigration', 'Document Verification'],
    status: 'available',
    avatar: '/Agent.png',
    responseTime: '< 2 min',
    languages: ['English', 'Sinhala', 'Tamil'],
    currentQueue: 0
  },
  {
    id: 'agent-2',
    name: 'Kamal Silva',
    role: 'Business Registration Expert',
    specialties: ['Business Registration', 'Licensing', 'Tax Services'],
    status: 'busy',
    avatar: '/Agent.png',
    responseTime: '< 5 min',
    languages: ['English', 'Sinhala'],
    currentQueue: 3
  },
  {
    id: 'agent-3',
    name: 'Priya Fernando',
    role: 'Legal Documentation Officer',
    specialties: ['Marriage Certificates', 'Birth Certificates', 'Legal Documents'],
    status: 'available',
    avatar: '/Agent.png',
    responseTime: '< 3 min',
    languages: ['English', 'Sinhala', 'Tamil'],
    currentQueue: 0
  },
  {
    id: 'agent-4',
    name: 'Rohith Jayasinghe',
    role: 'Motor Vehicle Specialist',
    specialties: ['Driving Licenses', 'Vehicle Registration', 'Motor Services'],
    status: 'away',
    avatar: '/Agent.png',
    responseTime: '< 10 min',
    languages: ['English', 'Sinhala'],
    currentQueue: 0
  },
  {
    id: 'agent-5',
    name: 'Sanduni Wickramasinghe',
    role: 'General Support Agent',
    specialties: ['General Inquiries', 'Information Services', 'Guidance'],
    status: 'available',
    avatar: '/Agent.png',
    responseTime: '< 1 min',
    languages: ['English', 'Sinhala', 'Tamil'],
    currentQueue: 0
  },
  {
    id: 'agent-6',
    name: 'Thilak Mendis',
    role: 'Senior Consultant',
    specialties: ['Complex Cases', 'Appeals', 'Special Requests'],
    status: 'offline',
    avatar: '/Agent.png',
    responseTime: 'N/A',
    languages: ['English', 'Sinhala'],
    currentQueue: 0
  }
];

// Status indicator component
const StatusIndicator = ({ status, language = 'en' }: { status: AgentStatus; language?: Language }) => {
  const t = translations[language];
  const statusConfig = {
    available: { color: 'bg-[#008060]', text: t.available, textColor: 'text-[#008060]' },
    busy: { color: 'bg-[#FF5722]', text: t.busy, textColor: 'text-[#FF5722]' },
    away: { color: 'bg-[#FFC72C]', text: t.away, textColor: 'text-[#FFC72C]' },
    offline: { color: 'bg-muted-foreground', text: t.offline, textColor: 'text-muted-foreground' }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${config.color} ${status === 'available' ? 'animate-pulse' : ''}`}></div>
      <span className={`text-sm font-medium ${config.textColor}`}>{config.text}</span>
    </div>
  );
};

// Support Agent Card Component
const AgentCard = ({ 
  agent, 
  onConnect, 
  language = 'en' 
}: { 
  agent: SupportAgent; 
  onConnect: (agentId: string) => void;
  language?: Language;
}) => {
  const t = translations[language];
  const isAvailable = agent.status === 'available';
  
  return (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow p-6 hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in-up modern-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center text-white font-semibold shadow-lg overflow-hidden">
              <Image
                src={agent.avatar}
                alt={agent.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background shadow-lg ${
              agent.status === 'available' ? 'bg-[#008060]' : 
              agent.status === 'busy' ? 'bg-[#FF5722]' : 
              agent.status === 'away' ? 'bg-[#FFC72C]' : 'bg-muted-foreground'
            } ${agent.status === 'available' ? 'animate-pulse' : ''}`}></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.role}</p>
            <StatusIndicator status={agent.status} language={language} />
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-1">{t.specialties}:</p>
          <div className="flex flex-wrap gap-1">
            {agent.specialties.map((specialty, index) => (
              <span key={index} className="px-2 py-1 bg-[#FFC72C]/10 text-[#FFC72C] text-xs rounded-full border border-[#FFC72C]/20">
                {specialty}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <ClockIcon className="text-muted-foreground" />
            <span className="text-muted-foreground">{t.responseTime}: {agent.responseTime}</span>
          </div>
          {agent.status === 'busy' && (
            <div className="flex items-center gap-2">
              <UsersIcon className="text-muted-foreground w-4 h-4" />
              <span className="text-muted-foreground">{agent.currentQueue} {t.inQueue}</span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground mb-1">{t.languages}:</p>
          <p className="text-sm text-muted-foreground">{agent.languages.join(', ')}</p>
        </div>
      </div>
      
      <button 
        onClick={() => onConnect(agent.id)}
        disabled={!isAvailable}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
          isAvailable 
            ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] text-white shadow-glow hover:scale-105' 
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        {isAvailable ? (
          <div className="flex items-center justify-center gap-2">
            <MessageSquareIcon />
            {t.connectNow}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <ClockIcon />
            {agent.status === 'busy' ? t.joinQueue : t.unavailable}
          </div>
        )}
      </button>
    </div>
  );
};

// Main Wait Page Content Component
function WaitPageContent() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [agents] = useState<SupportAgent[]>(supportAgents);
  const [selectedFilter, setSelectedFilter] = useState<'all' | AgentStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const t = translations[currentLanguage];

  // Filter agents based on status and search term
  const filteredAgents = agents.filter(agent => {
    const matchesFilter = selectedFilter === 'all' || agent.status === selectedFilter;
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const availableAgents = agents.filter(agent => agent.status === 'available').length;
  const busyAgents = agents.filter(agent => agent.status === 'busy').length;

  const handleConnectToAgent = (agentId: string) => {
    // Navigate to human chat with the selected agent
  router.push(`/user/chat/human?agent=${agentId}`);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  return (
    <WaitPageLayout
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            {t.pageTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t.pageSubtitle}
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md px-6 py-3 rounded-full border border-border/50 shadow-md modern-card">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#008060] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{availableAgents} {t.available}</span>
              </div>
            </div>
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md px-6 py-3 rounded-full border border-border/50 shadow-md modern-card">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF5722] rounded-full"></div>
                <span className="text-sm font-medium">{busyAgents} {t.busy}</span>
              </div>
            </div>
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md px-6 py-3 rounded-full border border-border/50 shadow-md modern-card">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-[#FFC72C]" />
                <span className="text-sm font-medium">{t.avgResponse}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'available', 'busy', 'away', 'offline'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedFilter === status
                      ? 'bg-[#FFC72C] text-[#8D153A] shadow-glow'
                      : 'bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-foreground hover:border-[#FFC72C] modern-card'
                  }`}
                >
                  {status === 'all' ? t.filterAll : t[status as keyof typeof t] as string}
                </button>
              ))}
            </div>
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl pl-4 pr-10 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] transition-all duration-300 min-w-[300px] shadow-md modern-card"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Support Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onConnect={handleConnectToAgent}
              language={currentLanguage}
            />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow p-8 max-w-md mx-auto modern-card">
              <UsersIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{t.noAgentsFound}</h3>
              <p className="text-muted-foreground">
                {t.noAgentsDescription}
              </p>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="text-center">
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow p-8 max-w-2xl mx-auto modern-card">
            <h2 className="text-2xl font-bold text-gradient mb-4">{t.needHelp}</h2>
            <p className="text-muted-foreground mb-6">
              {t.needHelpDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/user/chat/bot"
                className="px-6 py-3 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-glow"
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageSquareIcon />
                  <span>{t.tryAIAssistant}</span>
                </div>
              </Link>
              <button className="px-6 py-3 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 hover:border-[#FFC72C] text-foreground rounded-xl font-semibold transition-all duration-300 hover:scale-105 modern-card">
                <div className="flex items-center justify-center gap-2">
                  <PhoneIcon />
                  <span>{t.requestCallback}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </WaitPageLayout>
  );
}

export default function SupportAgentWaitPage() {
  return <WaitPageContent />;
}
