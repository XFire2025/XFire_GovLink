"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserX,
  User,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Calendar,
  Mail,
  Phone,
  MessageCircle,
  Eye,
  RotateCcw,
  Search,
  Filter,
  Download
} from 'lucide-react';


interface SuspendedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'agent';
  suspensionReason: string;
  suspensionType: 'temporary' | 'permanent';
  suspendedDate: string;
  suspendedBy: string;
  appealStatus: 'none' | 'pending' | 'approved' | 'rejected';
  appealDate?: string;
  appealReason?: string;
  reactivationDate?: string;
  violationLevel: 'minor' | 'major' | 'severe';
  previousViolations: number;
  status: 'suspended' | 'appeal_pending' | 'reactivated';
}

const AccountSuspension = () => {
  const [suspendedUsers, setSuspendedUsers] = useState<SuspendedUser[]>([
    {
      id: 'SUS001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+94 77 234 5678',
      role: 'user',
      suspensionReason: 'Multiple failed verification attempts and suspicious activity',
      suspensionType: 'temporary',
      suspendedDate: '2024-01-20T10:30:00Z',
      suspendedBy: 'Admin System',
      appealStatus: 'pending',
      appealDate: '2024-01-22T14:15:00Z',
      appealReason: 'Account was compromised, I have secured it now',
      reactivationDate: '2024-01-27T10:30:00Z',
      violationLevel: 'major',
      previousViolations: 2,
      status: 'appeal_pending'
    },
    {
      id: 'SUS002',
      name: 'Priya Mendis',
      email: 'priya.mendis@company.lk',
      phone: '+94 11 345 6789',
      role: 'agent',
      suspensionReason: 'Unauthorized access to sensitive user data',
      suspensionType: 'permanent',
      suspendedDate: '2024-01-18T16:45:00Z',
      suspendedBy: 'Security Team',
      appealStatus: 'rejected',
      appealDate: '2024-01-19T09:20:00Z',
      appealReason: 'Data access was for legitimate customer support',
      violationLevel: 'severe',
      previousViolations: 1,
      status: 'suspended'
    },
    {
      id: 'SUS003',
      name: 'Tharaka Silva',
      email: 'tharaka.silva@email.com',
      phone: '+94 70 456 7890',
      role: 'user',
      suspensionReason: 'Spam and abusive behavior in chat system',
      suspensionType: 'temporary',
      suspendedDate: '2024-01-19T11:20:00Z',
      suspendedBy: 'Moderation System',
      appealStatus: 'none',
      reactivationDate: '2024-01-24T11:20:00Z',
      violationLevel: 'minor',
      previousViolations: 0,
      status: 'suspended'
    }
  ]);

  const [selectedUser, setSelectedUser] = useState<SuspendedUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredUsers = suspendedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesType = typeFilter === 'all' || user.suspensionType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAppealDecision = (userId: string, decision: 'approved' | 'rejected') => {
    setSuspendedUsers(users =>
      users.map(user =>
        user.id === userId
          ? {
              ...user,
              appealStatus: decision,
              status: decision === 'approved' ? 'reactivated' : 'suspended'
            }
          : user
      )
    );
  };

  const handleReactivate = (userId: string) => {
    setSuspendedUsers(users =>
      users.map(user =>
        user.id === userId
          ? { ...user, status: 'reactivated' }
          : user
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'suspended': return 'text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/20';
      case 'appeal_pending': return 'text-[#FFC72C] bg-[#FFC72C]/10 border-[#FFC72C]/20';
      case 'reactivated': return 'text-[#008060] bg-[#008060]/10 border-[#008060]/20';
      default: return 'text-muted-foreground bg-muted/10 border-border/20';
    }
  };

  const getViolationColor = (level: string) => {
    switch (level) {
      case 'minor': return 'text-[#FFC72C]';
      case 'major': return 'text-[#FF5722]';
      case 'severe': return 'text-[#8D153A]';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (user: SuspendedUser) => {
    if (user.suspensionType === 'permanent') return false;
    if (!user.reactivationDate) return false;
    return new Date(user.reactivationDate) <= new Date();
  };

  return (
    <div className="relative min-h-full">
      {/* Main content */}
      <div className="space-y-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="animate-fade-in-up"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <span className="flex items-center gap-3">
              <UserX className="w-8 h-8 text-[#FF5722]" />
              <span className="text-foreground">Account Suspension</span>{' '}
              <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                Management
              </span>
            </span>
          </h1>
          <p className="text-muted-foreground">
            Monitor suspended accounts, handle appeals, and manage reactivations.
          </p>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#FF5722]/20 to-[#FF5722]/10 group-hover:scale-110 transition-transform duration-300">
                <UserX className="w-6 h-6 text-[#FF5722]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {suspendedUsers.filter(u => u.status === 'suspended').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Suspensions</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#FFC72C]/20 to-[#FFC72C]/10 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-[#FFC72C]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {suspendedUsers.filter(u => u.appealStatus === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Appeals</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#FF5722]/20 to-[#FFC72C]/10 group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="w-6 h-6 text-[#FF5722]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {suspendedUsers.filter(u => isExpired(u) && u.status === 'suspended').length}
                </div>
                <div className="text-sm text-muted-foreground">Expired Suspensions</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#008060]/20 to-[#008060]/10 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-[#008060]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {suspendedUsers.filter(u => u.status === 'reactivated').length}
                </div>
                <div className="text-sm text-muted-foreground">Reactivated</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-[#FF5722] transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search suspended users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722]/50 transition-all duration-300 modern-card hover:shadow-md"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722]/50 transition-all duration-300 modern-card hover:shadow-md"
            >
              <option value="all">All Status</option>
              <option value="suspended">Suspended</option>
              <option value="appeal_pending">Appeal Pending</option>
              <option value="reactivated">Reactivated</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722]/50 transition-all duration-300 modern-card hover:shadow-md"
            >
              <option value="all">All Types</option>
              <option value="temporary">Temporary</option>
              <option value="permanent">Permanent</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#FFC72C]/50 transition-all duration-300 modern-card hover:shadow-md">
              <Filter className="w-4 h-4 text-[#FFC72C]" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#008060]/50 transition-all duration-300 modern-card hover:shadow-md">
              <Download className="w-4 h-4 text-[#008060]" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Enhanced Suspended Users List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="grid gap-6"
        >
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl hover:border-[#FF5722]/30 transition-all duration-500 modern-card group"
            >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* User Information */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#FF5722]/20 to-[#FF5722]/30 rounded-full flex items-center justify-center border-2 border-[#FF5722]/30 shadow-md transition-all duration-300 group-hover:scale-110">
                        <UserX className="w-6 h-6 text-[#FF5722]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-[#FF5722] transition-colors duration-300">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • ID: {user.id}
                        </p>
                      </div>
                  </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getStatusColor(user.status)}`}>
                        {user.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {isExpired(user) && user.status === 'suspended' && (
                        <span className="px-2 py-1 bg-[#FFC72C]/10 text-[#FFC72C] border border-[#FFC72C]/20 rounded text-xs font-semibold transition-all duration-300 hover:scale-105">
                          EXPIRED
                        </span>
                      )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Suspended: {formatDate(user.suspendedDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>By: {user.suspendedBy}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-medium">Suspension Type:</span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                        user.suspensionType === 'temporary' 
                          ? 'bg-[#FFC72C]/10 text-[#FFC72C] border-[#FFC72C]/20'
                          : 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20'
                      }`}>
                        {user.suspensionType.toUpperCase()}
                      </span>
                    <span className="text-sm font-medium">Violation Level:</span>
                    <span className={`text-sm font-medium ${getViolationColor(user.violationLevel)}`}>
                      {user.violationLevel.toUpperCase()}
                    </span>
                  </div>
                  {user.reactivationDate && (
                    <div className="text-sm text-muted-foreground">
                      Auto-reactivation: {formatDate(user.reactivationDate)}
                    </div>
                  )}
                  {user.previousViolations > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Previous violations: {user.previousViolations}
                    </div>
                  )}
                </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Suspension Reason:</h4>
                    <div className="p-3 bg-[#FF5722]/5 border border-[#FF5722]/20 rounded-lg backdrop-blur-sm">
                      <p className="text-sm text-foreground">{user.suspensionReason}</p>
                    </div>
                  </div>

                {user.appealStatus !== 'none' && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-foreground">Appeal Status:</h4>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                          user.appealStatus === 'pending' 
                            ? 'bg-[#FFC72C]/10 text-[#FFC72C] border-[#FFC72C]/20'
                            : user.appealStatus === 'approved'
                            ? 'bg-[#008060]/10 text-[#008060] border-[#008060]/20'
                            : 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20'
                        }`}>
                          {user.appealStatus.toUpperCase()}
                        </span>
                    </div>
                    {user.appealDate && (
                      <div className="text-sm text-muted-foreground mb-2">
                        Appeal submitted: {formatDate(user.appealDate)}
                      </div>
                    )}
                      {user.appealReason && (
                        <div className="p-3 bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg">
                          <p className="text-sm text-foreground">{user.appealReason}</p>
                        </div>
                      )}
                  </div>
                )}
              </div>

                {/* Enhanced Actions */}
                <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#8D153A]/50 transition-all duration-300 hover:scale-105 modern-card"
                  >
                    <Eye className="w-4 h-4 text-[#8D153A]" />
                    View Details
                  </button>
                  
                  {user.appealStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAppealDecision(user.id, 'approved')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#008060] to-[#008060]/90 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve Appeal
                      </button>
                      <button
                        onClick={() => handleAppealDecision(user.id, 'rejected')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FF5722] to-[#FF5722]/90 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Appeal
                      </button>
                    </>
                  )}
                  
                  {(user.status === 'suspended' && (isExpired(user) || user.suspensionType === 'temporary')) && (
                    <button
                      onClick={() => handleReactivate(user.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8D153A] to-[#8D153A]/90 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reactivate
                    </button>
                  )}
                  
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#FFC72C]/50 transition-all duration-300 hover:scale-105 modern-card">
                    <MessageCircle className="w-4 h-4 text-[#FFC72C]" />
                    Contact User
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredUsers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-center py-12 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 modern-card"
          >
            <User className="w-16 h-16 text-[#8D153A]/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Suspended Users</h3>
            <p className="text-muted-foreground">No suspended users match the selected filters.</p>
          </motion.div>
        )}

        {/* Enhanced Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card/95 dark:bg-card/98 backdrop-blur-md border border-border/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl modern-card"
            >
              <div className="p-6 border-b border-border/30 bg-gradient-to-r from-[#FF5722]/5 to-[#8D153A]/5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                    <UserX className="w-6 h-6 text-[#FF5722]" />
                    <span>Suspension Details</span>
                  </h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-[#FF5722]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#FF5722]"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-r from-[#8D153A]/5 to-[#FF5722]/5 p-4 rounded-lg border border-border/30">
                  <p className="text-muted-foreground text-center">Detailed suspension management interface would be implemented here with full user history, violation records, and administrative actions.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSuspension;
