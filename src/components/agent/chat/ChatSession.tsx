// src/components/agent/chat/ChatSession.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react';

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

interface ChatSessionProps {
  activeChat: ActiveChat;
  onSendMessage: (content: string, type?: 'text' | 'file', fileName?: string, fileUrl?: string) => void;
  onTransferChat: () => void;
  onEndChat: () => void;
  language?: Language;
}

// Session translations
const sessionTranslations: Record<Language, {
  chatWith: string;
  typing: string;
  online: string;
  typeMessage: string;
  sendMessage: string;
  attachFile: string;
  transferChat: string;
  endChat: string;
  fileSent: string;
  chatStarted: string;
  chatTransferred: string;
  chatEnded: string;
  you: string;
  system: string;
}> = {
  en: {
    chatWith: 'Chat with',
    typing: 'is typing...',
    online: 'Online',
    typeMessage: 'Type your message...',
    sendMessage: 'Send message',
    attachFile: 'Attach file',
    transferChat: 'Transfer Chat',
    endChat: 'End Chat',
    fileSent: 'File sent',
    chatStarted: 'Chat session started',
    chatTransferred: 'Chat has been transferred',
    chatEnded: 'Chat session ended',
    you: 'You',
    system: 'System'
  },
  si: {
    chatWith: 'සමඟ කතාබස්',
    typing: 'ටයිප් කරමින්...',
    online: 'සබැඳි',
    typeMessage: 'ඔබේ පණිවිඩය ටයිප් කරන්න...',
    sendMessage: 'පණිවිඩය යවන්න',
    attachFile: 'ගොනුව ඇමුණන්න',
    transferChat: 'කතාබස් මාරු කරන්න',
    endChat: 'කතාබස් අවසන් කරන්න',
    fileSent: 'ගොනුව යවන ලදී',
    chatStarted: 'කතාබස් සැසිය ආරම්භ විය',
    chatTransferred: 'කතාබස් මාරු කර ඇත',
    chatEnded: 'කතාබස් සැසිය අවසන් විය',
    you: 'ඔබ',
    system: 'පද්ධතිය'
  },
  ta: {
    chatWith: 'உடன் அரட்டை',
    typing: 'தட்டச்சு செய்கிறது...',
    online: 'ஆன்லைன்',
    typeMessage: 'உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...',
    sendMessage: 'செய்தி அனுப்பு',
    attachFile: 'கோப்பை இணைக்கவும்',
    transferChat: 'அரட்டையை மாற்று',
    endChat: 'அரட்டையை முடி',
    fileSent: 'கோப்பு அனுப்பப்பட்டது',
    chatStarted: 'அரட்டை அமர்வு தொடங்கியது',
    chatTransferred: 'அரட்டை மாற்றப்பட்டது',
    chatEnded: 'அரட்டை அமர்வு முடிந்தது',
    you: 'நீங்கள்',
    system: 'அமைப்பு'
  }
};

const ChatSession: React.FC<ChatSessionProps> = ({
  activeChat,
  onSendMessage,
  onTransferChat,
  onEndChat,
  language = 'en'
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = sessionTranslations[language];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (activeChat.messages.length > 0) {
      const lastMessage = activeChat.messages[activeChat.messages.length - 1];
      if (lastMessage.sender === 'agent') {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeChat.messages]);

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

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
    return `${diff}m`;
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow h-[600px] flex flex-col animate-fade-in-up modern-card">
      {/* Chat Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              {activeChat.citizenName.charAt(0).toUpperCase()}
            </div>
            
            {/* Info */}
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                {t.chatWith} {activeChat.citizenName}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
                <span className="text-xs text-[#008060] font-medium">{t.online}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{formatDuration(activeChat.startTime)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTransferChat}
              className="px-3 py-1.5 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-lg text-xs font-medium text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C] transition-all duration-300 shadow-md hover:shadow-lg modern-card"
            >
              {t.transferChat}
            </button>
            <button
              onClick={onEndChat}
              className="px-3 py-1.5 bg-gradient-to-r from-[#FF5722] to-[#8D153A] text-white rounded-lg text-xs font-medium hover:from-[#8D153A] hover:to-[#FF5722] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t.endChat}
            </button>
          </div>
        </div>

        {/* Topic */}
        <div className="mt-2 p-2 bg-card/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Topic:</p>
          <p className="text-sm font-medium text-foreground">{activeChat.topic}</p>
        </div>
      </div>

      {/* Messages Area */}
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
        {activeChat.messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'agent' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}
          >
            {msg.type === 'system' ? (
              /* System Message */
              <div className="max-w-xs px-3 py-2 bg-muted/30 rounded-full text-xs text-muted-foreground text-center">
                {msg.content}
              </div>
            ) : (
              /* Regular Message */
              <div className={`max-w-xs lg:max-w-md ${msg.sender === 'agent' ? 'ml-12' : 'mr-12'}`}>
                <div className={`p-3 rounded-2xl shadow-md ${
                  msg.sender === 'agent' 
                    ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white' 
                    : 'bg-card/80 text-foreground border border-border/30 backdrop-blur-sm'
                }`}>
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
                <div className={`flex items-center gap-2 mt-1 px-1 ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-muted-foreground">
                    {msg.sender === 'agent' ? t.you : activeChat.citizenName}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs mr-12">
              <div className="p-3 bg-card/80 border border-border/30 rounded-2xl backdrop-blur-sm shadow-md">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">{activeChat.citizenName} {t.typing}</span>
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

      {/* Input Area */}
      <div className="p-4 border-t border-border/30">
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

export default ChatSession;