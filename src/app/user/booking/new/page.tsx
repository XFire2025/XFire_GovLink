// src/app/User/Booking/New/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';

// Types
type Language = 'en' | 'si' | 'ta';

// New booking translations
const newBookingTranslations: Record<Language, {
  title: string;
  subtitle: string;
  backToBookings: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  agentDesignation: string;
  agentName: string;
  selectDesignation: string;
  selectAgent: string;
  selectDesignationFirst: string;
  pickDay: string;
  availableSlots: string;
  selectAgentAndDay: string;
  availableSlotsWillAppear: string;
  availableTimesFor: string;
  slotsAvailable: string;
  noSlotsAvailable: string;
  tryDifferentDay: string;
  notes: string;
  notesPlaceholder: string;
  cancel: string;
  requestBooking: string;
  submitting: string;
  booked: string;
  errors: {
    selectDesignation: string;
    selectAgent: string;
    pickDay: string;
    chooseTimeSlot: string;
  };
}> = {
  en: {
    title: 'Book Appointment',
    subtitle: 'Schedule your meeting with government officials',
    backToBookings: 'Back to Bookings',
    step1Title: 'Step 1: Agent',
    step1Desc: 'Select the type of official you need to meet.',
    step2Title: 'Step 2: Schedule',
    step2Desc: 'Pick an available day and time slot for your appointment.',
    step3Title: 'Step 3: Details',
    step3Desc: 'Provide any additional notes for your appointment.',
    agentDesignation: 'Agent Designation',
    agentName: 'Agent Name',
    selectDesignation: 'Select a designation...',
    selectAgent: 'Select an agent...',
    selectDesignationFirst: 'Select a designation first',
    pickDay: 'Pick a Day',
    availableSlots: 'Available Slots',
    selectAgentAndDay: 'Select an agent and a day first',
    availableSlotsWillAppear: 'Available time slots will appear here',
    availableTimesFor: 'Available Times for',
    slotsAvailable: 'slots available',
    noSlotsAvailable: 'No slots available',
    tryDifferentDay: 'Please try a different day or agent',
    notes: 'Notes (Optional)',
    notesPlaceholder: 'Add any specific details, questions, or required documents...',
    cancel: 'Cancel',
    requestBooking: 'Request Booking',
    submitting: 'Submitting...',
    booked: 'Booked!',
    errors: {
      selectDesignation: 'Please select an agent designation',
      selectAgent: 'Please select an agent',
      pickDay: 'Please pick a day for your appointment',
      chooseTimeSlot: 'Please choose an available time slot'
    }
  },
  si: {
    title: 'හමුවීම් වෙන්කිරීම',
    subtitle: 'රජයේ නිලධාරීන් සමඟ ඔබගේ හමුවීම සකස් කරන්න',
    backToBookings: 'වෙන්කිරීම් වෙත ආපසු',
    step1Title: 'පියවර 1: නිලධාරි',
    step1Desc: 'ඔබට හමුවීමට අවශ්‍ය නිලධාරියාගේ වර්ගය තෝරන්න.',
    step2Title: 'පියවර 2: කාලසටහන',
    step2Desc: 'ඔබගේ හමුවීම සඳහා පවතින දිනයක් සහ වේලාවක් තෝරන්න.',
    step3Title: 'පියවර 3: විස්තර',
    step3Desc: 'ඔබගේ හමුවීම සඳහා අමතර සටහන් සපයන්න.',
    agentDesignation: 'නිලධාරි තනතුර',
    agentName: 'නිලධාරි නම',
    selectDesignation: 'තනතුරක් තෝරන්න...',
    selectAgent: 'නිලධාරියෙකු තෝරන්න...',
    selectDesignationFirst: 'මුලින්ම තනතුරක් තෝරන්න',
    pickDay: 'දිනයක් තෝරන්න',
    availableSlots: 'පවතින වේලාවන්',
    selectAgentAndDay: 'මුලින්ම නිලධාරියෙකු සහ දිනයක් තෝරන්න',
    availableSlotsWillAppear: 'පවතින වේලාවන් මෙහි පෙන්වනු ඇත',
    availableTimesFor: 'සඳහා පවතින වේලාවන්',
    slotsAvailable: 'වේලාවන් පවතී',
    noSlotsAvailable: 'වේලාවන් නොමැත',
    tryDifferentDay: 'කරුණාකර වෙනත් දිනයක් හෝ නිලධාරියෙකු උත්සාහ කරන්න',
    notes: 'සටහන් (විකල්ප)',
    notesPlaceholder: 'විශේෂ විස්තර, ප්‍රශ්න, හෝ අවශ්‍ය ලේඛන එක් කරන්න...',
    cancel: 'අවලංගු කරන්න',
    requestBooking: 'වෙන්කිරීම ඉල්ලන්න',
    submitting: 'ඉදිරිපත් කරමින්...',
    booked: 'වෙන් කරන ලදී!',
    errors: {
      selectDesignation: 'කරුණාකර නිලධාරි තනතුරක් තෝරන්න',
      selectAgent: 'කරුණාකර නිලධාරියෙකු තෝරන්න',
      pickDay: 'කරුණාකර ඔබගේ හමුවීම සඳහා දිනයක් තෝරන්න',
      chooseTimeSlot: 'කරුණාකර පවතින වේලාවක් තෝරන්න'
    }
  },
  ta: {
    title: 'சந்திப்பு முன்பதிவு',
    subtitle: 'அரசு அதிகாரிகளுடன் உங்கள் சந்திப்பை திட்டமிடுங்கள்',
    backToBookings: 'முன்பதிவுகளுக்கு திரும்பவும்',
    step1Title: 'படி 1: அதிகாரி',
    step1Desc: 'நீங்கள் சந்திக்க வேண்டிய அதிகாரியின் வகையைத் தேர்ந்தெடுக்கவும்.',
    step2Title: 'படி 2: அட்டவணை',
    step2Desc: 'உங்கள் சந்திப்புக்கு கிடைக்கும் நாள் மற்றும் நேர இடைவெளியைத் தேர்ந்தெடுக்கவும்.',
    step3Title: 'படி 3: விவரங்கள்',
    step3Desc: 'உங்கள் சந்திப்புக்கான கூடுதல் குறிப்புகளை வழங்கவும்.',
    agentDesignation: 'அதிகாரி பதவி',
    agentName: 'அதிகாரி பெயர்',
    selectDesignation: 'ஒரு பதவியைத் தேர்ந்தெடுக்கவும்...',
    selectAgent: 'ஒரு அதிகாரியைத் தேர்ந்தெடுக்கவும்...',
    selectDesignationFirst: 'முதலில் ஒரு பதவியைத் தேர்ந்தெடுக்கவும்',
    pickDay: 'ஒரு நாளைத் தேர்ந்தெடுக்கவும்',
    availableSlots: 'கிடைக்கும் நேரங்கள்',
    selectAgentAndDay: 'முதலில் ஒரு அதிகாரி மற்றும் நாளைத் தேர்ந்தெடுக்கவும்',
    availableSlotsWillAppear: 'கிடைக்கும் நேர இடைவெளிகள் இங்கே தோன்றும்',
    availableTimesFor: 'க்கு கிடைக்கும் நேரங்கள்',
    slotsAvailable: 'இடைவெளிகள் கிடைக்கின்றன',
    noSlotsAvailable: 'இடைவெளிகள் கிடைக்கவில்லை',
    tryDifferentDay: 'தயவுசெய்து வேறு நாள் அல்லது அதிகாரியை முயற்சிக்கவும்',
    notes: 'குறிப்புகள் (விருப்பமானது)',
    notesPlaceholder: 'குறிப்பிட்ட விவரங்கள், கேள்விகள், அல்லது தேவையான ஆவணங்களைச் சேர்க்கவும்...',
    cancel: 'ரத்துசெய்',
    requestBooking: 'முன்பதிவு கோரிக்கை',
    submitting: 'சமர்ப்பிக்கிறது...',
    booked: 'முன்பதிவு செய்யப்பட்டது!',
    errors: {
      selectDesignation: 'தயவுசெய்து ஒரு அதிகாரி பதவியைத் தேர்ந்தெடுக்கவும்',
      selectAgent: 'தயவுசெய்து ஒரு அதிகாரியைத் தேர்ந்தெடுக்கவும்',
      pickDay: 'தயவுசெய்து உங்கள் சந்திப்புக்கு ஒரு நாளைத் தேர்ந்தெடுக்கவும்',
      chooseTimeSlot: 'தயவுசெய்து கிடைக்கும் நேர இடைவெளியைத் தேர்ந்தெடுக்கவும்'
    }
  }
};

