// src/components/department/AddServiceForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Layers, FileText, Clock, DollarSign } from 'lucide-react';

// This is the data for the form itself.
export interface NewServiceData {
  name: string;
  description: string;
  category: string;
  processingTime: string;
  fee: number;
  requirements: string[];
  status: 'active' | 'inactive';
}

// Interface for existing services from database
interface ExistingServiceData {
  _id?: string;
  name: string;
  description: string;
  category: string;
  processingTime: string;
  fee: number;
  requirements: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AddServiceFormProps {
  onSave: (serviceData: NewServiceData) => void;
  onClose: () => void;
  serviceToEdit?: ExistingServiceData | null; // Service object when editing
  loading?: boolean;
}

// This component is ONLY the form. It does not know if it is open or closed.
export default function AddServiceForm({ onSave, onClose, serviceToEdit, loading = false }: AddServiceFormProps) {
  const isEditMode = !!serviceToEdit;
  const [serviceData, setServiceData] = useState<NewServiceData>({
    name: '',
    description: '',
    category: '',
    processingTime: '',
    fee: 0,
    requirements: [],
    status: 'active',
  });

  // Initialize form data when editing
  useEffect(() => {
    if (isEditMode && serviceToEdit) {
      setServiceData({
        name: serviceToEdit.name || '',
        description: serviceToEdit.description || '',
        category: serviceToEdit.category || '',
        processingTime: serviceToEdit.processingTime || '',
        fee: serviceToEdit.fee || 0,
        requirements: serviceToEdit.requirements || [],
        status: serviceToEdit.isActive ? 'active' : 'inactive',
      });
    } else {
      setServiceData({
        name: '',
        description: '',
        category: '',
        processingTime: '',
        fee: 0,
        requirements: [],
        status: 'active',
      });
    }
  }, [isEditMode, serviceToEdit]);

  const handleInputChange = (field: keyof NewServiceData, value: string | number | string[]) => {
    setServiceData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!serviceData.name.trim()) errors.push('Service Name is required');
    if (!serviceData.description.trim()) errors.push('Description is required');
    if (!serviceData.category) errors.push('Category is required');
    if (!serviceData.processingTime) errors.push('Processing Time is required');
    if (!serviceData.fee || serviceData.fee < 0) errors.push('Service Fee must be 0 or greater');
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
      return;
    }
    
    onSave(serviceData);
  };

  const inputStyles = "w-full bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/20 transition-all duration-300 backdrop-blur-sm hover:border-[#FFC72C]/50";
  const labelStyles = "block text-sm font-semibold text-foreground mb-3 flex items-center gap-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
      <div>
        <label className={labelStyles}><Layers className="w-4 h-4" /> Service Name</label>
        <input type="text" value={serviceData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={inputStyles} placeholder="e.g., Passport Renewal" required />
      </div>
      <div>
        <label className={labelStyles}><FileText className="w-4 h-4" /> Description</label>
        <textarea value={serviceData.description} onChange={(e) => handleInputChange('description', e.target.value)} className={inputStyles} placeholder="A brief description of the service." rows={3} required></textarea>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelStyles}><Layers className="w-4 h-4" /> Category</label>
          <select value={serviceData.category} onChange={(e) => handleInputChange('category', e.target.value)} className={inputStyles} required>
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="Immigration">Immigration</option>
            <option value="Registration">Registration</option>
            <option value="Licensing">Licensing</option>
            <option value="Certification">Certification</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Finance">Finance</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelStyles}><Clock className="w-4 h-4" /> Processing Time</label>
          <select value={serviceData.processingTime} onChange={(e) => handleInputChange('processingTime', e.target.value)} className={inputStyles} required>
            <option value="">Select Processing Time</option>
            <option value="Same day">Same day</option>
            <option value="1-2 business days">1-2 business days</option>
            <option value="3-5 business days">3-5 business days</option>
            <option value="1-2 weeks">1-2 weeks</option>
            <option value="2-4 weeks">2-4 weeks</option>
            <option value="1-2 months">1-2 months</option>
            <option value="Custom timeframe">Custom timeframe</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelStyles}><FileText className="w-4 h-4" /> Requirements (one per line)</label>
        <textarea 
          value={serviceData.requirements.join('\n')} 
          onChange={(e) => handleInputChange('requirements', e.target.value.split('\n').filter(req => req.trim()))} 
          className={inputStyles} 
          placeholder="e.g.&#10;NIC copy&#10;Application form&#10;Passport photos" 
          rows={3}
        ></textarea>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelStyles}><DollarSign className="w-4 h-4" /> Service Fee (LKR)</label>
          <input type="number" value={serviceData.fee} onChange={(e) => handleInputChange('fee', parseFloat(e.target.value))} className={inputStyles} placeholder="e.g., 5000" required />
        </div>
        <div>
          <label className={labelStyles}><Clock className="w-4 h-4" /> Initial Status</label>
          <select value={serviceData.status} onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive')} className={inputStyles}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-6 border-t border-border/30">
        <button 
          type="button" 
          onClick={onClose} 
          disabled={loading}
          className="px-6 py-3 bg-card/30 border border-border/50 rounded-xl text-foreground hover:bg-card/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading} 
          className="px-6 py-3 bg-gradient-to-r from-[#008060] to-[#8D153A] text-white rounded-xl hover:from-[#8D153A] hover:to-[#008060] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Service' : 'Create Service')}
        </button>
      </div>
    </form>
  );
}