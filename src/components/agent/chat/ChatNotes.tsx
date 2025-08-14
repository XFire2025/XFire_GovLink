// src/components/agent/chat/ChatNotes.tsx
"use client";
import React, { useState } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';

interface ChatNotesProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNotes: (notes: string, followUpRequired: boolean) => void;
  chatId: string;
  citizenName: string;
  language?: Language;
}

// Notes translations
const notesTranslations: Record<Language, {
  endChatSession: string;
  sessionSummary: string;
  chatResolution: string;
  followUpRequired: string;
  followUpDesc: string;
  sessionNotes: string;
  notesPlaceholder: string;
  cancel: string;
  endSession: string;
  ending: string;
  resolutionOptions: Record<string, string>;
  notesRequired: string;
  resolutionRequired: string;
}> = {
  en: {
    endChatSession: 'End Chat Session',
    sessionSummary: 'Session Summary',
    chatResolution: 'Chat Resolution',
    followUpRequired: 'Follow-up Required',
    followUpDesc: 'Citizen may need additional assistance',
    sessionNotes: 'Session Notes',
    notesPlaceholder: 'Please provide a summary of the chat session, what was discussed, and any actions taken...',
    cancel: 'Cancel',
    endSession: 'End Session',
    ending: 'Ending Session...',
    resolutionOptions: {
      'resolved': 'Issue Resolved',
      'partial': 'Partially Resolved',
      'referred': 'Referred to Department',
      'appointment': 'Appointment Scheduled',
      'information': 'Information Provided',
      'follow_up': 'Follow-up Required'
    },
    notesRequired: 'Please provide session notes',
    resolutionRequired: 'Please select a resolution status'
  },
  si: {
    endChatSession: 'කතාබස් සැසිය අවසන් කරන්න',
    sessionSummary: 'සැසි සාරාංශය',
    chatResolution: 'කතාබස් විසඳුම',
    followUpRequired: 'පසු විපරම් අවශ්‍යයි',
    followUpDesc: 'පුරවැසියාට අමතර සහාය අවශ්‍ය විය හැක',
    sessionNotes: 'සැසි සටහන්',
    notesPlaceholder: 'කරුණාකර කතාබස් සැසියේ සාරාංශයක්, සාකච්ඡා කළ දේ සහ ගත් ක්‍රියාමාර්ග ලබා දෙන්න...',
    cancel: 'අවලංගු කරන්න',
    endSession: 'සැසිය අවසන් කරන්න',
    ending: 'සැසිය අවසන් කරමින්...',
    resolutionOptions: {
      'resolved': 'ගැටලුව විසඳා ඇත',
      'partial': 'අර්ධ වශයෙන් විසඳා ඇත',
      'referred': 'දෙපාර්තමේන්තුවට යොමු කළා',
      'appointment': 'නියමයන් නියම කළා',
      'information': 'තොරතුරු ලබා දුන්නා',
      'follow_up': 'පසු විපරම් අවශ්‍යයි'
    },
    notesRequired: 'කරුණාකර සැසි සටහන් ලබා දෙන්න',
    resolutionRequired: 'කරුණාකර විසඳුම් තත්ත්වයක් තෝරන්න'
  },
  ta: {
    endChatSession: 'அரட்டை அமர்வை முடிக்கவும்',
    sessionSummary: 'அமர்வு சுருக்கம்',
    chatResolution: 'அரட்டை தீர்வு',
    followUpRequired: 'பின்தொடர்தல் தேவை',
    followUpDesc: 'குடிமக்களுக்கு கூடுதல் உதவி தேவைப்படலாம்',
    sessionNotes: 'அமர்வு குறிப்புகள்',
    notesPlaceholder: 'அரட்டை அமர்வின் சுருக்கம், என்ன விவாதிக்கப்பட்டது மற்றும் எடுக்கப்பட்ட நடவடிக்கைகளை வழங்கவும்...',
    cancel: 'ரத்துசெய்',
    endSession: 'அமர்வை முடிக்கவும்',
    ending: 'அமர்வை முடிக்கிறது...',
    resolutionOptions: {
      'resolved': 'பிரச்சினை தீர்க்கப்பட்டது',
      'partial': 'பகுதியாக தீர்க்கப்பட்டது',
      'referred': 'துறைக்கு பரிந்துரைக்கப்பட்டது',
      'appointment': 'சந்திப்பு திட்டமிடப்பட்டது',
      'information': 'தகவல் வழங்கப்பட்டது',
      'follow_up': 'பின்தொடர்தல் தேவை'
    },
    notesRequired: 'அமர்வு குறிப்புகளை வழங்கவும்',
    resolutionRequired: 'தீர்வு நிலையைத் தேர்ந்தெடுக்கவும்'
  }
};

