// src/lib/hooks/useBookingChat.ts
import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

export interface BookingData {
  step: 'department' | 'service' | 'agent' | 'schedule' | 'details' | 'complete';
  department?: string;
  departmentName?: string;
  service?: string;
  serviceName?: string;
  agent?: string;
  agentName?: string;
  date?: string;
  time?: string;
  notes?: string;
  sessionId: string;
  userId?: string;
  completed: boolean;
}

export interface BookingChatContext {
  departmentId?: string;
  departmentName?: string;
  serviceId?: string;
  serviceName?: string;
  agentId?: string;
  agentName?: string;
  date?: string;
  time?: string;
}

export interface BookingChatHook {
  bookingData: BookingData | null;
  saveBookingData: (data: Partial<BookingData>) => void;
  clearBookingData: () => void;
  isReadyForBooking: () => boolean;
  getNextQuestion: () => string | null;
  processUserResponse: (response: string, context?: BookingChatContext) => Promise<void>;
  canProceedToForm: () => boolean;
}

const BOOKING_STORAGE_KEY = 'govlink_booking_data';

const bookingQuestions = {
  department: "I'd be happy to help you book an appointment! First, which department do you need assistance with? For example: Immigration, Business Registration, Education, Health, etc.",
  service: "Great! Now, what specific service do you need from {department}? Please describe the service you're looking for.",
  agent: "Perfect! What type of official would you like to meet with? For example: Senior Officer, Specialist, Manager, etc.",
  schedule: "Excellent! When would you prefer to schedule your appointment? Please provide your preferred date and time.",
  details: "Almost done! Do you have any specific notes or requirements for your appointment? If not, just say 'no' or 'none'.",
  complete: "Thank you! I have collected all the necessary information. You can now open the booking form to complete your appointment request."
};

export const useBookingChat = (): BookingChatHook => {
  const { user, isAuthenticated } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(BOOKING_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const saveBookingData = useCallback(async (data: Partial<BookingData>) => {
    if (!isAuthenticated || !user) {
      console.warn('User must be authenticated to save booking data');
      return;
    }

    const newData: BookingData = {
      step: 'department',
      sessionId: `booking_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      completed: false,
      userId: user.id,
      ...bookingData,
      ...data,
    };

    setBookingData(newData);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(newData));
    }

    // Also save to MongoDB for persistence across devices
    try {
      const response = await fetch('/api/user/booking-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        console.warn('Failed to save booking data to server:', await response.text());
      }
    } catch (error) {
      console.warn('Error saving booking data to server:', error);
      // Continue with localStorage only
    }
  }, [bookingData, isAuthenticated, user]);

  const clearBookingData = useCallback(async () => {
    setBookingData(null);
    
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(BOOKING_STORAGE_KEY);
    }

    // Clear from MongoDB if user is authenticated
    if (isAuthenticated && user && bookingData?.sessionId) {
      try {
        await fetch(`/api/user/booking-data?sessionId=${bookingData.sessionId}&userId=${user.id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.warn('Error clearing booking data from server:', error);
      }
    }
  }, [isAuthenticated, user, bookingData]);

  const isReadyForBooking = useCallback(() => {
    return !!(bookingData?.department && bookingData?.service);
  }, [bookingData]);

  const canProceedToForm = useCallback(() => {
    return !!(
      bookingData?.department &&
      bookingData?.service &&
      bookingData?.agent &&
      bookingData?.completed &&
      isAuthenticated &&
      user
    );
  }, [bookingData, isAuthenticated, user]);

  const getNextQuestion = useCallback(() => {
    if (!bookingData) return bookingQuestions.department;
    
    switch (bookingData.step) {
      case 'department':
        return bookingQuestions.service.replace('{department}', bookingData.departmentName || 'the selected department');
      case 'service':
        return bookingQuestions.agent;
      case 'agent':
        return bookingQuestions.schedule;
      case 'schedule':
        return bookingQuestions.details;
      case 'details':
        return bookingQuestions.complete;
      default:
        return null;
    }
  }, [bookingData]);

  const processUserResponse = useCallback(async (response: string, context?: BookingChatContext) => {
    if (!isAuthenticated || !user) {
      throw new Error('Authentication required to process booking');
    }

    if (!bookingData) {
      // Start new booking process
      saveBookingData({
        step: 'department',
        department: context?.departmentId,
        departmentName: context?.departmentName || response,
      });
      return;
    }

    switch (bookingData.step) {
      case 'department':
        saveBookingData({
          step: 'service',
          service: context?.serviceId,
          serviceName: context?.serviceName || response,
        });
        break;
      case 'service':
        saveBookingData({
          step: 'agent',
          agent: context?.agentId,
          agentName: context?.agentName || response,
        });
        break;
      case 'agent':
        saveBookingData({
          step: 'schedule',
          date: context?.date,
          time: context?.time,
        });
        break;
      case 'schedule':
        saveBookingData({
          step: 'details',
          notes: response,
        });
        break;
      case 'details':
        saveBookingData({
          step: 'complete',
          completed: true,
        });
        break;
      default:
        break;
    }
  }, [bookingData, saveBookingData, isAuthenticated, user]);

  return {
    bookingData,
    saveBookingData,
    clearBookingData,
    isReadyForBooking,
    getNextQuestion,
    processUserResponse,
    canProceedToForm,
  };
};
