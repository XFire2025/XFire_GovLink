// e.g., app/user/booking/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from '@/components/Header'; // Assuming Header is in a shared components directory

// --- SHARED COMPONENTS (Copied from verification/page.tsx for consistency) ---

const GlobalParticleBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Light Mode Enhanced Flag Background */}
        <div className="absolute inset-0 opacity-[0.25] sm:opacity-[0.30] md:opacity-[0.35] dark:opacity-0">
            <Image src="/flag-of-sri-lanka-1.gif" alt="Sri Lankan Flag Background" fill className="object-cover object-center scale-110 sm:scale-105 md:scale-100" style={{ filter: 'contrast(2.2) brightness(0.45) saturate(2.2) sepia(0.25) hue-rotate(8deg)', mixBlendMode: 'multiply' }} unoptimized={true} priority={false} />
        </div>
        {/* Dark Mode Flag Background */}
        <div className="absolute inset-0 opacity-0 dark:opacity-[0.02]">
            <Image src="/flag-of-sri-lanka-1.gif" alt="Sri Lankan Flag Background" fill className="object-cover object-center scale-110 sm:scale-105 md:scale-100" unoptimized={true} priority={false} />
        </div>
        {/* Subtle static accents */}
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
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const LocationPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const EmptyCalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9.5 14.5 5 0"/><path d="m9.5 18.5 2 0"/></svg>
);


type Booking = {
    id: string;
    designation: string;
    agent: string;
    date: string; // ISO date
    time: string; // HH:mm
    location?: string;
    status: "upcoming" | "completed" | "cancelled";
};

