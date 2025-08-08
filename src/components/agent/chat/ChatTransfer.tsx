// src/components/agent/chat/ChatTransfer.tsx
"use client";
import React, { useState } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';

interface ChatTransferProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (targetAgent: string, reason: string) => void;
  chatId: string;
  citizenName: string;
  language?: Language;
}

// Transfer translations
const transferTranslations: Record<Language, {
  transferChat: string;
  transferTo: string;
  transferReason: string;
  selectAgent: string;
  reasonPlaceholder: string;
  cancel: string;
  transfer: string;
  transferring: string;
  selectDepartment: string;
  agents: Record<string, string>;
  departments: Record<string, string>;
  reasonRequired: string;
  agentRequired: string;
}> = {
  en: {
    transferChat: 'Transfer Chat',
    transferTo: 'Transfer to Agent',
    transferReason: 'Transfer Reason',
    selectAgent: 'Select an agent',
    reasonPlaceholder: 'Please provide a reason for the transfer...',
    cancel: 'Cancel',
    transfer: 'Transfer Chat',
    transferring: 'Transferring...',
    selectDepartment: 'Select Department',
    agents: {
      'agent001': 'Sarah Perera - Passport Services',
      'agent002': 'Rohan Silva - Driving Licenses',
      'agent003': 'Kamala Fernando - Birth Certificates',
      'agent004': 'Nimal Jayawardena - Business Registration',
      'agent005': 'Priya Wickramasinghe - Visa Services',
      'supervisor001': 'Supervisor - General Issues'
    },
    departments: {
      'passport': 'Passport Services',
      'transport': 'Transport Department',
      'registrar': 'Registrar General',
      'business': 'Business Registration',
      'immigration': 'Immigration & Emigration',
      'supervisor': 'Supervisor'
    },
    reasonRequired: 'Please provide a transfer reason',
    agentRequired: 'Please select an agent'
  },
  si: {
    transferChat: 'කතාබස් මාරු කරන්න',
    transferTo: 'නිලධාරියා වෙත මාරු කරන්න',
    transferReason: 'මාරු කිරීමේ හේතුව',
    selectAgent: 'නිලධාරියෙකු තෝරන්න',
    reasonPlaceholder: 'කරුණාකර මාරු කිරීම සඳහා හේතුවක් ලබා දෙන්න...',
    cancel: 'අවලංගු කරන්න',
    transfer: 'කතාබස් මාරු කරන්න',
    transferring: 'මාරු කරමින්...',
    selectDepartment: 'දෙපාර්තමේන්තුව තෝරන්න',
    agents: {
      'agent001': 'සාරා පෙරේරා - ගමන් බලපත්‍ර සේවා',
      'agent002': 'රෝහන් සිල්වා - රියදුරු බලපත්‍ර',
      'agent003': 'කමලා ප්‍රනාන්දු - උප්පැන්න සහතික',
      'agent004': 'නිමල් ජයවර්ධන - ව්‍යාපාර ලියාපදිංචිය',
      'agent005': 'ප්‍රියා වික්‍රමසිංහ - වීසා සේවා',
      'supervisor001': 'අධීක්ෂකවරයා - සාමාන්‍ය ගැටලු'
    },
    departments: {
      'passport': 'ගමන් බලපත්‍ර සේවා',
      'transport': 'ප්‍රවාහන දෙපාර්තමේන්තුව',
      'registrar': 'මහ ලේකම්',
      'business': 'ව්‍යාපාර ලියාපදිංචිය',
      'immigration': 'ආගමන හා විගමන',
      'supervisor': 'අධීක්ෂකවරයා'
    },
    reasonRequired: 'කරුණාකර මාරු කිරීමේ හේතුවක් ලබා දෙන්න',
    agentRequired: 'කරුණාකර නිලධාරියෙකු තෝරන්න'
  },
  ta: {
    transferChat: 'அரட்டையை மாற்று',
    transferTo: 'அதிகாரிக்கு மாற்று',
    transferReason: 'மாற்றுவதற்கான காரணம்',
    selectAgent: 'ஒரு அதிகாரியைத் தேர்ந்தெடுக்கவும்',
    reasonPlaceholder: 'மாற்றுவதற்கான காரணத்தை வழங்கவும்...',
    cancel: 'ரத்துசெய்',
    transfer: 'அரட்டையை மாற்று',
    transferring: 'மாற்றுகிறது...',
    selectDepartment: 'துறையைத் தேர்ந்தெடுக்கவும்',
    agents: {
      'agent001': 'சாரா பெரேரா - பாஸ்போர்ட் சேவைகள்',
      'agent002': 'ரோஹன் சில்வா - ஓட்டுநர் உரிமங்கள்',
      'agent003': 'கமலா பெர்னாண்டோ - பிறப்பு சான்றிதழ்கள்',
      'agent004': 'நிமல் ஜயவர்தன - வணிக பதிவு',
      'agent005': 'ப்ரியா விக்ரமசிங்ஹே - விசா சேவைகள்',
      'supervisor001': 'மேற்பார்வையாளர் - பொதுவான பிரச்சினைகள்'
    },
    departments: {
      'passport': 'பாஸ்போர்ட் சேவைகள்',
      'transport': 'போக்குவரத்து துறை',
      'registrar': 'பதிவாளர் ஜெனரல்',
      'business': 'வணிக பதிவு',
      'immigration': 'குடியேற்றம் மற்றும் வெளியேற்றம்',
      'supervisor': 'மேற்பார்வையாளர்'
    },
    reasonRequired: 'மாற்றுவதற்கான காரணத்தை வழங்கவும்',
    agentRequired: 'ஒரு அதிகாரியைத் தேர்ந்தெடுக்கவும்'
  }
};

