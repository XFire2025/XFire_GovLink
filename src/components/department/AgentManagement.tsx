// src/components/department/AgentManagement.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Search, Plus, Edit, UserCog, RefreshCw, AlertCircle, Loader, Trash2, Eye, X } from "lucide-react";
import AddAgentModal from "./AddAgentModal";
import CustomBadge from './CustomBadge';
import { AgentFormData } from './AddAgentForm'; // Import the specific interface
import { useAgents, useServices, useAgentMutations } from "@/lib/hooks/useDepartmentApi";
import { Agent } from "@/lib/services/departmentApiService";

export default function DepartmentAgentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [viewingAgent, setViewingAgent] = useState<Agent | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    status?: string;
    search?: string;
  }>({});

  // Use API hooks
  const { data: agents, loading: agentsLoading, error: agentsError, refetch: refetchAgents } = useAgents(filters);
  const { data: services, loading: servicesLoading } = useServices();
  const { createAgent, updateAgent, deleteAgent, loading: mutationLoading } = useAgentMutations();

  // Update filters when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ 
        ...prev, 
        search: searchTerm || undefined 
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredAgents = agents || [];
  const availableServices = services || [];


  // Fix Error: Use the specific AgentFormData interface instead of 'any'
  const handleSaveAgent = async (agentData: AgentFormData) => {
    const loadingToast = toast.loading(editingAgent ? 'Updating agent...' : 'Creating agent...');
    
    try {
      if (editingAgent) {
        // Editing existing agent - send all the updated data
        await updateAgent(editingAgent.id, {
          fullName: agentData.fullName,
          email: agentData.email,
          officerId: agentData.officerId,
          nicNumber: agentData.nicNumber,
          position: agentData.position,
          officeName: agentData.officeName,
          officeAddress: agentData.officeAddress,
          phoneNumber: agentData.phoneNumber,
          duties: agentData.duties || [],
          specialization: agentData.assignedServices || [],
        });
        
        toast.success('✅ Agent updated successfully!', { id: loadingToast });
      } else {
        // Creating new agent - provide proper data structure
        await createAgent({
          fullName: agentData.fullName,
          email: agentData.email,
          password: agentData.password,
          officerId: agentData.officerId,
          nicNumber: agentData.nicNumber,
          position: agentData.position,
          officeName: agentData.officeName,
          officeAddress: agentData.officeAddress,
          phoneNumber: agentData.phoneNumber,
          duties: agentData.duties || [],
          specialization: agentData.assignedServices || [],
        });
        
        toast.success('🎉 Agent created successfully!', { id: loadingToast });
      }
      
      setIsModalOpen(false);
      setEditingAgent(null);
      await refetchAgents();
    } catch (error) {
      console.error('Failed to save agent:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (editingAgent) {
        toast.error(`❌ Failed to update agent: ${errorMessage}`, { id: loadingToast });
      } else {
        toast.error(`❌ Failed to create agent: ${errorMessage}`, { id: loadingToast });
      }
    }
  };

  const openAddModal = () => { 
    setEditingAgent(null); 
    setIsModalOpen(true); 
  };
  
  const openEditModal = (agent: Agent) => { 
    setEditingAgent(agent); 
    setIsModalOpen(true); 
  };
  
  const openViewModal = (agent: Agent) => {
    setViewingAgent(agent);
    setIsViewModalOpen(true);
  };

  const handleDeleteAgent = async (agentId: string) => {
    const loadingToast = toast.loading('Deactivating agent...');
    
    try {
      await deleteAgent(agentId);
      await refetchAgents(); // Refresh the list
      toast.success('🗑️ Agent deactivated successfully!', { id: loadingToast });
      setIsDeleteModalOpen(false);
      setAgentToDelete(null);
    } catch (error) {
      console.error('Failed to delete agent:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`❌ Failed to deactivate agent: ${errorMessage}`, { id: loadingToast });
    }
  };

  const openDeleteModal = (agent: Agent) => {
    setAgentToDelete(agent);
    setIsDeleteModalOpen(true);
  };

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const loading = agentsLoading || servicesLoading;
  const error = agentsError;

  return (
    <div className="relative min-h-full">
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <UserCog className="w-8 h-8 text-[#008060]" />
              <span className="text-foreground">Agent</span>{' '}
              <span className="bg-gradient-to-r from-[#008060] to-[#FFC72C] bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-muted-foreground">Manage your department&apos;s customer service agents.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={async () => {
                const loadingToast = toast.loading('Refreshing agents...');
                try {
                  await refetchAgents();
                  toast.success('🔄 Agents refreshed!', { id: loadingToast });
                } catch {
                  toast.error('❌ Failed to refresh agents', { id: loadingToast });
                }
              }}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={openAddModal} 
              disabled={mutationLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] hover:from-[#FFC72C] hover:to-[#FF5722] text-white px-4 py-2.5 rounded-xl disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add Agent
            </button>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search agents..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]/50 modern-card" 
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? undefined : e.target.value)}
                className="px-3 py-2.5 bg-card/60 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]/50"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/10 backdrop-blur-md p-4 rounded-xl border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">Failed to load agents</h3>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
              <button
                onClick={refetchAgents}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/90 modern-card rounded-2xl border border-border/50 shadow-glow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 animate-spin text-[#008060]" />
                <span className="text-muted-foreground">Loading agents...</span>
              </div>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-12">
              <UserCog className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No agents found</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#008060]/5 to-[#FF5722]/5 border-b border-border/30">
                  <tr>
                    <th className="p-4 text-left font-semibold">Agent</th>
                    <th className="p-4 text-left font-semibold">Specialization</th>
                    <th className="p-4 text-left font-semibold">Workload</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Joined</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map(agent => (
                    <tr key={agent.id} className="border-t border-border/20 hover:bg-card/30">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">{agent.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            // Debug: Check specialization field
                            const specs = agent.specialization;
                            console.log(`Agent ${agent.name} specialization:`, specs, 'Type:', typeof specs, 'Array?:', Array.isArray(specs));
                            
                            const validSpecs = specs && Array.isArray(specs) ? specs.filter(spec => spec && spec.trim()) : [];
                            
                            if (validSpecs.length > 0) {
                              return validSpecs.map((serviceId, index) => {
                                // Convert service ID to service name
                                const service = availableServices.find(s => s.id === serviceId);
                                const displayName = service ? service.name : serviceId; // Fallback to ID if service not found
                                return (
                                  <CustomBadge key={index}>{displayName}</CustomBadge>
                                );
                              });
                            } else {
                              return <span className="text-sm text-muted-foreground">No specialization</span>;
                            }
                          })()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            agent.workload < 50 ? 'bg-green-500' : 
                            agent.workload < 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm text-muted-foreground">{agent.workload}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          agent.status === "ACTIVE" ? "bg-[#008060]/10 text-[#008060]" : 
                          agent.status === "SUSPENDED" ? "bg-[#FF5722]/10 text-[#FF5722]" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openViewModal(agent)}
                            className="p-2 hover:bg-[#008060]/10 rounded-lg text-[#008060]" 
                            title="View Details"
                            disabled={mutationLoading}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditModal(agent)} 
                            className="p-2 hover:bg-[#FFC72C]/10 rounded-lg text-[#FFC72C]" 
                            title="Edit"
                            disabled={mutationLoading}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(agent)}
                            className="p-2 hover:bg-[#FF5722]/10 rounded-lg text-[#FF5722]" 
                            title="Deactivate"
                            disabled={mutationLoading}
                          >
                            {mutationLoading ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
      <AddAgentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveAgent} 
        agentToEdit={editingAgent} 
        services={availableServices}
      />
      
      {/* Agent Details View Modal */}
      {isViewModalOpen && viewingAgent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-glow">
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <div>
                <h2 className="text-2xl font-bold">Agent Details</h2>
                <p className="text-sm text-muted-foreground">View detailed information about this agent</p>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 rounded-xl bg-card/30" aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingAgent.fullName || viewingAgent.name || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingAgent.email || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Officer ID</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingAgent.officerId || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">NIC Number</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingAgent.nicNumber || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Position</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingAgent.position || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Office Name</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingAgent.officeName || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingAgent.phoneNumber || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                    <div className="px-3 py-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        viewingAgent.status === "ACTIVE" ? "bg-[#008060]/10 text-[#008060]" : 
                        viewingAgent.status === "SUSPENDED" ? "bg-[#FF5722]/10 text-[#FF5722]" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {viewingAgent.status || (viewingAgent.isActive ? 'ACTIVE' : 'INACTIVE')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Workload</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingAgent.workload || 0}%
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Joined Date</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingAgent.createdAt ? new Date(viewingAgent.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              {viewingAgent.officeAddress && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Office Address</label>
                  <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                    {viewingAgent.officeAddress.addressLine1}<br/>
                    {viewingAgent.officeAddress.addressLine2 && <>{viewingAgent.officeAddress.addressLine2}<br/></>}
                    {viewingAgent.officeAddress.city}, {viewingAgent.officeAddress.district}<br/>
                    {viewingAgent.officeAddress.province} - {viewingAgent.officeAddress.postalCode}
                  </div>
                </div>
              )}
              
              {viewingAgent.specialization && Array.isArray(viewingAgent.specialization) && viewingAgent.specialization.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Specialization</label>
                  <div className="flex flex-wrap gap-2">
                    {viewingAgent.specialization.filter(spec => spec && spec.trim()).map((serviceId, index) => {
                      // Convert service ID to service name
                      const service = availableServices.find(s => s.id === serviceId);
                      const displayName = service ? service.name : serviceId; // Fallback to ID if service not found
                      return (
                        <CustomBadge key={index}>{displayName}</CustomBadge>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/20">
                <button 
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openEditModal(viewingAgent);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] hover:from-[#FFC72C] hover:to-[#FF5722] text-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Agent
                </button>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-card/30 border border-border/30 rounded-lg hover:bg-card/50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && agentToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-morphism max-w-md w-full rounded-2xl border border-border/50 shadow-glow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-[#FF5722]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Deactivate Agent</h3>
                  <p className="text-sm text-muted-foreground">This action will deactivate the agent</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-foreground mb-2">
                  Are you sure you want to deactivate <span className="font-semibold">{agentToDelete.fullName || agentToDelete.name}</span>?
                </p>
                <p className="text-sm text-muted-foreground">
                  The agent will be marked as inactive and will no longer be able to access the system. This action can be reversed later.
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setAgentToDelete(null);
                  }}
                  className="px-4 py-2 bg-card/30 border border-border/30 rounded-lg hover:bg-card/50 transition-colors"
                  disabled={mutationLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteAgent(agentToDelete.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5722] to-[#E53935] hover:from-[#E53935] hover:to-[#D32F2F] text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={mutationLoading}
                >
                  {mutationLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Deactivating...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Deactivate Agent
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}