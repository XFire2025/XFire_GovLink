// src/components/department/DepartmentSubmissionModal.tsx
"use client";
import React from 'react';
import { X } from 'lucide-react';
import CustomBadge from './CustomBadge'; // Using our custom badge
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';

interface Submission {
  id: string;
  citizenName: string;
  citizenId: string;
  serviceName: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_info';
}

interface DepartmentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
}

const DepartmentSubmissionModal: React.FC<DepartmentSubmissionModalProps> = ({ isOpen, onClose, submission }) => {
  const { t } = useTranslation('department');

  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-glow">
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t('submissions.modal.title')}</h2>
            <p className="text-sm text-muted-foreground">ID: {submission.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-card/30" aria-label="Close modal">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Citizen</span>
            <p className="font-medium text-foreground">{submission.citizenName} ({submission.citizenId})</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Service</span>
            <p className="font-medium text-foreground">{submission.serviceName}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Submitted On</span>
            <p className="font-medium text-foreground">{new Date(submission.submittedDate).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Status</span>
            <p><CustomBadge>{submission.status}</CustomBadge></p>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 p-6 border-t border-border/30">
          <button onClick={onClose} className="px-6 py-3 bg-card/30 border border-border/50 rounded-xl">{t('submissions.modal.close')}</button>
          <button className="px-6 py-3 bg-card/30 border border-border/50 rounded-xl">{t('submissions.modal.requestInfo')}</button>
          <button className="px-6 py-3 bg-gradient-to-r from-[#FF5722] to-[#8D153A] text-white rounded-xl">{t('submissions.modal.reject')}</button>
          <button className="px-6 py-3 bg-gradient-to-r from-[#008060] to-[#8D153A] text-white rounded-xl">{t('submissions.modal.approve')}</button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSubmissionModal;