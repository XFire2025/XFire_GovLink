'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  UserCheck,
  MoreHorizontal,
  ShieldCheck,
  Users,
  UserCog,
  Trash,
  Loader2,
} from 'lucide-react';

// Types for UI mapping
type UIRole = 'user' | 'agent' | 'admin';
type UIStatus = 'active' | 'suspended' | 'pending';
type UIVerification = 'verified' | 'pending' | 'rejected';

interface UIUser {
  id: string;
  name: string;
  email: string;
  role: UIRole;
  status: UIStatus;
  verificationStatus: UIVerification;
  joinDate: string;
  lastActive: string;
}

interface UserManagementProps {
  userType: 'normal-users' | 'agents';
}

// Backend document interfaces
interface UserDocument {
  _id: string;
  fullName: string;
  email: string;
  role: 'citizen' | 'agent' | 'admin' | string;
  accountStatus:
    | 'active'
    | 'pending_verification'
    | 'under_review'
    | 'suspended'
    | 'deactivated'
    | string;
  verificationStatus:
    | 'unverified'
    | 'email_verified'
    | 'phone_verified'
    | 'documents_submitted'
    | 'partially_verified'
    | 'fully_verified'
    | 'verification_failed'
    | string;
  createdAt?: string;
  lastLoginAt?: string;

  // Optionals that may exist in your API
  nicNumber?: string;
  dateOfBirth?: string; // ISO
  mobileNumber?: string;
}

interface OfficeAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
}

interface AgentDocument {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt?: string;
  lastLoginAt?: string;

  // Optionals that may exist in your API
  officerId?: string;
  nicNumber?: string;
  position?: string;
  officeName?: string;
  officeAddress?: OfficeAddress;
  phoneNumber?: string;
}

// Form interfaces
interface CreateFormData {
  fullName: string;
  email: string;
  password: string;
  nicNumber: string;
  dateOfBirth: string;
  mobileNumber: string;
  officerId: string;
  position: string;
  officeName: string;
  officeAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    district: string;
    province: string;
    postalCode: string;
  };
  phoneNumber: string;
}

type RoleOption = 'citizen' | 'agent' | 'admin';
type AccountStatusOption =
  | 'active'
  | 'pending_verification'
  | 'under_review'
  | 'suspended'
  | 'deactivated';
type VerificationStatusOption =
  | 'unverified'
  | 'email_verified'
  | 'phone_verified'
  | 'documents_submitted'
  | 'partially_verified'
  | 'fully_verified'
  | 'verification_failed';

interface EditFormData {
  fullName?: string;
  email?: string;
  accountStatus?: AccountStatusOption;
  verificationStatus?: VerificationStatusOption;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

// Districts & Provinces for Agent creation
const SRI_LANKAN_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara',
  'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota',
  'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu',
  'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam',
  'Anuradhapura', 'Polonnaruwa',
  'Badulla', 'Moneragala',
  'Ratnapura', 'Kegalle'
] as const;

const SRI_LANKAN_PROVINCES = [
  'Western', 'Central', 'Southern', 'Northern', 'Eastern',
  'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
] as const;

function timeAgo(date?: string | Date | null) {
  if (!date) return '—';
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (Math.abs(minutes) < 60) return rtf.format(-minutes, 'minute');
  if (Math.abs(hours) < 24) return rtf.format(-hours, 'hour');
  return rtf.format(-days, 'day');
}

function mapUserDocToUI(doc: UserDocument): UIUser {
  const status: UIStatus =
    doc.accountStatus === 'active'
      ? 'active'
      : ['pending_verification', 'under_review'].includes(doc.accountStatus)
        ? 'pending'
        : 'suspended';

  const verificationStatus: UIVerification =
    doc.verificationStatus === 'fully_verified'
      ? 'verified'
      : doc.verificationStatus === 'verification_failed'
        ? 'rejected'
        : 'pending';

  const roleMap: Record<string, UIRole> = {
    citizen: 'user',
    agent: 'agent',
    admin: 'admin',
  };

  return {
    id: doc._id,
    name: doc.fullName,
    email: doc.email,
    role: roleMap[doc.role] || 'user',
    status,
    verificationStatus,
    joinDate: doc.createdAt ? new Date(doc.createdAt).toISOString().slice(0, 10) : '',
    lastActive: doc.lastLoginAt ? timeAgo(doc.lastLoginAt) : '—',
  };
}

