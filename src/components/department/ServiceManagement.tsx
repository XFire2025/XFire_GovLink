// src/components/department/ServiceManagement.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search,
  Plus,
  Layers, // Icon for Services
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Loader,
  X,
} from "lucide-react";
import AddServiceModal from "./AddServiceModal";
import { useServices, useServiceMutations } from "@/lib/hooks/useDepartmentApi";
import { Service } from "@/lib/services/departmentApiService";

export default function ServiceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    isActive?: boolean;
    category?: string;
    search?: string;
  }>({});

  // Use the API hooks
  const { data: services, loading, error, refetch } = useServices(filters);
  const { 
    createService, 
    updateService,
    deleteService, 
    toggleServiceStatus, 
    loading: mutationLoading 
  } = useServiceMutations();

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

  const filteredServices = services || [];

  const handleSaveService = async (serviceData: {
    name: string;
    description: string;
    category: string;
    processingTime: string;
    fee: number;
    requirements: string[];
    status: 'active' | 'inactive';
  }) => {
    const loadingToast = toast.loading(editingService ? 'Updating service...' : 'Creating service...');
    
    try {
      // Map form data to API format
      const apiData = {
        name: serviceData.name,
        description: serviceData.description,
        category: serviceData.category,
        processingTime: serviceData.processingTime,
        fee: serviceData.fee || 0,
        requirements: serviceData.requirements || [],
        isActive: serviceData.status === 'active'
      };
      
      if (editingService) {
        // Editing existing service
        await updateService(editingService.id, apiData);
        toast.success('✅ Service updated successfully!', { id: loadingToast });
      } else {
        // Creating new service
        await createService(apiData);
        toast.success('🎉 Service created successfully!', { id: loadingToast });
      }
      
      setIsModalOpen(false);
      setEditingService(null);
      await refetch(); // Refresh the list
    } catch (error) {
      console.error('Failed to save service:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (editingService) {
        toast.error(`❌ Failed to update service: ${errorMessage}`, { id: loadingToast });
      } else {
        toast.error(`❌ Failed to create service: ${errorMessage}`, { id: loadingToast });
      }
    }
  };

  const handleToggleStatus = async (serviceId: string, currentStatus: boolean) => {
    const loadingToast = toast.loading(`${currentStatus ? 'Deactivating' : 'Activating'} service...`);
    
    try {
      await toggleServiceStatus(serviceId, !currentStatus);
      await refetch(); // Refresh the list
      
      const statusText = currentStatus ? 'deactivated' : 'activated';
      const statusIcon = currentStatus ? '🔴' : '🟢';
      toast.success(`${statusIcon} Service ${statusText} successfully!`, { id: loadingToast });
    } catch (error) {
      console.error('Failed to toggle service status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`❌ Failed to toggle service status: ${errorMessage}`, { id: loadingToast });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const loadingToast = toast.loading('Deleting service...');
    
    try {
      await deleteService(serviceId);
      await refetch(); // Refresh the list
      toast.success('🗑️ Service deleted successfully!', { id: loadingToast });
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Failed to delete service:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`❌ Failed to delete service: ${errorMessage}`, { id: loadingToast });
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const openViewModal = (service: Service) => {
    setViewingService(service);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="relative min-h-full">
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex justify-between items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Layers className="w-8 h-8 text-[#008060]" />
              <span className="text-foreground">Service</span>{' '}
              <span className="bg-gradient-to-r from-[#008060] to-[#FFC72C] bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-muted-foreground">Define and manage the services offered by your department.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={refetch}
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
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-[#008060]" />
              <input 
                type="text" 
                placeholder="Search services..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]/50 modern-card" 
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.isActive?.toString() || 'all'}
                onChange={(e) => handleFilterChange('isActive', e.target.value === 'all' ? undefined : e.target.value === 'true')}
                className="px-3 py-2.5 bg-card/60 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]/50"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">Failed to load services</h3>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
              <button
                onClick={refetch}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }} className="bg-card/90 modern-card rounded-2xl border border-border/50 shadow-glow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 animate-spin text-[#008060]" />
                <span className="text-muted-foreground">Loading services...</span>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No services found</p>
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
                    <th className="text-left p-4 font-semibold text-foreground">Service Name</th>
                    <th className="text-left p-4 font-semibold text-foreground">Category</th>
                    <th className="text-left p-4 font-semibold text-foreground">Status</th>
                    <th className="text-left p-4 font-semibold text-foreground">Service Fee (LKR)</th>
                    <th className="text-left p-4 font-semibold text-foreground">Processing Time</th>
                    <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="border-t border-border/20 hover:bg-card/30">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{service.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{service.description}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                          {service.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(service.id, service.isActive)}
                          disabled={mutationLoading}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                            service.isActive 
                              ? "bg-[#008060]/10 text-[#008060] hover:bg-[#008060]/20" 
                              : "bg-[#FF5722]/10 text-[#FF5722] hover:bg-[#FF5722]/20"
                          } ${mutationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {service.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {service.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4 font-mono text-muted-foreground">
                        {service.fee ? `LKR ${service.fee.toLocaleString()}` : 'Free'}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {service.processingTime || 'N/A'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openViewModal(service)}
                            className="p-2 hover:bg-[#008060]/10 rounded-lg text-[#008060]" 
                            title="View Details"
                            disabled={mutationLoading}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditModal(service)}
                            className="p-2 hover:bg-[#FFC72C]/10 rounded-lg text-[#FFC72C]" 
                            title="Edit"
                            disabled={mutationLoading}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(service)}
                            className="p-2 hover:bg-[#FF5722]/10 rounded-lg text-[#FF5722]" 
                            title="Delete"
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
      <AddServiceModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingService(null); }} 
        onSave={handleSaveService}
        serviceToEdit={editingService}
        loading={mutationLoading}
      />

      {/* Service Details View Modal */}
      {isViewModalOpen && viewingService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-glow">
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <div>
                <h2 className="text-2xl font-bold">Service Details</h2>
                <p className="text-sm text-muted-foreground">View detailed information about this service</p>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 rounded-xl bg-card/30" aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Service Name</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingService.name || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg">
                      <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                        {viewingService.category || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Service Fee</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground font-mono">
                      {viewingService.fee ? `LKR ${viewingService.fee.toLocaleString()}` : 'Free'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Processing Time</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingService.processingTime || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                    <div className="px-3 py-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        viewingService.isActive 
                          ? "bg-[#008060]/10 text-[#008060]" 
                          : "bg-[#FF5722]/10 text-[#FF5722]"
                      }`}>
                        {viewingService.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {viewingService.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Created Date</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingService.createdAt ? new Date(viewingService.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Last Updated</label>
                    <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                      {viewingService.updatedAt ? new Date(viewingService.updatedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              {viewingService.description && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                    {viewingService.description}
                  </div>
                </div>
              )}
              
              {viewingService.requirements && viewingService.requirements.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Requirements</label>
                  <div className="px-3 py-2 bg-card/50 border border-border/30 rounded-lg text-muted-foreground">
                    <ul className="list-disc list-inside space-y-1">
                      {viewingService.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/20">
                <button 
                  onClick={() => {
                    setIsViewModalOpen(false);
                    openEditModal(viewingService);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] hover:from-[#FFC72C] hover:to-[#FF5722] text-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Service
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
      {isDeleteModalOpen && serviceToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-morphism max-w-md w-full rounded-2xl border border-border/50 shadow-glow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-[#FF5722]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Delete Service</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-foreground mb-2">
                  Are you sure you want to delete <span className="font-semibold">{serviceToDelete.name}</span>?
                </p>
                <p className="text-sm text-muted-foreground">
                  This will permanently remove the service and all associated data. Citizens will no longer be able to access this service.
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setServiceToDelete(null);
                  }}
                  className="px-4 py-2 bg-card/30 border border-border/30 rounded-lg hover:bg-card/50 transition-colors"
                  disabled={mutationLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteService(serviceToDelete.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5722] to-[#E53935] hover:from-[#E53935] hover:to-[#D32F2F] text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={mutationLoading}
                >
                  {mutationLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Service
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