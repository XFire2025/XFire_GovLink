// src/components/department/SubmissionManagement.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, FileText, CheckCircle, XCircle, Clock, HelpCircle } from "lucide-react";
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';
import DepartmentSubmissionModal from "./DepartmentSubmissionModal";

type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'needs_info';

interface Submission {
  id: string;
  citizenName: string;
  citizenId: string;
  serviceName: string;
  submittedDate: string;
  status: SubmissionStatus;
}

export default function SubmissionManagement() {
  const { t } = useTranslation('department');
  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: 'SUB-001', citizenName: 'Amal Perera', citizenId: '199012345V', serviceName: 'New Passport Application', submittedDate: '2024-05-20T10:30:00Z', status: 'pending' },
    { id: 'SUB-002', citizenName: 'Saman Silva', citizenId: '198554321V', serviceName: 'Passport Renewal', submittedDate: '2024-05-19T14:00:00Z', status: 'approved' },
    { id: 'SUB-003', citizenName: 'Kamala Fernando', citizenId: '199298765V', serviceName: 'New Passport Application', submittedDate: '2024-05-18T09:00:00Z', status: 'rejected' },
    { id: 'SUB-004', citizenName: 'Nimal Jayasuriya', citizenId: '197811223V', serviceName: 'ID Card Correction', submittedDate: '2024-05-21T11:00:00Z', status: 'needs_info' },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) || s.citizenId.toLowerCase().includes(searchTerm.toLowerCase()) || s.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const StatusBadge = ({ status }: { status: SubmissionStatus }) => {
    const statusMap = {
      pending: { text: t('submissions.pending'), icon: Clock, color: 'text-[#FFC72C] bg-[#FFC72C]/10' },
      approved: { text: t('submissions.approved'), icon: CheckCircle, color: 'text-[#008060] bg-[#008060]/10' },
      rejected: { text: t('submissions.rejected'), icon: XCircle, color: 'text-[#FF5722] bg-[#FF5722]/10' },
      needs_info: { text: t('submissions.needsInfo'), icon: HelpCircle, color: 'text-[#8D153A] bg-[#8D153A]/10' },
    };
    const { text, icon: Icon, color } = statusMap[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${color}`}>
        <Icon className="w-3 h-3" />
        {text}
      </span>
    );
  };

  return (
    <div className="relative min-h-full">
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#008060]" />
            {t('submissions.title')}
          </h1>
          <p className="text-muted-foreground">{t('submissions.description')}</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder={t('submissions.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-border/50 rounded-xl modern-card" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | 'all')} className="px-3 py-2.5 bg-card/60 border border-border/50 rounded-xl modern-card">
            <option value="all">{t('submissions.all')}</option>
            <option value="pending">{t('submissions.pending')}</option>
            <option value="approved">{t('submissions.approved')}</option>
            <option value="rejected">{t('submissions.rejected')}</option>
            <option value="needs_info">{t('submissions.needsInfo')}</option>
          </select>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/90 modern-card rounded-2xl border border-border/50 shadow-glow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#008060]/5 to-[#FF5722]/5 border-b border-border/30">
                <tr>
                  <th className="p-4 text-left font-semibold">{t('submissions.table.citizen')}</th>
                  <th className="p-4 text-left font-semibold">{t('submissions.table.service')}</th>
                  <th className="p-4 text-left font-semibold">{t('submissions.table.status')}</th>
                  <th className="p-4 text-left font-semibold">{t('submissions.table.submittedOn')}</th>
                  <th className="p-4 text-left font-semibold">{t('submissions.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="border-t border-border/20 hover:bg-card/30">
                    <td className="p-4">
                      <div className="font-medium">{sub.citizenName}</div>
                      <div className="text-sm text-muted-foreground font-mono">{sub.citizenId}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">{sub.serviceName}</td>
                    <td className="p-4"><StatusBadge status={sub.status} /></td>
                    <td className="p-4 text-muted-foreground">{new Date(sub.submittedDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button onClick={() => openModal(sub)} className="p-2 hover:bg-[#008060]/10 rounded-lg text-[#008060]" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <DepartmentSubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} submission={selectedSubmission} />
    </div>
  );
}