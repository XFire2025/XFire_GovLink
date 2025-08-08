// src/app/agent/submissions/page.tsx
"use client";
import { useState } from 'react';
import SubmissionsLayout from '@/components/agent/submissions/SubmissionsLayout';
import SubmissionFilters from '@/components/agent/submissions/SubmissionFilters';
import SubmissionCard from '@/components/agent/submissions/SubmissionCard';
import SubmissionModal from '@/components/agent/submissions/SubmissionModal';
import SubmissionNotes from '@/components/agent/submissions/SubmissionNotes';

// Types
type Language = 'en' | 'si' | 'ta';
type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'needs_info';
type FormType = 'passport' | 'license' | 'certificate' | 'registration' | 'visa';
type Priority = 'normal' | 'urgent';

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

interface SubmissionFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

// Mock form submissions data
const mockSubmissions: FormSubmission[] = [
  {
    id: 'SUB001',
    citizenName: 'Nimal Perera',
    citizenId: '199012345678V',
    formType: 'passport',
    submittedDate: '2025-08-07T09:15:00Z',
    status: 'pending',
    priority: 'urgent',
    lastUpdated: '2025-08-07T09:15:00Z',
    contactEmail: 'nimal.perera@email.com',
    contactPhone: '+94 77 123 4567',
    attachments: [
      {
        id: 'file1',
        fileName: 'passport_application.pdf',
        fileType: 'application/pdf',
        fileSize: 2048576,
        fileUrl: '/mock/passport_application.pdf'
      },
      {
        id: 'file2',
        fileName: 'id_card_copy.jpg',
        fileType: 'image/jpeg',
        fileSize: 1024000,
        fileUrl: '/mock/id_card_copy.jpg'
      }
    ],
    formData: {
      applicationType: 'New Passport',
      travelPurpose: 'Tourism',
      emergencyContact: 'Kamala Perera',
      emergencyPhone: '+94 71 987 6543'
    }
  },
  {
    id: 'SUB002',
    citizenName: 'Kamala Silva',
    citizenId: '198567891234V',
    formType: 'license',
    submittedDate: '2025-08-06T14:30:00Z',
    status: 'needs_info',
    priority: 'normal',
    lastUpdated: '2025-08-07T10:20:00Z',
    contactEmail: 'kamala.silva@email.com',
    contactPhone: '+94 71 987 6543',
    attachments: [
      {
        id: 'file3',
        fileName: 'license_application.pdf',
        fileType: 'application/pdf',
        fileSize: 1536000,
        fileUrl: '/mock/license_application.pdf'
      }
    ],
    formData: {
      licenseType: 'Light Motor Vehicle',
      previousLicense: 'Learner',
      medicalCertificate: 'Attached'
    },
    requestedInfo: ['Medical Certificate Clarity', 'Proof of Address']
  },
  {
    id: 'SUB003',
    citizenName: 'Sunil Fernando',
    citizenId: '197734567890V',
    formType: 'certificate',
    submittedDate: '2025-08-05T11:45:00Z',
    status: 'approved',
    priority: 'normal',
    lastUpdated: '2025-08-06T16:30:00Z',
    contactEmail: 'sunil.fernando@email.com',
    contactPhone: '+94 76 456 7890',
    attachments: [
      {
        id: 'file4',
        fileName: 'birth_cert_request.pdf',
        fileType: 'application/pdf',
        fileSize: 512000,
        fileUrl: '/mock/birth_cert_request.pdf'
      }
    ],
    formData: {
      certificateType: 'Birth Certificate',
      requestReason: 'Passport Application',
      copies: 2
    },
    reviewNotes: 'All documents verified. Certificate approved for issuance.'
  },
  {
    id: 'SUB004',
    citizenName: 'Priya Jayawardena',
    citizenId: '199223456789V',
    formType: 'registration',
    submittedDate: '2025-08-04T16:20:00Z',
    status: 'rejected',
    priority: 'normal',
    lastUpdated: '2025-08-05T09:15:00Z',
    contactEmail: 'priya.jayawardena@email.com',
    contactPhone: '+94 75 234 5678',
    attachments: [
      {
        id: 'file5',
        fileName: 'business_registration.pdf',
        fileType: 'application/pdf',
        fileSize: 3072000,
        fileUrl: '/mock/business_registration.pdf'
      }
    ],
    formData: {
      businessName: 'Priya Textiles',
      businessType: 'Retail',
      location: 'Colombo'
    },
    reviewNotes: 'Business name already exists. Please submit alternative names.'
  }
];

