"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

// --- PREMIUM SVG ICON COMPONENTS ---
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

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
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

// Support Agent Status Types
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
  rating: number;
  currentQueue: number;
}

// --- PREMIUM HEADER COMPONENT ---
const Header = () => (
  <header className="glass-morphism backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
    <nav className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LotusIcon className="animate-glow" />
          <div>
            <h1 className="text-2xl font-bold text-gradient">GovLink</h1>
            <p className="text-xs text-muted-foreground font-medium">Support Center</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/User/Chat/Bot" 
            className="text-muted-foreground hover:text-foreground transition-colors duration-300 px-4 py-2 rounded-full hover:bg-card/30 text-sm font-medium"
          >
            AI Assistant
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

// Status indicator component
const StatusIndicator = ({ status }: { status: AgentStatus }) => {
  const statusConfig = {
    available: { color: 'bg-green-500', text: 'Available', textColor: 'text-green-500' },
    busy: { color: 'bg-red-500', text: 'Busy', textColor: 'text-red-500' },
    away: { color: 'bg-yellow-500', text: 'Away', textColor: 'text-yellow-500' },
    offline: { color: 'bg-gray-500', text: 'Offline', textColor: 'text-gray-500' }
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
const AgentCard = ({ agent, onConnect }: { agent: SupportAgent; onConnect: (agentId: string) => void }) => {
  const isAvailable = agent.status === 'available';
  
  return (
    <div className="glass-morphism rounded-2xl p-6 hover:shadow-glow transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={agent.avatar} 
              alt={agent.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#FFC72C]/20"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${
              agent.status === 'available' ? 'bg-green-500' : 
              agent.status === 'busy' ? 'bg-red-500' : 
              agent.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.role}</p>
            <StatusIndicator status={agent.status} />
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-3 h-3 ${i < agent.rating ? 'text-[#FFC72C]' : 'text-gray-300'}`}>
                ⭐
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{agent.rating}/5</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Specialties:</p>
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
            <span className="text-muted-foreground">Response: {agent.responseTime}</span>
          </div>
          {agent.status === 'busy' && (
            <div className="flex items-center gap-2">
              <UsersIcon className="text-muted-foreground w-4 h-4" />
              <span className="text-muted-foreground">{agent.currentQueue} in queue</span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Languages:</p>
          <p className="text-sm text-muted-foreground">{agent.languages.join(', ')}</p>
        </div>
      </div>
      
      <button 
        onClick={() => onConnect(agent.id)}
        disabled={!isAvailable}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
          isAvailable 
            ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] text-white shadow-glow hover:scale-105' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isAvailable ? (
          <div className="flex items-center justify-center gap-2">
            <MessageSquareIcon />
            Connect Now
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <ClockIcon />
            {agent.status === 'busy' ? 'Join Queue' : 'Unavailable'}
          </div>
        )}
      </button>
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
    avatar: '/api/placeholder/64/64',
    responseTime: '< 2 min',
    languages: ['English', 'Sinhala', 'Tamil'],
    rating: 5,
    currentQueue: 0
  },
  {
    id: 'agent-2',
    name: 'Kamal Silva',
    role: 'Business Registration Expert',
    specialties: ['Business Registration', 'Licensing', 'Tax Services'],
    status: 'busy',
    avatar: '/api/placeholder/64/64',
    responseTime: '< 5 min',
    languages: ['English', 'Sinhala'],
    rating: 4,
    currentQueue: 3
  },
  {
    id: 'agent-3',
    name: 'Priya Fernando',
    role: 'Legal Documentation Officer',
    specialties: ['Marriage Certificates', 'Birth Certificates', 'Legal Documents'],
    status: 'available',
    avatar: '/api/placeholder/64/64',
    responseTime: '< 3 min',
    languages: ['English', 'Sinhala', 'Tamil'],
    rating: 5,
    currentQueue: 0
  },
  {
    id: 'agent-4',
    name: 'Rohith Jayasinghe',
    role: 'Motor Vehicle Specialist',
    specialties: ['Driving Licenses', 'Vehicle Registration', 'Motor Services'],
    status: 'away',
    avatar: '/api/placeholder/64/64',
    responseTime: '< 10 min',
    languages: ['English', 'Sinhala'],
    rating: 4,
    currentQueue: 0
  },
  {
    id: 'agent-5',
    name: 'Sanduni Wickramasinghe',
    role: 'General Support Agent',
    specialties: ['General Inquiries', 'Information Services', 'Guidance'],
    status: 'available',
    avatar: '/api/placeholder/64/64',
    responseTime: '< 1 min',
    languages: ['English', 'Sinhala', 'Tamil'],
    rating: 4,
    currentQueue: 0
  },
  {
    id: 'agent-6',
    name: 'Thilak Mendis',
    role: 'Senior Consultant',
    specialties: ['Complex Cases', 'Appeals', 'Special Requests'],
    status: 'offline',
    avatar: '/api/placeholder/64/64',
    responseTime: 'N/A',
    languages: ['English', 'Sinhala'],
    rating: 5,
    currentQueue: 0
  }
];

export default function SupportAgentWaitPage() {
  const router = useRouter();
  const [agents] = useState<SupportAgent[]>(supportAgents);
  const [selectedFilter, setSelectedFilter] = useState<'all' | AgentStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    router.push(`/User/Chat/Human?agent=${agentId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#FFC72C]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#FF5722]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Connect with Support Agents
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get personalized assistance from our expert support team for all your government service needs
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="glass-morphism px-6 py-3 rounded-full">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{availableAgents} Available</span>
                </div>
              </div>
              <div className="glass-morphism px-6 py-3 rounded-full">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">{busyAgents} Busy</span>
                </div>
              </div>
              <div className="glass-morphism px-6 py-3 rounded-full">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-[#FFC72C]" />
                  <span className="text-sm font-medium">Avg 3min response</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Status Filters */}
              <div className="flex gap-2 flex-wrap">
                {['all', 'available', 'busy', 'away', 'offline'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedFilter(status as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedFilter === status
                        ? 'bg-[#FFC72C] text-[#8D153A] shadow-glow'
                        : 'glass-morphism text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-morphism pl-4 pr-10 py-2 rounded-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#FFC72C] text-foreground placeholder-muted-foreground min-w-[300px]"
                />
              </div>
            </div>
          </div>

          {/* Support Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onConnect={handleConnectToAgent}
              />
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-16">
              <div className="glass-morphism rounded-2xl p-8 max-w-md mx-auto">
                <UsersIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No agents found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms to find available support agents.
                </p>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-16 text-center">
            <div className="glass-morphism rounded-2xl p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gradient mb-4">Need Immediate Help?</h2>
              <p className="text-muted-foreground mb-6">
                If all agents are busy, you can try our AI assistant for instant help or join the queue for the next available agent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/User/Chat/Bot"
                  className="btn-touch bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-glow"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Try AI Assistant</span>
                  </div>
                </Link>
                <button className="btn-touch glass-morphism text-foreground rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-[#FFC72C]/20">
                  <div className="flex items-center justify-center gap-2">
                    <PhoneIcon />
                    <span>Request Callback</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
