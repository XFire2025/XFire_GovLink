// src/components/department/AddAgentModal.tsx
"use client";
import React from 'react';
import { X } from 'lucide-react';
import AddAgentForm, { AgentFormData } from './AddAgentForm'; // Import the specific interface

import { Agent } from '@/lib/services/departmentApiService';

interface Service { id: string; name: string; }

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agentData: AgentFormData) => void; // Use the specific interface
  agentToEdit?: Agent | null;
  services: Service[];
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose, onSave, agentToEdit, services }) => {
  if (!isOpen) return null;

  const isEditMode = !!agentToEdit;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-glow">
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-2xl font-bold">{isEditMode ? 'Edit Agent' : 'Add New Agent'}</h2>
            <p className="text-sm text-muted-foreground">{isEditMode ? 'Update the agent\'s details and service assignments.' : 'Fill in the details for the new agent.'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-card/30" aria-label="Close modal">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
            <AddAgentForm onClose={onClose} onSave={onSave} agentToEdit={agentToEdit} services={services} />
        </div>
      </div>
    </div>
  );
};

export default AddAgentModal;