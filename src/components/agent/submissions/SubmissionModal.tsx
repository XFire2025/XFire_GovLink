// src/components/agent/submissions/SubmissionModal.tsx
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

interface SubmissionModalProps {
  submission: FormSubmission;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestInfo: () => void;
  language?: Language;
}

// Modal translations
const modalTranslations: Record<Language, {
  submissionDetails: string;
  citizenInformation: string;
  formData: string;
  attachments: string;
  reviewHistory: string;
  actions: string;
  close: string;
  approve: string;
  reject: string;
  requestInfo: string;
  download: string;
  name: string;
  citizenId: string;
  email: string;
  phone: string;
  submissionId: string;
  formType: string;
  submittedDate: string;
  lastUpdated: string;
  priority: string;
  currentStatus: string;
  reviewNotes: string;
  requestedInfo: string;
  noAttachments: string;
  noFormData: string;
  viewDocument: string;
  downloadAll: string;
  statuses: Record<SubmissionStatus, string>;
  formTypes: Record<FormType, string>;
  priorities: Record<Priority, string>;
}> = {
  en: {
    submissionDetails: 'Submission Details',
    citizenInformation: 'Citizen Information',
    formData: 'Form Data',
    attachments: 'Attachments',
    reviewHistory: 'Review History',
    actions: 'Actions',
    close: 'Close',
    approve: 'Approve Submission',
    reject: 'Reject Submission',
    requestInfo: 'Request Additional Info',
    download: 'Download',
    name: 'Full Name',
    citizenId: 'Citizen ID',
    email: 'Email Address',
    phone: 'Phone Number',
    submissionId: 'Submission ID',
    formType: 'Form Type',
    submittedDate: 'Submitted Date',
    lastUpdated: 'Last Updated',
    priority: 'Priority Level',
    currentStatus: 'Current Status',
    reviewNotes: 'Review Notes',
    requestedInfo: 'Requested Information',
    noAttachments: 'No attachments uploaded',
    noFormData: 'No additional form data available',
    viewDocument: 'View Document',
    downloadAll: 'Download All',
    statuses: {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      needs_info: 'Needs Information'
    },
    formTypes: {
      passport: 'Passport Application',
      license: 'Driving License',
      certificate: 'Certificate Request',
      registration: 'Business Registration',
      visa: 'Visa Application'
    },
    priorities: {
      normal: 'Normal',
      urgent: 'Urgent'
    }
  },
  si: {
    submissionDetails: 'ගොනුකිරීම් විස්තර',
    citizenInformation: 'පුරවැසි තොරතුරු',
    formData: 'ආකෘති දත්ත',
    attachments: 'ඇමුණුම්',
    reviewHistory: 'සමාලෝචන ඉතිහාසය',
    actions: 'ක්‍රියාමාර්ග',
    close: 'වසන්න',
    approve: 'ගොනුකිරීම අනුමත කරන්න',
    reject: 'ගොනුකිරීම ප්‍රතික්ෂේප කරන්න',
    requestInfo: 'අමතර තොරතුරු ඉල්ලන්න',
    download: 'බාගත කරන්න',
    name: 'සම්පූර්ණ නම',
    citizenId: 'පුරවැසි හැඳුනුම්පත',
    email: 'විද්‍යුත් ලිපිනය',
    phone: 'දුරකථන අංකය',
    submissionId: 'ගොනුකිරීම් හැඳුනුම්පත',
    formType: 'ආකෘතියේ වර්ගය',
    submittedDate: 'ගොනු කළ දිනය',
    lastUpdated: 'අවසන් යාවත්කාලීනය',
    priority: 'ප්‍රමුඛතා මට්ටම',
    currentStatus: 'වර්තමාන තත්ත්වය',
    reviewNotes: 'සමාලෝචන සටහන්',
    requestedInfo: 'ඉල්ලූ තොරතුරු',
    noAttachments: 'ඇමුණුම් උඩුගත කර නැත',
    noFormData: 'අමතර ආකෘති දත්ත නැත',
    viewDocument: 'ලේඛනය බලන්න',
    downloadAll: 'සියල්ල බාගත කරන්න',
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
    },
    priorities: {
      normal: 'සාමාන්‍ය',
      urgent: 'ගඩු'
    }
  },
  ta: {
    submissionDetails: 'சமர்ப்பிப்பு விவரங்கள்',
    citizenInformation: 'குடிமக்கள் தகவல்',
    formData: 'படிவ தரவு',
    attachments: 'இணைப்புகள்',
    reviewHistory: 'மதிப்பாய்வு வரலாறு',
    actions: 'நடவடிக்கைகள்',
    close: 'மூடு',
    approve: 'சமர்ப்பிப்பை ஒப்புதல்',
    reject: 'சமர்ப்பிப்பை நிராகரி',
    requestInfo: 'கூடுதல் தகவல் கோரிக்கை',
    download: 'பதிவிறக்கம்',
    name: 'முழு பெயர்',
    citizenId: 'குடிமக்கள் அடையாள எண்',
    email: 'மின்னஞ்சல் முகவரி',
    phone: 'தொலைபேசி எண்',
    submissionId: 'சமர்ப்பிப்பு ஐடி',
    formType: 'படிவ வகை',
    submittedDate: 'சமர்ப்பித்த தேதி',
    lastUpdated: 'கடைசி புதுப்பிப்பு',
    priority: 'முன்னுரிமை நிலை',
    currentStatus: 'தற்போதைய நிலை',
    reviewNotes: 'மதிப்பாய்வு குறிப்புகள்',
    requestedInfo: 'கோரப்பட்ட தகவல்',
    noAttachments: 'இணைப்புகள் பதிவேற்றப்படவில்லை',
    noFormData: 'கூடுதல் படிவ தரவு இல்லை',
    viewDocument: 'ஆவணத்தைப் பார்க்கவும்',
    downloadAll: 'அனைத்தையும் பதிவிறக்கவும்',
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
    },
    priorities: {
      normal: 'சாதாரண',
      urgent: 'அவசர'
    }
  }
};

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  submission,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'attachments' | 'history'>('details');
  const t = modalTranslations[language];

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language === 'si' ? 'si-LK' : 'ta-LK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending':
        return 'text-[#FFC72C]';
      case 'approved':
        return 'text-[#008060]';
      case 'rejected':
        return 'text-[#FF5722]';
      case 'needs_info':
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

  const handleDownloadFile = (file: SubmissionFile) => {
    console.log(`Downloading file: ${file.fileName}`);
    // In real implementation, this would trigger file download
  };

  const handleDownloadAll = () => {
    console.log('Downloading all attachments as ZIP');
    // In real implementation, this would create and download a ZIP file
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="glass-morphism max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-glow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t.submissionDetails}</h2>
            <p className="text-sm text-muted-foreground">ID: {submission.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-card/30 border border-border/50 text-foreground hover:bg-card/50 transition-all duration-300"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/30">
          {[
            { id: 'details', label: t.citizenInformation },
            { id: 'attachments', label: t.attachments },
            { id: 'history', label: t.reviewHistory }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'details' | 'attachments' | 'history')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-[#FFC72C] text-[#FFC72C]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Citizen Information */}
                <div className="glass-morphism p-6 rounded-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {t.citizenInformation}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">{t.name}:</span>
                      <p className="font-medium text-foreground">{submission.citizenName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t.citizenId}:</span>
                      <p className="font-medium text-foreground font-mono">{submission.citizenId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t.email}:</span>
                      <p className="font-medium text-foreground">{submission.contactEmail}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t.phone}:</span>
                      <p className="font-medium text-foreground">{submission.contactPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Form Data */}
                <div className="glass-morphism p-6 rounded-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {t.formData}
                  </h3>
                  {Object.keys(submission.formData).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(submission.formData).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <p className="font-medium text-foreground">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">{t.noFormData}</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Submission Details */}
                <div className="glass-morphism p-6 rounded-xl border border-border/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Submission Info</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">{t.submissionId}:</span>
                      <p className="font-medium text-foreground font-mono">{submission.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t.formType}:</span>
                      <p className="font-medium text-foreground">{t.formTypes[submission.formType]}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t.submittedDate}:</span>
                      <p className="font-medium text-foreground">{formatDate(submission.submittedDate)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t.lastUpdated}:</span>
                      <p className="font-medium text-foreground">{formatDate(submission.lastUpdated)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t.priority}:</span>
                      <span className={`font-medium ${submission.priority === 'urgent' ? 'text-[#FF5722]' : 'text-foreground'}`}>
                        {t.priorities[submission.priority]}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t.currentStatus}:</span>
                      <span className={`font-medium ${getStatusColor(submission.status)}`}>
                        {t.statuses[submission.status]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Notes */}
                {submission.reviewNotes && (
                  <div className="glass-morphism p-6 rounded-xl border border-border/30">
                    <h3 className="text-lg font-semibold text-foreground mb-4">{t.reviewNotes}</h3>
                    <p className="text-muted-foreground italic">&quot;{submission.reviewNotes}&quot;</p>
                  </div>
                )}

                {/* Requested Info */}
                {submission.requestedInfo && submission.requestedInfo.length > 0 && (
                  <div className="glass-morphism p-6 rounded-xl border border-border/30">
                    <h3 className="text-lg font-semibold text-foreground mb-4">{t.requestedInfo}</h3>
                    <ul className="space-y-2">
                      {submission.requestedInfo.map((info, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-2 h-2 bg-[#8D153A] rounded-full"></span>
                          {info}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'attachments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">{t.attachments}</h3>
                {submission.attachments.length > 0 && (
                  <button
                    onClick={handleDownloadAll}
                    className="px-4 py-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] text-white rounded-lg hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 text-sm font-medium"
                  >
                    {t.downloadAll}
                  </button>
                )}
              </div>

              {submission.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submission.attachments.map((file) => (
                    <div key={file.id} className="glass-morphism p-4 rounded-xl border border-border/30 hover:border-[#FFC72C] transition-all duration-300">
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
                          onClick={() => console.log(`Viewing ${file.fileName}`)}
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
                  <p className="text-muted-foreground">This submission has no attached documents</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">{t.reviewHistory}</h3>
              <div className="space-y-4">
                {/* Mock history timeline */}
                <div className="flex gap-4 p-4 glass-morphism rounded-xl border border-border/30">
                  <div className="w-8 h-8 bg-[#008060] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20m8-10H4"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Submission Created</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(submission.submittedDate)}</p>
                    <p className="text-sm text-muted-foreground">Form submitted by {submission.citizenName}</p>
                  </div>
                </div>

                {submission.status !== 'pending' && (
                  <div className="flex gap-4 p-4 glass-morphism rounded-xl border border-border/30">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      submission.status === 'approved' ? 'bg-[#008060]' :
                      submission.status === 'rejected' ? 'bg-[#FF5722]' :
                      'bg-[#8D153A]'
                    }`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {submission.status === 'approved' ? (
                          <polyline points="20 6 9 17 4 12"/>
                        ) : submission.status === 'rejected' ? (
                          <>
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </>
                        ) : (
                          <>
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <path d="M12 17h.01"/>
                          </>
                        )}
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Status Updated: {t.statuses[submission.status]}</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(submission.lastUpdated)}</p>
                      {submission.reviewNotes && (
                        <p className="text-sm text-muted-foreground mt-1">&quot;{submission.reviewNotes}&quot;</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-4 p-6 border-t border-border/30">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-card/30 border border-border/50 rounded-xl text-foreground hover:bg-card/50 transition-all duration-300"
          >
            {t.close}
          </button>
          
          {submission.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={onRequestInfo}
                className="px-6 py-3 bg-card/30 border border-border/50 rounded-xl text-foreground hover:bg-card/50 hover:border-[#FFC72C] transition-all duration-300"
              >
                {t.requestInfo}
              </button>
              <button
                onClick={onReject}
                className="px-6 py-3 bg-gradient-to-r from-[#FF5722] to-[#8D153A] text-white rounded-xl hover:from-[#8D153A] hover:to-[#FF5722] transition-all duration-300"
              >
                {t.reject}
              </button>
              <button
                onClick={onApprove}
                className="px-6 py-3 bg-gradient-to-r from-[#008060] to-[#FFC72C] text-white rounded-xl hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300"
              >
                {t.approve}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
