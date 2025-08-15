// src/components/department/DepartmentSubmissionModal.tsx
"use client";
import React from 'react';
import { X, Loader, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import CustomBadge from './CustomBadge'; // Using our custom badge
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';
import { Submission } from '@/lib/services/departmentApiService';

interface DepartmentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  onStatusUpdate?: (submissionId: string, newStatus: string) => Promise<void>;
  loading?: boolean;
}

const DepartmentSubmissionModal: React.FC<DepartmentSubmissionModalProps> = ({ 
  isOpen, 
  onClose, 
  submission, 
  onStatusUpdate,
  loading = false 
}) => {
  const { t } = useTranslation('department');

  if (!isOpen || !submission) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    if (onStatusUpdate) {
      await onStatusUpdate(submission.id, newStatus);
      onClose();
    }
  };

  const getStatusActions = () => {
    const currentStatus = submission.status;
    const actions = [];

    if (currentStatus !== 'APPROVED' && currentStatus !== 'COMPLETED') {
      actions.push({
        label: t('submissions.modal.approve'),
        action: () => handleStatusUpdate('APPROVED'),
        className: "px-6 py-3 bg-gradient-to-r from-[#008060] to-[#00a67c] text-white rounded-xl hover:shadow-lg transition-all",
        icon: CheckCircle
      });
    }

    if (currentStatus !== 'REJECTED') {
      actions.push({
        label: t('submissions.modal.reject'),
        action: () => handleStatusUpdate('REJECTED'),
        className: "px-6 py-3 bg-gradient-to-r from-[#FF5722] to-[#d84315] text-white rounded-xl hover:shadow-lg transition-all",
        icon: XCircle
      });
    }

    if (currentStatus !== 'IN_REVIEW' && currentStatus !== 'PENDING') {
      actions.push({
        label: t('submissions.modal.requestInfo'),
        action: () => handleStatusUpdate('IN_REVIEW'),
        className: "px-6 py-3 bg-gradient-to-r from-[#8D153A] to-[#a91b60] text-white rounded-xl hover:shadow-lg transition-all",
        icon: HelpCircle
      });
    }

    return actions;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-glow bg-card">
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#008060] to-[#FFC72C] bg-clip-text text-transparent">
              {t('submissions.modal.title')}
            </h2>
            <p className="text-sm text-muted-foreground">ID: {submission.submissionId}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-card/30 hover:bg-card/50 transition-colors" 
            aria-label="Close modal"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Applicant Name</span>
              <p className="font-medium text-foreground">{submission.applicantName}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Email</span>
              <p className="font-medium text-foreground">{submission.applicantEmail}</p>
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground block mb-1">Service</span>
            <p className="font-medium text-foreground">{submission.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Priority</span>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                submission.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                submission.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {submission.priority}
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Status</span>
              <CustomBadge>{submission.status}</CustomBadge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Assigned Agent</span>
              <p className="font-medium text-foreground">{submission.agentId || 'Unassigned'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Submitted On</span>
              <p className="font-medium text-foreground">{new Date(submission.submittedAt).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Last Updated</span>
              <p className="font-medium text-foreground">{new Date(submission.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 p-6 border-t border-border/30">
          <button 
            onClick={onClose} 
            className="px-6 py-3 bg-card/30 border border-border/50 rounded-xl hover:bg-card/50 transition-colors"
            disabled={loading}
          >
            {t('submissions.modal.close')}
          </button>
          
          {getStatusActions().map((action, index) => {
            const Icon = action.icon;
            return (
              <button 
                key={index}
                onClick={action.action}
                className={action.className}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepartmentSubmissionModal;