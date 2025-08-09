// src/components/agent/submissions/SubmissionNotes.tsx
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
  formData: Record<string, string | number | boolean | string[] | null>;
  reviewNotes?: string;
  requestedInfo?: string[];
  lastUpdated: string;
  contactEmail: string;
  contactPhone: string;
}

interface SubmissionNotesProps {
  submission: FormSubmission;
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string, requestedInfo?: string[]) => void;
  type: 'approval' | 'rejection' | 'info_request';
  language?: Language;
}

// Notes translations
const notesTranslations: Record<Language, {
  approvalTitle: string;
  rejectionTitle: string;
  infoRequestTitle: string;
  reviewNotes: string;
  requestedInfo: string;
  notesPlaceholder: string;
  approvalPlaceholder: string;
  rejectionPlaceholder: string;
  infoPlaceholder: string;
  addInfoItem: string;
  removeItem: string;
  save: string;
  cancel: string;
  approve: string;
  reject: string;
  requestInfo: string;
  required: string;
  infoItemPlaceholder: string;
  commonRequests: string;
  clearPhotos: string;
  proofOfAddress: string;
  medicalCertificate: string;
  additionalDocuments: string;
  formTypes: Record<FormType, string>;
}> = {
  en: {
    approvalTitle: 'Approve Submission',
    rejectionTitle: 'Reject Submission',
    infoRequestTitle: 'Request Additional Information',
    reviewNotes: 'Review Notes',
    requestedInfo: 'Requested Information',
    notesPlaceholder: 'Add your review notes here...',
    approvalPlaceholder: 'Provide any additional comments for approval...',
    rejectionPlaceholder: 'Explain the reason for rejection...',
    infoPlaceholder: 'Specify what additional information is needed...',
    addInfoItem: 'Add Information Request',
    removeItem: 'Remove',
    save: 'Save',
    cancel: 'Cancel',
    approve: 'Approve Submission',
    reject: 'Reject Submission',
    requestInfo: 'Request Information',
    required: 'Required',
    infoItemPlaceholder: 'What information is needed?',
    commonRequests: 'Common Requests',
    clearPhotos: 'Clear/Better Photos',
    proofOfAddress: 'Proof of Address',
    medicalCertificate: 'Medical Certificate',
    additionalDocuments: 'Additional Documents',
    formTypes: {
      passport: 'Passport Application',
      license: 'Driving License',
      certificate: 'Certificate Request',
      registration: 'Business Registration',
      visa: 'Visa Application'
    }
  },
  si: {
    approvalTitle: 'ගොනුකිරීම අනුමත කරන්න',
    rejectionTitle: 'ගොනුකිරීම ප්‍රතික්ෂේප කරන්න',
    infoRequestTitle: 'අමතර තොරතුරු ඉල්ලන්න',
    reviewNotes: 'සමාලෝචන සටහන්',
    requestedInfo: 'ඉල්ලූ තොරතුරු',
    notesPlaceholder: 'ඔබේ සමාලෝචන සටහන් මෙහි එක් කරන්න...',
    approvalPlaceholder: 'අනුමත කිරීම සඳහා අමතර අදහස් ලබා දෙන්න...',
    rejectionPlaceholder: 'ප්‍රතික්ෂේප කිරීමේ හේතුව පැහැදිලි කරන්න...',
    infoPlaceholder: 'අවශ්‍ය අමතර තොරතුරු සඳහන් කරන්න...',
    addInfoItem: 'තොරතුරු ඉල්ලීම එක් කරන්න',
    removeItem: 'ඉවත් කරන්න',
    save: 'සුරකින්න',
    cancel: 'අවලංගු කරන්න',
    approve: 'ගොනුකිරීම අනුමත කරන්න',
    reject: 'ගොනුකිරීම ප්‍රතික්ෂේප කරන්න',
    requestInfo: 'තොරතුරු ඉල්ලන්න',
    required: 'අවශ්‍යයි',
    infoItemPlaceholder: 'කුමන තොරතුරු අවශ්‍යද?',
    commonRequests: 'සාමාන්‍ය ඉල්ලීම්',
    clearPhotos: 'පැහැදිලි/වඩා හොඳ ඡායාරූප',
    proofOfAddress: 'ලිපින සනාථය',
    medicalCertificate: 'වෛද්‍ය සහතිකය',
    additionalDocuments: 'අමතර ලේඛන',
    formTypes: {
      passport: 'ගමන් බලපත්‍ර අයදුම්පත',
      license: 'රියදුරු බලපත්‍රය',
      certificate: 'සහතික ඉල්ලීම',
      registration: 'ව්‍යාපාර ලියාපදිංචිය',
      visa: 'වීසා අයදුම්පත'
    }
  },
  ta: {
    approvalTitle: 'சமர்ப்பிப்பை ஒப்புதல்',
    rejectionTitle: 'சமர்ப்பிப்பை நிராகரி',
    infoRequestTitle: 'கூடுதல் தகவல் கோரிக்கை',
    reviewNotes: 'மதிப்பாய்வு குறிப்புகள்',
    requestedInfo: 'கோரப்பட்ட தகவல்',
    notesPlaceholder: 'உங்கள் மதிப்பாய்வு குறிப்புகளை இங்கே சேர்க்கவும்...',
    approvalPlaceholder: 'ஒப்புதலுக்கான கூடுதல் கருத்துகளை வழங்கவும்...',
    rejectionPlaceholder: 'நிராகரிப்புக்கான காரணத்தை விளக்கவும்...',
    infoPlaceholder: 'எந்த கூடுதல் தகவல் தேவை என்பதைக் குறிப்பிடவும்...',
    addInfoItem: 'தகவல் கோரிக்கையைச் சேர்க்கவும்',
    removeItem: 'அகற்று',
    save: 'சேமி',
    cancel: 'ரத்துசெய்',
    approve: 'சமர்ப்பிப்பை ஒப்புதல்',
    reject: 'சமர்ப்பிப்பை நிராகரி',
    requestInfo: 'தகவல் கோரிக்கை',
    required: 'தேவையான',
    infoItemPlaceholder: 'என்ன தகவல் தேவை?',
    commonRequests: 'பொதுவான கோரிக்கைகள்',
    clearPhotos: 'தெளிவான/சிறந்த புகைப்படங்கள்',
    proofOfAddress: 'முகவரி சான்று',
    medicalCertificate: 'மருத்துவ சான்றிதழ்',
    additionalDocuments: 'கூடுதல் ஆவணங்கள்',
    formTypes: {
      passport: 'பாஸ்போர்ட் விண்ணப்பம்',
      license: 'ஓட்டுநர் உரிமம்',
      certificate: 'சான்றிதழ் கோரிக்கை',
      registration: 'வணிக பதிவு',
      visa: 'விசா விண்ணப்பம்'
    }
  }
};

