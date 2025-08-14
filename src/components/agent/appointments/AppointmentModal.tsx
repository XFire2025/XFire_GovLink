// components/agent/appointments/AppointmentModal.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import AppointmentViewer from './AppointmentViewer';
import appointmentService from '@/lib/services/appointmentService';

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
}

// UPDATED: This is the detailed appointment data we will fetch
interface DetailedAppointment extends Appointment {
  documents?: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string | null; // Can be null if presigned URL fails
  }[];
}

interface AppointmentUpdateData {
  status?: AppointmentStatus;
  agentId?: string;
  cancellationReason?: string;
}

interface AppointmentModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (appointmentId: string, newStatus: AppointmentStatus) => void;
  language?: Language;
}

// Modal translations (No changes needed here)
const modalTranslations: Record<Language, {
  appointmentDetails: string;
  citizenInformation: string;
  serviceDetails: string;
  contactInformation: string;
  statusHistory: string;
  attachments: string;
  actions: string;
  close: string;
  updateStatus: string;
  reschedule: string;
  sendNotification: string;
  viewHistory: string;
  addNotes: string;
  saveChanges: string;
  name: string;
  citizenId: string;
  email: string;
  phone: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  submittedDate: string;
  priority: string;
  currentStatus: string;
  notes: string;
  agentNotes: string;
  notificationSent: string;
  notificationFailed: string;
  updatingStatus: string;
  sendingNotification: string;
  savingNotes: string;
  bookingReference: string;
  cancellationReason: string;
  noAttachments: string;
  viewDocument: string;
  download: string;
  downloadAll: string;
  notificationTypes: {
    sms: string;
    email: string;
    both: string;
  };
  statuses: Record<AppointmentStatus, string>;
  services: Record<ServiceType, string>;
  priorities: Record<'normal' | 'urgent', string>;
}> = {
  en: {
    appointmentDetails: 'Appointment Details',
    citizenInformation: 'Citizen Information',
    serviceDetails: 'Service Details',
    contactInformation: 'Contact Information',
    statusHistory: 'Status History',
    attachments: 'Attachments',
    actions: 'Actions',
    close: 'Close',
    updateStatus: 'Update Status',
    reschedule: 'Reschedule',
    sendNotification: 'Send Notification',
    viewHistory: 'View Citizen History',
    addNotes: 'Add Notes',
    saveChanges: 'Save Changes',
    name: 'Full Name',
    citizenId: 'Citizen ID',
    email: 'Email Address',
    phone: 'Phone Number',
    serviceType: 'Service Type',
    appointmentDate: 'Appointment Date',
    appointmentTime: 'Appointment Time',
    submittedDate: 'Submitted Date',
    priority: 'Priority Level',
    currentStatus: 'Current Status',
    notes: 'Notes',
    agentNotes: 'Agent Notes',
    notificationSent: 'Notification sent successfully!',
    notificationFailed: 'Failed to send notification. Please try again.',
    updatingStatus: 'Updating status...',
    sendingNotification: 'Sending notification...',
    savingNotes: 'Saving notes...',
    bookingReference: 'Booking Reference',
    cancellationReason: 'Cancellation Reason',
    noAttachments: 'No attachments uploaded',
    viewDocument: 'View Document',
    download: 'Download',
    downloadAll: 'Download All',
    notificationTypes: {
      sms: 'SMS Only',
      email: 'Email Only',
      both: 'SMS & Email'
    },
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
    },
    priorities: {
      normal: 'Normal',
      urgent: 'Urgent'
    }
  },
  si: {
    appointmentDetails: 'නියමයන් විස්තර',
    citizenInformation: 'පුරවැසි තොරතුරු',
    serviceDetails: 'සේවා විස්තර',
    contactInformation: 'සම්බන්ධතා තොරතුරු',
    statusHistory: 'තත්ත්ව ඉතිහාසය',
    attachments: 'ඇමුණුම්',
    actions: 'ක්‍රියාමාර්ග',
    close: 'වසන්න',
    updateStatus: 'තත්ත්වය යාවත්කාලීන කරන්න',
    reschedule: 'නව කාල නියම කරන්න',
    sendNotification: 'දැනුම්දීම යවන්න',
    viewHistory: 'පුරවැසි ඉතිහාසය බලන්න',
    addNotes: 'සටහන් එක් කරන්න',
    saveChanges: 'වෙනස්කම් සුරකින්න',
    name: 'සම්පූර්ණ නම',
    citizenId: 'පුරවැසි හැඳුනුම්පත',
    email: 'විද්‍යුත් ලිපිනය',
    phone: 'දුරකථන අංකය',
    serviceType: 'සේවාවේ වර්ගය',
    appointmentDate: 'නියමයන් දිනය',
    appointmentTime: 'නියමයන් වේලාව',
    submittedDate: 'ගොනු කළ දිනය',
    priority: 'ප්‍රමුඛතා මට්ටම',
    currentStatus: 'වර්තමාන තත්ත්වය',
    notes: 'සටහන්',
    agentNotes: 'නිලධාරී සටහන්',
    notificationSent: 'දැනුම්දීම සාර්ථකව යවන ලදි!',
    notificationFailed: 'දැනුම්දීම යැවීමට අසමත් විය. නැවත උත්සාහ කරන්න.',
    updatingStatus: 'තත්ත්වය යාවත්කාලීන කරමින්...',
    sendingNotification: 'දැනුම්දීම යවමින්...',
    savingNotes: 'සටහන් සුරකිමින්...',
    bookingReference: 'වෙන්කරගැනීම් අංකය',
    cancellationReason: 'අවලංගු කිරීමේ හේතුව',
    noAttachments: 'ඇමුණුම් උඩුගත කර නැත',
    viewDocument: 'ලේඛනය බලන්න',
    download: 'බාගත කරන්න',
    downloadAll: 'සියල්ල බාගත කරන්න',
    notificationTypes: {
      sms: 'SMS පමණක්',
      email: 'ඊමේල් පමණක්',
      both: 'SMS සහ ඊමේල්'
    },
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
    },
    priorities: {
      normal: 'සාමාන්‍ය',
      urgent: 'හදිසි'
    }
  },
  ta: {
    appointmentDetails: 'சந்திப்பு விவரங்கள்',
    citizenInformation: 'குடிமக்கள் தகவல்',
    serviceDetails: 'சேவை விவரங்கள்',
    contactInformation: 'தொடர்பு தகவல்',
    statusHistory: 'நிலை வரலாறு',
    attachments: 'இணைப்புகள்',
    actions: 'நடவடிக்கைகள்',
    close: 'மூடு',
    updateStatus: 'நிலையைப் புதுப்பிக்கவும்',
    reschedule: 'மீண்டும் நேரம் நிர்ணயிக்கவும்',
    sendNotification: 'அறிவிப்பு அனுப்பவும்',
    viewHistory: 'குடிமக்கள் வரலாறைப் பார்க்கவும்',
    addNotes: 'குறிப்புகளைச் சேர்க்கவும்',
    saveChanges: 'மாற்றங்களைச் சேமிக்கவும்',
    name: 'முழு பெயர்',
    citizenId: 'குடிமக்கள் அடையாள எண்',
    email: 'மின்னஞ்சல் முகவரி',
    phone: 'தொலைபேசி எண்',
    serviceType: 'சேவை வகை',
    appointmentDate: 'சந்திப்பு தேதி',
    appointmentTime: 'சந்திப்பு நேரம்',
    submittedDate: 'சமர்ப்பித்த தேதி',
    priority: 'முன்னுரிமை நிலை',
    currentStatus: 'தற்போதைய நிலை',
    notes: 'குறிப்புகள்',
    agentNotes: 'அதிகாரி குறிப்புகள்',
    notificationSent: 'அறிவிப்பு வெற்றிகரமாக அனுப்பப்பட்டது!',
    notificationFailed: 'அறிவிப்பு அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    updatingStatus: 'நிலையைப் புதுப்பிக்கிறது...',
    sendingNotification: 'அறிவிப்பு அனுப்புகிறது...',
    savingNotes: 'குறிப்புகளை சேமிக்கிறது...',
    bookingReference: 'முன்பதிவு குறிப்பு',
    cancellationReason: 'ரத்துசெய்யப்பட்ட காரணம்',
    noAttachments: 'இணைப்புகள் பதிவேற்றப்படவில்லை',
    viewDocument: 'ஆவணத்தைப் பார்க்கவும்',
    download: 'பதிவிறக்கம்',
    downloadAll: 'அனைத்தையும் பதிவிறக்கவும்',
    notificationTypes: {
      sms: 'SMS மட்டும்',
      email: 'மின்னஞ்சல் மட்டும்',
      both: 'SMS மற்றும் மின்னஞ்சல்'
    },
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
    },
    priorities: {
      normal: 'சாதாரண',
      urgent: 'அவசர'
    }
  }
};

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onStatusUpdate,
  language = 'en'
}) => {
  const [detailedAppointment, setDetailedAppointment] = useState<DetailedAppointment | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [newStatus, setNewStatus] = useState<AppointmentStatus>(appointment.status);
  const [additionalNotes, setAdditionalNotes] = useState(appointment.agentNotes || '');
  const [notificationType, setNotificationType] = useState<'sms' | 'email' | 'both'>('email');
  const [cancellationReason, setCancellationReason] = useState('');
  
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  
  const [showNotificationSuccess, setShowNotificationSuccess] = useState(false);
  const [showNotificationError, setShowNotificationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [activeTab, setActiveTab] = useState<'details' | 'attachments' | 'history'>('details');
  
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const t = modalTranslations[language];

  const loadAppointmentDetails = useCallback(async () => {
    if (!appointment.id) return;
    setIsLoadingDetails(true);
    try {
      const result = await appointmentService.getAppointment(appointment.id);
      if (result.success && result.data) {
        setDetailedAppointment(result.data as DetailedAppointment);
        setAdditionalNotes(result.data.agentNotes || '');
      } else {
        setErrorMessage(result.message || 'Failed to load details');
      }
    } catch (error) {
      console.error('Error loading appointment details:', error);
      setErrorMessage('Failed to load details');
    } finally {
      setIsLoadingDetails(false);
    }
  }, [appointment.id]);

  useEffect(() => {
    if (isOpen) {
      loadAppointmentDetails();
    } else {
      setDetailedAppointment(null);
    }
  }, [isOpen, loadAppointmentDetails]);

  useEffect(() => {
    setNewStatus(appointment.status);
    setAdditionalNotes(appointment.agentNotes || '');
    setCancellationReason('');
    setShowNotificationSuccess(false);
    setShowNotificationError(false);
    setErrorMessage('');
  }, [appointment]);

  if (!isOpen) return null;

  const handleStatusUpdate = async () => {
    if (newStatus === appointment.status) return;

    try {
      setIsUpdatingStatus(true);
      setErrorMessage('');

      const updates: AppointmentUpdateData = { 
        status: newStatus,
        agentId: 'CURRENT_AGENT' // Replace with actual agent ID
      };

      if (newStatus === 'cancelled' && cancellationReason.trim()) {
        updates.cancellationReason = cancellationReason.trim();
      }

      const result = await appointmentService.updateAppointment(appointment.id, updates);
      
      if (result.success) {
        onStatusUpdate(appointment.id, newStatus);
      } else {
        setErrorMessage(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setErrorMessage('Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      setIsSendingNotification(true);
      setShowNotificationSuccess(false);
      setShowNotificationError(false);
      setErrorMessage('');

      const result = await appointmentService.sendNotification(appointment.id, notificationType);
      
      if (result.success) {
        setShowNotificationSuccess(true);
        setTimeout(() => setShowNotificationSuccess(false), 5000);
      } else {
        setShowNotificationError(true);
        setErrorMessage(result.message || 'Failed to send notification');
        setTimeout(() => setShowNotificationError(false), 5000);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setShowNotificationError(true);
      setErrorMessage('Failed to send notification. Please try again.');
      setTimeout(() => setShowNotificationError(false), 5000);
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleSaveNotes = async () => {
    if (additionalNotes.trim() === (appointment.agentNotes || '').trim()) return;

    try {
      setIsSavingNotes(true);
      setErrorMessage('');

      const result = await appointmentService.addNotes(
        appointment.id, 
        additionalNotes.trim(),
        'CURRENT_AGENT' // Replace with actual agent ID
      );
      
      if (result.success) {
        console.log('Notes saved successfully');
      } else {
        setErrorMessage(result.message || 'Failed to save notes');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      setErrorMessage('Failed to save notes. Please try again.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleViewHistory = () => {
    console.log(`Viewing history for citizen ${appointment.citizenId}`);
  };

  const handleViewFile = (index: number) => {
    setSelectedFileIndex(index);
    setIsViewerOpen(true);
  };

  const handleDownloadFile = (file: { fileName: string; url: string | null }) => {
    if (!file.url) {
      console.error("Cannot download file, URL is missing.");
      setErrorMessage("Could not generate a secure download link for this file. Please try again later.");
      return;
    }
    console.log(`Downloading file: ${file.fileName}`);
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    if (detailedAppointment?.documents) {
      detailedAppointment.documents.forEach(file => {
        setTimeout(() => handleDownloadFile(file), 100);
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language === 'si' ? 'si-LK' : 'ta-LK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return 'text-[#FFC72C]';
      case 'confirmed':
        return 'text-[#008060]';
      case 'cancelled':
        return 'text-[#FF5722]';
      case 'completed':
        return 'text-[#8D153A]';
      default:
        return 'text-muted-foreground';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF5722]">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      );
    } else if (fileType.includes('image')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#008060]">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      );
    } else {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFC72C]">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fade-in-up" style={{ zIndex: 60 }}>
        <div className="bg-background/98 dark:bg-card/98 backdrop-blur-md border border-border/50 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl modern-card relative z-[61]" style={{ zIndex: 61 }}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-card/90 dark:bg-card/95 backdrop-blur-md sticky top-0 z-[62]" style={{ zIndex: 62 }}>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t.appointmentDetails}</h2>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-muted-foreground font-mono">ID: {appointment.id}</p>
                {appointment.bookingReference && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{t.bookingReference}:</span> {appointment.bookingReference}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-xl bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FF5722]/60 transition-all duration-300 hover:scale-105 relative z-[63]"
              style={{ zIndex: 63 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border/50 bg-card/50 dark:bg-card/60 backdrop-blur-md">
            {[
              { id: 'details', label: t.appointmentDetails },
              { id: 'attachments', label: t.attachments },
              { id: 'history', label: t.statusHistory }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'details' | 'attachments' | 'history')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? 'border-[#FFC72C] text-[#FFC72C] bg-[#FFC72C]/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-card/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 bg-background/95 backdrop-blur-md">
            {/* Success/Error Messages */}
            {showNotificationSuccess && (
              <div className="bg-[#008060]/20 border border-[#008060]/30 text-[#008060] p-4 rounded-xl animate-fade-in-up mb-6 backdrop-blur-md modern-card">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-medium">{t.notificationSent}</span>
                </div>
              </div>
            )}

            {showNotificationError && (
              <div className="bg-[#FF5722]/20 border border-[#FF5722]/30 text-[#FF5722] p-4 rounded-xl animate-fade-in-up mb-6 backdrop-blur-md modern-card">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  <span className="font-medium">{errorMessage || t.notificationFailed}</span>
                </div>
              </div>
            )}

            {isLoadingDetails ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#FFC72C]/20 border-t-[#FFC72C] rounded-full animate-spin"></div>
              </div>
            ) : activeTab === 'details' && detailedAppointment ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Citizen Information */}
                  <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card hover:border-[#FFC72C]/50 group relative overflow-hidden">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 group-hover:text-[#FFC72C] transition-colors duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {t.citizenInformation}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">{t.name}:</span>
                        <p className="font-medium text-foreground">{detailedAppointment.citizenName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t.citizenId}:</span>
                        <p className="font-medium text-foreground font-mono">{detailedAppointment.citizenId}</p>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card hover:border-[#008060]/50 group relative overflow-hidden">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 group-hover:text-[#008060] transition-colors duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {t.contactInformation}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">{t.email}:</span>
                        <p className="font-medium text-foreground">{detailedAppointment.contactEmail}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t.phone}:</span>
                        <p className="font-medium text-foreground">{detailedAppointment.contactPhone}</p>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#008060]/5 via-transparent to-[#FFC72C]/5 rounded-2xl"></div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card hover:border-[#FF5722]/50 group relative overflow-hidden">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 group-hover:text-[#FF5722] transition-colors duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {t.serviceDetails}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">{t.serviceType}:</span>
                        <p className="font-medium text-foreground">{t.services[detailedAppointment.serviceType]}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t.appointmentDate}:</span>
                        <p className="font-medium text-foreground">{formatDate(detailedAppointment.date)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t.appointmentTime}:</span>
                        <p className="font-medium text-foreground">{formatTime(detailedAppointment.time)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t.submittedDate}:</span>
                        <p className="font-medium text-foreground">{formatDate(detailedAppointment.submittedDate)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t.priority}:</span>
                        <span className={`font-medium ${detailedAppointment.priority === 'urgent' ? 'text-[#FF5722]' : 'text-foreground'}`}>
                          {t.priorities[detailedAppointment.priority]}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t.currentStatus}:</span>
                        <span className={`font-medium ${getStatusColor(detailedAppointment.status)}`}>
                          {t.statuses[detailedAppointment.status]}
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/5 via-transparent to-[#8D153A]/5 rounded-2xl"></div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Notes */}
                  {detailedAppointment.notes && (
                    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card hover:border-[#8D153A]/50 group relative overflow-hidden">
                      <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-[#8D153A] transition-colors duration-300">{t.notes}</h3>
                      <p className="text-foreground italic">&ldquo;{detailedAppointment.notes}&rdquo;</p>

                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8D153A]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card hover:border-[#FFC72C]/50 group relative overflow-hidden">
                    <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-[#FFC72C] transition-colors duration-300">{t.actions}</h3>
                    
                    {/* Status Update */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t.updateStatus}</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as AppointmentStatus)}
                          disabled={isUpdatingStatus}
                          className="w-full py-3 px-4 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {Object.entries(t.statuses).map(([value, label]) => (
                            <option key={value} value={value} className="bg-card text-foreground">
                              {label}
                            </option>
                          ))}
                        </select>
                        
                        {/* Cancellation Reason */}
                        {newStatus === 'cancelled' && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-foreground mb-2">{t.cancellationReason}</label>
                            <textarea
                              value={cancellationReason}
                              onChange={(e) => setCancellationReason(e.target.value)}
                              className="w-full py-3 px-4 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 resize-none"
                              rows={2}
                              placeholder="Enter reason for cancellation..."
                            />
                          </div>
                        )}
                        
                        {newStatus !== detailedAppointment.status && (
                          <button
                            onClick={handleStatusUpdate}
                            disabled={isUpdatingStatus || (newStatus === 'cancelled' && !cancellationReason.trim())}
                            className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-xl hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isUpdatingStatus ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                {t.updatingStatus}
                              </>
                            ) : (
                              t.updateStatus
                            )}
                          </button>
                        )}
                      </div>

                      {/* Send Notification */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t.sendNotification}</label>
                        <select
                          value={notificationType}
                          onChange={(e) => setNotificationType(e.target.value as 'sms' | 'email' | 'both')}
                          disabled={isSendingNotification}
                          className="w-full py-3 px-4 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {Object.entries(t.notificationTypes).map(([value, label]) => (
                            <option key={value} value={value} className="bg-card text-foreground">
                              {label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleSendNotification}
                          disabled={isSendingNotification}
                          className="w-full px-4 py-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] text-white rounded-xl hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSendingNotification ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                              {t.sendingNotification}
                            </>
                          ) : (
                            t.sendNotification
                          )}
                        </button>
                      </div>

                      {/* Agent Notes */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t.agentNotes}</label>
                        <textarea
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          disabled={isSavingNotes}
                          className="w-full py-3 px-4 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                          rows={3}
                          placeholder="Add internal notes about this appointment..."
                        />
                        {additionalNotes.trim() !== (detailedAppointment.agentNotes || '').trim() && (
                          <button
                            onClick={handleSaveNotes}
                            disabled={isSavingNotes}
                            className="mt-2 w-full px-4 py-2 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C]/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isSavingNotes ? (
                              <>
                                <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>
                                {t.savingNotes}
                              </>
                            ) : (
                              t.saveChanges
                            )}
                          </button>
                        )}
                      </div>

                      {/* Other Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={handleViewHistory}
                          className="w-full px-4 py-2 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C]/60 transition-all duration-300 hover:scale-105"
                        >
                          {t.viewHistory}
                        </button>
                        <button className="w-full px-4 py-2 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C]/60 transition-all duration-300 hover:scale-105">
                          {t.reschedule}
                        </button>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'attachments' && detailedAppointment ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">{t.attachments}</h3>
                  {detailedAppointment.documents && detailedAppointment.documents.length > 0 && (
                    <button
                      onClick={handleDownloadAll}
                      className="px-4 py-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] text-white rounded-lg hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 text-sm font-medium"
                    >
                      {t.downloadAll}
                    </button>
                  )}
                </div>

                {detailedAppointment.documents && detailedAppointment.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {detailedAppointment.documents.map((file, index) => (
                      <div key={file.id} className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-xl border border-border/30 hover:border-[#FFC72C] transition-all duration-300">
                        <div className="flex items-start gap-3">
                          {getFileIcon(file.fileType)}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground text-sm truncate">{file.fileName}</h4>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.fileSize)}</p>
                            <p className="text-xs text-muted-foreground capitalize">{file.fileType.split('/')[1]}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleViewFile(index)}
                            className="flex-1 px-3 py-2 bg-card/30 border border-border/50 rounded-lg text-xs font-medium text-foreground hover:bg-card/50 hover:border-[#FFC72C] transition-all duration-300"
                          >
                            {t.viewDocument}
                          </button>
                          <button
                            onClick={() => handleDownloadFile(file)}
                            className="px-3 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-lg hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 text-xs font-medium"
                          >
                            {t.download}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{t.noAttachments}</h4>
                    <p className="text-muted-foreground">This appointment has no attached documents</p>
                  </div>
                )}
              </div>
            ) : activeTab === 'history' && detailedAppointment ? (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">{t.statusHistory}</h3>
                <div className="space-y-4">
                  {/* Mock history timeline */}
                  <div className="flex gap-4 p-4 bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-glow modern-card hover:shadow-xl transition-all duration-300">
                    <div className="w-8 h-8 bg-[#008060] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20m8-10H4"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Appointment Created</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(detailedAppointment.submittedDate)}</p>
                      <p className="text-sm text-muted-foreground">Appointment booked by {detailedAppointment.citizenName}</p>
                    </div>
                  </div>

                  {detailedAppointment.status !== 'pending' && (
                    <div className="flex gap-4 p-4 bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-glow modern-card hover:shadow-xl transition-all duration-300">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        detailedAppointment.status === 'confirmed' ? 'bg-[#008060]' :
                        detailedAppointment.status === 'cancelled' ? 'bg-[#FF5722]' :
                        'bg-[#8D153A]'
                      }`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {detailedAppointment.status === 'confirmed' ? (
                            <polyline points="20 6 9 17 4 12"/>
                          ) : detailedAppointment.status === 'cancelled' ? (
                            <>
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </>
                          ) : (
                            <>
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="20 6 9 17 4 12"/>
                            </>
                          )}
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Status Updated: {t.statuses[detailedAppointment.status]}</h4>
                        <p className="text-sm text-muted-foreground">Updated by agent</p>
                        {detailedAppointment.notes && (
                          <p className="text-sm text-foreground mt-1">&ldquo;{detailedAppointment.notes}&rdquo;</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center gap-4 p-6 border-t border-border/50 bg-card/90 dark:bg-card/95 backdrop-blur-md sticky bottom-0">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FF5722]/60 transition-all duration-300 hover:scale-105"
            >
              {t.close}
            </button>
            
            {errorMessage && (
              <p className="text-sm text-[#FF5722] max-w-md">{errorMessage}</p>
            )}
            
            <div className="flex gap-3">
              {(isUpdatingStatus || isSendingNotification || isSavingNotes) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {detailedAppointment?.documents && detailedAppointment.documents.length > 0 && (
        <AppointmentViewer
          files={detailedAppointment.documents
            .filter(doc => doc.url) // Filter out any docs where URL generation failed
            .map(doc => ({
              id: doc.id,
              fileName: doc.fileName,
              fileType: doc.fileType,
              fileSize: doc.fileSize,
              fileUrl: doc.url! // Use non-null assertion because we filtered
          }))}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          initialFileIndex={selectedFileIndex}
          language={language}
          appointmentId={appointment.id}
          citizenName={appointment.citizenName}
        />
      )}
    </>
  );
};

export default AppointmentModal;