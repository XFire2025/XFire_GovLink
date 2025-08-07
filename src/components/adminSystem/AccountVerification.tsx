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
  MessageCircle,
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
        return "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      case "under_review":
        return "text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
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
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Account Verification
        </h1>
        <p className="text-muted-foreground">
          Review and process user verification requests for identity, business,
          and agent accounts.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-morphism p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
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
        </div>
        <div className="glass-morphism p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-blue-500" />
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
        </div>
        <div className="glass-morphism p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
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
        </div>
        <div className="glass-morphism p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
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

      {/* Verification Requests Table */}
      <div className="glass-morphism rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Request ID</th>
                <th className="text-left p-4 font-semibold">User</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Priority</th>
                <th className="text-left p-4 font-semibold">Submitted</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-foreground">
                      {request.id}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {request.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {request.userName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <ShieldCheck className="w-3 h-3" />
                      {request.verificationType.charAt(0).toUpperCase() +
                        request.verificationType.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
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
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(request.id, "approved")
                            }
                            className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(request.id, "rejected")
                            }
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">
                  Verification Request - {selectedRequest.id}
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-muted rounded-lg"
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

              {/* Actions */}
              {selectedRequest.status === "pending" && (
                <div className="flex gap-4 pt-6 border-t border-border">
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedRequest.id, "approved")
                    }
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedRequest.id, "rejected")
                    }
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedRequest.id, "under_review")
                    }
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
  );
}
