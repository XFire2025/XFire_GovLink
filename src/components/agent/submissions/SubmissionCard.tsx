// src/components/agent/submissions/SubmissionCard.tsx
"use client";
import React, { useState } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';
type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'needs_info';
type FormType = 'passport' | 'license' | 'certificate' | 'registration' | 'visa';
type Priority = 'normal' | 'urgent';

interface SubmissionFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

interface FormSubmission {
  id: string;
  citizenName: string;
  citizenId: string;
  formType: FormType;
  submittedDate: string;
  status: SubmissionStatus;
  priority: Priority;
  attachments: SubmissionFile[];
  formData: Record<string, string | number | boolean>;
  reviewNotes?: string;
  requestedInfo?: string[];
  lastUpdated: string;
  contactEmail: string;
  contactPhone: string;
}

interface SubmissionCardProps {
  submission: FormSubmission;
  language?: Language;
  onClick: () => void;
  onStatusUpdate: (submissionId: string, newStatus: SubmissionStatus, notes?: string) => void;
  onRequestInfo: () => void;
}

// Card translations
const cardTranslations: Record<Language, {
  submittedOn: string;
  lastUpdated: string;
  attachments: string;
  urgent: string;
  viewDetails: string;
  quickActions: string;
  approve: string;
  reject: string;
  requestInfo: string;
  download: string;
  statuses: Record<SubmissionStatus, string>;
  formTypes: Record<FormType, string>;
}> = {
  en: {
    submittedOn: 'Submitted on',
    lastUpdated: 'Last updated',
    attachments: 'attachments',
    urgent: 'Urgent',
    viewDetails: 'View Details',
    quickActions: 'Quick Actions',
    approve: 'Approve',
    reject: 'Reject',
    requestInfo: 'Request Info',
    download: 'Download',
    statuses: {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      needs_info: 'Needs Info'
    },
    formTypes: {
      passport: 'Passport Application',
      license: 'Driving License',
      certificate: 'Certificate Request',
      registration: 'Business Registration',
      visa: 'Visa Application'
    }
  },
  si: {
    submittedOn: 'ගොනු කළ දිනය',
    lastUpdated: 'අවසන් යාවත්කාලීනය',
    attachments: 'ඇමුණුම්',
    urgent: 'ගඩු',
    viewDetails: 'විස්තර බලන්න',
    quickActions: 'ඉක්මන් ක්‍රියා',
    approve: 'අනුමත කරන්න',
    reject: 'ප්‍රතික්ෂේප කරන්න',
    requestInfo: 'තොරතුරු ඉල්ලන්න',
    download: 'බාගත කරන්න',
    statuses: {
      pending: 'සමාලෝචනය අපේක්ෂිත',
      approved: 'අනුමත කළ',
      rejected: 'ප්‍රතික්ෂේප කළ',
      needs_info: 'තොරතුරු අවශ්‍යයි'
    },
    formTypes: {
      passport: 'ගමන් බලපත්‍ර අයදුම්පත',
      license: 'රියදුරු බලපත්‍රය',
      certificate: 'සහතික ඉල්ලීම',
      registration: 'ව්‍යාපාර ලියාපදිංචිය',
      visa: 'වීසා අයදුම්පත'
    }
  },
  ta: {
    submittedOn: 'சமர்ப்பித்த தேதி',
    lastUpdated: 'கடைசி புதுப்பிப்பு',
    attachments: 'இணைப்புகள்',
    urgent: 'அவசர',
    viewDetails: 'விவரங்களைப் பார்க்கவும்',
    quickActions: 'விரைவு நடவடிக்கைகள்',
    approve: 'ஒப்புதல்',
    reject: 'நிராகரி',
    requestInfo: 'தகவல் கோரிக்கை',
    download: 'பதிவிறக்கம்',
    statuses: {
      pending: 'மதிப்பாய்வு நிலுவையில்',
      approved: 'ஒப்புதல் அளிக்கப்பட்டது',
      rejected: 'நிராகரிக்கப்பட்டது',
      needs_info: 'தகவல் தேவை'
    },
    formTypes: {
      passport: 'பாஸ்போர்ட் விண்ணப்பம்',
      license: 'ஓட்டுநர் உரிமம்',
      certificate: 'சான்றிதழ் கோரிக்கை',
      registration: 'வணிக பதிவு',
      visa: 'விசா விண்ணப்பம்'
    }
  }
};