// --- PAGE-SPECIFIC COMPONENTS & ICONS ---

// Icons
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const UserCheckIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>;
const CalendarClockIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.25V14"/><circle cx="16" cy="16" r="5.5"/></svg>;
const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>;
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;

// Custom Dropdown Component
const CustomDropdown = ({ 
    id, 
    name, 
    value, 
    onChange, 
    disabled, 
    placeholder, 
    options 
}: {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    placeholder: string;
    options: { value: string; label: string }[];
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
            {/* Hidden select for form compatibility */}
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

            {/* Custom dropdown button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 flex items-center justify-between backdrop-blur-md
                    ${disabled 
                        ? 'opacity-60 cursor-not-allowed bg-card/20 dark:bg-card/30 border-border/30' 
                        : 'bg-card/50 dark:bg-card/70 border-border/50 hover:border-[#FFC72C]/60 hover:bg-card/70 dark:hover:bg-card/80 focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/30'
                    }
                    shadow-md hover:shadow-lg modern-card
                `}
            >
                <span className={`${value ? 'text-foreground' : 'text-muted-foreground'} font-medium`}>
                    {selectedLabel}
                </span>
                <ChevronDownIcon 
                    className={`w-5 h-5 text-[#FFC72C] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Options */}
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

// Form Step component for visual structure
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

// Themed alert components
const SuccessAlert = ({ message }: { message: string }) => (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-[#008060]/30 flex items-center gap-3 shadow-glow modern-card animate-fade-in-up">
        <CheckCircleIcon className="w-6 h-6 text-[#008060] flex-shrink-0" />
        <p className="text-sm font-medium text-[#008060]">{message}</p>
    </div>
);
const ErrorAlert = ({ message }: { message: string }) => (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-[#FF5722]/30 flex items-center gap-3 shadow-glow modern-card animate-fade-in-up">
        <AlertTriangleIcon className="w-6 h-6 text-[#FF5722] flex-shrink-0" />
        <p className="text-sm font-medium text-[#FF5722]">{message}</p>
    </div>
);

// Time Slot Card Component
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

    const getSlotStatus = () => {
        if (!isAvailable) return { text: 'Unavailable', color: 'text-[#FF5722]' };
        if (isSelected) return { text: 'Selected', color: 'text-[#008060]' };
        return { text: 'Available', color: 'text-[#FFC72C]' };
    };

    const status = getSlotStatus();

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
                        {/* Only show status text for available/selected slots, not unavailable ones */}
                        {isAvailable && (
                            <div className={`text-xs font-medium transition-colors duration-300 ${status.color}`}>
                                {status.text}
                            </div>
                        )}
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
            
            {/* Hover Effect Gradient */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
            </div>
        </div>
    );
};


// --- MOCK DATA & GENERATORS (Unchanged logic) ---
const DESIGNATIONS = [{ value: "officer", label: "Officer" }, { value: "senior-officer", label: "Senior Officer" }, { value: "manager", label: "Manager" }];
const AGENTS_BY_DESIGNATION: Record<string, { value: string; label: string }[]> = {
	officer: [{ value: "a_perera", label: "A. Perera" }, { value: "s_fernando", label: "S. Fernando" }],
	"senior-officer": [{ value: "n_silva", label: "N. Silva" }, { value: "k_de_alwis", label: "K. De Alwis" }],
	manager: [{ value: "r_jayasinghe", label: "R. Jayasinghe" }],
};
function generateDays(days = 7) {
	const out: { key: string; date: Date; label: string }[] = [];
	const now = new Date();
	for (let i = 0; i < days; i++) {
		const d = new Date(now);
		d.setDate(now.getDate() + i);
		out.push({ key: d.toISOString().slice(0, 10), date: d, label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) });
	}
	return out;
}
function generateSlots() {
	const slots: string[] = [];
	for (let h = 9; h <= 16; h++) {
		for (const m of [0, 30]) {
			const timeSlot = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
			
			// Skip lunch break: 12:30 PM to 2:00 PM (12:30 - 14:00)
			if ((h === 12 && m === 30) || h === 13 || (h === 14 && m === 0)) {
				continue;
			}
			
			slots.push(timeSlot);
		}
	}
	return slots;
}
function mockAvailability(dayKey: string, agent: string) {
	const base = generateSlots();
	const blocked = new Set<string>();
	for (let i = 0; i < base.length; i++) {
		const seed = (dayKey.charCodeAt(0) + (agent?.charCodeAt(0) || 0) + i) % 5;
		if (seed === 0) blocked.add(base[i]);
	}
	return new Set(base.filter((s) => !blocked.has(s)));
}


// --- MAIN PAGE COMPONENT ---
export default function NewBookingPage() {
	const router = useRouter();
	const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
	const [form, setForm] = useState({ designation: "", agent: "", day: "", slot: "", notes: "" });
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const t = newBookingTranslations[currentLanguage];

	const handleLanguageChange = (newLanguage: Language) => {
		setCurrentLanguage(newLanguage);
	};

	// Increase to 14 days
	const days = useMemo(() => generateDays(14), []);
	const slots = useMemo(() => generateSlots(), []);
	const agents = useMemo(() => form.designation ? AGENTS_BY_DESIGNATION[form.designation] || [] : [], [form.designation]);
	const availableSlots = useMemo(() => (!form.day || !form.agent) ? new Set<string>() : mockAvailability(form.day, form.agent), [form.day, form.agent]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({...prev, [name]: value, ...(name === "designation" ? { agent: "", slot: "" } : {}), ...(name === "agent" ? { slot: "" } : {}) }));
	}

	function selectDay(dayKey: string) { setForm((prev) => ({ ...prev, day: dayKey, slot: "" })); }
	function selectSlot(slot: string) { if (availableSlots.has(slot)) setForm((prev) => ({ ...prev, slot })); }

	function validate() {
		if (!form.designation) return t.errors.selectDesignation;
		if (!form.agent) return t.errors.selectAgent;
		if (!form.day) return t.errors.pickDay;
		if (!form.slot) return t.errors.chooseTimeSlot;
		return null;
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
        setSuccess(null);
		const validationError = validate();
		if (validationError) { setError(validationError); return; }

		setSubmitting(true);
		await new Promise((res) => setTimeout(res, 1200));
		
		// Store booking data for the submission page (in real app, this would be handled differently)
		const bookingData = {
			designation: form.designation,
			agent: form.agent,
			day: form.day,
			slot: form.slot,
			notes: form.notes
		};
		localStorage.setItem('latestBooking', JSON.stringify(bookingData));
		
		// Redirect to submission page
		router.push('/user/booking/submission');
	}

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
			language={currentLanguage}
			onLanguageChange={handleLanguageChange}
		>
			<div className="max-w-4xl mx-auto">
				{/* Back Button */}
				<div className="mb-8">
					<Link 
						href="/User/Booking"
						className="inline-flex items-center gap-2 px-4 py-2 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
					>
						<ArrowLeftIcon className="w-4 h-4" />
						{t.backToBookings}
					</Link>
				</div>

				{success && <div className="mb-8"><SuccessAlert message={success} /></div>}
				{error && <div className="mb-8"><ErrorAlert message={error} /></div>}
			
				<form onSubmit={handleSubmit} className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border/50 shadow-glow modern-card hover:border-[#FFC72C]/30 transition-all duration-500">
					<div className="space-y-12">
						<Step icon={UserCheckIcon} title={t.step1Title} description={t.step1Desc}>
							<div>
								<label htmlFor="designation" className="block text-sm font-medium text-muted-foreground mb-2">{t.agentDesignation}</label>
								<CustomDropdown
									id="designation"
									name="designation"
									value={form.designation}
									onChange={handleChange}
									placeholder={t.selectDesignation}
									options={DESIGNATIONS}
								/>
							</div>
							<div>
								<label htmlFor="agent" className="block text-sm font-medium text-muted-foreground mb-2">{t.agentName}</label>
								<CustomDropdown
									id="agent"
									name="agent"
									value={form.agent}
									onChange={handleChange}
									disabled={!form.designation}
									placeholder={form.designation ? t.selectAgent : t.selectDesignationFirst}
									options={agents}
								/>
							</div>
						</Step>

						<div className="border-t border-border/30"></div>

						<Step icon={CalendarClockIcon} title={t.step2Title} description={t.step2Desc}>
							<div>
								<label className="block text-sm font-medium text-muted-foreground mb-2">{t.pickDay}</label>
								<div className="bg-card/50 dark:bg-card/60 backdrop-blur-md p-4 rounded-xl border border-border/30 modern-card">
									{/* Responsive grid: max 7 columns on large screens, fewer on small */}
									<div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
										{days.map((d) => {
											const isActive = form.day === d.key;
											const dayOfWeek = d.date.getDay(); // 0 = Sunday, 6 = Saturday
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
									) : (
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<h4 className="font-semibold text-foreground">
													{t.availableTimesFor} {days.find(d => d.key === form.day)?.label}
												</h4>
												<div className="text-sm text-muted-foreground">
													{Array.from(availableSlots).length} {t.slotsAvailable}
												</div>
											</div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {slots.map((s) => {
                                                            const isAvailable = availableSlots.has(s);
                                                            const isSelected = form.slot === s;
                                                            return (
                                                                <TimeSlotCard
                                                                    key={s}
                                                                    slot={s}
                                                                    isAvailable={isAvailable}
                                                                    isSelected={isSelected}
                                                                    onSelect={() => selectSlot(s)}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                    
											{Array.from(availableSlots).length === 0 && (
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
                                
						<div className="border-t border-border/30"></div>

						<Step icon={ClipboardIcon} title={t.step3Title} description={t.step3Desc}>
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

						<div className="border-t border-border/30 pt-8 flex flex-col sm:flex-row items-center justify-end gap-4">
							<Link 
								href="/User/Booking" 
								className="w-full sm:w-auto px-6 py-3 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105 text-center"
							>
								{t.cancel}
							</Link>
							<button 
								type="submit" 
								disabled={submitting || !!success} 
								className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl"
							>
								{submitting ? t.submitting : (success ? t.booked : t.requestBooking)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</UserDashboardLayout>
	);
}