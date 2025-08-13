// src/app/User/Booking/New/page.tsx
"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import UserApiService, { Department, Service, Agent } from '@/lib/services/userApiService';

// New booking translations (keeping existing translations)
const newBookingTranslations = {
  title: 'Book Appointment',
  subtitle: 'Schedule your meeting with government officials and submit required documents',
  backToBookings: 'Back to Bookings',
  step1Title: 'Step 1: Service',
  step1Desc: 'Select the department and service you need assistance with.',
  step2Title: 'Step 2: Agent',
  step2Desc: 'Choose the type of official you need to meet.',
  step3Title: 'Step 3: Schedule', 
  step3Desc: 'Pick an available day and time slot for your appointment.',
  step4Title: 'Step 4: Documents',
  step4Desc: 'Upload required documents for your appointment.',
  step5Title: 'Step 5: Details',
  step5Desc: 'Provide any additional notes for your appointment.',
  department: 'Department',
  service: 'Service',
  selectDepartment: 'Select a department...',
  selectService: 'Select a service...',
  selectDepartmentFirst: 'Select a department first',
  agentDesignation: 'Agent Position',
  agentName: 'Agent Name',
  selectDesignation: 'Select a position...',
  selectAgent: 'Select an agent...',
  selectDesignationFirst: 'Select a position first',
  pickDay: 'Pick a Day',
  availableSlots: 'Available Slots',
  selectAgentAndDay: 'Select an agent and a day first',
  availableSlotsWillAppear: 'Available time slots will appear here',
  availableTimesFor: 'Available Times for',
  slotsAvailable: 'slots available',
  noSlotsAvailable: 'No slots available',
  tryDifferentDay: 'Please try a different day or agent',
  requiredDocuments: 'Required Documents',
  optionalDocuments: 'Optional Documents', 
  documentNote: 'Upload clear, color scans/photos less than 5MB each (JPEG/PNG/PDF)',
  clickToUpload: 'Click to upload',
  dragToUpload: 'or drag and drop files here',
  remove: 'Remove',
  allowed: 'Allowed',
  notes: 'Notes (Optional)',
  notesPlaceholder: 'Add any specific details, questions, or required documents...',
  appointmentSummary: 'Appointment Summary',
  reference: 'Reference',
  agent: 'Agent',
  dateTime: 'Date & Time',
  uploadedDocuments: 'Uploaded Documents',
  notProvided: 'Not Provided',
  optional: 'Optional',
  cancel: 'Cancel',
  requestBooking: 'Request Booking',
  submitting: 'Submitting...',
  booked: 'Booked!',
  editBooking: 'Edit Booking',
  resubmit: 'Resubmit',
  whatHappensNext: 'What Happens Next?',
  nextSteps: {
    step1: 'You will receive an email confirmation with your appointment details',
    step2: 'Our staff will review your documents and may request clarifications',
    step3: 'You can track your appointment status in the Dashboard > Bookings section'
  },
  dashboard: 'Dashboard',
  bookingReceived: 'Your booking request has been received. Reference',
  errors: {
    selectDepartment: 'Please select a department',
    selectService: 'Please select a service',
    selectDesignation: 'Please select an agent position',
    selectAgent: 'Please select an agent',
    pickDay: 'Please pick a day for your appointment',
    chooseTimeSlot: 'Please choose an available time slot',
    missingField: 'Missing required field',
    pleaseUpload: 'Please upload'
  },
  loading: 'Loading...',
  loadingDepartments: 'Loading departments...',
  loadingServices: 'Loading services...',
  loadingAgents: 'Loading agents...',
  errorLoadingData: 'Error loading data. Please try again.',
  retry: 'Retry'
};

// Icons (keeping existing icons)
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const UserCheckIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>;
const CalendarClockIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.25V14"/><circle cx="16" cy="16" r="5.5"/></svg>;
const FileUploadIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 11v7"/><path d="M9 15l3-3 3 3"/></svg>;
const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>;
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const FileIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>;
const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>;

// Document requirement interface
interface DocumentRequirement {
    name: string;
    label: string;
    required: boolean;
    accept: string;
    description?: string;
}

