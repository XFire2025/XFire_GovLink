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
      case 'suspended': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'appeal_pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'reactivated': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getViolationColor = (level: string) => {
    switch (level) {
      case 'minor': return 'text-yellow-600';
      case 'major': return 'text-orange-600';
      case 'severe': return 'text-red-600';
      default: return 'text-gray-600';
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Account Suspension Management</h1>
        <p className="text-muted-foreground">
          Monitor suspended accounts, handle appeals, and manage reactivations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <UserX className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {suspendedUsers.filter(u => u.status === 'suspended').length}
              </div>
              <div className="text-sm text-muted-foreground">Active Suspensions</div>
            </div>
          </div>
        </div>
        
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {suspendedUsers.filter(u => u.appealStatus === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Appeals</div>
            </div>
          </div>
        </div>
        
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {suspendedUsers.filter(u => isExpired(u) && u.status === 'suspended').length}
              </div>
              <div className="text-sm text-muted-foreground">Expired Suspensions</div>
            </div>
          </div>
        </div>
        
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {suspendedUsers.filter(u => u.status === 'reactivated').length}
              </div>
              <div className="text-sm text-muted-foreground">Reactivated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search suspended users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="suspended">Suspended</option>
            <option value="appeal_pending">Appeal Pending</option>
            <option value="reactivated">Reactivated</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Types</option>
            <option value="temporary">Temporary</option>
            <option value="permanent">Permanent</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Suspended Users List */}
      <div className="grid gap-6">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism p-6 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* User Information */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-red-600/30 rounded-full flex items-center justify-center">
                      <UserX className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • ID: {user.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {isExpired(user) && user.status === 'suspended' && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded text-xs">
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
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.suspensionType === 'temporary' 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
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
                  <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm">{user.suspensionReason}</p>
                  </div>
                </div>

                {user.appealStatus !== 'none' && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-foreground">Appeal Status:</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.appealStatus === 'pending' 
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : user.appealStatus === 'approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
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
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm">{user.appealReason}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                
                {user.appealStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAppealDecision(user.id, 'approved')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Appeal
                    </button>
                    <button
                      onClick={() => handleAppealDecision(user.id, 'rejected')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Appeal
                    </button>
                  </>
                )}
                
                {(user.status === 'suspended' && (isExpired(user) || user.suspensionType === 'temporary')) && (
                  <button
                    onClick={() => handleReactivate(user.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reactivate
                  </button>
                )}
                
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Contact User
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Suspended Users</h3>
          <p className="text-muted-foreground">No suspended users match the selected filters.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Suspension Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground">Detailed suspension management interface would be implemented here with full user history, violation records, and administrative actions.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSuspension;
