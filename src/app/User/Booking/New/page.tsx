// e.g., app/user/booking/new/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
	for (let h = 9; h <= 16; h++) for (const m of [0, 30]) slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
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
		setSuccess("Your booking request has been confirmed! A confirmation has been sent to your registered email.");
		setForm({ designation: "", agent: "", day: "", slot: "", notes: "" });
		setSubmitting(false);
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
                                        <select id="designation" name="designation" value={form.designation} onChange={handleChange} className="form-input">
                                            <option value="" disabled>Select a designation...</option>
                                            {DESIGNATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="agent" className="form-label">Agent Name</label>
                                        <select id="agent" name="agent" value={form.agent} onChange={handleChange} disabled={!form.designation} className="form-input">
                                            <option value="" disabled>{form.designation ? "Select an agent..." : "Select a designation first"}</option>
                                            {agents.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                                        </select>
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
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={d.key}
                                                            onClick={() => selectDay(d.key)}
                                                            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 text-center ${isActive ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg' : 'bg-card/50 hover:bg-card/80 text-muted-foreground'}`}
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
                                                <div className="flex items-center justify-center text-center gap-3 py-8">
                                                    <InfoIcon className="w-6 h-6 text-muted-foreground/70" />
                                                    <p className="text-muted-foreground">Select an agent and a day to see available times.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                                    {slots.map((s) => {
                                                        const isAvailable = availableSlots.has(s);
                                                        const isActive = form.slot === s;
                                                        return <button key={s} type="button" disabled={!isAvailable} onClick={() => selectSlot(s)} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-[#FFC72C] ${!isAvailable ? 'bg-card/30 text-muted-foreground/50 line-through cursor-not-allowed' : isActive ? 'bg-gradient-to-r from-[#008060] to-[#007055] text-white shadow-md' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'}`}>{s}</button>;
                                                    })}
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