const ChatNotes: React.FC<ChatNotesProps> = ({
  isOpen,
  onClose,
  onSaveNotes,
  chatId,
  citizenName,
  language = 'en'
}) => {
  const [sessionNotes, setSessionNotes] = useState('');
  const [resolution, setResolution] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const t = notesTranslations[language];

  if (!isOpen) return null;

  const handleEndSession = async () => {
    if (!sessionNotes.trim()) {
      alert(t.notesRequired);
      return;
    }
    if (!resolution) {
      alert(t.resolutionRequired);
      return;
    }

    setIsEnding(true);
    
    // Simulate ending delay
    setTimeout(() => {
      const fullNotes = `Resolution: ${t.resolutionOptions[resolution as keyof typeof t.resolutionOptions]}\n\nNotes: ${sessionNotes}`;
      onSaveNotes(fullNotes, followUpRequired);
      setIsEnding(false);
      
      // Reset form
      setSessionNotes('');
      setResolution('');
      setFollowUpRequired(false);
    }, 2000);
  };

  const handleCancel = () => {
    setSessionNotes('');
    setResolution('');
    setFollowUpRequired(false);
    onClose();
  };

  const getResolutionColor = (resolutionType: string) => {
    switch (resolutionType) {
      case 'resolved':
        return 'border-[#008060] text-[#008060] bg-[#008060]/10';
      case 'partial':
        return 'border-[#FFC72C] text-[#FFC72C] bg-[#FFC72C]/10';
      case 'referred':
        return 'border-[#FF5722] text-[#FF5722] bg-[#FF5722]/10';
      case 'appointment':
        return 'border-[#8D153A] text-[#8D153A] bg-[#8D153A]/10';
      case 'information':
        return 'border-blue-500 text-blue-500 bg-blue-500/10';
      case 'follow_up':
        return 'border-purple-500 text-purple-500 bg-purple-500/10';
      default:
        return 'border-border text-muted-foreground bg-card/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-glow modern-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-xl font-bold text-foreground">{t.endChatSession}</h2>
            <p className="text-sm text-muted-foreground font-mono">Chat ID: {chatId}</p>
          </div>
          <button
            onClick={handleCancel}
            disabled={isEnding}
            className="p-2 rounded-xl bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 text-foreground hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 disabled:opacity-50 modern-card"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Citizen Info */}
          <div className="p-4 bg-card/20 rounded-xl modern-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {citizenName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">{citizenName}</p>
                <p className="text-sm text-muted-foreground">Chat session ending</p>
              </div>
            </div>
          </div>

          {/* Resolution Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">{t.chatResolution}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(t.resolutionOptions).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setResolution(value)}
                  disabled={isEnding}
                  className={`p-3 border-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed modern-card ${
                    resolution === value 
                      ? getResolutionColor(value)
                      : 'border-border text-muted-foreground hover:border-[#FFC72C] hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up Toggle */}
          <div className="p-4 bg-card/20 rounded-xl modern-card">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="followUp"
                checked={followUpRequired}
                onChange={(e) => setFollowUpRequired(e.target.checked)}
                disabled={isEnding}
                className="mt-1 w-4 h-4 text-[#FFC72C] rounded focus:ring-[#FFC72C] focus:ring-2 disabled:opacity-50"
              />
              <div className="flex-1">
                <label htmlFor="followUp" className="text-sm font-medium text-foreground cursor-pointer">
                  {t.followUpRequired}
                </label>
                <p className="text-xs text-muted-foreground mt-1">{t.followUpDesc}</p>
              </div>
            </div>
          </div>

          {/* Session Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.sessionNotes}</label>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              disabled={isEnding}
              className="w-full py-3 px-4 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 resize-none disabled:opacity-50 modern-card"
              rows={6}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Minimum 20 characters required</span>
              <span className={sessionNotes.length >= 20 ? 'text-[#008060]' : 'text-[#FF5722]'}>
                {sessionNotes.length} characters
              </span>
            </div>
          </div>

          {/* Ending Status */}
          {isEnding && (
            <div className="flex items-center justify-center gap-3 p-4 bg-[#008060]/10 border border-[#008060]/30 rounded-xl backdrop-blur-md modern-card">
              <div className="w-5 h-5 border-2 border-[#008060] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-[#008060]">{t.ending}</span>
            </div>
          )}

          {/* Session Summary Preview */}
          {(sessionNotes || resolution) && (
            <div className="p-4 bg-muted/20 border border-border/30 rounded-xl modern-card">
              <h4 className="text-sm font-semibold text-foreground mb-3">{t.sessionSummary}</h4>
              <div className="space-y-2 text-sm">
                {resolution && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Resolution:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getResolutionColor(resolution)}`}>
                      {t.resolutionOptions[resolution as keyof typeof t.resolutionOptions]}
                    </span>
                  </div>
                )}
                {followUpRequired && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Follow-up:</span>
                    <span className="text-[#FFC72C] text-xs font-medium">Required</span>
                  </div>
                )}
                {sessionNotes && (
                  <div>
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="text-foreground mt-1 text-xs leading-relaxed max-h-20 overflow-y-auto">
                      {sessionNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border/30">
          <button
            onClick={handleCancel}
            disabled={isEnding}
            className="px-6 py-3 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed modern-card"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleEndSession}
            disabled={isEnding || !sessionNotes.trim() || !resolution || sessionNotes.length < 20}
            className="px-6 py-3 bg-gradient-to-r from-[#FF5722] to-[#8D153A] text-white rounded-xl hover:from-[#8D153A] hover:to-[#FF5722] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isEnding && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isEnding ? t.ending : t.endSession}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatNotes;