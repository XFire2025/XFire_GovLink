// src/components/agent/chat/ChatQueue.tsx
"use client";
import React from 'react';

// Types
type Language = 'en' | 'si' | 'ta';
type Priority = 'normal' | 'urgent';

interface ChatRequest {
  id: string;
  citizenName: string;
  citizenId: string;
  topic: string;
  priority: Priority;
  waitTime: number; // minutes
  avatar?: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatQueueProps {
  chatQueue: ChatRequest[];
  onAcceptChat: (chatRequest: ChatRequest) => void;
  onDeclineChat: (chatId: string) => void;
  language?: Language;
}

// Queue translations
const queueTranslations: Record<Language, {
  queueTitle: string;
  waitingTime: string;
  urgent: string;
  minutes: string;
  minute: string;
  accept: string;
  decline: string;
  noRequests: string;
  noRequestsDesc: string;
  chatWith: string;
}> = {
  en: {
    queueTitle: 'Chat Queue',
    waitingTime: 'Waiting',
    urgent: 'Urgent',
    minutes: 'minutes',
    minute: 'minute',
    accept: 'Accept',
    decline: 'Decline',
    noRequests: 'No Pending Requests',
    noRequestsDesc: 'All caught up! No citizens are waiting for chat assistance.',
    chatWith: 'Chat with'
  },
  si: {
    queueTitle: 'කතාබස් පෙළ',
    waitingTime: 'පොරොත්තුවෙන්',
    urgent: 'ගඩු',
    minutes: 'මිනිත්තු',
    minute: 'මිනිත්තුව',
    accept: 'පිළිගන්න',
    decline: 'ප්‍රතික්ෂේප කරන්න',
    noRequests: 'අපේක්ෂිත ඉල්ලීම් නැත',
    noRequestsDesc: 'සියල්ල අවසන්! කතාබස් සහාය සඳහා කිසිදු පුරවැසියෙක් බලා නොසිටී.',
    chatWith: 'සමඟ කතාබස්'
  },
  ta: {
    queueTitle: 'அரட்டை வரிசை',
    waitingTime: 'காத்திருக்கிறது',
    urgent: 'அவசர',
    minutes: 'நிமிடங்கள்',
    minute: 'நிமிடம்',
    accept: 'ஏற்றுக்கொள்',
    decline: 'நிராகரி',
    noRequests: 'நிலுவையில் கோரிக்கைகள் இல்லை',
    noRequestsDesc: 'அனைத்தும் முடிந்தது! அரட்டை உதவிக்காக எந்த குடிமக்களும் காத்திருக்கவில்லை.',
    chatWith: 'உடன் அரட்டை'
  }
};

const ChatQueue: React.FC<ChatQueueProps> = ({
  chatQueue,
  onAcceptChat,
  onDeclineChat,
  language = 'en'
}) => {
  const t = queueTranslations[language];

  const formatWaitTime = (minutes: number) => {
    const timeUnit = minutes === 1 ? t.minute : t.minutes;
    return `${minutes} ${timeUnit}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPriorityColor = (priority: Priority) => {
    return priority === 'urgent' 
      ? 'bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/30' 
      : 'bg-[#008060]/20 text-[#008060] border-[#008060]/30';
  };

  const getWaitTimeColor = (minutes: number) => {
    if (minutes >= 15) return 'text-[#FF5722]';
    if (minutes >= 10) return 'text-[#FFC72C]';
    return 'text-[#008060]';
  };

  return (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow animate-fade-in-up modern-card">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 modern-card">
            <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium text-foreground">{t.queueTitle}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFC72C]/10 text-[#FFC72C] rounded-full text-xs font-medium border border-[#FFC72C]/20">
            <span>{chatQueue.length}</span>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {chatQueue.length > 0 ? (
          chatQueue.map((request, index) => (
            <div 
              key={request.id} 
              className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-xl border border-border/50 hover:border-[#FFC72C]/70 hover:shadow-2xl transition-all duration-500 animate-fade-in-up modern-card hover-lift relative overflow-hidden"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Request Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {request.citizenName.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Basic Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-foreground text-sm group-hover:text-[#FFC72C] transition-colors duration-300">
                      {request.citizenName}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate font-mono">
                      ID: {request.citizenId}
                    </p>
                  </div>
                </div>

                {/* Priority Badge */}
                {request.priority === 'urgent' && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getPriorityColor(request.priority)} animate-pulse`}>
                    {t.urgent}
                  </span>
                )}
              </div>

              {/* Topic */}
              <div className="mb-3">
                <p className="text-sm font-medium text-foreground mb-1">{request.topic}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 italic">
                  &quot;{request.lastMessage}&quot;
                </p>
              </div>

              {/* Wait Time & Timestamp */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className={`text-xs font-medium ${getWaitTimeColor(request.waitTime)}`}>
                    {t.waitingTime} {formatWaitTime(request.waitTime)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTime(request.timestamp)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onAcceptChat(request)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] text-white rounded-lg text-sm font-medium hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {t.accept}
                </button>
                <button
                  onClick={() => onDeclineChat(request.id)}
                  className="px-3 py-2 bg-card/30 border border-border/50 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/50 hover:border-[#FF5722] transition-all duration-300"
                >
                  {t.decline}
                </button>
              </div>

              {/* Hover Effect Gradient - EXACT SAME as Landing Page */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-xl"></div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="11" r="1"/>
              <circle cx="8" cy="11" r="1"/>
              <circle cx="16" cy="11" r="1"/>
            </svg>
            <h4 className="text-lg font-semibold text-foreground mb-2">{t.noRequests}</h4>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">{t.noRequestsDesc}</p>
          </div>
        )}
      </div>

      {/* Queue Stats Footer */}
      {chatQueue.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#FF5722] rounded-full"></div>
                {chatQueue.filter(req => req.priority === 'urgent').length} urgent
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#008060] rounded-full"></div>
                {chatQueue.filter(req => req.priority === 'normal').length} normal
              </span>
            </div>
            <span>
              Avg wait: {Math.round(chatQueue.reduce((acc, req) => acc + req.waitTime, 0) / chatQueue.length)}m
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatQueue;