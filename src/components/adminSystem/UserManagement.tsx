"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
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
  Users,
  UserCog,
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
    <div className="relative min-h-full">
      {/* Main content */}
      <div className="space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
        >
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="flex items-center gap-3">
                {userType === "agents" ? (
                  <UserCog className="w-8 h-8 text-[#8D153A]" />
                ) : (
                  <Users className="w-8 h-8 text-[#8D153A]" />
                )}
                <span className="text-foreground">{userType === "agents" ? "Agent" : "User"}</span>{' '}
                <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                  Management
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground">
              Manage{" "}
              {userType === "agents"
                ? "customer service agents"
                : "regular users"}{" "}
              and their permissions
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 modern-card">
            <Plus className="w-4 h-4" />
            Add {userType === "agents" ? "Agent" : "User"}
          </button>
        </motion.div>

        {/* Enhanced Search and Filters */}
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
              placeholder={`Search ${userType === "agents" ? "agents" : "users"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
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

        {/* Enhanced Users Table */}
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
                  <th className="text-left p-4 font-semibold text-foreground">{userType === "agents" ? "Agent" : "User"}</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">Verification</th>
                  <th className="text-left p-4 font-semibold text-foreground">Join Date</th>
                  <th className="text-left p-4 font-semibold text-foreground">Last Active</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="border-t border-border/20 hover:bg-card/30 transition-all duration-300 group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-r rounded-full flex items-center justify-center border-2 shadow-md transition-all duration-300 group-hover:scale-110 ${
                          userType === "agents" 
                            ? "from-[#8D153A]/20 to-[#FF5722]/20 border-[#8D153A]/30" 
                            : "from-[#008060]/20 to-[#FFC72C]/20 border-[#008060]/30"
                        }`}>
                          <span className="text-sm font-bold text-foreground">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground group-hover:text-[#8D153A] transition-colors duration-300">
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                          user.status === "active"
                            ? "bg-[#008060]/10 text-[#008060] border-[#008060]/20"
                            : user.status === "pending"
                            ? "bg-[#FFC72C]/10 text-[#FFC72C] border-[#FFC72C]/20"
                            : "bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20"
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                          user.verificationStatus === "verified"
                            ? "bg-[#8D153A]/10 text-[#8D153A] border-[#8D153A]/20"
                            : user.verificationStatus === "pending"
                            ? "bg-[#FFC72C]/10 text-[#FFC72C] border-[#FFC72C]/20"
                            : "bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20"
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
                    <td className="p-4 text-sm text-muted-foreground font-medium">
                      {user.joinDate}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-medium">
                      {user.lastActive}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#8D153A]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#8D153A]" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-[#FFC72C]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#FFC72C]" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.status === "active" ? (
                          <button
                            onClick={() =>
                              handleStatusChange(user.id, "suspended")
                            }
                            className="p-2 hover:bg-[#FF5722]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#FF5722]"
                            title="Suspend User"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(user.id, "active")}
                            className="p-2 hover:bg-[#008060]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#008060]"
                            title="Activate User"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
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
    </div>
  );
}