const SubmissionNotes: React.FC<SubmissionNotesProps> = ({
  submission,
  isOpen,
  onClose,
  onSave,
  type,
  language = 'en'
}) => {
  const [notes, setNotes] = useState('');
  const [requestedItems, setRequestedItems] = useState<string[]>(['']);
  const t = notesTranslations[language];

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'approval':
        return t.approvalTitle;
      case 'rejection':
        return t.rejectionTitle;
      case 'info_request':
        return t.infoRequestTitle;
      default:
        return t.reviewNotes;
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'approval':
        return t.approvalPlaceholder;
      case 'rejection':
        return t.rejectionPlaceholder;
      case 'info_request':
        return t.infoPlaceholder;
      default:
        return t.notesPlaceholder;
    }
  };

  const getActionLabel = () => {
    switch (type) {
      case 'approval':
        return t.approve;
      case 'rejection':
        return t.reject;
      case 'info_request':
        return t.requestInfo;
      default:
        return t.save;
    }
  };

  const getStatusColor = () => {
    switch (type) {
      case 'approval':
        return 'from-[#008060] to-[#FFC72C]';
      case 'rejection':
        return 'from-[#FF5722] to-[#8D153A]';
      case 'info_request':
        return 'from-[#8D153A] to-[#FF5722]';
      default:
        return 'from-[#FFC72C] to-[#FF5722]';
    }
  };

  const addRequestedItem = () => {
    setRequestedItems([...requestedItems, '']);
  };

  const removeRequestedItem = (index: number) => {
    setRequestedItems(requestedItems.filter((_, i) => i !== index));
  };

  const updateRequestedItem = (index: number, value: string) => {
    const updated = [...requestedItems];
    updated[index] = value;
    setRequestedItems(updated);
  };

  const addCommonRequest = (request: string) => {
    if (!requestedItems.includes(request)) {
      setRequestedItems([...requestedItems.filter(item => item !== ''), request, '']);
    }
  };

  const handleSave = () => {
    if (type === 'info_request') {
      const filteredItems = requestedItems.filter(item => item.trim() !== '');
      if (filteredItems.length === 0) {
        alert('Please add at least one information request.');
        return;
      }
      onSave(notes, filteredItems);
    } else {
      if (notes.trim() === '') {
        alert('Please add review notes.');
        return;
      }
      onSave(notes);
    }
  };

  const commonRequests = [
    t.clearPhotos,
    t.proofOfAddress,
    t.medicalCertificate,
    t.additionalDocuments
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-glow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-xl font-bold text-foreground">{getTitle()}</h2>
            <p className="text-sm text-muted-foreground">
              {t.formTypes[submission.formType]} - {submission.citizenName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-card/30 border border-border/50 text-foreground hover:bg-card/50 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Submission Info */}
          <div className="glass-morphism p-4 rounded-xl border border-border/30">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <span className="font-medium text-foreground ml-2">{submission.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Priority:</span>
                <span className={`font-medium ml-2 ${submission.priority === 'urgent' ? 'text-[#FF5722]' : 'text-foreground'}`}>
                  {submission.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Review Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t.reviewNotes} {type === 'rejection' && <span className="text-[#FF5722]">*</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 py-3 px-4 bg-card/30 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 resize-none"
              placeholder={getPlaceholder()}
            />
          </div>

          {/* Requested Information (only for info_request type) */}
          {type === 'info_request' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t.requestedInfo} <span className="text-[#FF5722]">*</span>
              </label>

              {/* Common Requests */}
              <div className="mb-4">
                <div className="text-xs font-medium text-muted-foreground mb-2">{t.commonRequests}:</div>
                <div className="flex flex-wrap gap-2">
                  {commonRequests.map((request, index) => (
                    <button
                      key={index}
                      onClick={() => addCommonRequest(request)}
                      className="px-3 py-1 bg-card/30 border border-border/50 rounded-lg text-xs font-medium text-foreground hover:bg-card/50 hover:border-[#FFC72C] transition-all duration-300"
                    >
                      + {request}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Requests */}
              <div className="space-y-3">
                {requestedItems.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateRequestedItem(index, e.target.value)}
                      className="flex-1 py-2 px-3 bg-card/30 border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300"
                      placeholder={t.infoItemPlaceholder}
                    />
                    {requestedItems.length > 1 && (
                      <button
                        onClick={() => removeRequestedItem(index)}
                        className="px-3 py-2 bg-[#FF5722]/10 border border-[#FF5722]/30 rounded-lg text-[#FF5722] hover:bg-[#FF5722]/20 transition-all duration-300"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  onClick={addRequestedItem}
                  className="w-full py-2 px-3 bg-card/30 border border-border/50 border-dashed rounded-lg text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14m7-7H5" />
                  </svg>
                  {t.addInfoItem}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border/30">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-card/30 border border-border/50 rounded-xl text-foreground hover:bg-card/50 transition-all duration-300"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-3 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl hover:opacity-90 transition-all duration-300 font-medium`}
          >
            {getActionLabel()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionNotes;