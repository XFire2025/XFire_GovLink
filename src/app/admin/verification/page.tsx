"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';

interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  address: string;
  verificationType: 'identity' | 'business' | 'agent';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    verified: boolean;
  }[];
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

const AccountVerification = () => {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([
    {
      id: 'VR001',
      userId: 'USR001',
      userName: 'Amal Perera',
      email: 'amal.perera@email.com',
      phone: '+94 77 123 4567',
      address: '123 Galle Road, Colombo 03',
      verificationType: 'identity',
      status: 'pending',
      submittedDate: '2024-01-22T10:30:00Z',
      documents: [
        { id: 'DOC001', name: 'National ID Card - Front', type: 'image/jpeg', url: '/docs/nic-front.jpg', verified: false },
        { id: 'DOC002', name: 'National ID Card - Back', type: 'image/jpeg', url: '/docs/nic-back.jpg', verified: false },
        { id: 'DOC003', name: 'Utility Bill', type: 'application/pdf', url: '/docs/utility-bill.pdf', verified: false }
      ],
      priority: 'high'
    },
    {
      id: 'VR002',
      userId: 'USR002',
      userName: 'Sunitha Silva',
      email: 'sunitha.silva@company.lk',
      phone: '+94 11 234 5678',
      address: '456 Kandy Road, Kandy',
      verificationType: 'business',
      status: 'under_review',
      submittedDate: '2024-01-21T14:15:00Z',
      documents: [
        { id: 'DOC004', name: 'Business Registration Certificate', type: 'application/pdf', url: '/docs/business-reg.pdf', verified: true },
        { id: 'DOC005', name: 'Tax Certificate', type: 'application/pdf', url: '/docs/tax-cert.pdf', verified: false },
        { id: 'DOC006', name: 'Bank Statement', type: 'application/pdf', url: '/docs/bank-statement.pdf', verified: true }
      ],
      priority: 'medium',
      notes: 'Tax certificate requires additional verification from authorities.'
    },
    {
      id: 'VR003',
      userId: 'AGT001',
      userName: 'Kamal Fernando',
      email: 'kamal.fernando@gov.lk',
      phone: '+94 70 987 6543',
      address: '789 Parliament Road, Colombo 01',
      verificationType: 'agent',
      status: 'pending',
      submittedDate: '2024-01-20T09:00:00Z',
      documents: [
        { id: 'DOC007', name: 'Government Employee ID', type: 'image/jpeg', url: '/docs/gov-id.jpg', verified: false },
        { id: 'DOC008', name: 'Department Authorization Letter', type: 'application/pdf', url: '/docs/auth-letter.pdf', verified: false },
        { id: 'DOC009', name: 'Service Record', type: 'application/pdf', url: '/docs/service-record.pdf', verified: false }
      ],
      priority: 'high'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredRequests = verificationRequests.filter(request => {
    const statusMatch = filterStatus === 'all' || request.status === filterStatus;
    const typeMatch = filterType === 'all' || request.verificationType === filterType;
    return statusMatch && typeMatch;
  });

  const handleStatusUpdate = (requestId: string, newStatus: 'approved' | 'rejected' | 'under_review') => {
    setVerificationRequests(requests =>
      requests.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus,
              reviewedDate: new Date().toISOString(),
              reviewedBy: 'Admin User'
            }
          : request
      )
    );
    setSelectedRequest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'under_review': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Account Verification</h1>
        <p className="text-muted-foreground">
          Review and process user verification requests for identity, business, and agent accounts.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {verificationRequests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
        
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {verificationRequests.filter(r => r.status === 'under_review').length}
              </div>
              <div className="text-sm text-muted-foreground">Under Review</div>
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
                {verificationRequests.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
          </div>
        </div>
        
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {verificationRequests.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Types</option>
          <option value="identity">Identity</option>
          <option value="business">Business</option>
          <option value="agent">Agent</option>
        </select>
      </div>

      {/* Verification Requests List */}
      <div className="grid gap-6">
        {filteredRequests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism p-6 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* User Information */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{request.userName}</h3>
                      <p className="text-sm text-muted-foreground">Request ID: {request.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{request.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{request.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{request.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Submitted: {formatDate(request.submittedDate)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Verification Type:</h4>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    request.verificationType === 'identity' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    request.verificationType === 'business' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {request.verificationType === 'identity' && <ShieldCheck className="w-3 h-3" />}
                    {request.verificationType === 'business' && <FileText className="w-3 h-3" />}
                    {request.verificationType === 'agent' && <User className="w-3 h-3" />}
                    {request.verificationType.charAt(0).toUpperCase() + request.verificationType.slice(1)} Verification
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Documents:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {request.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm truncate">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                          <button className="p-1 hover:bg-muted rounded">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {request.notes && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Review Notes:</h4>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm">{request.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Review Details
                </button>
                
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'under_review')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Start Review
                    </button>
                  </>
                )}
                
                {(request.status === 'pending' || request.status === 'under_review') && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request.id, 'rejected')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
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

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Verification Requests</h3>
          <p className="text-muted-foreground">No verification requests match the selected filters.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Verification Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Detailed view content would go here */}
              <p className="text-muted-foreground">Detailed verification review interface would be implemented here with document viewers, verification checklists, and approval workflows.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountVerification;
