// src/components/user/chat/BookingChatManager.tsx
"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useBookingChat, BookingChatContext } from '@/lib/hooks/useBookingChat';
import { AuthPrompt } from './AuthPrompt';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

interface BookingConversationData {
  department?: string;
  service?: string;
  agentType?: string;
  preferredDate?: string;
  preferredTime?: string;
  additionalNotes?: string;
}

interface BookingChatManagerProps {
  onBookingQuestionGenerated?: (question: string) => void;
  onLoginRequired?: () => void;
  language?: 'en' | 'si' | 'ta';
  lastUserMessage?: string;
  sessionId?: string;
  messages?: Array<{ type: 'user' | 'bot'; text: string; timestamp: Date }>;
}

interface BookingIntent {
  isBookingIntent: boolean;
  extractedData?: BookingChatContext;
  confidence: number;
}

const bookingKeywords = [
  'book', 'appointment', 'schedule', 'meeting', 'visit', 'apply for',
  'register', 'submit', 'request', 'service', 'office', 'agent',
  'වෙන්කරවීම', 'හමුවීම', 'ලියාපදිංචිය', 'සේවාව', 'කාර්යාලය',
  'முன்பதிவு', 'சந்திப்பு', 'பதிவு', 'சேவை', 'அலுவலகம்'
];

const departmentKeywords = {
  immigration: ['passport', 'visa', 'immigration', 'emigration', 'travel document'],
  business: ['business', 'company', 'registration', 'trade license', 'commercial'],
  health: ['health', 'medical', 'certificate', 'clinic', 'hospital'],
  education: ['education', 'school', 'university', 'certificate', 'scholarship'],
  tax: ['tax', 'revenue', 'VAT', 'income tax', 'registration']
};

