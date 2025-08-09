// src/app/User/Booking/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';

// Types
type Language = 'en' | 'si' | 'ta';

// Booking translations
const bookingTranslations: Record<Language, {
  title: string;
  subtitle: string;
  backToDashboard: string;
  createNew: string;
  upcoming: string;
  history: string;
  upcomingSubtitle: string;
  historySubtitle: string;
  noBookings: string;
  noBookingsDesc: string;
  createBooking: string;
  view: string;
  cancel: string;
  cancelling: string;
  viewDetails: string;
}> = {
  en: {
    title: 'Your Bookings',
    subtitle: 'Manage upcoming appointments and review your history',
    backToDashboard: 'Back to Dashboard',
    createNew: 'Create New Booking',
    upcoming: 'Upcoming',
    history: 'History',
    upcomingSubtitle: 'Your scheduled appointments. You will be notified before your turn.',
    historySubtitle: 'Your past completed and cancelled appointments.',
    noBookings: 'No Bookings Yet',
    noBookingsDesc: 'Create your first appointment to get started.',
    createBooking: 'Create Booking',
    view: 'View',
    cancel: 'Cancel',
    cancelling: 'Cancelling...',
    viewDetails: 'View Details'
  },
  si: {
    title: 'ඔබගේ වෙන්කිරීම්',
    subtitle: 'ඉදිරි නියමයන් කළමනාකරණය කරන්න සහ ඔබගේ ඉතිහාසය සමාලෝචනය කරන්න',
    backToDashboard: 'පාලනයට ආපසු',
    createNew: 'නව වෙන්කිරීමක් සාදන්න',
    upcoming: 'ඉදිරි',
    history: 'ඉතිහාසය',
    upcomingSubtitle: 'ඔබගේ නියම කරන ලද නියමයන්. ඔබගේ වාරය පැමිණීමට පෙර ඔබට දැනුම් දෙනු ඇත.',
    historySubtitle: 'ඔබගේ අතීත සම්පූර්ණ සහ අවලංගු කරන ලද නියමයන්.',
    noBookings: 'තවම වෙන්කිරීම් නැත',
    noBookingsDesc: 'ආරම්භ කිරීමට ඔබගේ පළමු නියමය සාදන්න.',
    createBooking: 'වෙන්කිරීම සාදන්න',
    view: 'බලන්න',
    cancel: 'අවලංගු කරන්න',
    cancelling: 'අවලංගු කරමින්...',
    viewDetails: 'විස්තර බලන්න'
  },
  ta: {
    title: 'உங்கள் முன்பதிவுகள்',
    subtitle: 'வரவிருக்கும் சந்திப்புகளை நிர்வகிக்கவும் மற்றும் உங்கள் வரலாற்றை மதிப்பாய்வு செய்யவும்',
    backToDashboard: 'டாஷ்போர்டுக்கு திரும்பவும்',
    createNew: 'புதிய முன்பதிவு உருவாக்கவும்',
    upcoming: 'வரவிருக்கும்',
    history: 'வரலாறு',
    upcomingSubtitle: 'உங்கள் திட்டமிடப்பட்ட சந்திப்புகள். உங்கள் முறைக்கு முன் நீங்கள் அறிவிக்கப்படுவீர்கள்.',
    historySubtitle: 'உங்கள் கடந்த முடிக்கப்பட்ட மற்றும் ரத்து செய்யப்பட்ட சந்திப்புகள்.',
    noBookings: 'இன்னும் முன்பதிவுகள் இல்லை',
    noBookingsDesc: 'தொடங்க உங்கள் முதல் சந்திப்பை உருவாக்கவும்.',
    createBooking: 'முன்பதிவு உருவாக்கவும்',
    view: 'பார்க்கவும்',
    cancel: 'ரத்து செய்',
    cancelling: 'ரத்து செய்கிறது...',
    viewDetails: 'விவரங்களைப் பார்க்கவும்'
  }
};


