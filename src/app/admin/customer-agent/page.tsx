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
      case 'active': return 'text-[#008060] bg-[#008060]/10 border-[#008060]/20';
      case 'busy': return 'text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/20';
      case 'away': return 'text-[#FFC72C] bg-[#FFC72C]/10 border-[#FFC72C]/20';
      case 'offline': return 'text-muted-foreground bg-muted/10 border-border/20';
      default: return 'text-muted-foreground bg-muted/10 border-border/20';
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#8D153A]/20 to-[#8D153A]/10 group-hover:scale-110 transition-transform duration-300">
            <UserCog className="w-6 h-6 text-[#8D153A]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{agents.length}</div>
            <div className="text-sm text-muted-foreground">Total Agents</div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#008060]/20 to-[#008060]/10 group-hover:scale-110 transition-transform duration-300">
            <CheckCircle className="w-6 h-6 text-[#008060]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Online Now</div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#FFC72C]/20 to-[#FFC72C]/10 group-hover:scale-110 transition-transform duration-300">
            <MessageSquare className="w-6 h-6 text-[#FFC72C]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {chatSessions.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Chats</div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#FF5722]/20 to-[#FF5722]/10 group-hover:scale-110 transition-transform duration-300">
            <Star className="w-6 h-6 text-[#FF5722]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {(agents.reduce((sum, agent) => sum + agent.performance.averageRating, 0) / agents.length).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const AgentsView = () => (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agent Management</h2>
          <p className="text-muted-foreground">Manage customer service agents and their performance</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#8D153A] to-[#FF5722] text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 modern-card">
          <Plus className="w-4 h-4" />
          Add Agent
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
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-card/60 dark:bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl focus:ring-2 focus:ring-[#8D153A]/20 focus:border-[#8D153A]/50 transition-all duration-300 modern-card hover:shadow-md"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="busy">Busy</option>
            <option value="away">Away</option>
            <option value="offline">Offline</option>
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

      {/* Enhanced Agents Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="grid gap-6"
      >
        {filteredAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
            className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow hover:shadow-2xl hover:border-[#8D153A]/30 transition-all duration-500 modern-card group"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Agent Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#8D153A]/20 to-[#8D153A]/30 rounded-full flex items-center justify-center border-2 border-[#8D153A]/30 shadow-md transition-all duration-300 group-hover:scale-110">
                        <UserCog className="w-6 h-6 text-[#8D153A]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-[#8D153A] transition-colors duration-300">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground">{agent.department} • ID: {agent.id}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getStatusColor(agent.status)}`}>
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

                  {/* Enhanced Performance Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg hover:bg-card/60 transition-all duration-300 hover:scale-105">
                      <div className="text-lg font-bold text-foreground">{agent.performance.totalChats}</div>
                      <div className="text-xs text-muted-foreground">Total Chats</div>
                    </div>
                    <div className="text-center p-3 bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg hover:bg-card/60 transition-all duration-300 hover:scale-105">
                      <div className="text-lg font-bold text-[#008060]">{calculateResolutionRate(agent)}%</div>
                      <div className="text-xs text-muted-foreground">Resolution Rate</div>
                    </div>
                    <div className="text-center p-3 bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg hover:bg-card/60 transition-all duration-300 hover:scale-105">
                      <div className="text-lg font-bold text-[#FFC72C]">{agent.performance.averageRating}</div>
                      <div className="text-xs text-muted-foreground">Avg Rating</div>
                    </div>
                    <div className="text-center p-3 bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg hover:bg-card/60 transition-all duration-300 hover:scale-105">
                      <div className="text-lg font-bold text-[#8D153A]">{formatTime(agent.performance.responseTime)}</div>
                      <div className="text-xs text-muted-foreground">Response Time</div>
                    </div>
                  </div>

                  {/* Enhanced Workload */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-foreground">Current Workload</span>
                      <span className="font-semibold text-[#8D153A]">{agent.currentWorkload}/{agent.maxWorkload} chats</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2 border border-border/20">
                      <div 
                        className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] h-2 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${(agent.currentWorkload / agent.maxWorkload) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Enhanced Specializations & Languages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Specializations:</h4>
                      <div className="flex flex-wrap gap-1">
                        {agent.specializations.map((spec, index) => (
                          <span key={index} className="px-2 py-1.5 bg-[#8D153A]/10 text-[#8D153A] border border-[#8D153A]/20 rounded-full text-xs font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Languages:</h4>
                      <div className="flex flex-wrap gap-1">
                        {agent.languages.map((lang, index) => (
                          <span key={index} className="px-2 py-1.5 bg-[#008060]/10 text-[#008060] border border-[#008060]/20 rounded-full text-xs font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
              </div>

                {/* Enhanced Actions */}
                <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                  <button
                    onClick={() => setSelectedAgent(agent)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#8D153A]/50 transition-all duration-300 hover:scale-105 modern-card"
                  >
                    <Eye className="w-4 h-4 text-[#8D153A]" />
                    View Profile
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#FFC72C]/50 transition-all duration-300 hover:scale-105 modern-card">
                    <Edit className="w-4 h-4 text-[#FFC72C]" />
                    Edit Details
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#008060]/50 transition-all duration-300 hover:scale-105 modern-card">
                    <BarChart3 className="w-4 h-4 text-[#008060]" />
                    Performance
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 hover:border-[#FF5722]/50 transition-all duration-300 hover:scale-105 modern-card">
                    <MoreHorizontal className="w-4 h-4 text-[#FF5722]" />
                    More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
    </div>
  );

  return (
    <div className="relative min-h-full">
      {/* Main content */}
      <div className="space-y-6">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="animate-fade-in-up"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <span className="flex items-center gap-3">
              <UserCog className="w-8 h-8 text-[#8D153A]" />
              <span className="text-foreground">Customer & Agent</span>{' '}
              <span className="bg-gradient-to-r from-[#8D153A] to-[#FF5722] bg-clip-text text-transparent">
                Management
              </span>
            </span>
          </h1>
          <p className="text-muted-foreground">
            Manage customer service agents, monitor chat sessions, and analyze performance metrics.
          </p>
        </motion.div>

        <AgentStats />

        {/* Enhanced Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="border-b border-border/30 bg-card/30 backdrop-blur-sm rounded-t-xl"
        >
          <nav className="flex space-x-8 px-4">
            <button
              onClick={() => setActiveTab('agents')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === 'agents'
                  ? 'border-[#8D153A] text-[#8D153A] bg-[#8D153A]/5 rounded-t-lg'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-card/20 rounded-t-lg'
              }`}
            >
              Agents
            </button>
            <button
              onClick={() => setActiveTab('chats')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === 'chats'
                  ? 'border-[#FFC72C] text-[#FFC72C] bg-[#FFC72C]/5 rounded-t-lg'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-card/20 rounded-t-lg'
              }`}
            >
              Chat Sessions
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
                activeTab === 'analytics'
                  ? 'border-[#008060] text-[#008060] bg-[#008060]/5 rounded-t-lg'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-card/20 rounded-t-lg'
              }`}
            >
              Analytics
            </button>
          </nav>
        </motion.div>

        {/* Enhanced Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'agents' && <AgentsView />}
          {activeTab === 'chats' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 modern-card"
            >
              <MessageSquare className="w-16 h-16 text-[#FFC72C]/60 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Chat Sessions Management</h3>
              <p className="text-muted-foreground">Real-time chat monitoring and management interface would be implemented here.</p>
            </motion.div>
          )}
          {activeTab === 'analytics' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 modern-card"
            >
              <TrendingUp className="w-16 h-16 text-[#008060]/60 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground">Detailed analytics dashboard with charts and performance metrics would be implemented here.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Agent Detail Modal */}
        {selectedAgent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card/95 dark:bg-card/98 backdrop-blur-md border border-border/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl modern-card"
            >
              <div className="p-6 border-b border-border/30 bg-gradient-to-r from-[#8D153A]/5 to-[#FF5722]/5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                    <UserCog className="w-6 h-6 text-[#8D153A]" />
                    <span>Agent Profile</span>
                  </h2>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="p-2 hover:bg-[#FF5722]/10 rounded-lg transition-all duration-300 hover:scale-110 text-[#FF5722]"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-r from-[#8D153A]/5 to-[#FF5722]/5 p-4 rounded-lg border border-border/30">
                  <p className="text-muted-foreground text-center">Detailed agent profile with performance history, certifications, and management tools would be implemented here.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAgentManagement;
