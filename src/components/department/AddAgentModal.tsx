// src/components/department/AddAgentModal.tsx
"use client";
import React from 'react';
import { X } from 'lucide-react';
import AddAgentForm from './AddAgentForm';

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agentData: any) => void;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-glow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30 sticky top-0 bg-card/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add New Agent</h2>
            <p className="text-sm text-muted-foreground">Fill in the details to create a new agent account.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-card/30 border border-border/50 text-foreground hover:bg-card/50 transition-all duration-300"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
            <AddAgentForm onClose={onClose} onSave={onSave} />
        </div>
      </div>
    </div>
  );
};

export default AddAgentModal;