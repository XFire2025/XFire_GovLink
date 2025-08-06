"use client";

import React, { useState } from 'react';
import AdminSidebar from '@/components/adminSystem/AdminSidebar';
import AdminNavbar from '@/components/adminSystem/AdminNavbar';
import AccountVerification from './verification/page';
import AccountSuspension from './suspension/page';
import CustomerAgentManagement from './customer-agent/page';
import AdminReports from './reports/page';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserX, 
  AlertCircle,
  Clock,
  Settings,
  ShieldCheck,
  UserCog,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

// Interface definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'agent' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  joinDate: string;
  lastActive: string;
  avatar?: string;
}

interface SystemConfig {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  dataRetentionDays: number;
}

// Dashboard Stats Component
const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Agents',
      value: '156',
      change: '+5%',
      trend: 'up',
      icon: UserCog,
      color: 'green'
    },
    {
      title: 'Pending Verifications',
      value: '23',
      change: '-8%',
      trend: 'down',
      icon: UserCheck,
      color: 'orange'
    },
    {
      title: 'System Alerts',
      value: '3',
      change: '+2',
      trend: 'up',
      icon: AlertCircle,
      color: 'red'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-morphism p-6 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {stat.change}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// User Management Component
const UserManagement = ({ userType }: { userType: 'normal-users' | 'agents' }) => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Amal Perera',
      email: 'amal.perera@email.com',
      role: userType === 'agents' ? 'agent' : 'user',
      status: 'active',
      verificationStatus: 'verified',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Saman Silva',
      email: 'saman.silva@email.com',
      role: userType === 'agents' ? 'agent' : 'user',
      status: 'pending',
      verificationStatus: 'pending',
      joinDate: '2024-01-20',
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Kamal Fernando',
      email: 'kamal.fernando@email.com',
      role: userType === 'agents' ? 'agent' : 'user',
      status: 'suspended',
      verificationStatus: 'verified',
      joinDate: '2024-01-10',
      lastActive: '1 week ago'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {userType === 'agents' ? 'Agent Management' : 'User Management'}
          </h2>
          <p className="text-muted-foreground">
            Manage {userType === 'agents' ? 'customer service agents' : 'regular users'} and their permissions
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add {userType === 'agents' ? 'Agent' : 'User'}
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
                <tr key={user.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : user.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                      {user.status === 'pending' && <Clock className="w-3 h-3" />}
                      {user.status === 'suspended' && <XCircle className="w-3 h-3" />}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user.verificationStatus === 'verified'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : user.verificationStatus === 'pending'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user.verificationStatus === 'verified' && <ShieldCheck className="w-3 h-3" />}
                      {user.verificationStatus === 'pending' && <Clock className="w-3 h-3" />}
                      {user.verificationStatus === 'rejected' && <XCircle className="w-3 h-3" />}
                      {user.verificationStatus.charAt(0).toUpperCase() + user.verificationStatus.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{user.joinDate}</td>
                  <td className="p-4 text-sm text-muted-foreground">{user.lastActive}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-muted rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'active')}
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
};

// User Verification Component - moved to separate page
// This component is now available at /admin/verification

// System Configuration Component
const SystemConfiguration = () => {
  const [config, setConfig] = useState<SystemConfig>({
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    dataRetentionDays: 365
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleConfigChange = (key: keyof SystemConfig, value: boolean | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Here you would save the configuration to your backend
    setHasChanges(false);
    // Show success notification
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Configuration</h2>
          <p className="text-muted-foreground">Manage system-wide settings and preferences</p>
        </div>
        {hasChanges && (
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">General Settings</h3>
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Maintenance Mode</label>
                <p className="text-sm text-muted-foreground">Temporarily disable public access to the system</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.maintenanceMode}
                  onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">User Registration</label>
                <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.registrationEnabled}
                  onChange={(e) => handleConfigChange('registrationEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Email Verification Required</label>
                <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.emailVerificationRequired}
                  onChange={(e) => handleConfigChange('emailVerificationRequired', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Maximum Login Attempts
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.maxLoginAttempts}
                onChange={(e) => handleConfigChange('maxLoginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Number of failed login attempts before account lockout
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={config.sessionTimeout}
                onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Automatic logout after period of inactivity
              </p>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-morphism p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Data Retention Period (days)
            </label>
            <input
              type="number"
              min="30"
              max="2555"
              value={config.dataRetentionDays}
              onChange={(e) => handleConfigChange('dataRetentionDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-sm text-muted-foreground mt-1">
              How long to retain user data and logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to the GovLink administration panel. Monitor system status and manage users.
              </p>
            </div>
            <DashboardStats />
            
            {/* Recent Activity */}
            <div className="glass-morphism p-6 rounded-2xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">New user registration: Amal Perera</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">User verification completed: Saman Silva</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">System alert: High server load detected</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'normal-users':
        return <UserManagement userType="normal-users" />;
      case 'agents':
        return <UserManagement userType="agents" />;
      case 'user-verification':
        return <AccountVerification />;
      case 'account-suspension':
        return <AccountSuspension />;
      case 'system-configuration':
        return <SystemConfiguration />;
      case 'customer-agent':
        return <CustomerAgentManagement />;
      case 'reports':
        return <AdminReports />;
      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Feature Coming Soon</h3>
            <p className="text-muted-foreground">This feature is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex flex-col lg:ml-0 min-h-screen">
          <AdminNavbar />
          <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gradient-to-br from-background via-background to-muted/5">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
