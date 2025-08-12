// src/components/department/AddServiceForm.tsx
"use client";
import React, { useState } from 'react';
import { Layers, FileText, Clock, DollarSign } from 'lucide-react';

// This is the data for the form itself.
export interface NewServiceData {
  name: string;
  description: string;
  fee: number;
  status: 'active' | 'inactive';
}

interface AddServiceFormProps {
  onSave: (serviceData: NewServiceData) => void;
  onClose: () => void;
}

// This component is ONLY the form. It does not know if it is open or closed.
export default function AddServiceForm({ onSave, onClose }: AddServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serviceData, setServiceData] = useState<NewServiceData>({
    name: '',
    description: '',
    fee: 0,
    status: 'active',
  });

  const handleInputChange = (field: keyof NewServiceData, value: string | number) => {
    setServiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(serviceData);
    setIsLoading(false);
    onClose();
  };

  const inputStyles = "w-full bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#008060] focus:ring-2 focus:ring-[#008060]/20";
  const labelStyles = "block text-sm font-semibold text-foreground mb-3 flex items-center gap-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
      <div>
        <label className={labelStyles}><Layers className="w-4 h-4" /> Service Name</label>
        <input type="text" value={serviceData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={inputStyles} placeholder="e.g., Passport Renewal" required />
      </div>
      <div>
        <label className={labelStyles}><FileText className="w-4 h-4" /> Description</label>
        <textarea value={serviceData.description} onChange={(e) => handleInputChange('description', e.target.value)} className={inputStyles} placeholder="A brief description of the service." rows={3}></textarea>
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
        <button type="button" onClick={onClose} className="px-6 py-3 bg-card/30 border border-border/50 rounded-xl text-foreground hover:bg-card/50">Cancel</button>
        <button type="submit" disabled={isLoading} className="px-6 py-3 bg-gradient-to-r from-[#008060] to-[#8D153A] text-white rounded-xl hover:from-[#8D153A] hover:to-[#008060] disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Create Service'}
        </button>
      </div>
    </form>
  );
}