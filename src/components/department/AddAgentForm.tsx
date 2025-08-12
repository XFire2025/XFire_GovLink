// src/components/department/AddAgentForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import CustomMultiSelect from './CustomMultiSelect';

// Define and export a specific interface for the form data
export interface AgentFormData {
  fullName: string;
  email: string;
  password?: string; // Password is optional for editing
  assignedServices: string[];
}

interface Service { id: string; name: string; }
interface Agent { id: string; name: string; email: string; assignedServices?: string[]; }

interface AddAgentFormProps {
  onSave: (agentData: AgentFormData) => void;
  onClose: () => void;
  agentToEdit?: Agent | null;
  services: Service[];
}

export default function AddAgentForm({ onSave, onClose, agentToEdit, services }: AddAgentFormProps) {
  const isEditMode = !!agentToEdit;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode && agentToEdit) {
      setFormData({ fullName: agentToEdit.name, email: agentToEdit.email, password: '' });
      setSelectedServices(agentToEdit.assignedServices || []);
    } else {
      setFormData({ fullName: '', email: '', password: '' });
      setSelectedServices([]);
    }
  }, [agentToEdit, isEditMode]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Construct the data object with a specific type
    const saveData: AgentFormData = {
        fullName: formData.fullName,
        email: formData.email,
        assignedServices: selectedServices,
    };
    if (!isEditMode && formData.password) {
        saveData.password = formData.password;
    }

    onSave(saveData);
    setIsLoading(false);
    onClose();
  };

  const inputStyles = "w-full bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/20 transition-all duration-300 backdrop-blur-sm hover:border-[#FFC72C]/50";
  const labelStyles = "block text-sm font-semibold text-foreground mb-3 flex items-center gap-2";

  const serviceOptions = services.map(service => ({ value: service.id, label: service.name }));

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-2">
      <div className="space-y-6">
        <h4 className="text-lg font-bold text-foreground">Agent Details</h4>
        <div>
          <label className={labelStyles}><User className="w-4 h-4" /> Full Name</label>
          <input type="text" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className={inputStyles} required />
        </div>
        <div>
          <label className={labelStyles}><Mail className="w-4 h-4" /> Official Email</label>
          <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={inputStyles} required />
        </div>
      </div>
      <div className="space-y-6">
        <h4 className="text-lg font-bold text-foreground">Assign Services</h4>
        <CustomMultiSelect options={serviceOptions} selectedValues={selectedServices} onChange={setSelectedServices} placeholder="Select services..." />
      </div>
      {!isEditMode && (
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-foreground">Initial Credentials</h4>
          <div>
            <label className={labelStyles}><Lock className="w-4 h-4" /> Temporary Password</label>
            <input type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className={inputStyles} required={!isEditMode} />
          </div>
        </div>
      )}
      <div className="flex justify-end gap-4 pt-6 border-t border-border/30">
        <button type="button" onClick={onClose} className="px-6 py-3 bg-card/30 border border-border/50 rounded-xl">Cancel</button>
        <button type="submit" disabled={isLoading} className="px-6 py-3 bg-gradient-to-r from-[#008060] to-[#8D153A] text-white rounded-xl disabled:opacity-50">
          {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Agent')}
        </button>
      </div>
    </form>
  );
}