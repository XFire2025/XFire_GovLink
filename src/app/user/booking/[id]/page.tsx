// src/app/user/booking/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import QRCodeImage from '@/components/user/QRCodeImage';
import Link from "next/link";

// Types
interface AppointmentDetails {
  id: string;
  bookingReference: string;
  serviceType: string;
  department: string;
  date: string;
  time: string;
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
}

// Icons
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const LocationPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
  </svg>
);

// Status Badge Component
const StatusBadge = ({ status }: { status: AppointmentDetails['status'] }) => {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  };
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold tracking-wider uppercase border-2 ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const appointmentId = params.id as string;

  // Cancel appointment function
  const cancelAppointment = async () => {
    if (!appointment || appointment.status === 'cancelled' || appointment.status === 'completed') {
      return;
    }

    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this appointment? This action cannot be undone and will invalidate your QR code.'
    );

    if (!confirmCancel) {
      return;
    }

    setIsCancelling(true);
    
    try {
      const response = await fetch(`/api/user/appointments/${appointmentId}/cancel`, {
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
        setAppointment(prev => prev ? {
          ...prev,
          status: 'cancelled',
          qrCode: null // Remove QR code
        } : null);
        
        alert('Appointment cancelled successfully. Your QR code has been invalidated.');
      } else {
        throw new Error(data.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('❌ Cancel appointment error:', error);
      alert(error instanceof Error ? error.message : 'Failed to cancel appointment. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user/auth/login');
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!isAuthenticated || !user || !appointmentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/user/appointments/${appointmentId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 401) {
          router.push('/user/auth/login');
          return;
        }

        if (response.status === 404) {
          setError('Appointment not found');
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch appointment: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setAppointment(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch appointment details');
        }
      } catch (err) {
        console.error('Error fetching appointment details:', err);
        if (err instanceof Error && err.message.includes('401')) {
          router.push('/user/auth/login');
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchAppointmentDetails();
    }
  }, [authLoading, isAuthenticated, user, appointmentId, router]);

  // Download QR Code function
  const downloadQRCode = async () => {
    if (!appointment?.qrCode?.imageUrl) return;
    
    setIsDownloading(true);
    try {
      const apiUrl = `/api/file/retrieve?url=${encodeURIComponent(appointment.qrCode.imageUrl)}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch QR code: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `appointment-pass-${appointment.bookingReference}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time function
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <UserDashboardLayout
        title="Appointment Details"
        subtitle="Loading your appointment information"
        language="en"
        onLanguageChange={() => {}}
      >
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFC72C]"></div>
        </div>
      </UserDashboardLayout>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <UserDashboardLayout
        title="Appointment Details"
        subtitle="Loading your appointment information"
        language="en"
        onLanguageChange={() => {}}
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
        title="Appointment Details"
        subtitle="Error loading appointment information"
        language="en"
        onLanguageChange={() => {}}
      >
        <div className="max-w-lg mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">Error Loading Appointment</h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
              <Link 
                href="/user/booking"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Back to Bookings
              </Link>
            </div>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  if (!appointment) {
    return (
      <UserDashboardLayout
        title="Appointment Details"
        subtitle="Appointment not found"
        language="en"
        onLanguageChange={() => {}}
      >
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Appointment Not Found</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">The appointment you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
            <Link 
              href="/user/booking"
              className="px-4 py-2 bg-[#FFC72C] hover:bg-[#FF5722] text-white rounded-lg transition-colors"
            >
              Back to Bookings
            </Link>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout
      title="Appointment Details"
      subtitle={`REF: ${appointment.bookingReference}`}
      language="en"
      onLanguageChange={() => {}}
    >
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/user/booking"
          className="inline-flex items-center gap-2 px-4 py-2 font-medium text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card/70 border border-border/50 rounded-xl transition-all duration-300 hover:border-[#FFC72C]/60 hover:scale-105"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Bookings
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Status and Reference Header */}
        <div className="bg-gradient-to-r from-[#FFC72C]/10 to-[#FF5722]/10 rounded-2xl p-6 mb-6 border border-[#FFC72C]/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Appointment Confirmation
              </h1>
              <div className="bg-[#FFC72C] text-black px-4 py-2 rounded-full text-lg font-bold inline-block">
                REF: {appointment.bookingReference}
              </div>
            </div>
            <StatusBadge status={appointment.status} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information */}
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-glow modern-card">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <BuildingIcon className="w-5 h-5 text-[#FFC72C]" />
                Service Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Service Type</label>
                  <p className="text-lg font-semibold text-foreground">{appointment.serviceType}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Department</label>
                  <p className="text-lg font-semibold text-foreground">{appointment.department}</p>
                </div>
                {appointment.priority && (
                  <div>
                    <label className="text-sm text-muted-foreground">Priority</label>
                    <p className="text-lg font-semibold text-foreground capitalize">{appointment.priority}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Information */}
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-glow modern-card">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#FFC72C]" />
                Schedule
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-6 h-6 text-[#FFC72C]" />
                  <div>
                    <label className="text-sm text-muted-foreground">Date</label>
                    <p className="text-lg font-semibold text-foreground">{formatDate(appointment.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-6 h-6 text-[#FFC72C]" />
                  <div>
                    <label className="text-sm text-muted-foreground">Time</label>
                    <p className="text-lg font-semibold text-green-600">{formatTime(appointment.time)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Information */}
            {appointment.assignedAgent && (
              <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-glow modern-card">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#FFC72C]" />
                  Assigned Agent
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Agent Name</label>
                    <p className="text-lg font-semibold text-foreground">{appointment.assignedAgent.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Position</label>
                    <p className="text-lg font-semibold text-foreground">{appointment.assignedAgent.position}</p>
                  </div>
                  {appointment.assignedAgent.office && (
                    <div className="sm:col-span-2">
                      <label className="text-sm text-muted-foreground flex items-center gap-2">
                        <LocationPinIcon className="w-4 h-4" />
                        Office Location
                      </label>
                      <p className="text-lg font-semibold text-foreground">{appointment.assignedAgent.office}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {appointment.notes && (
              <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-glow modern-card">
                <h2 className="text-xl font-bold text-foreground mb-4">Notes</h2>
                <p className="text-foreground bg-muted/50 p-4 rounded-lg">{appointment.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - QR Code */}
          <div className="lg:col-span-1">
            {appointment.qrCode?.imageUrl && (
              <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-glow modern-card sticky top-6">
                <h2 className="text-xl font-bold text-foreground mb-4 text-center">Your Digital Pass</h2>
                
                {/* Large QR Code */}
                <div className="text-center mb-6">
                  <div className="inline-block bg-white p-6 rounded-2xl border-2 border-dashed border-[#FFC72C] shadow-lg">
                    <QRCodeImage 
                      src={appointment.qrCode.imageUrl} 
                      alt={`QR Code for appointment ${appointment.bookingReference}`}
                      className="w-64 h-64 mx-auto"
                      width={256}
                      height={256}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Present this QR code at your appointment
                  </p>
                </div>

                {/* QR Code Actions */}
                <div className="space-y-3">
                  <button
                    onClick={downloadQRCode}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] hover:from-[#FF5722] hover:to-[#8D153A] text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Pass
                      </>
                    )}
                  </button>

                  {/* Cancel Button - Only show for pending/confirmed appointments */}
                  {appointment?.status === 'pending' || appointment?.status === 'confirmed' ? (
                    <button
                      onClick={cancelAppointment}
                      disabled={isCancelling}
                      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl"
                    >
                      {isCancelling ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel Appointment
                        </>
                      )}
                    </button>
                  ) : null}

                  <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 text-sm">📋 Instructions</h4>
                    <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• Arrive 15 minutes early</li>
                      <li>• Bring original documents</li>
                      <li>• Present QR code at reception</li>
                      <li>• Keep phone charged</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