// Icons
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
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
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
    const [bookings, setBookings] = useState<Booking[]>([
        { id: "bk-001", designation: "Senior Officer", agent: "N. Silva", date: new Date().toISOString().slice(0, 10), time: new Date(Date.now() + 10 * 60 * 1000).toTimeString().slice(0, 5), location: "GovLink Office - Counter 3", status: "upcoming" },
        { id: "bk-002", designation: "Officer", agent: "A. Perera", date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10), time: "10:30", location: "GovLink Office - Counter 1", status: "upcoming" },
        { id: "bk-003", designation: "Manager", agent: "R. Jayasinghe", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), time: "14:00", location: "GovLink Office - Room 2", status: "upcoming" },
        { id: "bk-004", designation: "Clerk", agent: "S. Fernando", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), time: "09:00", location: "GovLink Office - Counter 5", status: "completed" },
    ]);

    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const t = bookingTranslations[currentLanguage];

    const handleLanguageChange = (newLanguage: Language) => {
        setCurrentLanguage(newLanguage);
    };

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
            {/* Back Button and Create Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
                <Link 
                    href="/User/Dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t.backToDashboard}
                </Link>
                <Link href="/User/Booking/New" className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-xl hover:from-[#FF5722] hover:to-[#8D153A] focus:outline-none focus:ring-4 focus:ring-[#FFC72C]/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
                    <PlusIcon className="w-5 h-5" />
                    {t.createNew}
                </Link>
            </div>

            {sortedBookings.length === 0 ? (
                <div className="max-w-lg mx-auto">
                    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-8 rounded-2xl border border-border/50 shadow-glow modern-card flex flex-col items-center text-center animate-fade-in-up">
                        <EmptyCalendarIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-foreground">{t.noBookings}</h3>
                        <p className="text-muted-foreground mb-6">{t.noBookingsDesc}</p>
                        <Link href="/User/Booking/New" className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-xl hover:from-[#FF5722] hover:to-[#8D153A] focus:outline-none focus:ring-4 focus:ring-[#FFC72C]/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
                            <PlusIcon className="w-5 h-5" />
                            {t.createBooking}
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-16">
                    {/* Upcoming Bookings */}
                    {upcomingBookings.length > 0 && (
                        <section>
                            <div className="mb-8 animate-fade-in-up">
                                <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
                                    <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
                                    <span className="text-xs sm:text-sm font-medium text-foreground">{t.upcoming}</span>
                                </div>
                                <p className="text-muted-foreground">{t.upcomingSubtitle}</p>
                            </div>
                            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {upcomingBookings.map((b, idx) => (
                                    <li key={b.id} className="relative group transition-all duration-300 hover:border-[#FFC72C]/80 hover:shadow-2xl hover-lift animate-fade-in-up modern-card">
                                        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow flex flex-col h-full">
                                            {idx === 0 && (
                                                <>
                                                    <div className="pointer-events-none absolute -inset-0.5 rounded-2xl ring-2 ring-[#FF5722]/60" aria-hidden />
                                                    <div aria-hidden className="pointer-events-none absolute -inset-1 rounded-2xl animate-pulse bg-gradient-to-r from-[#FF5722]/20 to-transparent" />
                                                </>
                                            )}
                                            <div className="flex-grow">
                                                <div className="flex items-start justify-between gap-4 mb-4">
                                                    <div>
                                                        <p className="text-muted-foreground text-sm">{b.designation}</p>
                                                        <h3 className="text-xl font-bold text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">{b.agent}</h3>
                                                    </div>
                                                    <BookingStatusBadge status={b.status} />
                                                </div>
                                                <div className="border-t border-border/50 my-4"></div>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-[#FFC72C]" /><span className="text-foreground">{new Date(b.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                                                    <div className="flex items-center gap-3"><ClockIcon className="w-5 h-5 text-[#FFC72C]" /><span className="text-foreground">{b.time}</span></div>
                                                    {b.location && <div className="flex items-center gap-3"><LocationPinIcon className="w-5 h-5 text-[#FFC72C]" /><span className="text-foreground">{b.location}</span></div>}
                                                </div>
                                            </div>
                                            <div className="border-t border-border/50 mt-6 pt-4 flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground">ID: {b.id}</p>
                                                <div className="flex gap-2">
                                                    <button type="button" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-lg transition-all duration-300 hover:border-[#FFC72C]/60">{t.view}</button>
                                                    <button type="button" onClick={() => cancelBooking(b.id)} disabled={cancellingId === b.id} className="px-3 py-1.5 text-sm font-medium text-[#FF5722] hover:text-white bg-[#FF5722]/10 hover:bg-[#FF5722] border border-[#FF5722]/30 hover:border-[#FF5722] rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                                        {cancellingId === b.id ? t.cancelling : t.cancel}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Hover Effect Gradient */}
                                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Past Bookings */}
                    {pastBookings.length > 0 && (
                        <section>
                            <div className="mb-8 animate-fade-in-up">
                                <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
                                    <div className="w-2 h-2 bg-gradient-to-r from-[#8D153A] to-[#008060] rounded-full animate-pulse"></div>
                                    <span className="text-xs sm:text-sm font-medium text-foreground">{t.history}</span>
                                </div>
                                <p className="text-muted-foreground">{t.historySubtitle}</p>
                            </div>
                            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {pastBookings.map((b) => (
                                    <li key={b.id} className="group transition-all duration-300 hover:border-foreground/30 hover:shadow-xl hover-lift animate-fade-in-up modern-card opacity-80 hover:opacity-100">
                                        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow flex flex-col h-full">
                                            <div className="flex-grow">
                                                <div className="flex items-start justify-between gap-4 mb-4">
                                                    <div>
                                                        <p className="text-muted-foreground text-sm">{b.designation}</p>
                                                        <h3 className="text-xl font-bold text-foreground">{b.agent}</h3>
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
                                                    <button type="button" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-lg transition-all duration-300 hover:border-[#FFC72C]/60">{t.viewDetails}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            )}
        </UserDashboardLayout>
    );
}