function mapAgentDocToUI(doc: AgentDocument): UIUser {
  const status: UIStatus = !doc.isEmailVerified
    ? 'pending'
    : doc.isActive
      ? 'active'
      : 'suspended';

  const verificationStatus: UIVerification = doc.isEmailVerified ? 'verified' : 'pending';

  return {
    id: doc._id,
    name: doc.fullName,
    email: doc.email,
    role: 'agent',
    status,
    verificationStatus,
    joinDate: doc.createdAt ? new Date(doc.createdAt).toISOString().slice(0, 10) : '',
    lastActive: doc.lastLoginAt ? timeAgo(doc.lastLoginAt) : '—',
  };
}

function exportToCsv(filename: string, rows: UIUser[]) {
  const headers = ['Name', 'Email', 'Role', 'Status', 'Verification', 'Join Date', 'Last Active'];
  const csv = [
    headers.join(','),
    ...rows.map((r) =>
      [
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.email.replace(/"/g, '""')}"`,
        r.role,
        r.status,
        r.verificationStatus,
        r.joinDate,
        `"${r.lastActive.replace(/"/g, '""')}"`,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  link.click();
  URL.revokeObjectURL(link.href);
}

interface DetailsState {
  open: boolean;
  loading: boolean;
  item?: UIUser;
  raw?: UserDocument | AgentDocument;
  error?: string | null;
}

const ROLE_OPTIONS: Array<{ value: RoleOption; label: string }> = [
  { value: 'citizen', label: 'User (Citizen)' },
  { value: 'agent', label: 'Agent' },
  { value: 'admin', label: 'Admin' },
];

const ACCOUNT_STATUS_OPTIONS: Array<{ value: AccountStatusOption; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'pending_verification', label: 'Pending Verification' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'deactivated', label: 'Deactivated' },
];

const VERIFICATION_STATUS_OPTIONS: Array<{ value: VerificationStatusOption; label: string }> = [
  { value: 'unverified', label: 'Unverified' },
  { value: 'email_verified', label: 'Email Verified' },
  { value: 'phone_verified', label: 'Phone Verified' },
  { value: 'documents_submitted', label: 'Documents Submitted' },
  { value: 'partially_verified', label: 'Partially Verified' },
  { value: 'fully_verified', label: 'Fully Verified' },
  { value: 'verification_failed', label: 'Verification Failed' },
];

export default function UserManagement({ userType }: UserManagementProps) {
  const [items, setItems] = useState<UIUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UIStatus>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<{ open: boolean; item?: UIUser }>({ open: false });
  const [details, setDetails] = useState<DetailsState>({ open: false, loading: false, error: null });
  const endpoint = userType === 'agents' ? '/api/admin/agents' : '/api/admin/users';

  // Create form state (minimal required fields per model)
  const [createForm, setCreateForm] = useState<CreateFormData>({
    // Users
    fullName: '',
    email: '',
    password: '',
    nicNumber: '',
    dateOfBirth: '',
    mobileNumber: '',
    // Agents
    officerId: '',
    position: '',
    officeName: '',
    officeAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: SRI_LANKAN_DISTRICTS[0],
      province: SRI_LANKAN_PROVINCES[0],
      postalCode: '',
    },
    phoneNumber: '',
  });

  // Edit form state (quick updates only)
  const [editForm, setEditForm] = useState<EditFormData>({});

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        search: debouncedSearch,
        status: statusFilter,
        page: '1',
        limit: '50',
      } as Record<string, string>);
      const res = await fetch(`${endpoint}?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();

      const mapped: UIUser[] =
        userType === 'agents'
          ? (json.data as AgentDocument[]).map((doc) => mapAgentDocToUI(doc))
          : (json.data as UserDocument[]).map((doc) => mapUserDocToUI(doc));

      setItems(mapped);
    } catch (e) {
      const err = e as Error;
      setError(err?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter, userType]);

  const handleStatusChange = async (id: string, newStatus: 'active' | 'suspended') => {
    try {
      const url = `${endpoint}/${id}`;
      let payload: Record<string, unknown> = {};

      if (userType === 'agents') {
        payload = { isActive: newStatus === 'active', ...(newStatus === 'active' ? { isEmailVerified: true } : {}) };
      } else {
        const accountStatus: AccountStatusOption = newStatus === 'active' ? 'active' : 'suspended';
        payload = { accountStatus };
      }

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchData();
    } catch (e) {
      const err = e as Error;
      alert(err?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setItems((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      const err = e as Error;
      alert(err?.message || 'Delete failed');
    }
  };

  const handleCreate = async () => {
    try {
      const payload =
        userType === 'agents'
          ? {
              fullName: createForm.fullName,
              officerId: createForm.officerId,
              nicNumber: createForm.nicNumber,
              position: createForm.position,
              officeName: createForm.officeName,
              officeAddress: {
                addressLine1: createForm.officeAddress.addressLine1,
                addressLine2: createForm.officeAddress.addressLine2 || undefined,
                city: createForm.officeAddress.city,
                district: createForm.officeAddress.district,
                province: createForm.officeAddress.province,
                postalCode: createForm.officeAddress.postalCode,
              },
              phoneNumber: createForm.phoneNumber,
              email: createForm.email,
              password: createForm.password,
            }
          : {
              fullName: createForm.fullName,
              email: createForm.email,
              password: createForm.password,
              nicNumber: createForm.nicNumber,
              dateOfBirth: new Date(createForm.dateOfBirth),
              mobileNumber: createForm.mobileNumber,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setOpenCreate(false);
      setCreateForm({
        fullName: '',
        email: '',
        password: '',
        nicNumber: '',
        dateOfBirth: '',
        mobileNumber: '',
        officerId: '',
        position: '',
        officeName: '',
        officeAddress: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          district: SRI_LANKAN_DISTRICTS[0],
          province: SRI_LANKAN_PROVINCES[0],
          postalCode: '',
        },
        phoneNumber: '',
      });
      await fetchData();
    } catch (e) {
      const err = e as Error;
      alert(err?.message || 'Create failed');
    }
  };

  const handleEditOpen = (item: UIUser) => {
    setOpenEdit({ open: true, item });
    if (userType === 'agents') {
      setEditForm({
        fullName: item.name,
        email: item.email,
        isActive: item.status === 'active',
        isEmailVerified: item.verificationStatus === 'verified',
      });
    } else {
      // normal-users quick fields
      setEditForm({
        fullName: item.name,
        email: item.email,
        accountStatus:
          item.status === 'active'
            ? 'active'
            : item.status === 'pending'
              ? 'pending_verification'
              : 'suspended',
        verificationStatus:
          item.verificationStatus === 'verified'
            ? 'fully_verified'
            : item.verificationStatus === 'rejected'
              ? 'verification_failed'
              : 'unverified',
      });
    }
  };

  const handleEditSave = async () => {
    if (!openEdit.item) return;
    try {
      const res = await fetch(`${endpoint}/${openEdit.item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error(await res.text());
      setOpenEdit({ open: false });
      await fetchData();
    } catch (e) {
      const err = e as Error;
      alert(err?.message || 'Update failed');
    }
  };

  const handleViewDetails = async (item: UIUser) => {
    setDetails({ open: true, loading: true, item, error: null });
    try {
      const res = await fetch(`${endpoint}/${item.id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      const rawJson: unknown = await res.json();

      let doc: UserDocument | AgentDocument;
      if (typeof rawJson === 'object' && rawJson !== null && 'data' in rawJson) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doc = (rawJson as { data: UserDocument | AgentDocument }).data;
      } else {
        doc = rawJson as UserDocument | AgentDocument;
      }

      setDetails((prev) => ({ ...prev, loading: false, raw: doc }));
    } catch (e) {
      const err = e as Error;
      setDetails((prev) => ({ ...prev, loading: false, error: err?.message || 'Failed to load details' }));
    }
  };

  const headerIcon = userType === 'agents' ? <UserCog className="w-8 h-8 text-[#8D153A]" /> : <Users className="w-8 h-8 text-[#8D153A]" />;

  const filteredUsers = items; // server already filters/sorts; keep simple

  const isAgentsList = userType === 'agents';

  const detailsTitle = useMemo(
    () => (isAgentsList ? 'Agent Details' : 'User Details'),
    [isAgentsList]
  );

  return (
    <div className="relative min-h-full">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
        >
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="flex items-center gap-3">
                {headerIcon}
                <span className="text-foreground">{isAgentsList ? 'Agent' : 'User'}</span>{' '}
                <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                  Management
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground">
              Manage {isAgentsList ? 'customer service agents' : 'regular users'} and their permissions
            </p>
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 modern-card"
          >
            <Plus className="w-4 h-4" />
            Add {isAgentsList ? 'Agent' : 'User'}
          </button>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-[#8D153A] transition-colors duration-300" />
            <input
              type="text"
              placeholder={`Search ${isAgentsList ? 'agents' : 'users'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | UIStatus)}
              className="px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <button
              onClick={() => exportToCsv(`${isAgentsList ? 'agents' : 'users'}-export.csv`, filteredUsers)}
              className="flex items-center gap-2 px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#008060]/50 transition-all duration-300 modern-card hover:shadow-md"
            >
              <Download className="w-4 h-4 text-[#008060]" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#8D153A]/5 to-[#FF5722]/5 border-b border-border/30">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">{isAgentsList ? 'Agent' : 'User'}</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">Verification</th>
                  <th className="text-left p-4 font-semibold text-foreground">Join Date</th>
                  <th className="text-left p-4 font-semibold text-foreground">Last Active</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                      </span>
                    </td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      No records found.
                    </td>
                  </tr>
                )}
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * index, duration: 0.25 }}
                    className="border-t border-border/20 hover:bg-card/30 transition-all duration-300 group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r rounded-full flex items-center justify-center border-2 shadow-md transition-all duration-300 group-hover:scale-110 ${
                            isAgentsList
                              ? 'from-[#8D153A]/20 to-[#FF5722]/20 border-[#8D153A]/30'
                              : 'from-[#008060]/20 to-[#FFC72C]/20 border-[#008060]/30'
                          }`}
                        >
                          <span className="text-sm font-bold text-foreground">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground group-hover:text-[#8D153A] transition-colors duration-300">
                            {user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                          user.status === 'active'
                            ? 'bg-[#008060]/10 text-[#008060] border-[#008060]/20'
                            : user.status === 'pending'
                            ? 'bg-[#FFC72C]/10 text-[#FFC72C] border-[#FFC72C]/20'
                            : 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20'
                        }`}
                      >
                        {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                        {user.status === 'pending' && <Clock className="w-3 h-3" />}
                        {user.status === 'suspended' && <XCircle className="w-3 h-3" />}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                          user.verificationStatus === 'verified'
                            ? 'bg-[#8D153A]/10 text-[#8D153A] border-[#8D153A]/20'
                            : user.verificationStatus === 'pending'
                            ? 'bg-[#FFC72C]/10 text-[#FFC72C] border-[#FFC72C]/20'
                            : 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20'
                        }`}
                      >
                        {user.verificationStatus === 'verified' && <ShieldCheck className="w-3 h-3" />}
                        {user.verificationStatus === 'pending' && <Clock className="w-3 h-3" />}
                        {user.verificationStatus === 'rejected' && <XCircle className="w-3 h-3" />}
                        {user.verificationStatus.charAt(0).toUpperCase() + user.verificationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-medium">{user.joinDate}</td>
                    <td className="p-4 text-sm text-muted-foreground font-medium">{user.lastActive}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 hover:bg-[#8D153A]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#8D153A]"
                          title="View Details"
                          onClick={() => handleViewDetails(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-[#FFC72C]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#FFC72C]"
                          title="Edit"
                          onClick={() => handleEditOpen(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(user.id, 'suspended')}
                            className="p-2 hover:bg-[#FF5722]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#FF5722]"
                            title="Suspend"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="p-2 hover:bg-[#008060]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#008060]"
                            title="Activate"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-all duration-300 hover:scale-110 text-red-500"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-muted/50 rounded-lg transition-all duration-300 hover:scale-110" title="More Actions">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Create Modal */}
      {openCreate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpenCreate(false)}>
          <div className="w-full max-w-2xl bg-card rounded-2xl border border-border/50 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Add {isAgentsList ? 'Agent' : 'User'}
              </h3>
              <button onClick={() => setOpenCreate(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            {isAgentsList ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="input" placeholder="Full Name" value={createForm.fullName} onChange={(e) => setCreateForm((f) => ({ ...f, fullName: e.target.value }))} />
                <input className="input" placeholder="Email" value={createForm.email} onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))} />
                <input className="input" placeholder="Password" type="password" value={createForm.password} onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))} />
                <input className="input" placeholder="Phone Number (e.g., 0771234567)" value={createForm.phoneNumber} onChange={(e) => setCreateForm((f) => ({ ...f, phoneNumber: e.target.value }))} />
                <input className="input" placeholder="Officer ID" value={createForm.officerId} onChange={(e) => setCreateForm((f) => ({ ...f, officerId: e.target.value }))} />
                <input className="input" placeholder="NIC Number (9V/12 digits)" value={createForm.nicNumber} onChange={(e) => setCreateForm((f) => ({ ...f, nicNumber: e.target.value }))} />
                <input className="input" placeholder="Position" value={createForm.position} onChange={(e) => setCreateForm((f) => ({ ...f, position: e.target.value }))} />
                <input className="input" placeholder="Office Name" value={createForm.officeName} onChange={(e) => setCreateForm((f) => ({ ...f, officeName: e.target.value }))} />
                <input className="input md:col-span-2" placeholder="Office Address Line 1" value={createForm.officeAddress.addressLine1} onChange={(e) => setCreateForm((f) => ({ ...f, officeAddress: { ...f.officeAddress, addressLine1: e.target.value } }))} />
                <input className="input md:col-span-2" placeholder="Office Address Line 2 (optional)" value={createForm.officeAddress.addressLine2} onChange={(e) => setCreateForm((f) => ({ ...f, officeAddress: { ...f.officeAddress, addressLine2: e.target.value } }))} />
                <input className="input" placeholder="City" value={createForm.officeAddress.city} onChange={(e) => setCreateForm((f) => ({ ...f, officeAddress: { ...f.officeAddress, city: e.target.value } }))} />
                <select className="input" value={createForm.officeAddress.district} onChange={(e) => setCreateForm((f) => ({ ...f, officeAddress: { ...f.officeAddress, district: e.target.value } }))}>
                  {SRI_LANKAN_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select className="input" value={createForm.officeAddress.province} onChange={(e) => setCreateForm((f) => ({ ...f, officeAddress: { ...f.officeAddress, province: e.target.value } }))}>
                  {SRI_LANKAN_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <input className="input" placeholder="Postal Code (5 digits)" value={createForm.officeAddress.postalCode} onChange={(e) => setCreateForm((f) => ({ ...f, officeAddress: { ...f.officeAddress, postalCode: e.target.value } }))} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="input" placeholder="Full Name" value={createForm.fullName} onChange={(e) => setCreateForm((f) => ({ ...f, fullName: e.target.value }))} />
                <input className="input" placeholder="Email" value={createForm.email} onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))} />
                <input className="input" placeholder="Password" type="password" value={createForm.password} onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))} />
                <input className="input" placeholder="NIC Number (9V/12 digits)" value={createForm.nicNumber} onChange={(e) => setCreateForm((f) => ({ ...f, nicNumber: e.target.value }))} />
                <input className="input" type="date" placeholder="Date of Birth" value={createForm.dateOfBirth} onChange={(e) => setCreateForm((f) => ({ ...f, dateOfBirth: e.target.value }))} />
                <input className="input" placeholder="Mobile Number (e.g., 0771234567)" value={createForm.mobileNumber} onChange={(e) => setCreateForm((f) => ({ ...f, mobileNumber: e.target.value }))} />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setOpenCreate(false)} className="px-4 py-2 rounded-lg border border-border/50 hover:bg-muted/30">
                Cancel
              </button>
              <button onClick={handleCreate} className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#8D153A] to-[#FF5722] hover:shadow-lg">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {details.open && details.item && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDetails({ open: false, loading: false })}>
          <div className="w-full max-w-2xl bg-card rounded-2xl border border-border/50 p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{detailsTitle}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (details.item) {
                      handleEditOpen(details.item);
                      setDetails((prev) => ({ ...prev, open: false }));
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-border/50 hover:bg-muted/30 text-sm flex items-center gap-1"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button onClick={() => setDetails({ open: false, loading: false })} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>
            </div>

            {/* Header with avatar */}
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r rounded-full flex items-center justify-center border-2 shadow-md ${
                  isAgentsList
                    ? 'from-[#8D153A]/20 to-[#FF5722]/20 border-[#8D153A]/30'
                    : 'from-[#008060]/20 to-[#FFC72C]/20 border-[#008060]/30'
                }`}
              >
                <span className="text-base font-bold text-foreground">
                  {details.item.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-lg font-semibold">{details.item.name}</div>
                <div className="text-sm text-muted-foreground">{details.item.email}</div>
              </div>
            </div>

            {/* Body */}
            {details.loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading details...
              </div>
            ) : details.error ? (
              <div className="text-red-500">{details.error}</div>
            ) : (
              <div className="space-y-6">
                {/* Status row */}
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      details.item.status === 'active'
                        ? 'bg-[#008060]/10 text-[#008060] border-[#008060]/20'
                        : details.item.status === 'pending'
                        ? 'bg-[#FFC72C]/10 text-[#FFC72C] border-[#FFC72C]/20'
                        : 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20'
                    }`}
                  >
                    {details.item.status === 'active' && <CheckCircle className="w-3 h-3" />}
                    {details.item.status === 'pending' && <Clock className="w-3 h-3" />}
                    {details.item.status === 'suspended' && <XCircle className="w-3 h-3" />}
                    {details.item.status.charAt(0).toUpperCase() + details.item.status.slice(1)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      details.item.verificationStatus === 'verified'
                        ? 'bg-[#8D153A]/10 text-[#8D153A] border-[#8D153A]/20'
                        : details.item.verificationStatus === 'pending'
                        ? 'bg-[#FFC72C]/10 text-[#FFC72C] border-[#FFC72C]/20'
                        : 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20'
                    }`}
                  >
                    {details.item.verificationStatus === 'verified' && <ShieldCheck className="w-3 h-3" />}
                    {details.item.verificationStatus === 'pending' && <Clock className="w-3 h-3" />}
                    {details.item.verificationStatus === 'rejected' && <XCircle className="w-3 h-3" />}
                    {details.item.verificationStatus.charAt(0).toUpperCase() + details.item.verificationStatus.slice(1)}
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailRow label="Role" value={details.item.role.toUpperCase()} />
                  <DetailRow label="Join Date" value={details.item.joinDate || '—'} />
                  <DetailRow label="Last Active" value={details.item.lastActive || '—'} />

                  {/* Extra fields if returned by backend */}
                  {isAgentsList ? (
                    <>
                      <DetailRow label="Active" value={(details.raw as AgentDocument)?.isActive ? 'Yes' : 'No'} />
                      <DetailRow label="Email Verified" value={(details.raw as AgentDocument)?.isEmailVerified ? 'Yes' : 'No'} />
                      {(details.raw as AgentDocument)?.officerId && (
                        <DetailRow label="Officer ID" value={(details.raw as AgentDocument).officerId!} />
                      )}
                      {(details.raw as AgentDocument)?.position && (
                        <DetailRow label="Position" value={(details.raw as AgentDocument).position!} />
                      )}
                      {(details.raw as AgentDocument)?.phoneNumber && (
                        <DetailRow label="Phone" value={(details.raw as AgentDocument).phoneNumber!} />
                      )}
                      {(details.raw as AgentDocument)?.nicNumber && (
                        <DetailRow label="NIC" value={(details.raw as AgentDocument).nicNumber!} />
                      )}
                      {(details.raw as AgentDocument)?.officeName && (
                        <DetailRow label="Office" value={(details.raw as AgentDocument).officeName!} />
                      )}
                      {(details.raw as AgentDocument)?.officeAddress && (
                        <div className="md:col-span-2">
                          <div className="text-sm text-muted-foreground mb-1">Office Address</div>
                          <div className="rounded-lg border border-border/50 p-3 text-sm">
                            <div>{(details.raw as AgentDocument).officeAddress?.addressLine1}</div>
                            {(details.raw as AgentDocument).officeAddress?.addressLine2 && (
                              <div>{(details.raw as AgentDocument).officeAddress?.addressLine2}</div>
                            )}
                            <div>
                              {(details.raw as AgentDocument).officeAddress?.city}
                              {', '}
                              {(details.raw as AgentDocument).officeAddress?.district}
                              {', '}
                              {(details.raw as AgentDocument).officeAddress?.province}{' '}
                              {(details.raw as AgentDocument).officeAddress?.postalCode}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {(details.raw as UserDocument)?.nicNumber && (
                        <DetailRow label="NIC" value={(details.raw as UserDocument).nicNumber!} />
                      )}
                      {(details.raw as UserDocument)?.mobileNumber && (
                        <DetailRow label="Mobile" value={(details.raw as UserDocument).mobileNumber!} />
                      )}
                      {(details.raw as UserDocument)?.dateOfBirth && (
                        <DetailRow
                          label="Date of Birth"
                          value={new Date((details.raw as UserDocument).dateOfBirth!).toISOString().slice(0, 10)}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {openEdit.open && openEdit.item && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpenEdit({ open: false })}>
          <div className="w-full max-w-xl bg-card rounded-2xl border border-border/50 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Edit {isAgentsList ? 'Agent' : 'User'}</h3>
              <button onClick={() => setOpenEdit({ open: false })} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            {isAgentsList ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="input" placeholder="Full Name" value={editForm.fullName || ''} onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))} />
                <input className="input" placeholder="Email" value={editForm.email || ''} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!editForm.isActive} onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!editForm.isEmailVerified} onChange={(e) => setEditForm((f) => ({ ...f, isEmailVerified: e.target.checked }))} /> Email Verified
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className="input" placeholder="Full Name" value={editForm.fullName || ''} onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))} />
                  <input className="input" placeholder="Email" value={editForm.email || ''} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                

              

                {/* Account Status pill group */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Account Status</div>
                  <div className="flex flex-wrap gap-2">
                    {ACCOUNT_STATUS_OPTIONS.map((opt) => {
                      const active = editForm.accountStatus === opt.value || (!editForm.accountStatus && opt.value === 'active');
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => setEditForm((f) => ({ ...f, accountStatus: opt.value }))}
                          className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                            active ? 'bg-[#008060]/10 border-[#008060]/30 text-foreground' : 'border-border/50 text-muted-foreground hover:bg-muted/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Verification Status pill group */}
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Verification Status</div>
                  <div className="flex flex-wrap gap-2">
                    {VERIFICATION_STATUS_OPTIONS.map((opt) => {
                      const active = editForm.verificationStatus === opt.value || (!editForm.verificationStatus && opt.value === 'unverified');
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => setEditForm((f) => ({ ...f, verificationStatus: opt.value }))}
                          className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                            active ? 'bg-[#FFC72C]/10 border-[#FFC72C]/30 text-foreground' : 'border-border/50 text-muted-foreground hover:bg-muted/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setOpenEdit({ open: false })} className="px-4 py-2 rounded-lg border border-border/50 hover:bg-muted/30">
                Cancel
              </button>
              <button onClick={handleEditSave} className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#8D153A] to-[#FF5722] hover:shadow-lg">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input {
          @apply w-full px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md;
        }
      `}</style>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 p-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-medium text-foreground text-right">{value || '—'}</div>
    </div>
  );
}