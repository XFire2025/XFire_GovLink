"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  User,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth/AdminAuthContext";

interface Admin {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "SUPERADMIN";
  accountStatus: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "ADMIN" | "SUPERADMIN";
  accountStatus?: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showActions, setShowActions] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deleteModalAdmin, setDeleteModalAdmin] = useState<Admin | null>(null);

  // Form states
  const [formData, setFormData] = useState<AdminFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ADMIN",
    accountStatus: "ACTIVE",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { admin, getAuthHeaders, isAuthenticated, isLoading } = useAdminAuth();

  // Redirect if not super admin
  useEffect(() => {
    if (admin && admin.role !== "SUPERADMIN") {
      router.push("/admin/dashboard");
    }
  }, [admin, router]);

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admin/admins", {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins);
      } else {
        console.error("Failed to fetch admins");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admins only when authenticated
  useEffect(() => {
    if (isAuthenticated && admin?.role === "SUPERADMIN") {
      fetchAdmins();
    } else if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, admin, isLoading, router, fetchAdmins]);

  // Handle delete admin
  const handleDeleteAdmin = async (adminToDelete: Admin) => {
    try {
      const response = await fetch(`/api/admin/admins/${adminToDelete.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (response.ok) {
        setAdmins(admins.filter((a) => a.id !== adminToDelete.id));
        setDeleteModalAdmin(null);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Error deleting admin");
    }
  };

  // Form validation
  const validateForm = (isEdit = false) => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!isEdit && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password && !formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormLoading(true);

    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the admin list
        await fetchAdmins();
        // Reset form and close modal
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "ADMIN",
          accountStatus: "ACTIVE",
        });
        setShowCreateModal(false);
        setFormErrors({});
      } else {
        setFormErrors({ submit: data.message || "Failed to create admin" });
      }
    } catch (error) {
      console.error("Create admin error:", error);
      setFormErrors({ submit: "Network error. Please try again." });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle edit admin
  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(true) || !editingAdmin) {
      return;
    }

    setFormLoading(true);

    try {
      const updateData: {
        fullName: string;
        email: string;
        role: "ADMIN" | "SUPERADMIN";
        accountStatus?: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
        password?: string;
      } = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        accountStatus: formData.accountStatus,
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/admin/admins/${editingAdmin.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the admin list
        await fetchAdmins();
        // Reset form and close modal
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "ADMIN",
          accountStatus: "ACTIVE",
        });
        setShowEditModal(false);
        setEditingAdmin(null);
        setFormErrors({});
      } else {
        setFormErrors({ submit: data.message || "Failed to update admin" });
      }
    } catch (error) {
      console.error("Edit admin error:", error);
      setFormErrors({ submit: "Network error. Please try again." });
    } finally {
      setFormLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (adminToEdit: Admin) => {
    setEditingAdmin(adminToEdit);
    setFormData({
      fullName: adminToEdit.fullName,
      email: adminToEdit.email,
      password: "",
      confirmPassword: "",
      role: adminToEdit.role,
      accountStatus: adminToEdit.accountStatus,
    });
    setFormErrors({});
    setShowEditModal(true);
    setShowActions(null);
  };

  // Close modals
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ADMIN",
      accountStatus: "ACTIVE",
    });
    setFormErrors({});
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingAdmin(null);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ADMIN",
      accountStatus: "ACTIVE",
    });
    setFormErrors({});
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Filter admins
  const filteredAdmins = admins.filter((adminItem) => {
    const matchesSearch =
      adminItem.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adminItem.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || adminItem.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Helper functions for badges
  const getRoleBadge = (role: string) => {
    if (role === "SUPERADMIN") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-800 dark:text-purple-200 text-xs font-medium rounded-full">
          <ShieldCheck className="w-3 h-3" />
          Super Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
        <Shield className="w-3 h-3" />
        Admin
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            Suspended
          </span>
        );
      case "DEACTIVATED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Deactivated
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#8D153A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Admin Management
          </h1>
          <p className="text-muted-foreground">
            Manage system administrators and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white rounded-lg hover:from-[#8D153A]/90 hover:to-[#FF5722]/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Admin
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search admins by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]"
              />
            </div>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]"
          >
            <option value="all">All Roles</option>
            <option value="SUPERADMIN">Super Admin</option>
            <option value="ADMIN">Normal Admin</option>
          </select>

          <div className="flex items-center text-sm text-muted-foreground">
            <Filter className="w-4 h-4 mr-2" />
            {filteredAdmins.length} of {admins.length} admins
          </div>
        </div>
      </div>

      {/* Admin List */}
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Admin
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Last Login
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Created
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((adminItem) => (
                <tr
                  key={adminItem.id}
                  className="border-b border-border hover:bg-muted/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#8D153A]/20 to-[#FF5722]/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#8D153A]" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {adminItem.fullName}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {adminItem.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{getRoleBadge(adminItem.role)}</td>
                  <td className="p-4">
                    {getStatusBadge(adminItem.accountStatus)}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {adminItem.lastLoginAt
                        ? new Date(adminItem.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {new Date(adminItem.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowActions(
                            showActions === adminItem.id ? null : adminItem.id
                          )
                        }
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {showActions === adminItem.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => openEditModal(adminItem)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Admin
                          </button>
                          {adminItem.id !== admin?._id && (
                            <button
                              onClick={() => {
                                setDeleteModalAdmin(adminItem);
                                setShowActions(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Admin
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAdmins.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No admins found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Create New Admin
              </h3>
              <button
                onClick={closeCreateModal}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              {/* Error Message */}
              {formErrors.submit && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {formErrors.submit}
                  </p>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A] ${
                      formErrors.fullName ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Enter full name"
                  />
                </div>
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A] ${
                      formErrors.email ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A] ${
                      formErrors.password ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A] ${
                      formErrors.confirmPassword
                        ? "border-red-500"
                        : "border-border"
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Role *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]"
                  >
                    <option value="ADMIN">Normal Admin</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white rounded-lg hover:from-[#8D153A]/90 hover:to-[#FF5722]/90 transition-all disabled:opacity-50"
                >
                  {formLoading ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && editingAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Edit Admin
              </h3>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditAdmin} className="p-6 space-y-4">
              {/* Error Message */}
              {formErrors.submit && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {formErrors.submit}
                  </p>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label
                  htmlFor="edit-fullName"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    id="edit-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A] ${
                      formErrors.fullName ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Enter full name"
                  />
                </div>
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="edit-email"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A] ${
                      formErrors.email ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password (Optional for edit) */}
              <div>
                <label
                  htmlFor="edit-password"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  New Password (Leave blank to keep current)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="edit-password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A] ${
                      formErrors.password ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password (Only if password is provided) */}
              {formData.password && (
                <div>
                  <label
                    htmlFor="edit-confirmPassword"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="edit-confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A] ${
                        formErrors.confirmPassword
                          ? "border-red-500"
                          : "border-border"
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Role */}
              <div>
                <label
                  htmlFor="edit-role"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Role *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <select
                    id="edit-role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]"
                  >
                    <option value="ADMIN">Normal Admin</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <label
                  htmlFor="edit-accountStatus"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Account Status *
                </label>
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <select
                    id="edit-accountStatus"
                    name="accountStatus"
                    value={formData.accountStatus}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="DEACTIVATED">Deactivated</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white rounded-lg hover:from-[#8D153A]/90 hover:to-[#FF5722]/90 transition-all disabled:opacity-50"
                >
                  {formLoading ? "Updating..." : "Update Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete Admin
            </h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete{" "}
              <strong>{deleteModalAdmin.fullName}</strong>? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModalAdmin(null)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAdmin(deleteModalAdmin)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