// A styled status badge component
const BookingStatusBadge = ({ status }: { status: Booking['status'] }) => {
    const styles = {
        upcoming: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
        <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase border ${styles[status]}`}>
            {status}
        </span>
    );
};

// The main component for the page
export default function BookingListPage() {
    const [bookings, setBookings] = useState<Booking[]>([
        { id: "bk-001", designation: "Senior Officer", agent: "N. Silva", date: new Date().toISOString().slice(0, 10), time: new Date(Date.now() + 10 * 60 * 1000).toTimeString().slice(0, 5), location: "GovLink Office - Counter 3", status: "upcoming" },
        { id: "bk-002", designation: "Officer", agent: "A. Perera", date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10), time: "10:30", location: "GovLink Office - Counter 1", status: "upcoming" },
        { id: "bk-003", designation: "Manager", agent: "R. Jayasinghe", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), time: "14:00", location: "GovLink Office - Room 2", status: "upcoming" },
        { id: "bk-004", designation: "Clerk", agent: "S. Fernando", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), time: "09:00", location: "GovLink Office - Counter 5", status: "completed" },
    ]);

    const [cancellingId, setCancellingId] = useState<string | null>(null);

    function cancelBooking(id: string) {
        setCancellingId(id);
        setTimeout(() => {
            setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
            setCancellingId(null);
        }, 700);
    }

    const sortedBookings = useMemo(() => {
        const toTs = (b: Booking) => new Date(`${b.date}T${b.time}:00`).getTime();
        return [...bookings].sort((a, b) => {
            if (a.status === "cancelled" && b.status !== "cancelled") return 1;
            if (b.status === "cancelled" && a.status !== "cancelled") return -1;
            if (a.status === "completed" && b.status !== "completed") return 1;
            if (b.status === "completed" && a.status !== "completed") return -1;
            return toTs(a) - toTs(b);
        });
    }, [bookings]);
    
    const upcomingBookings = sortedBookings.filter(b => b.status === 'upcoming');
    const pastBookings = sortedBookings.filter(b => b.status !== 'upcoming');

    return (
        <div className="bg-background text-foreground min-h-screen relative">
            <GlobalParticleBackground />
            <div className="relative z-10">
                <Header />
                <main className="container mx-auto px-4 sm:px-6 py-32 sm:py-40">
                    <SectionTitle
                        title="Your Bookings"
                        subtitle="Manage upcoming appointments and review your history."
                    />

                    <div className="text-center mb-16">
                        <Link href="/User/Booking/New" className="btn-primary-premium inline-flex items-center">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Create New Booking
                        </Link>
                    </div>

                    {sortedBookings.length === 0 ? (
                        <div className="glass-morphism max-w-lg mx-auto p-8 rounded-3xl border border-border/50 flex flex-col items-center text-center">
                            <EmptyCalendarIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-bold mb-2">No Bookings Yet</h3>
                            <p className="text-muted-foreground mb-6">Create your first appointment to get started.</p>
                            <Link href="/User/Booking/New" className="btn-primary-premium inline-flex items-center">
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Create Booking
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {/* Upcoming Bookings */}
                            {upcomingBookings.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2 text-gradient">Upcoming</h2>
                                    <p className="text-muted-foreground mb-8">Your scheduled appointments. You will be notified before your turn.</p>
                                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {upcomingBookings.map((b, idx) => (
                                            <li key={b.id} className="relative group transition-all duration-300 hover:!border-[#FFC72C]/80 hover:shadow-2xl hover:-translate-y-1 glass-morphism p-6 rounded-3xl border border-border/50 flex flex-col">
                                                {idx === 0 && (
                                                    <>
                                                        <div className="pointer-events-none absolute -inset-0.5 rounded-3xl ring-2 ring-red-400/60" aria-hidden />
                                                        <div aria-hidden className="pointer-events-none absolute -inset-1 rounded-[26px] animate-[glow_2.4s_linear_infinite] bg-[conic-gradient(from_var(--angle),transparent_0%,rgba(239,68,68,0.45)_12%,transparent_22%,transparent_100%)] [--angle:0deg]" style={{ maskImage: "radial-gradient(closest-side, transparent 92%, black 96%)" }} />
                                                    </>
                                                )}
                                                <div className="flex-grow">
                                                    <div className="flex items-start justify-between gap-4 mb-4">
                                                        <div>
                                                            <p className="text-muted-foreground text-sm">{b.designation}</p>
                                                            <h3 className="text-xl font-bold">{b.agent}</h3>
                                                        </div>
                                                        <BookingStatusBadge status={b.status} />
                                                    </div>
                                                    <div className="border-t border-border/50 my-4"></div>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-[#FFC72C]" /><span>{new Date(b.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                                                        <div className="flex items-center gap-3"><ClockIcon className="w-5 h-5 text-[#FFC72C]" /><span>{b.time}</span></div>
                                                        {b.location && <div className="flex items-center gap-3"><LocationPinIcon className="w-5 h-5 text-[#FFC72C]" /><span>{b.location}</span></div>}
                                                    </div>
                                                </div>
                                                <div className="border-t border-border/50 mt-6 pt-4 flex items-center justify-between">
                                                    <p className="text-xs text-muted-foreground">ID: {b.id}</p>
                                                    <div className="flex gap-2">
                                                        <button type="button" className="btn-secondary-premium !px-3 !py-1.5 text-sm">View</button>
                                                        <button type="button" onClick={() => cancelBooking(b.id)} disabled={cancellingId === b.id} className="btn-danger-premium !px-3 !py-1.5 text-sm disabled:opacity-50 disabled:pointer-events-none">
                                                            {cancellingId === b.id ? "Cancelling..." : "Cancel"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Past Bookings */}
                            {pastBookings.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2 text-gradient">History</h2>
                                    <p className="text-muted-foreground mb-8">Your past completed and cancelled appointments.</p>
                                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {pastBookings.map((b) => (
                                             <li key={b.id} className="transition-all duration-300 hover:border-foreground/20 hover:shadow-xl hover:-translate-y-1 glass-morphism p-6 rounded-3xl border border-border/50 flex flex-col opacity-80">
                                                <div className="flex-grow">
                                                    <div className="flex items-start justify-between gap-4 mb-4">
                                                        <div>
                                                            <p className="text-muted-foreground text-sm">{b.designation}</p>
                                                            <h3 className="text-xl font-bold">{b.agent}</h3>
                                                        </div>
                                                        <BookingStatusBadge status={b.status} />
                                                    </div>
                                                     <div className="border-t border-border/50 my-4"></div>
                                                    <div className="space-y-3 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5" /><span>{new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {b.time}</span></div>
                                                        {b.location && <div className="flex items-center gap-3"><LocationPinIcon className="w-5 h-5" /><span>{b.location}</span></div>}
                                                    </div>
                                                </div>
                                                <div className="border-t border-border/50 mt-6 pt-4 flex items-center justify-between">
                                                    <p className="text-xs text-muted-foreground">ID: {b.id}</p>
                                                    <div className="flex gap-2">
                                                        <button type="button" className="btn-secondary-premium !px-3 !py-1.5 text-sm">View Details</button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                <Footer />
            </div>

            {/* Keyframes for the animated glow */}
            <style jsx>{`
                @keyframes glow {
                    0% { --angle: 0deg; }
                    100% { --angle: 360deg; }
                }
            `}</style>
        </div>
    );
}