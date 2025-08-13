"use client"
import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Save,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
} from "lucide-react";

interface DepartmentFormData {
  _id?: string;  // Changed from id to _id
  name: string;
  code: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  budget: string;
  establishedDate: string;
  status: "active" | "inactive";
  tags: string[];
}

interface Department extends DepartmentFormData {
  _id: string;  // Changed from id to _id
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string[];
  data?: any;
}

const initialFormData: DepartmentFormData = {
  name: "",
  code: "",
  description: "",
  location: "",
  phone: "",
  email: "",
  budget: "",
  establishedDate: "",
  status: "active",
  tags: [],
};

export default function CreateDepartmentPage() {
  const [formData, setFormData] = useState<DepartmentFormData>(initialFormData);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<DepartmentFormData>>({});
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Department management states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDepartmentsList, setShowDepartmentsList] = useState(true);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoadingDepartments(true);
      const response = await fetch('/api/admin/departments');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.success && result.data) {
        // Map the data to ensure consistent field names
        const mappedDepartments = Array.isArray(result.data) 
          ? result.data.map((dept: any) => ({
              ...dept,
              _id: dept._id || dept.id,  // Ensure _id is used
            }))
          : [];
        setDepartments(mappedDepartments);
      } else {
        console.error('Failed to fetch departments:', result.error);
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const handleEditDepartment = (department: Department) => {
    // Ensure we're using the correct ID field
    const editData = {
      ...department,
      _id: department._id || department.id,  // Fallback to id if _id not present
    };
    setFormData(editData);
    setEditingDepartment(editData);
    setIsEditing(true);
    setShowDepartmentsList(false);
    setSubmitStatus({ type: null, message: '' });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingDepartment(null);
    setIsEditing(false);
    setShowDepartmentsList(true);
    setErrors({});
    setSubmitStatus({ type: null, message: '' });
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/departments/${departmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Department deleted successfully!'
        });
        fetchDepartments(); // Refresh the list
        
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' });
        }, 3000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to delete department'
        });
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    }
  };

  // Filter departments based on search and status
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof DepartmentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear submit status
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DepartmentFormData> = {};

    if (!formData.name?.trim()) newErrors.name = "Department name is required";
    if (!formData.code?.trim()) newErrors.code = "Department code is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    if (formData.budget && (isNaN(parseFloat(formData.budget)) || parseFloat(formData.budget) < 0)) {
      newErrors.budget = "Budget must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the validation errors before submitting.'
      });
      return;
    }

    setIsLoading(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      // Use _id for updates
      const url = isEditing ? `/api/admin/departments/${editingDepartment?._id}` : '/api/admin/departments';
      const method = isEditing ? 'PUT' : 'POST';
      
      // Prepare the data payload (exclude _id from the body)
      const { _id, ...payloadData } = formData;
      const payload = {
        ...payloadData,
        budget: formData.budget ? parseFloat(formData.budget).toString() : '',
        tags: formData.tags || [],
      };

      console.log('Submitting to URL:', url); // Debug log
      console.log('Method:', method); // Debug log
      console.log('Payload:', payload); // Debug log

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result: ApiResponse = await response.json();
      console.log('Response result:', result); // Debug log
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || `Department ${isEditing ? 'updated' : 'created'} successfully!`
        });
        
        // Refresh departments list
        await fetchDepartments();
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData(initialFormData);
          setEditingDepartment(null);
          setIsEditing(false);
          setShowDepartmentsList(true);
          setSubmitStatus({ type: null, message: '' });
          setErrors({});
        }, 2000);
      } else {
        // Handle validation errors
        if (result.details && Array.isArray(result.details)) {
          setSubmitStatus({
            type: 'error',
            message: result.details.join(', ')
          });
        } else {
          setSubmitStatus({
            type: 'error',
            message: result.error || `Failed to ${isEditing ? 'update' : 'create'} department`
          });
        }
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} department:`, error);
      setSubmitStatus({
        type: 'error',
        message: `Network error: ${error instanceof Error ? error.message : 'Please check your connection and try again.'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    // TODO: Implement save as draft functionality
    console.log("Save as draft:", formData);
    setSubmitStatus({
      type: 'success',
      message: 'Draft functionality will be implemented in a future update.'
    });
    setTimeout(() => {
      setSubmitStatus({ type: null, message: '' });
    }, 2000);
  };

  const handleCreateNew = () => {
    setFormData(initialFormData);
    setEditingDepartment(null);
    setIsEditing(false);
    setShowDepartmentsList(false);
    setErrors({});
    setSubmitStatus({ type: null, message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: 'url("/2.png")',
            backgroundPosition: 'center center',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#8D153A]/10 to-[#FF5722]/5 border border-[#8D153A]/20">
                <Building2 className="w-8 h-8 text-[#8D153A]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                  {isEditing ? 'Edit Department' : 'Department Management'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {isEditing ? 'Update department information' : 'Create and manage your organization\'s departments'}
                </p>
              </div>
            </div>
            
            {/* Toggle View Buttons */}
            <div className="flex gap-2">
              {isEditing && (
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
                >
                  Cancel Edit
                </button>
              )}
              <button
                onClick={() => showDepartmentsList ? handleCreateNew() : setShowDepartmentsList(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#8D153A]/10 to-[#FF5722]/5 border border-[#8D153A]/20 text-[#8D153A] rounded-xl hover:from-[#8D153A]/20 hover:to-[#FF5722]/10 transition-all duration-200"
              >
                {showDepartmentsList ? 'Create New' : 'View Departments'}
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {submitStatus.type && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-300' 
              : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300'
          }`}>
            {submitStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <span className="font-medium">{submitStatus.message}</span>
          </div>
        )}

        {/* Departments List View */}
        {showDepartmentsList && !isEditing && (
          <div className="mb-8">
            {/* Search and Filter Controls */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search departments by name, code, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                      className="pl-10 pr-8 py-3 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Departments Grid */}
              {isLoadingDepartments ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#8D153A]/30 border-t-[#8D153A] rounded-full animate-spin" />
                </div>
              ) : filteredDepartments.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {departments.length === 0 ? 'No departments created yet' : 'No departments match your search'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {departments.length === 0 ? 'Create your first department to get started' : 'Try adjusting your search criteria'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDepartments.map((department) => (
                    <div
                      key={department._id}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      {/* Department Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-[#8D153A]/10 to-[#FF5722]/5 border border-[#8D153A]/20">
                            <Building2 className="w-5 h-5 text-[#8D153A]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{department.name}</h3>
                            <p className="text-sm text-gray-500">{department.code}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          department.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {department.status}
                        </span>
                      </div>

                      {/* Department Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{department.location}</span>
                        </div>
                        {department.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{department.email}</span>
                          </div>
                        )}
                        {department.budget && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4" />
                            <span>${parseFloat(department.budget).toLocaleString()}</span>
                          </div>
                        )}
                        {department.tags && department.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {department.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-full text-xs text-blue-700 dark:text-blue-300"
                              >
                                {tag}
                              </span>
                            ))}
                            {department.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                                +{department.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Department Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {department.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditDepartment(department)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 text-blue-600 rounded-lg hover:from-blue-500/20 hover:to-blue-600/10 transition-all duration-200 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(department._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500/10 to-red-600/5 border border-red-500/20 text-red-600 rounded-lg hover:from-red-500/20 hover:to-red-600/10 transition-all duration-200 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Department Form */}
        {(!showDepartmentsList || isEditing) && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-[#8D153A]/10 to-[#FF5722]/5 border border-[#8D153A]/20">
                      <Building2 className="w-5 h-5 text-[#8D153A]" />
                    </div>
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Department Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Department Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 ${
                          errors.name ? "border-red-300" : "border-gray-200 dark:border-gray-600"
                        }`}
                        placeholder="e.g., Human Resources"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Department Code */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Department Code *
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 ${
                          errors.code ? "border-red-300" : "border-gray-200 dark:border-gray-600"
                        }`}
                        placeholder="e.g., HR001"
                      />
                      {errors.code && (
                        <p className="text-sm text-red-500">{errors.code}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 resize-none ${
                          errors.description ? "border-red-300" : "border-gray-200 dark:border-gray-600"
                        }`}
                        placeholder="Brief description of the department's role and responsibilities..."
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Contact Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          errors.location ? "border-red-300" : "border-gray-200 dark:border-gray-600"
                        }`}
                        placeholder="e.g., Building A, Floor 3"
                      />
                      {errors.location && (
                        <p className="text-sm text-red-500">{errors.location}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          errors.phone ? "border-red-300" : "border-gray-200 dark:border-gray-600"
                        }`}
                        placeholder="e.g., +1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 ${
                          errors.email ? "border-red-300" : "border-gray-200 dark:border-gray-600"
                        }`}
                        placeholder="e.g., hr@company.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20">
                      <Plus className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Tags & Categories</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50"
                        placeholder="Add tags (e.g., administrative, support, core)"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Tags Display */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 rounded-full text-sm text-green-700 dark:text-green-300"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-red-500 transition-colors duration-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Financial Information */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20">
                      <Users className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h2 className="text-lg font-semibold">Additional Details</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Budget */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Annual Budget ($)
                      </label>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 ${
                          errors.budget ? "border-red-300" : "border-gray-200 dark:border-gray-600"
                        }`}
                        placeholder="e.g., 500000"
                        min="0"
                        step="1000"
                      />
                      {errors.budget && (
                        <p className="text-sm text-red-500">{errors.budget}</p>
                      )}
                    </div>

                    {/* Established Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Established Date
                      </label>
                      <input
                        type="date"
                        name="establishedDate"
                        value={formData.establishedDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Department Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white rounded-xl hover:from-[#8D153A]/90 hover:to-[#FF5722]/90 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {isLoading ? (isEditing ? "Updating Department..." : "Creating Department...") : (isEditing ? "Update Department" : "Create Department")}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveAsDraft}
                      disabled={isLoading}
                      className="w-full px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Save as Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}