// Page translations
const pageTranslations: Record<Language, {
  title: string;
  subtitle: string;
  totalSubmissions: string;
  pendingReview: string;
  needsInfo: string;
  approvalRate: string;
  overview: string;
}> = {
  en: {
    title: 'Form Submissions',
    subtitle: 'Review and process citizen form submissions',
    totalSubmissions: 'Total Submissions',
    pendingReview: 'Pending Review',
    needsInfo: 'Needs Info',
    approvalRate: 'Approval Rate',
    overview: 'Submissions Overview'
  },
  si: {
    title: 'ආකෘති ගොනුකිරීම්',
    subtitle: 'පුරවැසි ආකෘති ගොනුකිරීම් සමාලෝචනය සහ ක්‍රියාත්මක කිරීම',
    totalSubmissions: 'සම්පූර්ණ ගොනුකිරීම්',
    pendingReview: 'සමාලෝචනය අපේක්ෂිත',
    needsInfo: 'තොරතුරු අවශ්‍යයි',
    approvalRate: 'අනුමත කිරීමේ අනුපාතය',
    overview: 'ගොනුකිරීම් දළ විශ්ලේෂණය'
  },
  ta: {
    title: 'படிவ சமர்ப்பிப்புகள்',
    subtitle: 'குடிமக்கள் படிவ சமர்ப்பிப்புகளை மதிப்பாய்வு மற்றும் செயலாக்கம்',
    totalSubmissions: 'மொத்த சமர்ப்பிப்புகள்',
    pendingReview: 'மதிப்பாய்வு நிலுவையில்',
    needsInfo: 'தகவல் தேவை',
    approvalRate: 'ஒப்புதல் விகிதம்',
    overview: 'சமர்ப்பிப்பு மேலோட்டம்'
  }
};

