// src/components/department/AgentManagement.tsx
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
  UserCog, // Using this icon specifically for agents
} from "lucide-react";


// Interface definition for an Agent
interface Agent {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "pending";
  verificationStatus: "verified" | "pending" | "rejected";
  joinDate: string;
  lastActive: string;
  avatar?: string;
}

// This component is a direct adaptation of Admin's UserManagement component
export default function DepartmentAgentManagement() {
  // Mock data for agents, following the established interface
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "agent-1",
      name: "Nimali Gunaratne",
      email: "nimali.g@dept.gov.lk",
      status: "active",
      verificationStatus: "verified",
      joinDate: "2023-11-10",
      lastActive: "5 minutes ago",
    },
    {
      id: "agent-2",
      name: "Bhanuka Rajapaksa",
      email: "bhanuka.r@dept.gov.lk",
      status: "active",
      verificationStatus: "verified",
      joinDate: "2023-12-01",
      lastActive: "1 hour ago",
    },
    {
      id: "agent-3",
      name: "Priya De Silva",
      email: "priya.ds@dept.gov.lk",
      status: "suspended",
      verificationStatus: "verified",
      joinDate: "2023-10-05",
      lastActive: "3 days ago",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (
    agentId: string,
    newStatus: "active" | "suspended"
  ) => {
    setAgents(
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, status: newStatus } : agent
      )
    );
  };

  return (
    <div className="relative min-h-full">
      <div className="space-y-8">
        {/* Header - Themed for Department */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
        >
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="flex items-center gap-3">
                {/* Department's Green Accent */}
                <UserCog className="w-8 h-8 text-[#008060]" />
                <span className="text-foreground">Agent</span>{' '}
                <span className="bg-gradient-to-r from-[#008060] to-[#FF5722] bg-clip-text text-transparent">
                  Management
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground">
              Manage your department&apos;s customer service agents.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#008060] to-[#8D153A] text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 modern-card">
            <Plus className="w-4 h-4" />
            Add Agent
          </button>
        </motion.div>

        {/* Search and Filters - Themed for Department */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-[#008060] transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search agents by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]/50 transition-all duration-300 modern-card hover:shadow-md"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]/50 transition-all duration-300 modern-card hover:shadow-md"
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

        {/* Agents Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#008060]/5 to-[#FF5722]/5 border-b border-border/30">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Agent</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">Verification</th>
                  <th className="text-left p-4 font-semibold text-foreground">Join Date</th>
                  <th className="text-left p-4 font-semibold text-foreground">Last Active</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent, index) => (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="border-t border-border/20 hover:bg-card/30 transition-all duration-300 group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#008060]/20 to-[#FF5722]/20 rounded-full flex items-center justify-center border-2 border-[#008060]/30 shadow-md transition-all duration-300 group-hover:scale-110">
                          <span className="text-sm font-bold text-foreground">
                            {agent.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground group-hover:text-[#008060] transition-colors duration-300">
                            {agent.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {agent.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                          agent.status === "active"
                            ? "bg-[#008060]/10 text-[#008060] border-[#008060]/20"
                            : agent.status === "pending"
                            ? "bg-[#FFC72C]/10 text-[#FFC72C] border-[#FFC72C]/20"
                            : "bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20"
                        }`}
                      >
                        {agent.status === "active" && <CheckCircle className="w-3 h-3" />}
                        {agent.status === "pending" && <Clock className="w-3 h-3" />}
                        {agent.status === "suspended" && <XCircle className="w-3 h-3" />}
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                          agent.verificationStatus === "verified"
                            ? "bg-[#008060]/10 text-[#008060] border-[#008060]/20"
                            : "bg-[#FFC72C]/10 text-[#FFC72C] border-[#FFC72C]/20"
                        }`}
                      >
                         <ShieldCheck className="w-3 h-3" />
                         {agent.verificationStatus.charAt(0).toUpperCase() + agent.verificationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-medium">{agent.joinDate}</td>
                    <td className="p-4 text-sm text-muted-foreground font-medium">{agent.lastActive}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#008060]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#008060]" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-[#FFC72C]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#FFC72C]" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        {agent.status === "active" ? (
                          <button onClick={() => handleStatusChange(agent.id, "suspended")} className="p-2 hover:bg-[#FF5722]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#FF5722]" title="Suspend Agent">
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => handleStatusChange(agent.id, "active")} className="p-2 hover:bg-[#008060]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#008060]" title="Activate Agent">
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