const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  language = 'en',
  onClick,
  onStatusUpdate,
  onRequestInfo
}) => {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const t = cardTranslations[language];

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-[#FFC72C]/20 text-[#FFC72C] border-[#FFC72C]/30';
      case 'approved':
        return 'bg-[#008060]/20 text-[#008060] border-[#008060]/30';
      case 'rejected':
        return 'bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/30';
      case 'needs_info':
        return 'bg-[#8D153A]/20 text-[#8D153A] border-[#8D153A]/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-border/30';
    }
  };

  const getFormTypeIcon = (formType: FormType) => {
    switch (formType) {
      case 'passport':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        );
      case 'license':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        );
      case 'certificate':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleQuickAction = (action: 'approve' | 'reject' | 'info') => {
    setIsActionMenuOpen(false);
    
    if (action === 'approve') {
      onStatusUpdate(submission.id, 'approved');
    } else if (action === 'reject') {
      onStatusUpdate(submission.id, 'rejected');
    } else if (action === 'info') {
      onRequestInfo();
    }
  };

  return (
    <div className="group glass-morphism p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left Section - Main Info */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            {/* Form Type Icon */}
            <div className="p-3 bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 rounded-xl text-[#FFC72C] group-hover:text-[#FF5722] transition-colors duration-300">
              {getFormTypeIcon(submission.formType)}
            </div>

            {/* Submission Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">
                    {submission.citizenName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {submission.citizenId}
                  </p>
                </div>

                {/* Priority Badge */}
                {submission.priority === 'urgent' && (
                  <span className="inline-flex items-center px-2 py-1 bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30 rounded-full text-xs font-semibold animate-pulse">
                    {t.urgent}
                  </span>
                )}
              </div>

              {/* Form Type */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-foreground">
                  {t.formTypes[submission.formType]}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {submission.id}
                </span>
              </div>

              {/* Submission Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">{t.submittedOn}: </span>
                  <span className="font-medium text-foreground">{formatDate(submission.submittedDate)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.lastUpdated}: </span>
                  <span className="font-medium text-foreground">{formatDate(submission.lastUpdated)}</span>
                </div>
              </div>

              {/* Attachments */}
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                <span className="text-sm text-muted-foreground">
                  {submission.attachments.length} {t.attachments}
                </span>
                {submission.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {submission.attachments.slice(0, 2).map((file) => (
                      <span key={file.id} className="text-xs bg-card/30 px-2 py-1 rounded text-muted-foreground">
                        {file.fileName.length > 15 ? `${file.fileName.substring(0, 15)}...` : file.fileName}
                      </span>
                    ))}
                    {submission.attachments.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{submission.attachments.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Requested Info (if needs_info status) */}
              {submission.status === 'needs_info' && submission.requestedInfo && (
                <div className="p-3 bg-[#8D153A]/10 border border-[#8D153A]/30 rounded-lg mb-4">
                  <p className="text-sm font-medium text-[#8D153A] mb-1">Requested Information:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {submission.requestedInfo.map((info, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-[#8D153A] rounded-full"></span>
                        {info}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Review Notes */}
              {submission.reviewNotes && (
                <div className="p-3 bg-card/20 rounded-lg">
                  <p className="text-sm text-muted-foreground italic">&quot;{submission.reviewNotes}&quot;</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Status & Actions */}
        <div className="flex flex-col lg:items-end gap-3 lg:min-w-[200px]">
          {/* Status Badge */}
          <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold border ${getStatusColor(submission.status)}`}>
            {t.statuses[submission.status]}
          </span>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onClick}
              className="px-4 py-2 bg-card/30 border border-border/50 rounded-lg text-sm font-medium text-foreground hover:bg-card/50 hover:border-[#FFC72C] transition-all duration-300 hover:scale-105"
            >
              {t.viewDetails}
            </button>

            {/* Quick Actions Dropdown */}
            {submission.status === 'pending' && (
              <div className="relative">
                <button
                  onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                  className="px-4 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-lg text-sm font-medium hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  {t.quickActions}
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isActionMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isActionMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 glass-morphism border border-border/50 rounded-xl shadow-glow overflow-hidden animate-fade-in-up z-10">
                    <button
                      onClick={() => handleQuickAction('approve')}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-card/30 transition-all duration-200 flex items-center gap-3"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {t.approve}
                    </button>
                    
                    <button
                      onClick={() => handleQuickAction('reject')}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-[#FF5722] hover:bg-[#FF5722]/10 transition-all duration-200 flex items-center gap-3"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      {t.reject}
                    </button>

                    <button
                      onClick={() => handleQuickAction('info')}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-card/30 transition-all duration-200 flex items-center gap-3"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <path d="M12 17h.01"/>
                      </svg>
                      {t.requestInfo}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close action menu */}
      {isActionMenuOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsActionMenuOpen(false)}
        />
      )}

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
    </div>
  );
};

export default SubmissionCard;
