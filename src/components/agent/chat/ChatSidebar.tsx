// src/components/agent/chat/ChatSidebar.tsx
"use client";
import React, { useState } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';
type ChatStatus = 'pending' | 'active' | 'transferred' | 'completed';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'citizen' | 'system';
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  fileName?: string;
  fileUrl?: string;
}

interface ActiveChat {
  id: string;
  citizenName: string;
  citizenId: string;
  topic: string;
  startTime: string;
  messages: ChatMessage[];
  status: ChatStatus;
  avatar?: string;
}

interface ChatSidebarProps {
  activeChat: ActiveChat | null;
  language?: Language;
}

// Sidebar translations
const sidebarTranslations: Record<Language, {
  citizenInfo: string;
  chatHistory: string;
  quickActions: string;
  noActiveChat: string;
  selectChat: string;
  name: string;
  citizenId: string;
  chatId: string;
  status: string;
  duration: string;
  totalMessages: string;
  viewProfile: string;
  viewHistory: string;
  sendForm: string;
  scheduleCallback: string;
  addToContacts: string;
  exportChat: string;
  statuses: Record<ChatStatus, string>;
}> = {
  en: {
    citizenInfo: 'Citizen Information',
    chatHistory: 'Chat History',
    quickActions: 'Quick Actions',
    noActiveChat: 'No Active Chat',
    selectChat: 'Select a chat from the queue to view citizen information',
    name: 'Full Name',
    citizenId: 'Citizen ID',
    chatId: 'Chat ID',
    status: 'Status',
    duration: 'Duration',
    totalMessages: 'Messages',
    viewProfile: 'View Full Profile',
    viewHistory: 'View Chat History',
    sendForm: 'Send Form',
    scheduleCallback: 'Schedule Callback',
    addToContacts: 'Add to Contacts',
    exportChat: 'Export Chat',
    statuses: {
      pending: 'Pending',
      active: 'Active',
      transferred: 'Transferred',
      completed: 'Completed'
    }
  },
  si: {
    citizenInfo: 'පුරවැසි තොරතුරු',
    chatHistory: 'කතාබස් ඉතිහාසය',
    quickActions: 'ඉක්මන් ක්‍රියා',
    noActiveChat: 'ක්‍රියාකාරී කතාබසක් නැත',
    selectChat: 'පුරවැසි තොරතුරු බැලීමට පෙළෙන් කතාබසක් තෝරන්න',
    name: 'සම්පූර්ණ නම',
    citizenId: 'පුරවැසි හැඳුනුම්පත',
    chatId: 'කතාබස් හැඳුනුම්පත',
    status: 'තත්ත්වය',
    duration: 'කාලසීමාව',
    totalMessages: 'පණිවිඩ',
    viewProfile: 'සම්පූර්ණ පැතිකඩ බලන්න',
    viewHistory: 'කතාබස් ඉතිහාසය බලන්න',
    sendForm: 'ආකෘතිය යවන්න',
    scheduleCallback: 'ආපසු ඇමතුම නියම කරන්න',
    addToContacts: 'සම්බන්ධතාවලට එක් කරන්න',
    exportChat: 'කතාබස් නිර්යාත කරන්න',
    statuses: {
      pending: 'අපේක්ෂිත',
      active: 'ක්‍රියාකාරී',
      transferred: 'මාරු කළ',
      completed: 'සම්පූර්ණ කළ'
    }
  },
  ta: {
    citizenInfo: 'குடிமக்கள் தகவல்',
    chatHistory: 'அரட்டை வரலாறு',
    quickActions: 'விரைவு நடவடிக்கைகள்',
    noActiveChat: 'செயலில் அரட்டை இல்லை',
    selectChat: 'குடிமக்கள் தகவலைப் பார்க்க வரிசையிலிருந்து ஒரு அரட்டையைத் தேர்ந்தெடுக்கவும்',
    name: 'முழு பெயர்',
    citizenId: 'குடிமக்கள் அடையாள எண்',
    chatId: 'அரட்டை ஐடி',
    status: 'நிலை',
    duration: 'கால அளவு',
    totalMessages: 'செய்திகள்',
    viewProfile: 'முழு சுயவிவரத்தைப் பார்க்கவும்',
    viewHistory: 'அரட்டை வரலாற்றைப் பார்க்கவும்',
    sendForm: 'படிவம் அனுப்பவும்',
    scheduleCallback: 'மீளழைப்பை திட்டமிடவும்',
    addToContacts: 'தொடர்புகளில் சேர்க்கவும்',
    exportChat: 'அரட்டையை ஏற்றுமதி செய்யவும்',
    statuses: {
      pending: 'நிலுவையில்',
      active: 'செயலில்',
      transferred: 'மாற்றப்பட்டது',
      completed: 'முடிந்தது'
    }
  }
};

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  activeChat,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'actions'>('info');
  const t = sidebarTranslations[language];

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getStatusColor = (status: ChatStatus) => {
    switch (status) {
      case 'active':
        return 'text-[#008060] bg-[#008060]/20 border-[#008060]/30';
      case 'pending':
        return 'text-[#FFC72C] bg-[#FFC72C]/20 border-[#FFC72C]/30';
      case 'transferred':
        return 'text-[#FF5722] bg-[#FF5722]/20 border-[#FF5722]/30';
      case 'completed':
        return 'text-[#8D153A] bg-[#8D153A]/20 border-[#8D153A]/30';
      default:
        return 'text-muted-foreground bg-muted/20 border-border/30';
    }
  };

  const mockActions = [
    { id: 'profile', label: t.viewProfile, icon: 'user' },
    { id: 'history', label: t.viewHistory, icon: 'history' },
    { id: 'form', label: t.sendForm, icon: 'file' },
    { id: 'callback', label: t.scheduleCallback, icon: 'phone' },
    { id: 'contacts', label: t.addToContacts, icon: 'plus' },
    { id: 'export', label: t.exportChat, icon: 'download' }
  ];

  const getActionIcon = (iconType: string) => {
    switch (iconType) {
      case 'user':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        );
      case 'history':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        );
      case 'file':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        );
      case 'phone':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        );
      case 'plus':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        );
      case 'download':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (!activeChat) {
    return (
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow h-[600px] flex items-center justify-center animate-fade-in-up modern-card">
        <div className="text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h3 className="text-lg font-semibold text-foreground mb-2">{t.noActiveChat}</h3>
          <p className="text-muted-foreground text-sm max-w-xs">{t.selectChat}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow h-[600px] flex flex-col animate-fade-in-up modern-card">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {activeChat.citizenName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm truncate">{activeChat.citizenName}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${getStatusColor(activeChat.status)} animate-pulse`}>
              {t.statuses[activeChat.status]}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-card/20 rounded-lg p-1">
          {[
            { id: 'info', label: t.citizenInfo },
            { id: 'actions', label: t.quickActions }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'info' | 'history' | 'actions')}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#FFC72C] text-black shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 mb-3 modern-card">
                <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-foreground">{t.citizenInfo}</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-card/20 rounded-lg">
                  <span className="text-xs text-muted-foreground">{t.name}</span>
                  <p className="text-sm font-medium text-foreground">{activeChat.citizenName}</p>
                </div>
                <div className="p-3 bg-card/20 rounded-lg">
                  <span className="text-xs text-muted-foreground">{t.citizenId}</span>
                  <p className="text-sm font-medium text-foreground font-mono">{activeChat.citizenId}</p>
                </div>
                <div className="p-3 bg-card/20 rounded-lg">
                  <span className="text-xs text-muted-foreground">{t.chatId}</span>
                  <p className="text-sm font-medium text-foreground font-mono">{activeChat.id}</p>
                </div>
              </div>
            </div>

            {/* Chat Stats */}
            <div className="pt-4 border-t border-border/30">
              <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 mb-3 modern-card">
                <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-foreground">{t.chatHistory}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-card/20 rounded-lg modern-card hover:shadow-lg transition-all duration-300">
                  <div className="text-lg font-bold text-[#FFC72C]">{formatDuration(activeChat.startTime)}</div>
                  <div className="text-xs text-muted-foreground">{t.duration}</div>
                </div>
                <div className="text-center p-3 bg-card/20 rounded-lg modern-card hover:shadow-lg transition-all duration-300">
                  <div className="text-lg font-bold text-[#008060]">{activeChat.messages.length}</div>
                  <div className="text-xs text-muted-foreground">{t.totalMessages}</div>
                </div>
              </div>
            </div>

            {/* Topic */}
            <div className="pt-4 border-t border-border/30">
              <div className="p-3 bg-card/20 rounded-lg">
                <span className="text-xs text-muted-foreground">Topic</span>
                <p className="text-sm font-medium text-foreground mt-1">{activeChat.topic}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 mb-3 modern-card">
              <div className="w-2 h-2 bg-gradient-to-r from-[#FF5722] to-[#8D153A] rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-foreground">{t.quickActions}</span>
            </div>
            {mockActions.map((action) => (
              <button
                key={action.id}
                onClick={() => console.log(`Action: ${action.id}`)}
                className="w-full p-3 bg-card/20 hover:bg-card/40 border border-border/30 hover:border-[#FFC72C] rounded-lg text-left transition-all duration-300 hover:scale-[1.02] group modern-card hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FFC72C]/10 rounded-lg text-[#FFC72C] group-hover:text-[#FF5722] transition-colors duration-300">
                    {getActionIcon(action.icon)}
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">
                    {action.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Session: {formatDuration(activeChat.startTime)}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;