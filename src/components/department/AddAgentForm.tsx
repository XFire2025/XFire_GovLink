// src/components/department/AddAgentForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, Mail, Lock } from 'lucide-react';
import CustomMultiSelect from './CustomMultiSelect';

// Define and export a specific interface for the form data
export interface AgentFormData {
  fullName: string;
  email: string;
  password?: string; // Password is optional for editing
  assignedServices: string[];
  officerId: string;
  nicNumber: string;
  position: string;
  officeName: string;
  officeAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    province: string;
    postalCode: string;
  };
  phoneNumber: string;
  duties?: string[];
  specialization?: string[];
}

interface Service { id: string; name: string; }
import { Agent } from '@/lib/services/departmentApiService';

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
    officerId: '',
    nicNumber: '',
    position: '',
    officeName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    province: '',
    postalCode: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode && agentToEdit) {
      setFormData({
        fullName: agentToEdit.fullName || agentToEdit.name || '',
        email: agentToEdit.email || '',
        password: '',
        officerId: agentToEdit.officerId || '',
        nicNumber: agentToEdit.nicNumber || '',
        position: agentToEdit.position || '',
        officeName: agentToEdit.officeName || '',
        phoneNumber: agentToEdit.phoneNumber || '',
        addressLine1: agentToEdit.officeAddress?.addressLine1 || '',
        addressLine2: agentToEdit.officeAddress?.addressLine2 || '',
        city: agentToEdit.officeAddress?.city || '',
        district: agentToEdit.officeAddress?.district || '',
        province: agentToEdit.officeAddress?.province || '',
        postalCode: agentToEdit.officeAddress?.postalCode || '',
      });
      setSelectedServices(agentToEdit.specialization || []);
    } else {
      setFormData({
        fullName: '',
        email: '',
        password: '',
        officerId: '',
        nicNumber: '',
        position: '',
        officeName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        district: '',
        province: '',
        postalCode: '',
      });
      setSelectedServices([]);
    }
  }, [agentToEdit, isEditMode]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.fullName.trim()) errors.push('Full Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) errors.push('Please enter a valid email address');
    if (!formData.officerId.trim()) errors.push('Officer ID is required');
    if (!formData.nicNumber.trim()) errors.push('NIC Number is required');
    if (!formData.nicNumber.match(/^(\d{9}[VvXx]|\d{12})$/)) errors.push('Please enter a valid Sri Lankan NIC number');
    if (!formData.position.trim()) errors.push('Position is required');
    if (!formData.officeName.trim()) errors.push('Office Name is required');
    if (!formData.phoneNumber.trim()) errors.push('Phone Number is required');
    if (!formData.phoneNumber.match(/^(\+94|0)([7][01245678]\d{7})$/)) errors.push('Please enter a valid Sri Lankan phone number');
    if (!formData.addressLine1.trim()) errors.push('Address Line 1 is required');
    if (!formData.city.trim()) errors.push('City is required');
    if (!formData.district) errors.push('District is required');
    if (!formData.province) errors.push('Province is required');
    if (!formData.postalCode.trim()) errors.push('Postal Code is required');
    if (!formData.postalCode.match(/^\d{5}$/)) errors.push('Postal Code must be 5 digits');
    
    if (!isEditMode) {
      if (!formData.password.trim()) errors.push('Password is required');
      if (formData.password.length < 8) errors.push('Password must be at least 8 characters');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }
    
    setIsLoading(true);
    
    // Construct the data object with a specific type
    const saveData: AgentFormData = {
        fullName: formData.fullName,
        email: formData.email,
        officerId: formData.officerId,
        nicNumber: formData.nicNumber,
        position: formData.position,
        officeName: formData.officeName,
        phoneNumber: formData.phoneNumber,
        officeAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city,
          district: formData.district,
          province: formData.province,
          postalCode: formData.postalCode,
        },
        assignedServices: selectedServices,
        duties: [],
        specialization: selectedServices, // Fix: Use selectedServices instead of empty array
    };
    if (!isEditMode && formData.password) {
        saveData.password = formData.password;
    }

    try {
      onSave(saveData);
    } catch (error) {
      console.error('Failed to save agent:', error);
      toast.error('Failed to save agent. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <input type="text" value={formData.fullName || ''} onChange={(e) => handleInputChange('fullName', e.target.value)} className={inputStyles} required />
        </div>
        <div>
          <label className={labelStyles}><Mail className="w-4 h-4" /> Official Email</label>
          <input type="email" value={formData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} className={inputStyles} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyles}>Officer ID</label>
            <input type="text" value={formData.officerId || ''} onChange={(e) => handleInputChange('officerId', e.target.value)} className={inputStyles} placeholder="e.g., AGT001" required />
          </div>
          <div>
            <label className={labelStyles}>NIC Number</label>
            <input type="text" value={formData.nicNumber || ''} onChange={(e) => handleInputChange('nicNumber', e.target.value)} className={inputStyles} placeholder="e.g., 123456789V" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyles}>Position</label>
            <input type="text" value={formData.position || ''} onChange={(e) => handleInputChange('position', e.target.value)} className={inputStyles} placeholder="e.g., Officer" required />
          </div>
          <div>
            <label className={labelStyles}>Phone Number</label>
            <input type="tel" value={formData.phoneNumber || ''} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} className={inputStyles} placeholder="e.g., 0712345678" required />
          </div>
        </div>
        <div>
          <label className={labelStyles}>Office Name</label>
          <input type="text" value={formData.officeName || ''} onChange={(e) => handleInputChange('officeName', e.target.value)} className={inputStyles} placeholder="e.g., Colombo Regional Office" required />
        </div>
      </div>
      <div className="space-y-6">
        <h4 className="text-lg font-bold text-foreground">Office Address</h4>
        <div>
          <label className={labelStyles}>Address Line 1</label>
          <input type="text" value={formData.addressLine1 || ''} onChange={(e) => handleInputChange('addressLine1', e.target.value)} className={inputStyles} placeholder="e.g., 123 Main Street" required />
        </div>
        <div>
          <label className={labelStyles}>Address Line 2 (Optional)</label>
          <input type="text" value={formData.addressLine2 || ''} onChange={(e) => handleInputChange('addressLine2', e.target.value)} className={inputStyles} placeholder="e.g., Apartment, Suite, etc." />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelStyles}>City</label>
            <input type="text" value={formData.city || ''} onChange={(e) => handleInputChange('city', e.target.value)} className={inputStyles} placeholder="e.g., Colombo" required />
          </div>
          <div>
            <label className={labelStyles}>District</label>
            <select value={formData.district || ''} onChange={(e) => handleInputChange('district', e.target.value)} className={inputStyles} required>
              <option value="">Select District</option>
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Kalutara">Kalutara</option>
              <option value="Kandy">Kandy</option>
              <option value="Matale">Matale</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              <option value="Galle">Galle</option>
              <option value="Matara">Matara</option>
              <option value="Hambantota">Hambantota</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Kilinochchi">Kilinochchi</option>
              <option value="Mannar">Mannar</option>
              <option value="Mullaitivu">Mullaitivu</option>
              <option value="Vavuniya">Vavuniya</option>
              <option value="Puttalam">Puttalam</option>
              <option value="Kurunegala">Kurunegala</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Polonnaruwa">Polonnaruwa</option>
              <option value="Badulla">Badulla</option>
              <option value="Moneragala">Moneragala</option>
              <option value="Ratnapura">Ratnapura</option>
              <option value="Kegalle">Kegalle</option>
              <option value="Ampara">Ampara</option>
              <option value="Batticaloa">Batticaloa</option>
              <option value="Trincomalee">Trincomalee</option>
            </select>
          </div>
          <div>
            <label className={labelStyles}>Province</label>
            <select value={formData.province || ''} onChange={(e) => handleInputChange('province', e.target.value)} className={inputStyles} required>
              <option value="">Select Province</option>
              <option value="Western">Western</option>
              <option value="Central">Central</option>
              <option value="Southern">Southern</option>
              <option value="Northern">Northern</option>
              <option value="Eastern">Eastern</option>
              <option value="North Western">North Western</option>
              <option value="North Central">North Central</option>
              <option value="Uva">Uva</option>
              <option value="Sabaragamuwa">Sabaragamuwa</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelStyles}>Postal Code</label>
          <input type="text" value={formData.postalCode || ''} onChange={(e) => handleInputChange('postalCode', e.target.value)} className={inputStyles} placeholder="e.g., 10001" pattern="\d{5}" maxLength={5} required />
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
            <input type="password" value={formData.password || ''} onChange={(e) => handleInputChange('password', e.target.value)} className={inputStyles} required={!isEditMode} />
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