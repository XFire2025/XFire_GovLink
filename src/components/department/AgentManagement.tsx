// src/components/department/AgentManagement.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, UserCog } from "lucide-react";
import AddAgentModal from "./AddAgentModal";
import CustomBadge from './CustomBadge';
import { AgentFormData } from './AddAgentForm'; // Import the specific interface

// Interfaces
interface Service { id: string; name: string; }
interface Agent { id: string; name: string; email: string; status: "active" | "suspended" | "pending"; verificationStatus: "verified" | "pending" | "rejected"; joinDate: string; lastActive: string; assignedServices?: string[]; }

export default function DepartmentAgentManagement() {
  // Fix Warning: 'setServices' is unused. We only need the 'services' variable.
  const [services] = useState<Service[]>([
    { id: "svc-1", name: "New Passport" }, { id: "svc-2", name: "Passport Renewal" }, { id: "svc-3", name: "ID Card Correction" }
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    { id: "agent-1", name: "Nimali Gunaratne", email: "nimali.g@dept.gov.lk", status: "active", verificationStatus: "verified", joinDate: "2023-11-10", lastActive: "5 mins ago", assignedServices: ["svc-1", "svc-2"] },
    { id: "agent-2", name: "Bhanuka Rajapaksa", email: "bhanuka.r@dept.gov.lk", status: "active", verificationStatus: "verified", joinDate: "2023-12-01", lastActive: "1 hour ago", assignedServices: ["svc-2"] },
    { id: "agent-3", name: "Priya De Silva", email: "priya.ds@dept.gov.lk", status: "suspended", verificationStatus: "verified", joinDate: "2023-10-05", lastActive: "3 days ago", assignedServices: ["svc-3"] },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const filteredAgents = agents.filter(agent => agent.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Fix Error: Use the specific AgentFormData interface instead of 'any'
  const handleSaveAgent = (agentData: AgentFormData) => {
    if (editingAgent) { // Editing existing agent
      setAgents(agents.map(agent => agent.id === editingAgent.id ? { ...agent, name: agentData.fullName, email: agentData.email, assignedServices: agentData.assignedServices } : agent));
    } else { // Adding new agent
      const newAgent: Agent = {
        id: `agent-${agents.length + 1}`,
        name: agentData.fullName,
        email: agentData.email,
        assignedServices: agentData.assignedServices,
        status: 'pending',
        verificationStatus: 'pending',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: 'just now',
      };
      setAgents(prev => [newAgent, ...prev]);
    }
  };

  const openAddModal = () => { setEditingAgent(null); setIsModalOpen(true); };
  const openEditModal = (agent: Agent) => { setEditingAgent(agent); setIsModalOpen(true); };

  return (
    <div className="relative min-h-full">
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3"><UserCog className="w-8 h-8 text-[#008060]" /> Agent Management</h1>
            <p className="text-muted-foreground">Manage your department&apos;s customer service agents.</p>
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-gradient-to-r from-[#008060] to-[#8D153A] text-white px-4 py-2.5 rounded-xl"><Plus className="w-4 h-4" /> Add Agent</button>
        </motion.div>
        <div className="relative flex-1 group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search agents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-sm pl-10 pr-4 py-2.5 bg-card/60 border border-border/50 rounded-xl modern-card" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/90 modern-card rounded-2xl border border-border/50 shadow-glow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#008060]/5 to-[#FF5722]/5 border-b border-border/30">
                <tr>
                  <th className="p-4 text-left font-semibold">Agent</th>
                  <th className="p-4 text-left font-semibold">Assigned Services</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map(agent => (
                  <tr key={agent.id} className="border-t border-border/20">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">{agent.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {agent.assignedServices?.map(serviceId => {
                          const service = services.find(s => s.id === serviceId);
                          return service ? <CustomBadge key={serviceId}>{service.name}</CustomBadge> : null;
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${agent.status === "active" ? "bg-[#008060]/10 text-[#008060]" : "text-[#FF5722]"}`}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(agent)} className="p-2 hover:bg-[#FFC72C]/10 rounded-lg text-[#FFC72C]" title="Edit"><Edit className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <AddAgentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveAgent} agentToEdit={editingAgent} services={services} />
    </div>
  );
}