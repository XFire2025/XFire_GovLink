"use client";
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
  XCircle,
  Eye,
  EyeOff,
  DollarSign,
  Hash,
  FileText,
  Tag,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DepartmentFormData {
  _id?: string;
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
  password: string;
}

interface Department extends DepartmentFormData {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string[];
  data?: Department[] | Department | null;
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
  password: "",
};

// Department Details Modal Component
const DepartmentDetailsModal: React.FC<{
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ department, isOpen, onClose }) => {
  if (!isOpen || !department) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#8D153A]/10 to-[#FF5722]/10 border-b border-border/30 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#8D153A]/20 to-[#FF5722]/20 border border-[#8D153A]/30">
                  <Building2 className="w-6 h-6 text-[#8D153A]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {department.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Department Details
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-card/80 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#8D153A]" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Department Code</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <Hash className="w-4 h-4 text-[#FFC72C]" />
                      {department.code}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        department.status === "active"
                          ? "bg-[#008060]/10 text-[#008060] border-[#008060]/20"
                          : "bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20"
                      }`}
                    >
                      {department.status === "active" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {department.status.charAt(0).toUpperCase() +
                        department.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-foreground">{department.description}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {department.location}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      {department.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      {department.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-600" />
                  Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Annual Budget</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      {department.budget
                        ? `$${parseFloat(department.budget).toLocaleString()}`
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Established Date</p>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      {department.establishedDate
                        ? new Date(department.establishedDate).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {department.tags && department.tags.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Tag className="w-5 h-5 text-green-600" />
                    Tags & Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {department.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 rounded-full text-sm text-green-700 dark:text-green-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              {(department.createdAt || department.updatedAt) && (
                <div className="space-y-2 pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    Created: {department.createdAt ? new Date(department.createdAt).toLocaleString() : "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last Updated: {department.updatedAt ? new Date(department.updatedAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function CreateDepartmentPage() {
  const [formData, setFormData] = useState<DepartmentFormData>(initialFormData);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<DepartmentFormData>>({});
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDepartmentsList, setShowDepartmentsList] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoadingDepartments(true);
      const response = await fetch("/api/admin/departments");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        const mappedDepartments = Array.isArray(result.data)
          ? (result.data as Department[]).map((dept: Department) => ({
              ...dept,
              _id: dept._id || (dept as Department & { id?: string }).id || '',
            }))
          : [];
        setDepartments(mappedDepartments);
      } else {
        console.error("Failed to fetch departments:", result.error);
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const handleViewDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDetailsModal(true);
  };

  const handleEditDepartment = (department: Department) => {
    const editData = {
      ...department,
      _id: department._id || (department as Department & { id?: string }).id || '',
      password: "",
    };
    setFormData(editData);
    setEditingDepartment(editData);
    setIsEditing(true);
    setShowDepartmentsList(false);
    setSubmitStatus({ type: null, message: "" });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingDepartment(null);
    setIsEditing(false);
    setShowDepartmentsList(true);
    setErrors({});
    setSubmitStatus({ type: null, message: "" });
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this department? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/departments/${departmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: "Department deleted successfully!",
        });
        fetchDepartments();

        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" });
        }, 3000);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Failed to delete department",
        });
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      setSubmitStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
    }
  };

    const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof DepartmentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
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
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    if (
      formData.budget &&
      (isNaN(parseFloat(formData.budget)) ||
        parseFloat(formData.budget) < 0)
    ) {
      newErrors.budget = "Budget must be a valid positive number";
    }

    // Password validation - always required
    if (!formData.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the validation errors before submitting.",
      });
      return;
    }

    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const url = isEditing
        ? `/api/admin/departments/${editingDepartment?._id}`
        : "/api/admin/departments";
      const method = isEditing ? "PUT" : "POST";

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id: departmentId, ...rest } = formData;
      const payload: Omit<DepartmentFormData, '_id'> & { password: string } = {
        ...rest,
        budget: formData.budget ? parseFloat(formData.budget).toString() : "",
        tags: formData.tags || [],
        password: formData.password.trim(),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message:
            result.message ||
            `Department ${isEditing ? "updated" : "created"} successfully!`,
        });

        await fetchDepartments();

        setTimeout(() => {
          setFormData(initialFormData);
          setEditingDepartment(null);
          setIsEditing(false);
          setShowDepartmentsList(true);
          setSubmitStatus({ type: null, message: "" });
          setErrors({});
        }, 2000);
      } else {
        if (result.details && Array.isArray(result.details)) {
          setSubmitStatus({
            type: "error",
            message: result.details.join(", "),
          });
        } else {
          setSubmitStatus({
            type: "error",
            message:
              result.error ||
              `Failed to ${isEditing ? "update" : "create"} department`,
          });
        }
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} department:`,
        error
      );
      setSubmitStatus({
        type: "error",
        message: `Network error: ${
          error instanceof Error
            ? error.message
            : "Please check your connection and try again."
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    console.log("Save as draft:", formData);
    setSubmitStatus({
      type: "success",
      message: "Draft functionality will be implemented in a future update.",
    });
    setTimeout(() => {
      setSubmitStatus({ type: null, message: "" });
    }, 2000);
  };

  const handleCreateNew = () => {
    setFormData(initialFormData);
    setEditingDepartment(null);
    setIsEditing(false);
    setShowDepartmentsList(false);
    setErrors({});
    setSubmitStatus({ type: null, message: "" });
  };

  return (
    <div className="relative min-h-full">
      {/* Department Details Modal */}
      <DepartmentDetailsModal
        department={selectedDepartment}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />

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
                <Building2 className="w-8 h-8 text-[#8D153A]" />
                <span className="text-foreground">Department</span>{" "}
                <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                  Management
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground">
              Create and manage your organization&apos;s departments
            </p>
          </div>

          {/* Toggle View Buttons */}
          <div className="flex gap-2">
            {isEditing && (
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#FF5722]/50 transition-all duration-300 modern-card"
              >
                <X className="w-4 h-4" />
                Cancel Edit
              </button>
            )}
            <button
              onClick={() =>
                showDepartmentsList ? handleCreateNew() : setShowDepartmentsList(true)
              }
              className="flex items-center gap-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 modern-card"
            >
              <Plus className="w-4 h-4" />
              {showDepartmentsList ? "Create New" : "View Departments"}
            </button>
          </div>
        </motion.div>

        {/* Status Messages */}
        {submitStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl flex items-center gap-3 ${
              submitStatus.type === "success"
                ? "bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-300"
                : "bg-red-100 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300"
            }`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{submitStatus.message}</span>
          </motion.div>
        )}

        {/* Departments List View */}
        {showDepartmentsList && !isEditing && (
          <div className="space-y-6">
            {/* Search and Filter Controls */}
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
                  placeholder="Search departments by name, code, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "all" | "active" | "inactive")
                  }
                  className="px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button className="flex items-center gap-2 px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#FFC72C]/50 transition-all duration-300 modern-card hover:shadow-md">
                  <Filter className="w-4 h-4 text-[#FFC72C]" />
                  Filter
                </button>
              </div>
            </motion.div>

            {/* Departments Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card overflow-hidden"
            >
              {isLoadingDepartments ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#8D153A]/30 border-t-[#8D153A] rounded-full animate-spin" />
                </div>
              ) : filteredDepartments.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {departments.length === 0
                      ? "No departments created yet"
                      : "No departments match your search"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {departments.length === 0
                      ? "Create your first department to get started"
                      : "Try adjusting your search criteria"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#8D153A]/5 to-[#FF5722]/5 border-b border-border/30">
                      <tr>
                        <th className="text-left p-4 font-semibold text-foreground">
                          Department
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground">
                          Location
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground">
                          Status
                        </th>
                        <th className="text-left p-4 font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDepartments.map((department, index) => (
                        <motion.tr
                          key={department._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                          className="border-t border-border/20 hover:bg-card/30 transition-all duration-300 group cursor-pointer"
                          onClick={() => handleViewDepartment(department)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-[#8D153A]/10 to-[#FF5722]/10 border border-[#8D153A]/20">
                                <Building2 className="w-5 h-5 text-[#8D153A]" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground group-hover:text-[#8D153A] transition-colors duration-300">
                                  {department.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Code: {department.code}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <span className="text-foreground">{department.location}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                                department.status === "active"
                                  ? "bg-[#008060]/10 text-[#008060] border-[#008060]/20"
                                  : "bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20"
                              }`}
                            >
                              {department.status === "active" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {department.status.charAt(0).toUpperCase() +
                                department.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDepartment(department);
                                }}
                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-lg transition-all duration-300 hover:scale-110"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditDepartment(department);
                                }}
                                className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 rounded-lg transition-all duration-300 hover:scale-110"
                                title="Edit Department"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDepartment(department._id);
                                }}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition-all duration-300 hover:scale-110"
                                title="Delete Department"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Create/Edit Department Form */}
        {(!showDepartmentsList || isEditing) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#8D153A]/10 to-[#FF5722]/10 border-b border-border/30 p-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#8D153A]/20 to-[#FF5722]/20 border border-[#8D153A]/30">
                  <Building2 className="w-6 h-6 text-[#8D153A]" />
                </div>
                {isEditing ? "Edit Department" : "Create New Department"}
              </h2>
              <p className="text-muted-foreground mt-1">
                {isEditing
                  ? "Update department information"
                  : "Fill in the details to create a new department"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#8D153A]" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter department name"
                      className={`w-full px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border rounded-xl focus:ring-2 transition-all duration-300 modern-card hover:shadow-md ${
                        errors.name
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-border/50 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Department Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter department code (e.g., HR, IT, FIN)"
                      className={`w-full px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border rounded-xl focus:ring-2 transition-all duration-300 modern-card hover:shadow-md ${
                        errors.code
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-border/50 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50"
                      }`}
                    />
                    {errors.code && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.code}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the department's purpose and responsibilities"
                    rows={3}
                    className={`w-full px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border rounded-xl focus:ring-2 transition-all duration-300 modern-card hover:shadow-md resize-none ${
                      errors.description
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-border/50 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter department location"
                      className={`w-full px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border rounded-xl focus:ring-2 transition-all duration-300 modern-card hover:shadow-md ${
                        errors.location
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-border/50 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50"
                      }`}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className={`w-full px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border rounded-xl focus:ring-2 transition-all duration-300 modern-card hover:shadow-md ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-border/50 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter department email"
                    className={`w-full px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border rounded-xl focus:ring-2 transition-all duration-300 modern-card hover:shadow-md ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-border/50 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Additional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Budget
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="Enter annual budget"
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border rounded-xl focus:ring-2 transition-all duration-300 modern-card hover:shadow-md ${
                        errors.budget
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-border/50 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50"
                      }`}
                    />
                    {errors.budget && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.budget}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Established Date
                    </label>
                    <input
                      type="date"
                      name="establishedDate"
                      value={formData.establishedDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-600" />
                  Security
                </h3>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Department Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter department password"
                      className={`w-full px-4 py-2.5 pr-12 bg-card/60 dark:bg-card/40 backdrop-blur-sm border rounded-xl focus:ring-2 transition-all duration-300 modern-card hover:shadow-md ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                          : "border-border/50 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-[#8D153A] transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Tag className="w-5 h-5 text-green-600" />
                  Tags & Categories
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tags (e.g., government, public-service)"
                      className="flex-1 px-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
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
                            className="p-0.5 hover:bg-green-500/20 rounded-full transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/30">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isEditing ? "Update Department" : "Create Department"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#FFC72C]/50 transition-all duration-300 text-foreground disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  Save as Draft
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-red-500/50 transition-all duration-300 text-foreground disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}