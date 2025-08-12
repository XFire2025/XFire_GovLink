// src/components/department/AddAgentForm.tsx
"use client";
import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';

interface AgentData {
  fullName: string;
  email: string;
  password: string;
}

interface AddAgentFormProps {
  onSave: (agentData: AgentData) => void;
  onClose: () => void;
}

export default function AddAgentForm({ onSave, onClose }: AddAgentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [agentData, setAgentData] = useState<AgentData>({
    fullName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (field: keyof AgentData, value: string) => {
    setAgentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would send agentData to the server here.
    // For now, we pass it up to the parent component.
    onSave({
      ...agentData,
      // Default statuses for a new agent
      status: 'pending',
      verificationStatus: 'pending',
    } as any); // Using 'as any' to add extra fields for the parent

    setIsLoading(false);
    onClose(); // Close the modal on success
  };

  const inputStyles = "w-full bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20 transition-all duration-300 backdrop-blur-sm hover:border-[#008060]/50";
  const labelStyles = "block text-sm font-semibold text-foreground mb-3 flex items-center gap-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-2">
      {/* Agent Details Section */}
      <div className="space-y-6">
        <h4 className="text-lg font-bold text-foreground flex items-center gap-3">
          <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FF5722] rounded-full animate-pulse"></div>
          Agent Details
          <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
        </h4>
        
        <div>
          <label className={labelStyles}>
            <User className="w-4 h-4" /> Full Name
          </label>
          <input
            type="text"
            value={agentData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={inputStyles}
            placeholder="e.g., Nimali Gunaratne"
            required
          />
        </div>
        
        <div>
          <label className={labelStyles}>
            <Mail className="w-4 h-4" /> Official Email
          </label>
          <input
            type="email"
            value={agentData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={inputStyles}
            placeholder="e.g., nimali.g@dept.gov.lk"
            required
          />
        </div>
      </div>

      {/* Credentials Section */}
      <div className="space-y-6">
        <h4 className="text-lg font-bold text-foreground flex items-center gap-3">
          <div className="w-2 h-2 bg-gradient-to-r from-[#FF5722] to-[#8D153A] rounded-full animate-pulse"></div>
          Initial Credentials
          <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent"></div>
        </h4>
        
        <div>
          <label className={labelStyles}>
            <Lock className="w-4 h-4" /> Temporary Password
          </label>
          <input
            type="password"
            value={agentData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={inputStyles}
            placeholder="Create a strong initial password"
            required
          />
           <p className="text-xs text-muted-foreground mt-2">The agent will be required to change this on first login.</p>
        </div>
      </div>
      
      {/* Footer / Actions */}
      <div className="flex justify-end items-center gap-4 pt-6 border-t border-border/30">
        <button type="button" onClick={onClose} className="px-6 py-3 bg-card/30 border border-border/50 rounded-xl text-foreground hover:bg-card/50 transition-all duration-300">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-6 py-3 bg-gradient-to-r from-[#008060] to-[#8D153A] text-white rounded-xl hover:from-[#8D153A] hover:to-[#008060] transition-all duration-300 disabled:opacity-50">
          {isLoading ? 'Creating...' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
}