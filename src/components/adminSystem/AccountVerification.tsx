"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
  AlertTriangle,
} from "lucide-react";


interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  address: string;
  verificationType: "identity" | "business" | "agent";
  status: "pending" | "approved" | "rejected" | "under_review";
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
  priority: "low" | "medium" | "high";
}

export default function AccountVerification() {
  const [verificationRequests, setVerificationRequests] = useState<
    VerificationRequest[]
  >([
    {
      id: "VR001",
      userId: "USR001",
      userName: "Amal Perera",
      email: "amal.perera@email.com",
      phone: "+94 71 234 5678",
      address: "Colombo 07, Sri Lanka",
      verificationType: "identity",
      status: "pending",
      submittedDate: "2024-01-15",
      documents: [
        {
          id: "DOC001",
          name: "National ID Card (Front)",
          type: "image/jpeg",
          url: "/documents/nic-front.jpg",
          verified: false,
        },
        {
          id: "DOC002",
          name: "National ID Card (Back)",
          type: "image/jpeg",
          url: "/documents/nic-back.jpg",
          verified: false,
        },
      ],
      priority: "medium",
    },
    {
      id: "VR002",
      userId: "USR002",
      userName: "Saman Silva",
      email: "saman.silva@email.com",
      phone: "+94 77 876 5432",
      address: "Kandy, Sri Lanka",
      verificationType: "agent",
      status: "under_review",
      submittedDate: "2024-01-12",
      reviewedDate: "2024-01-14",
      reviewedBy: "Admin User",
      documents: [
        {
          id: "DOC003",
          name: "Agent Certification",
          type: "application/pdf",
          url: "/documents/agent-cert.pdf",
          verified: true,
        },
        {
          id: "DOC004",
          name: "Professional License",
          type: "application/pdf",
          url: "/documents/license.pdf",
          verified: false,
        },
      ],
      notes: "Professional license needs additional verification",
      priority: "high",
    },
  ]);

  const [selectedRequest, setSelectedRequest] =
    useState<VerificationRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filteredRequests = verificationRequests.filter((request) => {
    const statusMatch =
      filterStatus === "all" || request.status === filterStatus;
    const typeMatch =
      filterType === "all" || request.verificationType === filterType;
    return statusMatch && typeMatch;
  });

  const handleStatusUpdate = (
    requestId: string,
    newStatus: VerificationRequest["status"],
    notes?: string
  ) => {
    setVerificationRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus,
              reviewedDate: new Date().toISOString().split("T")[0],
              reviewedBy: "Current Admin",
              notes: notes || request.notes,
            }
          : request
      )
    );
    setSelectedRequest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-[#008060] bg-[#008060]/10 border-[#008060]/20";
      case "rejected":
        return "text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/20";
      case "under_review":
        return "text-[#8D153A] bg-[#8D153A]/10 border-[#8D153A]/20";
      default:
        return "text-[#FFC72C] bg-[#FFC72C]/10 border-[#FFC72C]/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      case "under_review":
        return <Eye className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-[#FF5722]";
      case "medium":
        return "text-[#FFC72C]";
      default:
        return "text-muted-foreground";
    }
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
              <ShieldCheck className="w-8 h-8 text-[#8D153A]" />
              <span className="text-foreground">Account</span>{' '}
              <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                Verification
              </span>
            </span>
          </h1>
          <p className="text-muted-foreground">
            Review and process user verification requests for identity, business,
            and agent accounts.
          </p>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#FFC72C]/20 to-[#FFC72C]/10 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-[#FFC72C]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {
                    verificationRequests.filter((r) => r.status === "pending")
                      .length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#8D153A]/20 to-[#8D153A]/10 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 h-8 text-[#8D153A]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {
                    verificationRequests.filter(
                      (r) => r.status === "under_review"
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Under Review</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#008060]/20 to-[#008060]/10 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-[#008060]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {
                    verificationRequests.filter((r) => r.status === "approved")
                      .length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#FF5722]/20 to-[#FF5722]/10 group-hover:scale-110 transition-transform duration-300">
                <XCircle className="w-8 h-8 text-[#FF5722]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {
                    verificationRequests.filter((r) => r.status === "rejected")
                      .length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
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
            className="px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
          >
            <option value="all">All Types</option>
            <option value="identity">Identity</option>
            <option value="business">Business</option>
            <option value="agent">Agent</option>
          </select>
        </motion.div>

        {/* Enhanced Verification Requests Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#8D153A]/5 to-[#FF5722]/5 border-b border-border/30">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Request ID</th>
                  <th className="text-left p-4 font-semibold text-foreground">User</th>
                  <th className="text-left p-4 font-semibold text-foreground">Type</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">Priority</th>
                  <th className="text-left p-4 font-semibold text-foreground">Submitted</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request, index) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="border-t border-border/20 hover:bg-card/30 transition-all duration-300 group"
                  >
                  <td className="p-4">
                    <div className="font-medium text-foreground">
                      {request.id}
                    </div>
                  </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#8D153A]/20 to-[#FF5722]/20 rounded-full flex items-center justify-center border-2 border-[#8D153A]/30 shadow-md transition-all duration-300 group-hover:scale-110">
                          <span className="text-xs font-medium text-foreground">
                            {request.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground group-hover:text-[#8D153A] transition-colors duration-300">
                            {request.userName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-[#8D153A]/10 text-[#8D153A] border-[#8D153A]/20">
                        <ShieldCheck className="w-3 h-3" />
                        {request.verificationType.charAt(0).toUpperCase() +
                          request.verificationType.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1).replace("_", " ")}
                      </span>
                    </td>
                  <td className="p-4">
                    <span
                      className={`font-medium ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      {request.priority.charAt(0).toUpperCase() +
                        request.priority.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {request.submittedDate}
                  </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="p-2 hover:bg-[#8D153A]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#8D153A]"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(request.id, "approved")
                              }
                              className="p-2 hover:bg-[#008060]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#008060]"
                              title="Approve Request"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(request.id, "rejected")
                              }
                              className="p-2 hover:bg-[#FF5722]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#FF5722]"
                              title="Reject Request"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Enhanced Request Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card/95 dark:bg-card/98 backdrop-blur-md border border-border/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl modern-card"
            >
              <div className="p-6 border-b border-border/30 bg-gradient-to-r from-[#8D153A]/5 to-[#FF5722]/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-[#8D153A]" />
                    <span>Verification Request - {selectedRequest.id}</span>
                  </h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-2 hover:bg-[#FF5722]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#FF5722]"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

            <div className="p-6 space-y-6">
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">
                    User Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedRequest.userName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedRequest.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedRequest.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedRequest.address}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">
                    Request Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Submitted: {selectedRequest.submittedDate}
                      </span>
                    </div>
                    {selectedRequest.reviewedDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Reviewed: {selectedRequest.reviewedDate}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`w-4 h-4 ${getPriorityColor(
                          selectedRequest.priority
                        )}`}
                      />
                      <span className="text-sm">
                        Priority: {selectedRequest.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRequest.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {doc.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {doc.type}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          <button className="p-1 hover:bg-muted rounded">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedRequest.notes && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Notes</h4>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Enhanced Actions */}
              {selectedRequest.status === "pending" && (
                <div className="flex gap-4 pt-6 border-t border-border/30">
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedRequest.id, "approved")
                    }
                    className="flex items-center gap-2 bg-gradient-to-r from-[#008060] to-[#008060]/90 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedRequest.id, "rejected")
                    }
                    className="flex items-center gap-2 bg-gradient-to-r from-[#FF5722] to-[#FF5722]/90 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedRequest.id, "under_review")
                    }
                    className="flex items-center gap-2 bg-gradient-to-r from-[#8D153A] to-[#8D153A]/90 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Eye className="w-4 h-4" />
                    Mark Under Review
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  </div>
  );
}
