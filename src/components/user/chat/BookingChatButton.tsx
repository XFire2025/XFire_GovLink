// src/components/user/chat/BookingChatButton.tsx
"use client";
import React from 'react';
import { Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBookingChat } from '@/lib/hooks/useBookingChat';
import { useAuth } from '@/lib/auth/AuthContext';

interface BookingChatButtonProps {
  onLoginRequest?: () => void;
  language?: 'en' | 'si' | 'ta';
}

const translations = {
  en: {
    openBookingForm: 'Open Booking Form',
    loginRequired: 'Login Required',
    loginToBook: 'Login to Book Appointment',
    bookingReady: 'Booking Form Ready',
    collectingInfo: 'Collecting Information...',
    complete: 'Information Complete',
    loginFirst: 'Please login to proceed with booking'
  },
  si: {
    openBookingForm: 'වෙන්කරවීමේ ආකෘතිය විවෘත කරන්න',
    loginRequired: 'ප්‍රවේශය අවශ්‍යයි',
    loginToBook: 'හමුවීමක් වෙන්කරවීමට ප්‍රවේශ වන්න',
    bookingReady: 'වෙන්කරවීමේ ආකෘතිය සූදානම්',
    collectingInfo: 'තොරතුරු එකතු කරමින්...',
    complete: 'තොරතුරු සම්පූර්ණයි',
    loginFirst: 'වෙන්කරවීම සමඟ ඉදිරියට යාමට කරුණාකර ප්‍රවේශ වන්න'
  },
  ta: {
    openBookingForm: 'முன்பதிவு படிவத்தைத் திறக்கவும்',
    loginRequired: 'உள்நுழைவு தேவை',
    loginToBook: 'சந்திப்பு முன்பதிவு செய்ய உள்நுழையவும்',
    bookingReady: 'முன்பதிவு படிவம் தயார்',
    collectingInfo: 'தகவல் சேகரிக்கப்படுகிறது...',
    complete: 'தகவல் முடிந்தது',
    loginFirst: 'முன்பதிவுடன் தொடர உள்நுழையவும்'
  }
};

export const BookingChatButton: React.FC<BookingChatButtonProps> = ({
  onLoginRequest,
  language = 'en'
}) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { bookingData, canProceedToForm, isReadyForBooking } = useBookingChat();
  const t = translations[language];

  const handleBookingAction = () => {
    if (!isAuthenticated || !user) {
      if (onLoginRequest) {
        onLoginRequest();
      } else {
        router.push('/user/auth/login?redirect=/user/booking/new');
      }
      return;
    }

    if (canProceedToForm()) {
      // Navigate to booking form with pre-filled data
      const queryParams = new URLSearchParams();
      if (bookingData?.department) queryParams.set('department', bookingData.department);
      if (bookingData?.service) queryParams.set('service', bookingData.service);
      if (bookingData?.agent) queryParams.set('agent', bookingData.agent);
      if (bookingData?.date) queryParams.set('date', bookingData.date);
      if (bookingData?.time) queryParams.set('time', bookingData.time);
      if (bookingData?.notes) queryParams.set('notes', bookingData.notes);
      
      router.push(`/user/booking/new?fromChat=true&${queryParams.toString()}`);
    }
  };

  const getButtonContent = () => {
    if (!isAuthenticated) {
      return {
        icon: <User className="w-4 h-4" />,
        text: t.loginToBook,
        subtext: t.loginFirst,
        className: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        disabled: false
      };
    }

    if (canProceedToForm()) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: t.openBookingForm,
        subtext: t.bookingReady,
        className: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        disabled: false
      };
    }

    // When the conversation is still gathering details, don't display a "Collecting Information" label
    // Show a neutral disabled state with no subtext to avoid the collecting message appearing under the chat
    if (isReadyForBooking()) {
      return {
        icon: <Calendar className="w-4 h-4" />,
        text: t.bookingReady,
        subtext: '',
        className: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
        disabled: true
      };
    }

    return {
      icon: <AlertCircle className="w-4 h-4" />,
      text: t.bookingReady,
      subtext: '',
      className: 'from-gray-500 to-gray-600',
      disabled: true
    };
  };

  const { icon, text, subtext, className, disabled } = getButtonContent();

  return (
    <div className="mt-4 p-4 bg-card/30 dark:bg-card/40 backdrop-blur-md rounded-xl border border-border/50">
      <button
        onClick={handleBookingAction}
        disabled={disabled}
        className={`
          w-full px-6 py-4 rounded-xl transition-all duration-300 
          bg-gradient-to-r ${className}
          text-white font-semibold shadow-lg hover:shadow-xl
          disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
          hover:scale-[1.02] active:scale-[0.98]
          flex items-center justify-center space-x-3
        `}
      >
        {icon}
        <div className="text-left">
          <div className="text-sm font-semibold">{text}</div>
          <div className="text-xs opacity-90">{subtext}</div>
        </div>
      </button>
    </div>
  );
};
