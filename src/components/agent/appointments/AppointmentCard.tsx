// components/agent/appointments/AppointmentCard.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

// Types
type Language = 'en' | 'si' | 'ta';
type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
type ServiceType = 'passport' | 'license' | 'certificate' | 'registration' | 'visa';

interface Appointment {
  id: string;
  citizenName: string;
  citizenId: string;
  serviceType: ServiceType;
  date: string;
  time: string;
  status: AppointmentStatus;
  priority: 'normal' | 'urgent';
  notes?: string;
  contactEmail: string;
  contactPhone: string;
  submittedDate: string;
  bookingReference?: string;
  agentNotes?: string;
  documents?: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string;
  }[];
}

interface AppointmentCardProps {
  appointment: Appointment;
  language?: Language;
  onClick: () => void;
  onStatusUpdate: (appointmentId: string, newStatus: AppointmentStatus) => void;
}

// Card translations
const cardTranslations: Record<Language, {
  time: string;
  citizenId: string;
  submitted: string;
  urgentPriority: string;
  viewDetails: string;
  quickActions: string;
  confirm: string;
  cancel: string;
  complete: string;
  sendReminder: string;
  attachments: string;
  statuses: Record<AppointmentStatus, string>;
  services: Record<ServiceType, string>;
}> = {
  en: {
    time: 'Time',
    citizenId: 'Citizen ID',
    submitted: 'Submitted',
    urgentPriority: 'Urgent',
    viewDetails: 'View Details',
    quickActions: 'Quick Actions',
    confirm: 'Confirm',
    cancel: 'Cancel',
    complete: 'Complete',
    sendReminder: 'Send Reminder',
    attachments: 'attachments',
    statuses: {
      pending: 'Pending Review',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed'
    },
    services: {
      passport: 'Passport Application',
      license: 'Driving License',
      certificate: 'Birth Certificate',
      registration: 'Business Registration',
      visa: 'Visa Application'
    }
  },
  si: {
    time: 'වේලාව',
    citizenId: 'පුරවැසි හැඳුනුම්පත',
    submitted: 'ඉදිරිපත් කරන ලදී',
    urgentPriority: 'හදිසි',
    viewDetails: 'විස්තර බලන්න',
    quickActions: 'ඉක්මන් ක්‍රියා',
    confirm: 'තහවුරු කරන්න',
    cancel: 'අවලංගු කරන්න',
    complete: 'සම්පූර්ණ කරන්න',
    sendReminder: 'මතක් කිරීම යවන්න',
    attachments: 'ඇමුණුම්',
    statuses: {
      pending: 'සමාලෝචනය අපේක්ෂිත',
      confirmed: 'තහවුරු කළ',
      cancelled: 'අවලංගු කළ',
      completed: 'සම්පූර්ණ කළ'
    },
    services: {
      passport: 'ගමන් බලපත්‍ර අයදුම්පත',
      license: 'රියදුරු බලපත්‍රය',
      certificate: 'උප්පැන්න සහතිකය',
      registration: 'ව්‍යාපාර ලියාපදිංචිය',
      visa: 'වීසා අයදුම්පත'
    }
  },
  ta: {
    time: 'நேரம்',
    citizenId: 'குடிமக்கள் அடையாள எண்',
    submitted: 'சமர்ப்பிக்கப்பட்டது',
    urgentPriority: 'அவசர',
    viewDetails: 'விவரங்களைப் பார்க்கவும்',
    quickActions: 'விரைவு நடவடிக்கைகள்',
    confirm: 'உறுதிப்படுத்து',
    cancel: 'ரத்துசெய்',
    complete: 'முடிக்கவும்',
    sendReminder: 'நினைவூட்டல் அனுப்பவும்',
    attachments: 'இணைப்புகள்',
    statuses: {
      pending: 'மதிப்பாய்வு நிலுவையில்',
      confirmed: 'உறுதிப்படுத்தப்பட்டது',
      cancelled: 'ரத்துசெய்யப்பட்டது',
      completed: 'முடிக்கப்பட்டது'
    },
    services: {
      passport: 'பாஸ்போர்ட் விண்ணப்பம்',
      license: 'ஓட்டுநர் உரிமம்',
      certificate: 'பிறப்பு சான்றிதழ்',
      registration: 'வணிக பதிவு',
      visa: 'விசா விண்ணப்பம்'
    }
  }
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  language = 'en',
  onClick,
  onStatusUpdate
}) => {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties | null>(null);
  const t = cardTranslations[language];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
          setIsActionMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Position the portal dropdown relative to the trigger button so it can overlap other cards
  useEffect(() => {
    if (!isActionMenuOpen || !buttonRef.current) {
      setMenuStyle(null);
      return;
    }

    const updatePosition = () => {
      const btn = buttonRef.current!;
      const rect = btn.getBoundingClientRect();
      const preferredWidth = Math.max(220, rect.width);
      let left = rect.left + window.scrollX + rect.width - preferredWidth; // right-align to button
      if (left + preferredWidth > window.innerWidth) left = window.innerWidth - preferredWidth - 8;
      if (left < 8) left = 8;
      const top = rect.bottom + window.scrollY + 8; // small gap

      setMenuStyle({ position: 'absolute', left: `${left}px`, top: `${top}px`, minWidth: `${preferredWidth}px`, zIndex: 99999 });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isActionMenuOpen]);

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-[#FFC72C]/20 text-[#FFC72C] border-[#FFC72C]/30';
      case 'confirmed':
        return 'bg-[#008060]/20 text-[#008060] border-[#008060]/30';
      case 'cancelled':
        return 'bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/30';
      case 'completed':
        return 'bg-[#8D153A]/20 text-[#8D153A] border-[#8D153A]/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-border/30';
    }
  };

  const getServiceIcon = (serviceType: ServiceType) => {
    switch (serviceType) {
      case 'passport':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <path d="M16 2v4"/>
            <path d="M8 2v4"/>
            <path d="M3 10h18"/>
          </svg>
        );
      case 'license':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="14" y="14" width="4" height="6" rx="2"/>
            <rect x="6" y="4" width="4" height="6" rx="2"/>
            <path d="M6 20h4"/>
            <path d="M14 10h4"/>
            <path d="M6 14h2m6 0h2"/>
          </svg>
        );
      case 'certificate':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        );
      case 'registration':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18"/>
            <path d="M5 21V7l8-4v18"/>
            <path d="M19 21V11l-6-4"/>
          </svg>
        );
      case 'visa':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language === 'si' ? 'si-LK' : 'ta-LK', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleStatusUpdate = (newStatus: AppointmentStatus) => {
    onStatusUpdate(appointment.id, newStatus);
    setIsActionMenuOpen(false);
  };

  const handleSendReminder = () => {
    // Send reminder via backend API, and schedule 24-hour reminder there
    (async () => {
      try {
        setIsActionMenuOpen(false);
        toast.loading('Sending reminder...');
        const res = await fetch(`/api/agent/appointments/${appointment.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sendNotification', notificationType: 'email' })
        });

        const data = await res.json();
        toast.dismiss();
        if (res.ok && data.success) {
          toast.success('Reminder email sent and scheduled successfully');
        } else {
          console.error('Send reminder failed', data);
          toast.error(data?.message || 'Failed to send reminder');
        }
      } catch (err) {
        toast.dismiss();
        console.error('Error sending reminder:', err);
        toast.error('An error occurred while sending reminder');
      }
    })();
  };

  return (
    <div className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:border-[#FFC72C]/70 animate-fade-in-up modern-card relative">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left Section - Main Info */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            {/* Service Icon */}
            <div className="relative p-3 rounded-2xl transition-all duration-500 flex-shrink-0"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255, 199, 44, 0.1) 0%, rgba(255, 87, 34, 0.05) 50%, rgba(141, 21, 58, 0.08) 100%)',
                   border: '2px solid rgba(255, 199, 44, 0.3)',
                 }}>
              <div className="text-[#FFC72C] group-hover:text-[#FF5722] group-hover:scale-110 transition-all duration-500">
                {getServiceIcon(appointment.serviceType)}
              </div>
              
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-lg">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/15 via-transparent to-[#FF5722]/15 rounded-2xl blur-xl"></div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">
                    {appointment.citizenName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t.citizenId}: {appointment.citizenId}
                  </p>
                </div>

                {appointment.priority === 'urgent' && (
                  <span className="inline-flex items-center px-3 py-1 bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30 rounded-full text-xs font-semibold backdrop-blur-md animate-pulse">
                    {t.urgentPriority}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">
                  {t.services[appointment.serviceType]}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date: </span>
                  <span className="font-medium text-foreground">{formatDate(appointment.date)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.time}: </span>
                  <span className="font-medium text-foreground">{formatTime(appointment.time)}</span>
                </div>
              </div>

              {/* Attachments - NEW */}
              {appointment.documents && appointment.documents.length > 0 && (
                <div className="flex items-center gap-2 mt-3 text-muted-foreground group-hover:text-[#FFC72C] transition-colors duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                  <span className="text-sm font-medium">
                    {appointment.documents.length} {t.attachments}
                  </span>
                </div>
              )}

              {appointment.notes && (
                <div className="mt-3 p-3 bg-card/30 rounded-lg border border-border/30">
                  <p className="text-sm text-muted-foreground italic">&ldquo;{appointment.notes}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Status & Actions */}
        <div className="flex flex-col lg:items-end gap-3 lg:min-w-[200px]">
          <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold border backdrop-blur-md ${getStatusColor(appointment.status)}`}>
            {t.statuses[appointment.status]}
          </span>

          <p className="text-xs text-muted-foreground">
            {t.submitted}: {formatDate(appointment.submittedDate)}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onClick}
              className="px-4 py-2 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-sm font-medium text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C]/60 transition-all duration-300 hover:scale-105 modern-card"
            >
              {t.viewDetails}
            </button>

            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsActionMenuOpen(!isActionMenuOpen);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-xl text-sm font-medium hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {t.quickActions}
                <svg className={`w-4 h-4 transition-transform duration-200 ${isActionMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              
              {isActionMenuOpen && createPortal(
                  <div 
                    ref={dropdownRef}
                    className="bg-background/98 dark:bg-card/98 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up modern-card"
                    style={{ 
                      ...(menuStyle || {}),
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 199, 44, 0.1)'
                    }}
                  >
                  {appointment.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate('confirmed');
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-[#008060] bg-[#008060]/10 hover:bg-[#008060]/20 transition-all duration-200 flex items-center gap-3 border-b border-[#008060]/30 last:border-b-0 hover:scale-[1.02] hover:backdrop-blur-md"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#008060]/20 flex items-center justify-center transition-colors duration-200 hover:bg-[#008060]/30">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006644" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="font-medium">{t.confirm}</span>
                    </button>
                  )}
                  
                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate('completed');
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-[#8D153A]/10 hover:text-[#8D153A] transition-all duration-200 flex items-center gap-3 border-b border-border/30 last:border-b-0 hover:scale-[1.02] hover:backdrop-blur-md"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#8D153A]/10 flex items-center justify-center transition-all duration-200 group-hover:bg-[#8D153A]/20">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8D153A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <span className="font-medium">{t.complete}</span>
                    </button>
                  )}

                  {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate('cancelled');
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all duration-200 flex items-center gap-3 border-b border-border/30 last:border-b-0 hover:scale-[1.02] hover:backdrop-blur-md"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FF5722]/10 flex items-center justify-center transition-all duration-200 group-hover:bg-[#FF5722]/20">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      </div>
                      <span className="font-medium">{t.cancel}</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendReminder();
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-[#FFC72C]/10 hover:text-[#FFC72C] transition-all duration-200 flex items-center gap-3 hover:scale-[1.02] hover:backdrop-blur-md"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FFC72C]/10 flex items-center justify-center transition-all duration-200 group-hover:bg-[#FFC72C]/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22 6 12 13 2 6" />
                      </svg>
                    </div>
                    <span className="font-medium">{t.sendReminder}</span>
                  </button>
                  </div>, document.body
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
      </div>
      
      <div className="absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none group-hover:shadow-[0_0_30px_rgba(255,199,44,0.3)]"></div>
    </div>
  );
};

export default AppointmentCard;