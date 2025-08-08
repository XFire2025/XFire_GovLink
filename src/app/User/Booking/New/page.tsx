// e.g., app/user/booking/new/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from '@/components/Header'; // Assuming Header is in a shared components directory

// --- SHARED COMPONENTS (Copied for consistency) ---

const GlobalParticleBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.25] sm:opacity-[0.30] md:opacity-[0.35] dark:opacity-0">
            <Image src="/flag-of-sri-lanka-1.gif" alt="Sri Lankan Flag Background" fill className="object-cover object-center scale-110 sm:scale-105 md:scale-100" style={{ filter: 'contrast(2.2) brightness(0.45) saturate(2.2) sepia(0.25) hue-rotate(8deg)', mixBlendMode: 'multiply' }} unoptimized={true} priority={false} />
        </div>
        <div className="absolute inset-0 opacity-0 dark:opacity-[0.02]">
            <Image src="/flag-of-sri-lanka-1.gif" alt="Sri Lankan Flag Background" fill className="object-cover object-center scale-110 sm:scale-105 md:scale-100" unoptimized={true} priority={false} />
        </div>
        <div className="absolute top-20 left-10 w-24 h-24 bg-[#8D153A]/10 dark:bg-[#FFC72C]/6 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-[#FF5722]/12 dark:bg-[#FF5722]/6 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-8 h-36 w-36 rounded-full bg-[#008060]/10 dark:bg-[#008060]/6 blur-2xl" />
        <div className="absolute bottom-6 right-10 h-24 w-24 rounded-full bg-[#FFC72C]/15 dark:bg-[#FFC72C]/8 blur-xl" />
    </div>
);

const Footer = () => (
    <footer className="relative py-16 mt-24">
        <div className="container mx-auto px-6">
            <div className="pt-8 border-t border-border text-center">
                <p className="text-muted-foreground text-sm">
                    &copy; {new Date().getFullYear()} GovLink Sri Lanka. An initiative to streamline public services.
                </p>
            </div>
        </div>
    </footer>
);

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-gradient">{title}</span>
        </h1>
        {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {subtitle}
            </p>
        )}
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#FFC72C] to-[#FF5722]" />
    </div>
);

// --- PAGE-SPECIFIC COMPONENTS & ICONS ---

