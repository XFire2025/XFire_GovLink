// src/components/department/SubmissionManagement.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, FileText, CheckCircle, XCircle, Clock, HelpCircle, RefreshCw, AlertCircle, Loader } from "lucide-react";
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';
import DepartmentSubmissionModal from "./DepartmentSubmissionModal";
import { useSubmissions, useSubmissionMutations } from "@/lib/hooks/useDepartmentApi";
import { Submission } from "@/lib/services/departmentApiService";

export default function SubmissionManagement() {
  const { t } = useTranslation('department');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filters, setFilters] = useState<{
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }>({ limit: 20, offset: 0 });

  // Use API hooks
  const { data: submissionsData, loading, error, refetch } = useSubmissions(filters);
  const { updateSubmission, loading: mutationLoading } = useSubmissionMutations();

  // Update filters when search term or status changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ 
        ...prev, 
        search: searchTerm || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        offset: 0 // Reset to first page when filters change
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  const submissions = submissionsData?.submissions || [];

  const openModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (submissionId: string, newStatus: string) => {
    try {
      await updateSubmission(submissionId, { status: newStatus });
      await refetch();
    } catch (error) {
      console.error('Failed to update submission status:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') {
      setStatusFilter(value);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: Record<string, { text: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
      PENDING: { text: t('submissions.pending'), icon: Clock, color: 'text-[#FFC72C] bg-[#FFC72C]/10' },
      CONFIRMED: { text: 'Confirmed', icon: CheckCircle, color: 'text-[#008060] bg-[#008060]/10' },
      CANCELLED: { text: 'Cancelled', icon: XCircle, color: 'text-[#FF5722] bg-[#FF5722]/10' },
      COMPLETED: { text: t('submissions.completed'), icon: CheckCircle, color: 'text-[#008060] bg-[#008060]/10' },
      APPROVED: { text: t('submissions.approved'), icon: CheckCircle, color: 'text-[#008060] bg-[#008060]/10' },
      REJECTED: { text: t('submissions.rejected'), icon: XCircle, color: 'text-[#FF5722] bg-[#FF5722]/10' },
      IN_REVIEW: { text: t('submissions.inReview'), icon: HelpCircle, color: 'text-[#8D153A] bg-[#8D153A]/10' },
    };
    
    const statusInfo = statusMap[status] || { 
      text: status, 
      icon: HelpCircle, 
      color: 'text-muted-foreground bg-muted' 
    };
    
    const { text, icon: Icon, color } = statusInfo;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${color}`}>
        <Icon className="w-3 h-3" />
        {text}
      </span>
    );
  };

  return (
    <div className="relative min-h-full w-full">
      <div className="space-y-8 w-full max-w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#008060]" />
                Appointments Management
              </h1>
              <p className="text-muted-foreground">Review, process, and manage all citizen appointments for your department.</p>
            </div>
            <button 
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder={t('submissions.searchPlaceholder')} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]/50 modern-card" 
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => handleFilterChange('status', e.target.value)} 
              className="px-3 py-2.5 bg-card/60 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]/50 modern-card"
            >
              <option value="all">{t('submissions.all')}</option>
              <option value="PENDING">{t('submissions.pending')}</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">{t('submissions.completed')}</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="IN_REVIEW">{t('submissions.inReview')}</option>
              <option value="APPROVED">{t('submissions.approved')}</option>
              <option value="REJECTED">{t('submissions.rejected')}</option>
            </select>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/10 backdrop-blur-md p-4 rounded-xl border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">Failed to load submissions</h3>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
              <button
                onClick={refetch}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/90 modern-card rounded-2xl border border-border/50 shadow-glow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 animate-spin text-[#008060]" />
                <span className="text-muted-foreground">Loading submissions...</span>
              </div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No appointments found</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#008060]/5 to-[#FF5722]/5 border-b border-border/30">
                  <tr>
                    <th className="p-4 text-left font-semibold">Citizen</th>
                    <th className="p-4 text-left font-semibold">Appointment Details</th>
                    <th className="p-4 text-left font-semibold">Priority</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Submitted On</th>
                    <th className="p-4 text-left font-semibold">Agent</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="border-t border-border/20 hover:bg-card/30">
                      <td className="p-4">
                        <div className="font-medium">{sub.applicantName}</div>
                        <div className="text-sm text-muted-foreground">{sub.applicantEmail}</div>
                        {sub.citizenNIC && (
                          <div className="text-xs text-muted-foreground">NIC: {sub.citizenNIC}</div>
                        )}
                        {sub.contactPhone && (
                          <div className="text-xs text-muted-foreground">📱 {sub.contactPhone}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{sub.title}</div>
                        <div className="text-sm text-muted-foreground">Ref: {sub.bookingReference || sub.submissionId}</div>
                        {sub.appointmentDate && (
                          <div className="text-sm text-blue-600">
                            📅 {new Date(sub.appointmentDate).toLocaleDateString()} at {sub.appointmentTime}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sub.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                          sub.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {sub.priority}
                        </span>
                      </td>
                      <td className="p-4"><StatusBadge status={sub.status} /></td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {sub.agentName ? (
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{sub.agentName}</div>
                            <div className="text-xs text-muted-foreground">{sub.agentEmail}</div>
                            {sub.agentStatus === 'INACTIVE' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 mt-1">
                                Inactive
                              </span>
                            )}
                          </div>
                        ) : sub.status === 'PENDING' ? (
                          <span className="text-orange-600 font-medium">Unaccepted</span>
                        ) : (
                          <span className="text-gray-500">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => openModal(sub)} 
                          className="p-2 hover:bg-[#008060]/10 rounded-lg text-[#008060]" 
                          title="View Details"
                          disabled={mutationLoading}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {submissionsData && submissionsData.total > filters.limit! && (
            <div className="p-4 border-t border-border/30 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filters.offset! + 1} to {Math.min(filters.offset! + filters.limit!, submissionsData.total)} of {submissionsData.total} submissions
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, offset: Math.max(0, prev.offset! - prev.limit!) }))}
                  disabled={filters.offset === 0 || loading}
                  className="px-3 py-1 text-sm bg-card border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, offset: prev.offset! + prev.limit! }))}
                  disabled={filters.offset! + filters.limit! >= submissionsData.total || loading}
                  className="px-3 py-1 text-sm bg-card border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <DepartmentSubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        submission={selectedSubmission}
        onStatusUpdate={handleStatusUpdate}
        loading={mutationLoading}
      />
    </div>
  );
}