// Custom Dropdown Component (keeping existing)
const CustomDropdown = ({ 
    id, 
    name, 
    value, 
    onChange, 
    disabled, 
    placeholder, 
    options,
    loading = false
}: {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    placeholder: string;
    options: { value: string; label: string }[];
    loading?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(placeholder);
    
    React.useEffect(() => {
        const selected = options.find(opt => opt.value === value);
        setSelectedLabel(selected ? selected.label : placeholder);
    }, [value, options, placeholder]);

    const handleSelect = (optionValue: string) => {
        const syntheticEvent = {
            target: { name, value: optionValue }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="sr-only"
                tabIndex={-1}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <button
                type="button"
                onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
                disabled={disabled || loading}
                className={`
                    w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 flex items-center justify-between backdrop-blur-md
                    ${disabled || loading
                        ? 'opacity-60 cursor-not-allowed bg-card/20 dark:bg-card/30 border-border/30' 
                        : 'bg-card/50 dark:bg-card/70 border-border/50 hover:border-[#FFC72C]/60 hover:bg-card/70 dark:hover:bg-card/80 focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/30'
                    }
                    shadow-md hover:shadow-lg modern-card
                `}
            >
                <span className={`${value ? 'text-foreground' : 'text-muted-foreground'} font-medium`}>
                    {loading ? newBookingTranslations.loading : selectedLabel}
                </span>
                <ChevronDownIcon 
                    className={`w-5 h-5 text-[#FFC72C] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            {isOpen && !loading && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    <div className="absolute top-full left-0 right-0 mt-2 z-20">
                        <div className="bg-card/95 dark:bg-card/95 border border-border/50 rounded-xl shadow-glow backdrop-blur-md overflow-hidden modern-card">
                            <div className="max-h-60 overflow-y-auto">
                                {options.map((option, index) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={`
                                            w-full text-left px-4 py-3 transition-all duration-200 border-b border-border/30 last:border-b-0
                                            ${value === option.value 
                                                ? 'bg-[#FFC72C]/20 text-[#FFC72C] font-semibold' 
                                                : 'text-foreground hover:bg-card/30 hover:text-[#FFC72C]'
                                            }
                                            ${index === 0 ? 'rounded-t-xl' : ''}
                                            ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                                        `}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// File Upload Component (keeping existing but enhanced)
const FileUpload = ({ 
    document: doc, 
    file, 
    onFileChange, 
    onRemove 
}: {
    document: DocumentRequirement;
    file: File | null;
    onFileChange: (file: File | null) => void;
    onRemove: () => void;
}) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        onFileChange(selectedFile);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0] || null;
        onFileChange(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <UploadIcon className="w-4 h-4 text-[#FFC72C]" />
                    {doc.label}
                    {doc.required && <span className="text-red-400 ml-1">*</span>}
                    {!doc.required && <span className="text-muted-foreground text-xs ml-1">(Optional)</span>}
                </label>
                {file && (
                    <button 
                        type="button" 
                        onClick={onRemove} 
                        className="text-xs text-[#FF5722] hover:text-[#FF5722]/80 transition-colors"
                    >
                        {newBookingTranslations.remove}
                    </button>
                )}
            </div>
            
            {doc.description && (
                <p className="text-xs text-muted-foreground">{doc.description}</p>
            )}
            
            <div 
                className="border-2 border-dashed rounded-xl p-4 bg-card/40 dark:bg-card/50 border-border/50 hover:border-[#FFC72C]/60 transition-colors backdrop-blur-md modern-card"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input
                    id={doc.name}
                    type="file"
                    accept={doc.accept}
                    className="hidden"
                    onChange={handleFileChange}
                />
                <label htmlFor={doc.name} className="flex flex-col items-center justify-center gap-2 cursor-pointer text-center">
                    <div className="w-12 h-12 rounded-full bg-[#FFC72C]/15 flex items-center justify-center border border-[#FFC72C]/30">
                        <FileIcon className="w-6 h-6 text-[#FFC72C]" />
                    </div>
                    {file ? (
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-foreground">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">{newBookingTranslations.clickToUpload}</span>
                            <span className="text-xs text-muted-foreground">{newBookingTranslations.dragToUpload}</span>
                        </div>
                    )}
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {newBookingTranslations.allowed}: {doc.accept.replace(/\./g,'').replace(/,/g, ', ')} • Max 5MB
                    </p>
                </label>
            </div>
        </div>
    );
};

// Form Step component (keeping existing)
const Step = ({ icon: Icon, title, description, children }: { icon: React.ElementType; title: string; description: string; children: React.ReactNode }) => (
    <div className="animate-fade-in-up">
        <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
                <Icon className="w-4 h-4 text-[#FFC72C]" />
                <span className="text-xs sm:text-sm font-medium text-foreground">{title}</span>
            </div>
            <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

// Alert components (keeping existing)
const SuccessAlert = ({ message }: { message: string }) => (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-[#008060]/30 flex items-center gap-3 shadow-glow modern-card animate-fade-in-up">
        <CheckCircleIcon className="w-6 h-6 text-[#008060] flex-shrink-0" />
        <p className="text-sm font-medium text-[#008060]">{message}</p>
    </div>
);

const ErrorAlert = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-[#FF5722]/30 flex items-center gap-3 shadow-glow modern-card animate-fade-in-up">
        <AlertTriangleIcon className="w-6 h-6 text-[#FF5722] flex-shrink-0" />
        <div className="flex-1">
            <p className="text-sm font-medium text-[#FF5722]">{message}</p>
        </div>
        {onRetry && (
            <button
                onClick={onRetry}
                className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-[#FF5722] hover:bg-[#FF5722]/10 rounded-lg transition-colors"
            >
                <RefreshIcon className="w-3 h-3" />
                {newBookingTranslations.retry}
            </button>
        )}
    </div>
);

// Time Slot Card Component (keeping existing)
const TimeSlotCard = ({ 
    slot, 
    isAvailable, 
    isSelected, 
    onSelect 
}: { 
    slot: string; 
    isAvailable: boolean; 
    isSelected: boolean; 
    onSelect: () => void; 
}) => {
    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div
            onClick={isAvailable ? onSelect : undefined}
            className={`
                relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer group backdrop-blur-md modern-card
                ${!isAvailable 
                    ? 'bg-card/20 dark:bg-card/30 border-[#FF5722]/30 opacity-60 cursor-not-allowed' 
                    : isSelected 
                        ? 'bg-gradient-to-br from-[#008060]/20 to-[#FFC72C]/20 border-[#008060]/50 shadow-glow hover:shadow-2xl' 
                        : 'bg-card/50 dark:bg-card/70 border-border/50 hover:border-[#FFC72C]/60 hover:bg-card/70 dark:hover:bg-card/80 hover:shadow-lg hover-lift'
                }
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                        isSelected 
                            ? 'bg-[#008060]/20 border border-[#008060]/30' 
                            : 'bg-[#FFC72C]/20 border border-[#FFC72C]/30'
                    }`}>
                        <ClockIcon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                            isSelected ? 'text-[#008060]' : 'text-[#FFC72C]'
                        }`} />
                    </div>
                    <div>
                        <div className="font-semibold text-foreground text-lg transition-colors duration-300 group-hover:text-[#FFC72C]">
                            {formatTime(slot)}
                        </div>
                    </div>
                </div>
                
                {isSelected && (
                    <div className="p-1.5 rounded-xl bg-[#008060]/20 border border-[#008060]/30 animate-pulse">
                        <CheckCircleIcon className="w-5 h-5 text-[#008060]" />
                    </div>
                )}
            </div>
            
            {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/50 dark:bg-card/60 backdrop-blur-sm rounded-2xl">
                    <span className="text-xs font-medium text-[#FF5722] bg-[#FF5722]/20 px-3 py-1.5 rounded-full border border-[#FF5722]/30">
                        Unavailable
                    </span>
                </div>
            )}
        </div>
    );
};