export const BookingChatManager: React.FC<BookingChatManagerProps> = ({
  onBookingQuestionGenerated,
  onLoginRequired,
  language = 'en',
  lastUserMessage,
  sessionId,
  messages = []
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [completedBookingData, setCompletedBookingData] = useState<BookingChatContext | null>(null);
  const [hasNavigated, setHasNavigated] = useState(false);
  const {
    bookingData,
    getNextQuestion,
    processUserResponse,
    saveBookingData
  } = useBookingChat();

  // Check for completed booking conversation from the API
  useEffect(() => {
    const checkCompletedBooking = async () => {
      if (!isAuthenticated) return;
      
      try {
        // Use prop sessionId or fallback to sessionStorage
        const currentSessionId = sessionId || sessionStorage.getItem('ragSessionId') || `rag_session_${Date.now()}`;
        
        const response = await fetch(`/api/ragbot/booking-conversation-status?sessionId=${currentSessionId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.isComplete && data.collectedData) {
            setCompletedBookingData(data.collectedData);
            // Also sync with the booking chat hook
            await saveBookingData({
              department: data.collectedData.department,
              service: data.collectedData.service,
              agent: data.collectedData.agentType,
              date: data.collectedData.preferredDate,
              time: data.collectedData.preferredTime,
              notes: data.collectedData.additionalNotes,
              completed: true
            });
          }
        }
      } catch (error) {
        console.error('Error checking booking status:', error);
      }
    };

    checkCompletedBooking();
    
    // Check periodically for updates
    const interval = setInterval(checkCompletedBooking, 2000);
    return () => clearInterval(interval);
  }, [isAuthenticated, saveBookingData, sessionId]);

  const detectBookingIntent = useCallback((message: string): BookingIntent => {
    const lowerMessage = message.toLowerCase();
    const hasBookingKeyword = bookingKeywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );

    if (!hasBookingKeyword) {
      return { isBookingIntent: false, confidence: 0 };
    }

    // Extract department information
    const extractedData: BookingChatContext = {};
    let confidence = 0.5;

    for (const [dept, keywords] of Object.entries(departmentKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        extractedData.departmentName = dept;
        confidence = 0.8;
        break;
      }
    }

    return {
      isBookingIntent: true,
      extractedData: Object.keys(extractedData).length > 0 ? extractedData : undefined,
      confidence
    };
  }, []);

  const handleBookingFlow = useCallback(async (message: string) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    try {
      const intent = detectBookingIntent(message);
      
      if (intent.isBookingIntent && !bookingData) {
        // Start new booking process
        await processUserResponse(message, intent.extractedData);
        const nextQuestion = getNextQuestion();
        if (nextQuestion && onBookingQuestionGenerated) {
          onBookingQuestionGenerated(nextQuestion);
        }
      } else if (bookingData && !bookingData.completed) {
        // Continue existing booking process
        await processUserResponse(message);
        const nextQuestion = getNextQuestion();
        if (nextQuestion && onBookingQuestionGenerated) {
          onBookingQuestionGenerated(nextQuestion);
        }
      }
    } catch (error) {
      console.error('Error in booking flow:', error);
      if (error instanceof Error && error.message.includes('Authentication required')) {
        setShowAuthPrompt(true);
        if (onLoginRequired) {
          onLoginRequired();
        }
      }
    }
  }, [
    isAuthenticated,
    bookingData,
    detectBookingIntent,
    processUserResponse,
    getNextQuestion,
    onBookingQuestionGenerated,
    onLoginRequired,
    setShowAuthPrompt
  ]);

  // Process last user message for booking intent
  useEffect(() => {
    if (lastUserMessage) {
      const intent = detectBookingIntent(lastUserMessage);
      if (intent.isBookingIntent) {
        handleBookingFlow(lastUserMessage);
      }
    }
  }, [lastUserMessage, detectBookingIntent, handleBookingFlow]);

  // Check if the last few bot messages contain completion indicators
  const recentBotMessages = messages
    .filter(msg => msg.type === 'bot')
    .slice(-3) // Check last 3 bot messages
    .map(msg => msg.text);

  const hasCompletionMessage = recentBotMessages.some(text => 
    text.includes("Perfect! I've collected all your information") ||
    text.includes("Open Booking Form") ||
    text.includes("booking information is ready") ||
    text.includes("You can now proceed to complete your booking")
  );

  // Check if booking is completed (either through API or completion message)
  const isBookingCompleted = completedBookingData || hasCompletionMessage;

  // Auto-navigate to booking form when conversation completes
  useEffect(() => {
    if (isBookingCompleted && isAuthenticated && !hasNavigated) {
      console.log('Auto-navigating to booking form...');
      
      // Build query params from either completed data or bookingData
      const queryParams = new URLSearchParams();
      queryParams.set('fromChat', 'true');
      
      const dataSource = completedBookingData || bookingData;
      if (dataSource) {
        // Handle both BookingChatContext and BookingData types
        if ('departmentName' in dataSource && dataSource.departmentName) {
          queryParams.set('department', dataSource.departmentName);
        } else if ('department' in dataSource && dataSource.department) {
          queryParams.set('department', dataSource.department);
        }
        
        if ('serviceName' in dataSource && dataSource.serviceName) {
          queryParams.set('service', dataSource.serviceName);
        } else if ('service' in dataSource && dataSource.service) {
          queryParams.set('service', dataSource.service);
        }
        
        // Handle agentType from API data
        if ('agentType' in dataSource && (dataSource as BookingConversationData).agentType) {
          queryParams.set('agent', (dataSource as BookingConversationData).agentType!);
        } else if ('agentName' in dataSource && dataSource.agentName) {
          queryParams.set('agent', dataSource.agentName);
        } else if ('agent' in dataSource && dataSource.agent) {
          queryParams.set('agent', dataSource.agent);
        }
        
        // Handle preferredDate from API data
        if ('preferredDate' in dataSource && (dataSource as BookingConversationData).preferredDate) {
          queryParams.set('date', (dataSource as BookingConversationData).preferredDate!);
        } else if ('date' in dataSource && dataSource.date) {
          queryParams.set('date', dataSource.date);
        }
        
        // Handle preferredTime from API data
        if ('preferredTime' in dataSource && (dataSource as BookingConversationData).preferredTime) {
          queryParams.set('time', (dataSource as BookingConversationData).preferredTime!);
        } else if ('time' in dataSource && dataSource.time) {
          queryParams.set('time', dataSource.time);
        }
        
        // Handle additionalNotes from API data
        if ('additionalNotes' in dataSource && (dataSource as BookingConversationData).additionalNotes) {
          queryParams.set('notes', (dataSource as BookingConversationData).additionalNotes!);
        } else if ('notes' in dataSource && dataSource.notes) {
          queryParams.set('notes', dataSource.notes);
        }
      }
      
      setHasNavigated(true);
      router.push(`/user/booking/new?${queryParams.toString()}`);
    }
  }, [isBookingCompleted, isAuthenticated, hasNavigated, completedBookingData, bookingData, router]);

  // Enhanced detection - check if there's any booking-related conversation happening
  const hasAnyBookingActivity = 
    bookingData || 
    completedBookingData || 
    hasCompletionMessage ||
    messages.some(msg => 
      msg.text.includes('department') || 
      msg.text.includes('appointment') || 
      msg.text.includes('book') ||
      msg.text.includes('schedule') ||
      msg.text.includes('service') ||
      msg.text.includes('agent') ||
      msg.text.includes('Perfect! I') ||
      msg.text.includes('booking')
    );

  // Don't render anything if no booking activity exists
  if (!hasAnyBookingActivity && !lastUserMessage) {
    return null;
  }
  
  return (
    <div className="mt-4">
      {showAuthPrompt && (
        <AuthPrompt 
          message="Please login to continue with booking"
          language={language}
        />
      )}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-2">
        {isBookingCompleted ? 'Redirecting to booking form...' : 'Processing your booking request...'}
      </div>
    </div>
  );
};

export default BookingChatManager;
