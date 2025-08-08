"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
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
} from "lucide-react";

// Interface definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "agent" | "admin";
  status: "active" | "suspended" | "pending";
  verificationStatus: "verified" | "pending" | "rejected";
  joinDate: string;
  lastActive: string;
  avatar?: string;
}

// User Management Component
interface UserManagementProps {
  userType: "normal-users" | "agents";
}

export default function UserManagement({ userType }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Amal Perera",
      email: "amal.perera@email.com",
      role: userType === "agents" ? "agent" : "user",
      status: "active",
      verificationStatus: "verified",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Saman Silva",
      email: "saman.silva@email.com",
      role: userType === "agents" ? "agent" : "user",
      status: "pending",
      verificationStatus: "pending",
      joinDate: "2024-01-20",
      lastActive: "1 day ago",
    },
    {
      id: "3",
      name: "Kamal Fernando",
      email: "kamal.fernando@email.com",
      role: userType === "agents" ? "agent" : "user",
      status: "suspended",
      verificationStatus: "verified",
      joinDate: "2024-01-10",
      lastActive: "1 week ago",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (
    userId: string,
    newStatus: "active" | "suspended"
  ) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {userType === "agents" ? "Agent Management" : "User Management"}
          </h1>
          <p className="text-muted-foreground">
            Manage{" "}
            {userType === "agents"
              ? "customer service agents"
              : "regular users"}{" "}
            and their permissions
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add {userType === "agents" ? "Agent" : "User"}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
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

      {/* Users Table */}
      <div className="glass-morphism rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">User</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Verification</th>
                <th className="text-left p-4 font-semibold">Join Date</th>
                <th className="text-left p-4 font-semibold">Last Active</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {user.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : user.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {user.status === "active" && (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      {user.status === "pending" && (
                        <Clock className="w-3 h-3" />
                      )}
                      {user.status === "suspended" && (
                        <XCircle className="w-3 h-3" />
                      )}
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.verificationStatus === "verified"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : user.verificationStatus === "pending"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {user.verificationStatus === "verified" && (
                        <ShieldCheck className="w-3 h-3" />
                      )}
                      {user.verificationStatus === "pending" && (
                        <Clock className="w-3 h-3" />
                      )}
                      {user.verificationStatus === "rejected" && (
                        <XCircle className="w-3 h-3" />
                      )}
                      {user.verificationStatus.charAt(0).toUpperCase() +
                        user.verificationStatus.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {user.joinDate}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {user.lastActive}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-muted rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === "active" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(user.id, "suspended")
                          }
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(user.id, "active")}
                          className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded text-green-600"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 hover:bg-muted rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