// Helper functions
function generateDays(days = 14) {
    const out: { key: string; date: Date; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < days; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        out.push({ 
            key: d.toISOString().slice(0, 10), 
            date: d, 
            label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) 
        });
    }
    return out;
}

// MAIN PAGE COMPONENT
export default function NewBookingPage() {
    const router = useRouter();
    const [form, setForm] = useState({ 
        department: "",
        service: "",
        position: "", 
        agent: "", 
        day: "", 
        slot: "", 
        notes: "" 
    });
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [reference, setReference] = useState('');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // API state
    const [departments, setDepartments] = useState<Department[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [availableSlots, setAvailableSlots] = useState<Set<string>>(new Set());
    
    // Loading states
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [loadingServices, setLoadingServices] = useState(false);
    const [loadingAgents, setLoadingAgents] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const t = newBookingTranslations;
    const days = useMemo(() => generateDays(14), []);

    // Check login status on mount
    useEffect(() => {
        const token = localStorage.getItem('user_access_token');
        const authenticated = !!token;
        setIsAuthenticated(authenticated);
        
        console.log('🔐 Login status check:', authenticated ? 'Logged in' : 'Not logged in');
        if (!authenticated) {
            console.warn('⚠️ User not logged in - appointment creation will fail');
        }
        
        // Load departments
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        console.log('🔄 Loading departments...');
        setLoadingDepartments(true);
        setError(null);
        try {
            console.log('📡 Calling UserApiService.getDepartments()...');
            const response = await UserApiService.getDepartments();
            console.log('📥 Response:', response);
            
            if (response.success && response.data) {
                console.log('✅ Departments loaded:', response.data.departments);
                setDepartments(response.data.departments);
            } else {
                console.error('❌ API Error:', response.message);
                setError(response.message || t.errorLoadingData);
            }
        } catch (err) {
            console.error('💥 Load departments error:', err);
            setError(t.errorLoadingData);
        }
        setLoadingDepartments(false);
    };

    // Load services when department changes
    useEffect(() => {
        if (form.department) {
            loadServices(form.department);
        } else {
            setServices([]);
        }
    }, [form.department]);

    const loadServices = async (departmentId: string) => {
        setLoadingServices(true);
        setError(null);
        try {
            const response = await UserApiService.getDepartmentServices(departmentId);
            if (response.success && response.data) {
                setServices(response.data.services);
            } else {
                setError(response.message || t.errorLoadingData);
            }
        } catch (err) {
            setError(t.errorLoadingData);
            console.error('Load services error:', err);
        }
        setLoadingServices(false);
    };

    // Load agents when department changes
    useEffect(() => {
        if (form.department) {
            loadAgents(form.department, form.position);
        } else {
            setAgents([]);
        }
    }, [form.department, form.position]);

    const loadAgents = async (departmentId: string, position?: string) => {
        setLoadingAgents(true);
        setError(null);
        try {
            const response = await UserApiService.getDepartmentAgents(departmentId, position);
            if (response.success && response.data) {
                setAgents(response.data.agents);
            } else {
                setError(response.message || t.errorLoadingData);
            }
        } catch (err) {
            setError(t.errorLoadingData);
            console.error('Load agents error:', err);
        }
        setLoadingAgents(false);
    };

    // Load available slots when agent and day change
    useEffect(() => {
        if (form.agent && form.day) {
            loadAvailableSlots(form.agent, form.day);
        } else {
            setAvailableSlots(new Set());
        }
    }, [form.agent, form.day]);

    const loadAvailableSlots = async (agentId: string, date: string) => {
        setLoadingSlots(true);
        try {
            const response = await UserApiService.getAvailableTimeSlots(agentId, date);
            if (response.success && response.data) {
                setAvailableSlots(new Set(response.data.slots));
            } else {
                setAvailableSlots(new Set());
            }
        } catch (err) {
            setAvailableSlots(new Set());
            console.error('Load slots error:', err);
        }
        setLoadingSlots(false);
    };

    // Dynamic options
    const departmentOptions = departments.map(dept => ({
        value: dept.id,
        label: dept.name
    }));
    console.log('🏢 Department options:', departmentOptions);

    const serviceOptions = services.map(service => ({
        value: service.id,
        label: service.name
    }));

    const positionOptions = [...new Set(agents.map(agent => agent.position))].map(position => ({
        value: position,
        label: position
    }));

    const agentOptions = agents
        .filter(agent => !form.position || agent.position === form.position)
        .map(agent => ({
            value: agent.id,
            label: `${agent.name} (${agent.officerId})`
        }));

    // Document requirements based on selected service
    const requiredDocuments: DocumentRequirement[] = useMemo(() => {
        const selectedService = services.find(s => s.id === form.service);
        if (!selectedService || !selectedService.requirements.length) {
            return [
                { name: "applicationForm", label: "Application Form", required: true, accept: ".pdf,.jpg,.jpeg,.png", description: "Completed and signed application form" },
                { name: "nicScan", label: "NIC Copy", required: true, accept: ".jpg,.jpeg,.png,.pdf", description: "Clear scan or photo of your National Identity Card" },
                { name: "supportingDocs", label: "Supporting Documents", required: false, accept: ".pdf,.jpg,.jpeg,.png", description: "Any additional documents related to your request" }
            ];
        }
        
        return selectedService.requirements.map((req, index) => ({
            name: `document_${index}`,
            label: req,
            required: index < 2, // First 2 requirements are required
            accept: ".pdf,.jpg,.jpeg,.png",
            description: `${req} - Required for ${selectedService.name}`
        }));
    }, [services, form.service]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev, 
            [name]: value, 
            ...(name === "department" ? { service: "", position: "", agent: "", slot: "" } : {}),
            ...(name === "service" ? { position: "", agent: "", slot: "" } : {}),
            ...(name === "position" ? { agent: "", slot: "" } : {}), 
            ...(name === "agent" ? { slot: "" } : {})
        }));
        
        // Clear files when department or service changes
        if (name === "department" || name === "service") {
            setFiles({});
        }
    }

    function selectDay(dayKey: string) { 
        setForm((prev) => ({ ...prev, day: dayKey, slot: "" })); 
    }
    
    function selectSlot(slot: string) { 
        if (availableSlots.has(slot)) setForm((prev) => ({ ...prev, slot })); 
    }

    const handleFile = (docName: string, file: File | null) => {
        setFiles(prev => ({ ...prev, [docName]: file }));
    };

    const validate = useCallback(() => {
        if (!form.department) return t.errors.selectDepartment;
        if (!form.service) return t.errors.selectService;
        if (!form.agent) return t.errors.selectAgent;
        if (!form.day) return t.errors.pickDay;
        if (!form.slot) return t.errors.chooseTimeSlot;
        
        // Check required documents
        const requiredDocs = requiredDocuments.filter(doc => doc.required);
        for (const doc of requiredDocs) {
            if (!files[doc.name]) {
                return `${t.errors.pleaseUpload}: ${doc.label}`;
            }
        }
        
        return null;
    }, [form, files, requiredDocuments, t]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        // Check if user is logged in first
        const token = localStorage.getItem('user_access_token');
        if (!token) {
            setError('Please login first to create an appointment. Redirecting to login...');
            setTimeout(() => {
                window.location.href = '/user/auth/login';
            }, 2000);
            return;
        }
        
        const validationError = validate();
        if (validationError) { 
            setError(validationError); 
            return; 
        }

        console.log('🚀 Starting appointment submission...');
        setSubmitting(true);

        try {
            // Prepare files and file names
            const fileArray: File[] = [];
            const fileNames: string[] = [];
            
            Object.entries(files).forEach(([docName, file]) => {
                if (file) {
                    fileArray.push(file);
                    fileNames.push(docName);
                }
            });

            console.log('📝 Appointment data:', {
                departmentId: form.department,
                serviceId: form.service,
                agentId: form.agent,
                date: form.day,
                time: form.slot,
                notes: form.notes,
                files: fileArray.length
            });

            const appointmentData = {
                departmentId: form.department,
                serviceId: form.service,
                agentId: form.agent,
                date: form.day,
                time: form.slot,
                notes: form.notes,
                priority: 'normal' as const,
                files: fileArray,
                fileNames: fileNames
            };

            const response = await UserApiService.createAppointment(appointmentData);
            
            if (response.success && response.data) {
                console.log('✅ Appointment created successfully!');
                setReference(response.data.appointment.bookingReference);
                setSubmitted(true);
                setSuccess(`${t.bookingReceived} ${response.data.appointment.bookingReference}`);
            } else {
                console.error('❌ Appointment creation failed:', response.message);
                setError(response.message || 'Failed to create appointment');
            }
        } catch (err: any) {
            console.error('💥 Appointment submission error:', err);
            
            // Handle specific authentication errors
            if (err.message.includes('Authentication failed') || err.message.includes('Please login')) {
                setError('Your session has expired. Please login again. Redirecting...');
                setTimeout(() => {
                    window.location.href = '/user/auth/login';
                }, 2000);
            } else {
                setError(err.message || 'Failed to create appointment. Please try again.');
            }
        }
        
        setSubmitting(false);
    }

    // Helper functions to get display names
    const getDepartmentName = () => {
        const department = departments.find(d => d.id === form.department);
        return department ? department.name : '';
    };

    const getServiceName = () => {
        const service = services.find(s => s.id === form.service);
        return service ? service.name : '';
    };

    const getAgentName = () => {
        const agent = agents.find(a => a.id === form.agent);
        return agent ? agent.name : '';
    };

    const getAgentPosition = () => {
        const agent = agents.find(a => a.id === form.agent);
        return agent ? agent.position : '';
    };

    const getSelectedDay = () => {
        const day = days.find(d => d.key === form.day);
        return day ? day.label : '';
    };

    return (
        <UserDashboardLayout
            title={
                <span className="animate-title-wave">
                    <span className="text-foreground">{t.title.split(' ')[0]}</span>{' '}
                    <span className="text-gradient">
                        {t.title.split(' ')[1] || ''}
                    </span>
                </span>
            }
            subtitle={t.subtitle}
            language="en"
            onLanguageChange={() => {}}
        >
            <div className="max-w-4xl mx-auto">
                {/* Back Button and Login Status */}
                <div className="mb-8 flex justify-between items-center">
                    <Link 
                        href="/User/Booking"
                        className="inline-flex items-center gap-2 px-4 py-2 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        {t.backToBookings}
                    </Link>
                    
                    {/* Login Status Indicator (for debugging) */}
                    <div className="text-xs flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-muted-foreground">
                            {isAuthenticated ? 'Authenticated' : 'Not Logged In'}
                        </span>
                        {!isAuthenticated && (
                            <Link 
                                href="/user/auth/login"
                                className="ml-2 px-2 py-1 text-xs bg-[#FFC72C] text-black rounded-md hover:bg-[#FF5722] transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {success && <div className="mb-8"><SuccessAlert message={success} /></div>}
                {error && <div className="mb-8"><ErrorAlert message={error} onRetry={error.includes('loading') ? loadDepartments : undefined} /></div>}
            
                <form onSubmit={handleSubmit} className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border/50 shadow-glow modern-card hover:border-[#FFC72C]/30 transition-all duration-500">
                    <div className="space-y-12">
                        {/* Step 1: Department & Service Selection */}
                        <Step icon={UserCheckIcon} title={t.step1Title} description={t.step1Desc}>
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-muted-foreground mb-2">{t.department}</label>
                                <CustomDropdown
                                    id="department"
                                    name="department"
                                    value={form.department}
                                    onChange={handleChange}
                                    placeholder={t.selectDepartment}
                                    options={departmentOptions}
                                    loading={loadingDepartments}
                                />
                            </div>
                            <div>
                                <label htmlFor="service" className="block text-sm font-medium text-muted-foreground mb-2">{t.service}</label>
                                <CustomDropdown
                                    id="service"
                                    name="service"
                                    value={form.service}
                                    onChange={handleChange}
                                    disabled={!form.department}
                                    placeholder={form.department ? t.selectService : t.selectDepartmentFirst}
                                    options={serviceOptions}
                                    loading={loadingServices}
                                />
                            </div>
                        </Step>

                        <div className="border-t border-border/30"></div>

                        {/* Step 2: Agent Selection */}
                        <Step icon={CalendarClockIcon} title={t.step2Title} description={t.step2Desc}>
                            <div>
                                <label htmlFor="position" className="block text-sm font-medium text-muted-foreground mb-2">{t.agentDesignation}</label>
                                <CustomDropdown
                                    id="position"
                                    name="position"
                                    value={form.position}
                                    onChange={handleChange}
                                    disabled={!form.department}
                                    placeholder={form.department ? t.selectDesignation : t.selectDepartmentFirst}
                                    options={positionOptions}
                                    loading={loadingAgents}
                                />
                            </div>
                            <div>
                                <label htmlFor="agent" className="block text-sm font-medium text-muted-foreground mb-2">{t.agentName}</label>
                                <CustomDropdown
                                    id="agent"
                                    name="agent"
                                    value={form.agent}
                                    onChange={handleChange}
                                    disabled={!form.department}
                                    placeholder={form.department ? t.selectAgent : t.selectDepartmentFirst}
                                    options={agentOptions}
                                    loading={loadingAgents}
                                />
                            </div>
                        </Step>

                        <div className="border-t border-border/30"></div>

                        {/* Step 3: Schedule Selection */}
                        <Step icon={ClockIcon} title={t.step3Title} description={t.step3Desc}>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">{t.pickDay}</label>
                                <div className="bg-card/50 dark:bg-card/60 backdrop-blur-md p-4 rounded-xl border border-border/30 modern-card">
                                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                                        {days.map((d) => {
                                            const isActive = form.day === d.key;
                                            const dayOfWeek = d.date.getDay();
                                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                                            
                                            return (
                                                <button
                                                    type="button"
                                                    key={d.key}
                                                    onClick={() => !isWeekend && selectDay(d.key)}
                                                    disabled={isWeekend}
                                                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 text-center backdrop-blur-sm hover:scale-105 ${
                                                        isWeekend 
                                                            ? 'bg-card/20 dark:bg-card/30 text-muted-foreground/50 cursor-not-allowed opacity-60 border border-border/20' 
                                                            : isActive 
                                                                ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg hover:shadow-2xl border border-[#FFC72C]/50' 
                                                                : 'bg-card/50 dark:bg-card/70 hover:bg-card/70 dark:hover:bg-card/80 text-foreground hover:text-[#FFC72C] border border-border/30 hover:border-[#FFC72C]/60'
                                                    }`}
                                                >
                                                    {d.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">{t.availableSlots}</label>
                                <div className="bg-card/50 dark:bg-card/60 backdrop-blur-md p-4 rounded-xl border border-border/30 modern-card">
                                    {!form.day || !form.agent ? (
                                        <div className="flex items-center justify-center text-center gap-3 py-12">
                                            <InfoIcon className="w-8 h-8 text-muted-foreground/70" />
                                            <div>
                                                <p className="text-muted-foreground font-medium mb-1">{t.selectAgentAndDay}</p>
                                                <p className="text-sm text-muted-foreground/70">{t.availableSlotsWillAppear}</p>
                                            </div>
                                        </div>
                                    ) : loadingSlots ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFC72C]"></div>
                                            <span className="ml-3 text-muted-foreground">Loading slots...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-foreground">
                                                    {t.availableTimesFor} {getSelectedDay()}
                                                </h4>
                                                <div className="text-sm text-muted-foreground">
                                                    {Array.from(availableSlots).length} {t.slotsAvailable}
                                                </div>
                                            </div>
                                            
                                            {Array.from(availableSlots).length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {Array.from(availableSlots).map((slot) => (
                                                        <TimeSlotCard
                                                            key={slot}
                                                            slot={slot}
                                                            isAvailable={true}
                                                            isSelected={form.slot === slot}
                                                            onSelect={() => selectSlot(slot)}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <AlertTriangleIcon className="w-12 h-12 text-[#FFC72C] mx-auto mb-3" />
                                                    <p className="text-muted-foreground font-medium mb-1">{t.noSlotsAvailable}</p>
                                                    <p className="text-sm text-muted-foreground/70">{t.tryDifferentDay}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Step>

                        {/* Step 4: Document Upload */}
                        {requiredDocuments.length > 0 && (
                            <>
                                <div className="border-t border-border/30"></div>
                                <Step icon={FileUploadIcon} title={t.step4Title} description={t.step4Desc}>
                                    <div className="space-y-6">
                                        <div className="bg-card/40 dark:bg-card/50 backdrop-blur-md p-4 rounded-xl border border-border/30 modern-card">
                                            <p className="text-xs text-[#FFC72C] font-medium flex items-center gap-2">
                                                <InfoIcon className="w-4 h-4" />
                                                {t.documentNote}
                                            </p>
                                        </div>
                                        
                                        {/* Required Documents */}
                                        {requiredDocuments.filter(doc => doc.required).length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                    <AlertTriangleIcon className="w-4 h-4 text-[#FF5722]" />
                                                    {t.requiredDocuments}
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {requiredDocuments.filter(doc => doc.required).map((doc) => (
                                                        <FileUpload
                                                            key={doc.name}
                                                            document={doc}
                                                            file={files[doc.name] || null}
                                                            onFileChange={(file) => handleFile(doc.name, file)}
                                                            onRemove={() => handleFile(doc.name, null)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Optional Documents */}
                                        {requiredDocuments.filter(doc => !doc.required).length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                    <InfoIcon className="w-4 h-4 text-[#FFC72C]" />
                                                    {t.optionalDocuments}
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {requiredDocuments.filter(doc => !doc.required).map((doc) => (
                                                        <FileUpload
                                                            key={doc.name}
                                                            document={doc}
                                                            file={files[doc.name] || null}
                                                            onFileChange={(file) => handleFile(doc.name, file)}
                                                            onRemove={() => handleFile(doc.name, null)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Step>
                            </>
                        )}

                        <div className="border-t border-border/30"></div>

                        {/* Step 5: Additional Notes */}
                        <Step icon={ClipboardIcon} title={t.step5Title} description={t.step5Desc}>
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-2">{t.notes}</label>
                                <textarea 
                                    id="notes" 
                                    name="notes" 
                                    value={form.notes} 
                                    onChange={handleChange} 
                                    rows={4} 
                                    placeholder={t.notesPlaceholder} 
                                    className="w-full px-4 py-3 bg-card/50 dark:bg-card/70 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#FFC72C] focus:border-[#FFC72C] focus:outline-none transition-all duration-300 backdrop-blur-md text-foreground placeholder:text-muted-foreground hover:border-[#FFC72C]/60 resize-none" 
                                />
                            </div>
                        </Step>

                        {/* Booking Summary (post-submit) */}
                        {submitted && (
                            <div className="space-y-6">
                                <div className="border-t border-border/30"></div>
                                <div className="border border-border/40 rounded-2xl p-6 bg-card/40 dark:bg-card/50 backdrop-blur-md modern-card">
                                    <div className="flex items-center gap-3 mb-4">
                                        <CheckCircleIcon className="w-6 h-6 text-[#008060]" />
                                        <h2 className="text-lg font-bold text-gradient">{t.appointmentSummary}</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">{t.reference}</p>
                                            <p className="font-mono text-[#FFC72C] text-sm">{reference}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">Department</p>
                                            <p className="font-medium">{getDepartmentName()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">Service</p>
                                            <p className="font-medium">{getServiceName()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">{t.agent}</p>
                                            <p className="font-medium">{getAgentPosition()} - {getAgentName()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">{t.dateTime}</p>
                                            <p className="font-medium">{getSelectedDay()} at {form.slot}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground">Notes</p>
                                            <p className="font-medium break-words">{form.notes || 'None'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold mb-2 text-foreground">{t.uploadedDocuments}</h3>
                                        <ul className="space-y-2 text-sm">
                                            {requiredDocuments.map(doc => (
                                                <li key={doc.name} className="flex items-center gap-2">
                                                    <FileIcon className="w-4 h-4 text-[#FFC72C]" />
                                                    <span>{doc.label}: </span>
                                                    <span className="text-muted-foreground">
                                                        {files[doc.name]?.name || (!doc.required ? `${t.optional} / ${t.notProvided}` : '—')}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-4 border-t border-border/30">
                            <div className="text-xs text-muted-foreground flex-1">
                                Required documents: {requiredDocuments.filter(doc => doc.required).length}
                            </div>
                            <div className="flex gap-3 justify-end">
                                {submitted && (
                                    <button
                                        type="button"
                                        onClick={() => { setSubmitted(false); setSuccess(null); setReference(''); }}
                                        className="px-5 py-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card/70 text-sm font-medium transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105 text-foreground"
                                    >{t.editBooking}</button>
                                )}
                                <Link 
                                    href="/User/Booking" 
                                    className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105 text-center"
                                >
                                    {t.cancel}
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={submitting || !!success} 
                                    className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl"
                                >
                                    {submitting ? t.submitting : (submitted ? t.resubmit : t.requestBooking)}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Post-submission guidance */}
                {submitted && (
                    <div className="mt-8 bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow modern-card flex flex-col md:flex-row gap-6 items-start hover:border-[#008060]/30 transition-all duration-500">
                        <div className="w-12 h-12 rounded-full bg-[#008060]/20 flex items-center justify-center border border-[#008060]/30">
                            <CheckCircleIcon className="w-6 h-6 text-[#008060]" />
                        </div>
                        <div className="space-y-3 flex-1">
                            <h3 className="text-lg font-bold text-gradient">{t.whatHappensNext}</h3>
                            <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-5">
                                <li>{t.nextSteps.step1} <span className="text-[#FFC72C] font-mono">{reference}</span>.</li>
                                <li>{t.nextSteps.step2}.</li>
                                <li>{t.nextSteps.step3}.</li>
                            </ul>
                            <div className="pt-2 flex flex-wrap gap-3">
                                <Link href="/User/Dashboard" className="px-5 py-2.5 rounded-xl border border-border/50 bg-card/50 hover:bg-card/70 text-sm font-medium transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105 flex items-center gap-2 text-foreground">
                                    <HomeIcon className="w-4 h-4" /> {t.dashboard}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserDashboardLayout>
    );
}