export default function SubmissionsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [submissions, setSubmissions] = useState<FormSubmission[]>(mockSubmissions);
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesType, setNotesType] = useState<'approval' | 'rejection' | 'info_request'>('approval');

  const t = pageTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const handleFilterChange = (filtered: FormSubmission[]) => {
    setFilteredSubmissions(filtered);
  };

  const handleSubmissionClick = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (submissionId: string, newStatus: SubmissionStatus, notes?: string) => {
    const updatedSubmissions = submissions.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            status: newStatus, 
            lastUpdated: new Date().toISOString(),
            reviewNotes: notes || sub.reviewNotes
          }
        : sub
    );
    setSubmissions(updatedSubmissions);
    
    // Update filtered submissions
    const updatedFiltered = filteredSubmissions.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            status: newStatus, 
            lastUpdated: new Date().toISOString(),
            reviewNotes: notes || sub.reviewNotes
          }
        : sub
    );
    setFilteredSubmissions(updatedFiltered);
    
    // Update selected submission if it's the same
    if (selectedSubmission?.id === submissionId) {
      setSelectedSubmission({
        ...selectedSubmission,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        reviewNotes: notes || selectedSubmission.reviewNotes
      });
    }
  };

  const handleRequestInfo = (submissionId: string, requestedInfo: string[]) => {
    const updatedSubmissions = submissions.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            status: 'needs_info' as SubmissionStatus,
            requestedInfo,
            lastUpdated: new Date().toISOString()
          }
        : sub
    );
    setSubmissions(updatedSubmissions);
    
    // Update filtered submissions
    const updatedFiltered = filteredSubmissions.map(sub => 
      sub.id === submissionId 
        ? { 
            ...sub, 
            status: 'needs_info' as SubmissionStatus,
            requestedInfo,
            lastUpdated: new Date().toISOString()
          }
        : sub
    );
    setFilteredSubmissions(updatedFiltered);
    
    console.log(`Info requested for submission ${submissionId}:`, requestedInfo);
  };

  const openNotesModal = (type: 'approval' | 'rejection' | 'info_request') => {
    setNotesType(type);
    setIsNotesModalOpen(true);
    setIsModalOpen(false); // Close main modal
  };

  // Calculate stats
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending').length;
  const needsInfoSubmissions = submissions.filter(sub => sub.status === 'needs_info').length;
  const approvedSubmissions = submissions.filter(sub => sub.status === 'approved').length;
  const approvalRate = totalSubmissions > 0 ? Math.round((approvedSubmissions / totalSubmissions) * 100) : 0;

  // Stats data with Sri Lankan colors - EXACT SAME pattern as ChatLayout
  const stats = [
    {
      id: 'totalSubmissions',
      value: totalSubmissions.toString(),
      label: t.totalSubmissions,
      color: '#FFC72C',
      bgColor: 'from-[#FFC72C]/10 to-[#FFC72C]/5'
    },
    {
      id: 'pendingReview',
      value: pendingSubmissions.toString(),
      label: t.pendingReview,
      color: '#FF5722',
      bgColor: 'from-[#FF5722]/10 to-[#FF5722]/5'
    },
    {
      id: 'needsInfo',
      value: needsInfoSubmissions.toString(),
      label: t.needsInfo,
      color: '#8D153A',
      bgColor: 'from-[#8D153A]/10 to-[#8D153A]/5'
    },
    {
      id: 'approvalRate',
      value: `${approvalRate}%`,
      label: t.approvalRate,
      color: '#008060',
      bgColor: 'from-[#008060]/10 to-[#008060]/5'
    }
  ];

  return (
    <SubmissionsLayout
      title={
        <>
          <span>{t.title.split(' ')[0]}</span>{' '}
          <span className="text-gradient">{t.title.split(' ')[1] || ''}</span>
        </>
      }
      subtitle={t.subtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      {/* Stats Overview - Enhanced with ChatLayout Styling */}
      <section className="animate-fade-in-up">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
            <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium text-foreground">{t.overview}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.id}
              className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:shadow-2xl hover-lift animate-fade-in-up modern-card relative overflow-hidden"
              style={{
                animationDelay: `${0.1 * (index + 1)}s`,
              }}
            >
              {/* Header with Icon */}
              <div className="flex items-center justify-between mb-4">
                <div 
                  className={`relative p-3 rounded-xl bg-gradient-to-r ${stat.bgColor} transition-all duration-500 group-hover:scale-110`}
                  style={{
                    border: `2px solid ${stat.color}30`,
                  }}
                >
                  <div style={{color: stat.color}} className="transition-all duration-300 group-hover:scale-110">
                    {stat.id === 'totalSubmissions' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    )}
                    {stat.id === 'pendingReview' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    )}
                    {stat.id === 'needsInfo' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <path d="M12 17h.01"/>
                      </svg>
                    )}
                    {stat.id === 'approvalRate' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  
                  {/* Icon Glow Effect - SAME as ChatLayout */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div 
                      className="absolute inset-0 rounded-xl blur-xl" 
                      style={{background: `radial-gradient(circle, ${stat.color}20 0%, transparent 70%)`}}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Stats Value - Enhanced */}
              <div className="mb-2">
                <div 
                  className="text-2xl sm:text-3xl font-bold transition-all duration-500 group-hover:scale-105" 
                  style={{color: stat.color}}
                >
                  {stat.value}
                </div>
              </div>

              {/* Stats Label - Enhanced */}
              <div className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">
                {stat.label}
              </div>

              {/* Hover Effect Gradient - EXACT SAME as ChatLayout */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div 
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at center, ${stat.color}05 0%, transparent 70%)`
                  }}
                ></div>
              </div>

              {/* Animated Border Glow */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                style={{
                  boxShadow: `0 0 30px ${stat.color}30`
                }}
              ></div>
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <SubmissionFilters
        submissions={submissions}
        onFilterChange={handleFilterChange}
        language={currentLanguage}
      />

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            language={currentLanguage}
            onClick={() => handleSubmissionClick(submission)}
            onStatusUpdate={handleStatusUpdate}
            onRequestInfo={() => {
              setSelectedSubmission(submission);
              openNotesModal('info_request');
            }}
          />
        ))}
        
        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-8 rounded-2xl border border-border/50 shadow-glow modern-card">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <h3 className="text-lg font-semibold text-foreground mb-2">No submissions found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSubmission(null);
          }}
          onApprove={() => openNotesModal('approval')}
          onReject={() => openNotesModal('rejection')}
          onRequestInfo={() => openNotesModal('info_request')}
          language={currentLanguage}
        />
      )}

      {/* Notes Modal */}
      {selectedSubmission && (
        <SubmissionNotes
          submission={selectedSubmission}
          isOpen={isNotesModalOpen}
          onClose={() => {
            setIsNotesModalOpen(false);
            setSelectedSubmission(null);
          }}
          onSave={(notes, requestedInfo) => {
            if (notesType === 'approval') {
              handleStatusUpdate(selectedSubmission.id, 'approved', notes);
            } else if (notesType === 'rejection') {
              handleStatusUpdate(selectedSubmission.id, 'rejected', notes);
            } else if (notesType === 'info_request' && requestedInfo) {
              handleRequestInfo(selectedSubmission.id, requestedInfo);
            }
            setIsNotesModalOpen(false);
            setSelectedSubmission(null);
          }}
          type={notesType}
          language={currentLanguage}
        />
      )}
    </SubmissionsLayout>
  );
}