// Icons
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
                    w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 flex items-center justify-between
                    ${disabled 
                        ? 'opacity-60 cursor-not-allowed bg-card/20 border-border/30' 
                        : 'bg-card/40 border-border/50 hover:border-[#FFC72C]/50 hover:bg-card/60 focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/30'
                    }
                    backdrop-blur-sm shadow-lg
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
                        <div className="bg-card/95 border border-border/70 rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden">
                            <div className="max-h-60 overflow-y-auto">
                                {options.map((option, index) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={`
                                            w-full text-left px-4 py-3 transition-all duration-150 border-b border-border/40 last:border-b-0
                                            ${value === option.value 
                                                ? 'bg-[#FFC72C]/30 text-[#FFC72C] font-semibold' 
                                                : 'text-foreground hover:bg-card/80 hover:text-[#FFC72C]'
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
    <div className="grid md:grid-cols-4 gap-4 md:gap-8">
        <div className="md:col-span-1">
            <div className="flex items-center gap-3">
                <Icon className="w-8 h-8 text-[#FFC72C]" />
                <h3 className="text-xl font-bold text-gradient">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-11 md:ml-0">{description}</p>
        </div>
        <div className="md:col-span-3 space-y-6">
            {children}
        </div>
    </div>
);

// Themed alert components
const SuccessAlert = ({ message }: { message: string }) => (
    <div className="glass-morphism-light p-4 rounded-2xl border border-emerald-500/30 flex items-center gap-3">
        <CheckCircleIcon className="w-6 h-6 text-emerald-400 flex-shrink-0" />
        <p className="text-sm font-medium text-emerald-300">{message}</p>
    </div>
);
const ErrorAlert = ({ message }: { message: string }) => (
    <div className="glass-morphism-light p-4 rounded-2xl border border-red-500/30 flex items-center gap-3">
        <AlertTriangleIcon className="w-6 h-6 text-red-400 flex-shrink-0" />
        <p className="text-sm font-medium text-red-300">{message}</p>
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
        if (!isAvailable) return { text: 'Unavailable', color: 'text-red-400' };
        if (isSelected) return { text: 'Selected', color: 'text-emerald-400' };
        return { text: 'Available', color: 'text-[#FFC72C]' };
    };

    const status = getSlotStatus();

    return (
        <div
            onClick={isAvailable ? onSelect : undefined}
            className={`
                relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer group
                ${!isAvailable 
                    ? 'bg-card/20 border-red-500/30 opacity-60 cursor-not-allowed' 
                    : isSelected 
                        ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
                        : 'bg-card/40 border-border/50 hover:border-[#FFC72C]/50 hover:bg-card/60 hover:shadow-lg hover:shadow-[#FFC72C]/10'
                }
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isSelected ? 'bg-emerald-500/20' : 'bg-[#FFC72C]/20'}`}>
                        <ClockIcon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-[#FFC72C]'}`} />
                    </div>
                    <div>
                        <div className="font-semibold text-foreground text-lg">
                            {formatTime(slot)}
                        </div>
                        {/* Only show status text for available/selected slots, not unavailable ones */}
                        {isAvailable && (
                            <div className={`text-xs font-medium ${status.color}`}>
                                {status.text}
                            </div>
                        )}
                    </div>
                </div>
                
                {isSelected && (
                    <div className="p-1 rounded-full bg-emerald-500/20">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                )}
            </div>
            
            {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/30 backdrop-blur-sm rounded-2xl">
                    <span className="text-xs font-medium text-red-400 bg-red-500/20 px-2 py-1 rounded-full">
                        Unavailable
                    </span>
                </div>
            )}
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
	const [form, setForm] = useState({ designation: "", agent: "", day: "", slot: "", notes: "" });
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

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
		if (!form.designation) return "Please select an agent designation";
		if (!form.agent) return "Please select an agent";
		if (!form.day) return "Please pick a day for your appointment";
		if (!form.slot) return "Please choose an available time slot";
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
        <div className="bg-background text-foreground min-h-screen relative">
            <GlobalParticleBackground />
            <div className="relative z-10">
                <Header />
                <main className="container mx-auto px-4 sm:px-6 py-32 sm:py-40">
                    <SectionTitle title="Book an Appointment" subtitle="Choose a designation, pick your agent, then select a day and time." />
                    
                    <div className="max-w-4xl mx-auto">
                        {success && <div className="mb-8"><SuccessAlert message={success} /></div>}
                        {error && <div className="mb-8"><ErrorAlert message={error} /></div>}
                    
                        <form onSubmit={handleSubmit} className="glass-morphism p-6 sm:p-8 rounded-3xl border border-border/50">
                            <div className="space-y-12">
                                <Step icon={UserCheckIcon} title="Step 1: Agent" description="Select the type of official you need to meet.">
                                    <div>
                                        <label htmlFor="designation" className="form-label">Agent Designation</label>
                                        <CustomDropdown
                                            id="designation"
                                            name="designation"
                                            value={form.designation}
                                            onChange={handleChange}
                                            placeholder="Select a designation..."
                                            options={DESIGNATIONS}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="agent" className="form-label">Agent Name</label>
                                        <CustomDropdown
                                            id="agent"
                                            name="agent"
                                            value={form.agent}
                                            onChange={handleChange}
                                            disabled={!form.designation}
                                            placeholder={form.designation ? "Select an agent..." : "Select a designation first"}
                                            options={agents}
                                        />
                                    </div>
                                </Step>

                                <div className="border-t border-border/20"></div>

                                <Step icon={CalendarClockIcon} title="Step 2: Schedule" description="Pick an available day and time slot for your appointment.">
                                    <div>
                                        <label className="form-label">Pick a Day</label>
                                        <div className="glass-morphism-inner p-4 rounded-xl">
                                            {/* Responsive grid: max 7 columns on large screens, fewer on small */}
                                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
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
                                                            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 text-center ${
                                                                isWeekend 
                                                                    ? 'bg-card/20 text-muted-foreground/50 cursor-not-allowed opacity-60' 
                                                                    : isActive 
                                                                        ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg' 
                                                                        : 'bg-card/50 hover:bg-card/80 text-muted-foreground'
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
                                        <label className="form-label">Available Slots</label>
                                        <div className="glass-morphism-inner p-4 rounded-xl">
                                            {!form.day || !form.agent ? (
                                                <div className="flex items-center justify-center text-center gap-3 py-12">
                                                    <InfoIcon className="w-8 h-8 text-muted-foreground/70" />
                                                    <div>
                                                        <p className="text-muted-foreground font-medium mb-1">Select an agent and a day first</p>
                                                        <p className="text-sm text-muted-foreground/70">Available time slots will appear here</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold text-foreground">
                                                            Available Times for {days.find(d => d.key === form.day)?.label}
                                                        </h4>
                                                        <div className="text-sm text-muted-foreground">
                                                            {Array.from(availableSlots).length} slots available
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
                                                            <AlertTriangleIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                                                            <p className="text-muted-foreground font-medium mb-1">No slots available</p>
                                                            <p className="text-sm text-muted-foreground/70">Please try a different day or agent</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Step>
                                
                                <div className="border-t border-border/20"></div>

                                <Step icon={ClipboardIcon} title="Step 3: Details" description="Provide any additional notes for your appointment.">
                                    <div>
                                        <label htmlFor="notes" className="form-label">Notes (Optional)</label>
                                        <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={4} placeholder="Add any specific details, questions, or required documents..." className="form-input" />
                                    </div>
                                </Step>

                                <div className="border-t border-border/20 pt-8 flex items-center justify-end gap-4">
                                    <Link href="/user/booking" className="btn-secondary-premium">Cancel</Link>
                                    <button type="submit" disabled={submitting || !!success} className="btn-primary-premium">{submitting ? "Submitting..." : (success ? "Booked!" : "Request Booking")}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>

            {/* Local styles for form inputs */}
            <style jsx>{`
                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem; /* 14px */
                    font-weight: 600;
                    color: var(--color-muted-foreground);
                }
                .form-input {
                    display: block;
                    width: 100%;
                    background-color: hsla(var(--card-hsl), 0.5);
                    border: 1px solid hsla(var(--border-hsl), 0.5);
                    border-radius: 0.75rem; /* 12px */
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    color: var(--color-foreground);
                    transition: all 0.2s ease-in-out;
                }
                .form-input:focus {
                    outline: none;
                    border-color: #FFC72C;
                    box-shadow: 0 0 0 3px rgba(255, 199, 44, 0.3);
                }
                .form-input::placeholder {
                    color: var(--color-muted-foreground);
                    opacity: 0.7;
                }
                .form-input:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                    background-color: hsla(var(--card-hsl), 0.2);
                }
            `}</style>
        </div>
	);
}