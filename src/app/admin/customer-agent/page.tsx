"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCog,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Plus,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  BarChart3
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specializations: string[];
  status: 'active' | 'offline' | 'busy' | 'away';
  joinDate: string;
  lastActive: string;
  performance: {
    totalChats: number;
    resolvedChats: number;
    averageRating: number;
    responseTime: number; // in seconds
    resolutionTime: number; // in minutes
  };
  currentWorkload: number;
  maxWorkload: number;
  languages: string[];
  certifications: string[];
}

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  agentId: string;
  agentName: string;
  status: 'active' | 'resolved' | 'escalated' | 'abandoned';
  startTime: string;
  endTime?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  rating?: number;
  feedback?: string;
}

const CustomerAgentManagement = () => {
  const [agents] = useState<Agent[]>([
    {
      id: 'AGT001',
      name: 'Saman Kumara',
      email: 'saman.kumara@govlink.lk',
      phone: '+94 77 123 4567',
      department: 'General Support',
      specializations: ['Document Processing', 'Account Verification', 'Technical Support'],
      status: 'active',
      joinDate: '2023-08-15',
      lastActive: '5 minutes ago',
      performance: {
        totalChats: 245,
        resolvedChats: 228,
        averageRating: 4.7,
        responseTime: 45,
        resolutionTime: 12
      },
      currentWorkload: 3,
      maxWorkload: 8,
      languages: ['Sinhala', 'English', 'Tamil'],
      certifications: ['Customer Service Excellence', 'Government Services Training']
    },
    {
      id: 'AGT002',
      name: 'Priya Wijesinghe',
      email: 'priya.wijesinghe@govlink.lk',
      phone: '+94 71 234 5678',
      department: 'Business Services',
      specializations: ['Business Registration', 'Licensing', 'Tax Services'],
      status: 'busy',
      joinDate: '2023-06-20',
      lastActive: 'Online now',
      performance: {
        totalChats: 189,
        resolvedChats: 175,
        averageRating: 4.5,
        responseTime: 38,
        resolutionTime: 15
      },
      currentWorkload: 6,
      maxWorkload: 6,
      languages: ['English', 'Sinhala'],
      certifications: ['Business Consultant Certification', 'Advanced Customer Relations']
    },
    {
      id: 'AGT003',
      name: 'Ruwan Fernando',
      email: 'ruwan.fernando@govlink.lk',
      phone: '+94 70 345 6789',
      department: 'Technical Support',
      specializations: ['System Issues', 'Digital Services', 'Mobile App Support'],
      status: 'offline',
      joinDate: '2023-09-10',
      lastActive: '2 hours ago',
      performance: {
        totalChats: 156,
        resolvedChats: 142,
        averageRating: 4.3,
        responseTime: 52,
        resolutionTime: 18
      },
      currentWorkload: 0,
      maxWorkload: 5,
      languages: ['English', 'Sinhala'],
      certifications: ['IT Support Specialist', 'Digital Literacy Training']
    }
  ]);

  const [chatSessions] = useState<ChatSession[]>([
    {
      id: 'CHT001',
      userId: 'USR001',
      userName: 'Amal Perera',
      agentId: 'AGT001',
      agentName: 'Saman Kumara',
      status: 'active',
      startTime: '2024-01-22T14:30:00Z',
      category: 'Document Processing',
      priority: 'medium'
    },
    {
      id: 'CHT002',
      userId: 'USR002',
      userName: 'Nimal Silva',
      agentId: 'AGT002',
      agentName: 'Priya Wijesinghe',
      status: 'resolved',
      startTime: '2024-01-22T13:15:00Z',
      endTime: '2024-01-22T13:45:00Z',
      category: 'Business Registration',
      priority: 'high',
      rating: 5,
      feedback: 'Excellent service, very helpful and quick resolution'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'agents' | 'chats' | 'analytics'>('agents');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'busy': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'away': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'offline': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatTime = (seconds: number) => {
    return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const calculateResolutionRate = (agent: Agent) => {
    return agent.performance.totalChats > 0 
      ? ((agent.performance.resolvedChats / agent.performance.totalChats) * 100).toFixed(1)
      : '0.0';
  };

  const AgentStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="glass-morphism p-6 rounded-2xl border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <UserCog className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{agents.length}</div>
            <div className="text-sm text-muted-foreground">Total Agents</div>
          </div>
        </div>
      </div>
      
      <div className="glass-morphism p-6 rounded-2xl border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Online Now</div>
          </div>
        </div>
      </div>
      
      <div className="glass-morphism p-6 rounded-2xl border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <MessageSquare className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {chatSessions.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Chats</div>
          </div>
        </div>
      </div>
      
      <div className="glass-morphism p-6 rounded-2xl border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Star className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {(agents.reduce((sum, agent) => sum + agent.performance.averageRating, 0) / agents.length).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );

  const AgentsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agent Management</h2>
          <p className="text-muted-foreground">Manage customer service agents and their performance</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search agents..."
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
            <option value="busy">Busy</option>
            <option value="away">Away</option>
            <option value="offline">Offline</option>
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

      {/* Agents Grid */}
      <div className="grid gap-6">
        {filteredAgents.map((agent) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism p-6 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Agent Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/30 rounded-full flex items-center justify-center">
                      <UserCog className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.department} • ID: {agent.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Joined: {agent.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Last active: {agent.lastActive}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-foreground">{agent.performance.totalChats}</div>
                    <div className="text-xs text-muted-foreground">Total Chats</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{calculateResolutionRate(agent)}%</div>
                    <div className="text-xs text-muted-foreground">Resolution Rate</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">{agent.performance.averageRating}</div>
                    <div className="text-xs text-muted-foreground">Avg Rating</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{formatTime(agent.performance.responseTime)}</div>
                    <div className="text-xs text-muted-foreground">Response Time</div>
                  </div>
                </div>

                {/* Workload */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Current Workload</span>
                    <span>{agent.currentWorkload}/{agent.maxWorkload} chats</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(agent.currentWorkload / agent.maxWorkload) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Specializations & Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Specializations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {agent.specializations.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Languages:</h4>
                    <div className="flex flex-wrap gap-1">
                      {agent.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Profile
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit Details
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  Performance
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                  More
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Customer & Agent Management</h1>
        <p className="text-muted-foreground">
          Manage customer service agents, monitor chat sessions, and analyze performance metrics.
        </p>
      </div>

      <AgentStats />

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('agents')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'agents'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            Agents
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'chats'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            Chat Sessions
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'agents' && <AgentsView />}
        {activeTab === 'chats' && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Chat Sessions Management</h3>
            <p className="text-muted-foreground">Real-time chat monitoring and management interface would be implemented here.</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Performance Analytics</h3>
            <p className="text-muted-foreground">Detailed analytics dashboard with charts and performance metrics would be implemented here.</p>
          </div>
        )}
      </motion.div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Agent Profile</h2>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground">Detailed agent profile with performance history, certifications, and management tools would be implemented here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAgentManagement;
