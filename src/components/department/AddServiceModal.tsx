// src/components/department/AddServiceModal.tsx
"use client";
import React from 'react';
import { X } from 'lucide-react';
import AddServiceForm, { NewServiceData } from './AddServiceForm'; // Import the form and its data type

// This is the interface for the MODAL. It needs to know if it's open.
interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceData: NewServiceData) => void;
  serviceToEdit?: any; // Service object when editing
  loading?: boolean;
}

// This component is the "shell" that holds the form.
const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose, onSave, serviceToEdit, loading = false }) => {
  // The modal's only job is to show or hide.
  if (!isOpen) return null;

  return (
    // This is the modal backdrop and container
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-glow">
        <div className="flex items-center justify-between p-6 border-b border-border/30 sticky top-0 bg-card/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {serviceToEdit ? 'Edit Service' : 'Add New Service'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {serviceToEdit ? 'Update the service details.' : 'Define a new service offered by your department.'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-2 rounded-xl bg-card/30 border border-border/50 text-foreground hover:bg-card/50 disabled:opacity-50 disabled:cursor-not-allowed" 
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
            {/* It renders the separate form component inside */}
            <AddServiceForm onClose={onClose} onSave={onSave} serviceToEdit={serviceToEdit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;