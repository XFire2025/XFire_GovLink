// src/app/user/booking/page.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import QRCodeDisplay from '@/components/user/QRCodeDisplay';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
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
  viewPass: string;
  qrCode: string;
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
    viewDetails: 'View Details',
    viewPass: 'View Pass',
    qrCode: 'QR Code'
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
    viewDetails: 'විස්තර බලන්න',
    viewPass: 'පාස් බලන්න',
    qrCode: 'QR කේතය'
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
    viewDetails: 'விவரங்களைப் பார்க்கவும்',
    viewPass: 'பாஸைப் பார்க்கவும்',
    qrCode: 'QR குறியீடு'
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
    bookingReference: string;
    serviceType: string;
    department: string;
    date: string; // ISO date
    time: string; // HH:mm
    status: "pending" | "confirmed" | "completed" | "cancelled";
    priority?: string;
    notes?: string;
    assignedAgent?: {
        name: string;
        position: string;
        office?: string;
    } | null;
    submittedDate?: string;
    qrCode?: {
        imageUrl: string;
        generatedAt: string;
    } | null;
};

// A styled status badge component
const BookingStatusBadge = ({ status }: { status: Booking['status'] }) => {
    const styles = {
        pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
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
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const t = bookingTranslations[currentLanguage];

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/user/auth/login');
            return;
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch appointments from API
    useEffect(() => {
        const fetchAppointments = async () => {
            // Don't fetch if not authenticated
            if (!isAuthenticated || !user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/user/appointments?limit=50', {
                    method: 'GET',
                    credentials: 'include', // Include cookies for authentication
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.status === 401) {
                    // User is not authenticated, redirect to login
                    router.push('/user/auth/login');
                    return;
                }
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    setBookings(data.data.appointments || []);
                } else {
                    throw new Error(data.message || 'Failed to fetch appointments');
                }
            } catch (err) {
                console.error('Error fetching appointments:', err);
                if (err instanceof Error && err.message.includes('401')) {
                    router.push('/user/auth/login');
                    return;
                }
                setError(err instanceof Error ? err.message : 'Failed to load appointments');
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if authentication is complete
        if (!authLoading) {
            fetchAppointments();
        }
    }, [authLoading, isAuthenticated, user, router]);

    const handleLanguageChange = (newLanguage: Language) => {
        setCurrentLanguage(newLanguage);
    };

    function cancelBooking(id: string) {
        setCancellingId(id);
        
        // Call the cancel API
        const cancelAppointment = async () => {
            try {
                const response = await fetch(`/api/user/appointments/${id}/cancel`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    router.push('/user/auth/login');
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Failed to cancel appointment: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.success) {
                    // Update the local state to reflect the cancellation
                    setBookings((prev) => prev.map((b) => (
                        b.id === id 
                            ? { ...b, status: "cancelled" as const, qrCode: null } // Remove QR code
                            : b
                    )));
                    console.log('✅ Appointment cancelled successfully');
                } else {
                    throw new Error(data.message || 'Failed to cancel appointment');
                }
            } catch (error) {
                console.error('❌ Cancel appointment error:', error);
                alert(error instanceof Error ? error.message : 'Failed to cancel appointment. Please try again.');
            } finally {
                setCancellingId(null);
            }
        };

        cancelAppointment();
    }

    function showBookingQRCode(booking: Booking) {
        setSelectedBooking(booking);
        setShowQRCode(true);
    }

    function hideQRCode() {
        setShowQRCode(false);
        setSelectedBooking(null);
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
    
    const upcomingBookings = sortedBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
    const pastBookings = sortedBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

    // Show loading state while authentication is being checked
    if (authLoading) {
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
                <div className="flex items-center justify-center min-h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFC72C]"></div>
                </div>
            </UserDashboardLayout>
        );
    }

    // Don't render anything if not authenticated (will be redirected)
    if (!isAuthenticated || !user) {
        return null;
    }

    if (loading) {
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
                <div className="flex items-center justify-center min-h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFC72C]"></div>
                </div>
            </UserDashboardLayout>
        );
    }

    if (error) {
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
                <div className="max-w-lg mx-auto">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                        <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">Error Loading Appointments</h3>
                        <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </UserDashboardLayout>
        );
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
            {/* Back Button and Create Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
                <Link 
                    href="/user/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t.backToDashboard}
                </Link>
                <Link href="/user/booking/new" className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-xl hover:from-[#FF5722] hover:to-[#8D153A] focus:outline-none focus:ring-4 focus:ring-[#FFC72C]/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
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
                        <Link href="/user/booking/new" className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-xl hover:from-[#FF5722] hover:to-[#8D153A] focus:outline-none focus:ring-4 focus:ring-[#FFC72C]/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
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
                                                        <p className="text-muted-foreground text-sm">{b.assignedAgent?.position || 'Position not assigned'}</p>
                                                        <h3 className="text-xl font-bold text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">{b.assignedAgent?.name || 'Agent not assigned'}</h3>
                                                        <p className="text-sm text-muted-foreground">{b.serviceType}</p>
                                                        <p className="text-xs text-muted-foreground">{b.department}</p>
                                                    </div>
                                                    <BookingStatusBadge status={b.status} />
                                                </div>
                                                <div className="border-t border-border/50 my-4"></div>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-[#FFC72C]" /><span className="text-foreground">{new Date(b.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                                                    <div className="flex items-center gap-3"><ClockIcon className="w-5 h-5 text-[#FFC72C]" /><span className="text-foreground">{b.time}</span></div>
                                                    {b.assignedAgent?.office && <div className="flex items-center gap-3"><LocationPinIcon className="w-5 h-5 text-[#FFC72C]" /><span className="text-foreground">{b.assignedAgent.office}</span></div>}
                                                </div>
                                            </div>
                                            <div className="border-t border-border/50 mt-6 pt-4 flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground">
                                                    {b.bookingReference ? `REF: ${b.bookingReference}` : `ID: ${b.id}`}
                                                </p>
                                                <div className="flex gap-2">
                                                    <Link 
                                                        href={`/user/booking/${b.id}`}
                                                        className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-lg transition-all duration-300 hover:border-[#FFC72C]/60"
                                                    >
                                                        {t.view}
                                                    </Link>
                                                    {b.qrCode?.imageUrl && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => showBookingQRCode(b)}
                                                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-all duration-300"
                                                        >
                                                            {t.viewPass}
                                                        </button>
                                                    )}
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
                                                        <p className="text-muted-foreground text-sm">{b.assignedAgent?.position || 'Position not assigned'}</p>
                                                        <h3 className="text-xl font-bold text-foreground">{b.assignedAgent?.name || 'Agent not assigned'}</h3>
                                                        <p className="text-sm text-muted-foreground">{b.serviceType}</p>
                                                        <p className="text-xs text-muted-foreground">{b.department}</p>
                                                    </div>
                                                    <BookingStatusBadge status={b.status} />
                                                </div>
                                                <div className="border-t border-border/50 my-4"></div>
                                                <div className="space-y-3 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5" /><span>{new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {b.time}</span></div>
                                                    {b.assignedAgent?.office && <div className="flex items-center gap-3"><LocationPinIcon className="w-5 h-5" /><span>{b.assignedAgent.office}</span></div>}
                                                </div>
                                            </div>
                                            <div className="border-t border-border/50 mt-6 pt-4 flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground">
                                                    {b.bookingReference ? `REF: ${b.bookingReference}` : `ID: ${b.id}`}
                                                </p>
                                                <div className="flex gap-2">
                                                    <Link 
                                                        href={`/user/booking/${b.id}`}
                                                        className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-lg transition-all duration-300 hover:border-[#FFC72C]/60"
                                                    >
                                                        {t.viewDetails}
                                                    </Link>
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

            {/* QR Code Modal */}
            {showQRCode && selectedBooking && (
                <QRCodeDisplay
                    qrCodeImageUrl={selectedBooking.qrCode?.imageUrl}
                    bookingReference={selectedBooking.bookingReference}
                    appointmentData={{
                        service: selectedBooking.serviceType,
                        date: selectedBooking.date,
                        time: selectedBooking.time,
                        agent: selectedBooking.assignedAgent?.name,
                        location: selectedBooking.assignedAgent?.office
                    }}
                    onClose={hideQRCode}
                />
            )}
        </UserDashboardLayout>
    );
}