const ChatTransfer: React.FC<ChatTransferProps> = ({
  isOpen,
  onClose,
  onTransfer,
  chatId,
  citizenName,
  language = 'en'
}) => {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const t = transferTranslations[language];

  if (!isOpen) return null;

  const handleTransfer = async () => {
    if (!selectedAgent.trim()) {
      alert(t.agentRequired);
      return;
    }
    if (!transferReason.trim()) {
      alert(t.reasonRequired);
      return;
    }

    setIsTransferring(true);
    
    // Simulate transfer delay
    setTimeout(() => {
      onTransfer(selectedAgent, transferReason);
      setIsTransferring(false);
      
      // Reset form
      setSelectedAgent('');
      setTransferReason('');
      setSelectedDepartment('');
    }, 2000);
  };

  const handleCancel = () => {
    setSelectedAgent('');
    setTransferReason('');
    setSelectedDepartment('');
    onClose();
  };

  const getAgentsByDepartment = () => {
    const agentsByDept: Record<string, string[]> = {
      'passport': ['agent001'],
      'transport': ['agent002'],
      'registrar': ['agent003'],
      'business': ['agent004'],
      'immigration': ['agent005'],
      'supervisor': ['supervisor001']
    };
    
    return selectedDepartment ? agentsByDept[selectedDepartment] || [] : Object.keys(t.agents);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md max-w-md w-full rounded-2xl border border-border/50 shadow-glow modern-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-xl font-bold text-foreground">{t.transferChat}</h2>
            <p className="text-sm text-muted-foreground font-mono">Chat ID: {chatId}</p>
          </div>
          <button
            onClick={handleCancel}
            disabled={isTransferring}
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
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {citizenName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-foreground">{citizenName}</p>
                <p className="text-sm text-muted-foreground">Active chat session</p>
              </div>
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.selectDepartment}</label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedAgent(''); // Reset agent selection
              }}
              disabled={isTransferring}
              className="w-full py-3 px-4 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 disabled:opacity-50 modern-card"
            >
              <option value="">{t.selectDepartment}</option>
              {Object.entries(t.departments).map(([value, label]) => (
                <option key={value} value={value} className="bg-card text-foreground">
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Agent Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.transferTo}</label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              disabled={isTransferring}
              className="w-full py-3 px-4 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 disabled:opacity-50 modern-card"
            >
              <option value="">{t.selectAgent}</option>
              {getAgentsByDepartment().map((agentId) => (
                <option key={agentId} value={agentId} className="bg-card text-foreground">
                  {t.agents[agentId as keyof typeof t.agents]}
                </option>
              ))}
            </select>
          </div>

          {/* Transfer Reason */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t.transferReason}</label>
            <textarea
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              placeholder={t.reasonPlaceholder}
              disabled={isTransferring}
              className="w-full py-3 px-4 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 resize-none disabled:opacity-50 modern-card"
              rows={3}
            />
          </div>

          {/* Transfer Status */}
          {isTransferring && (
            <div className="flex items-center justify-center gap-3 p-4 bg-[#008060]/10 border border-[#008060]/30 rounded-xl backdrop-blur-md modern-card">
              <div className="w-5 h-5 border-2 border-[#008060] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-[#008060]">{t.transferring}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border/30">
          <button
            onClick={handleCancel}
            disabled={isTransferring}
            className="px-6 py-3 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed modern-card"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleTransfer}
            disabled={isTransferring || !selectedAgent || !transferReason.trim()}
            className="px-6 py-3 bg-gradient-to-r from-[#008060] to-[#FFC72C] text-white rounded-xl hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isTransferring && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isTransferring ? t.transferring : t.transfer}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTransfer;