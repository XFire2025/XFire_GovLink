// app/agent/appointments/page.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import AppointmentsLayout from '@/components/agent/appointments/AppointmentsLayout';
import AppointmentCard from '@/components/agent/appointments/AppointmentCard';
import AppointmentModal from '@/components/agent/appointments/AppointmentModal';
import appointmentService from '@/lib/services/appointmentService';

// Types
type Language = 'en' | 'si' | 'ta';
type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
type ServiceType = 'passport' | 'license' | 'certificate' | 'registration' | 'visa';

interface Appointment {
  id: string;
  citizenName: string;
  citizenId: string;
  serviceType: ServiceType;
  date: string;
  time: string;
  status: AppointmentStatus;
  priority: 'normal' | 'urgent';
  notes?: string;
  contactEmail: string;
  contactPhone: string;
  submittedDate: string;
  bookingReference?: string;
  agentNotes?: string;
}

interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
  urgent: number;
}

// Define proper filter interface
interface AppointmentFilters {
  search?: string;
  serviceType?: ServiceType;
  status?: AppointmentStatus;
  priority?: 'normal' | 'urgent';
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

// Page translations
const pageTranslations: Record<Language, {
  title: string;
  subtitle: string;
  totalAppointments: string;
  pendingAppointments: string;
  todayAppointments: string;
  overview: string;
  quickFilters: string;
  noAppointments: string;
  noAppointmentsDesc: string;
  loading: string;
  error: string;
  retry: string;
}> = {
  en: {
    title: 'Appointment Management',
    subtitle: 'Manage citizen appointment bookings and schedules',
    totalAppointments: 'Total Appointments',
    pendingAppointments: 'Pending Review',
    todayAppointments: 'Today\'s Schedule',
    overview: 'Statistics Overview',
    quickFilters: 'Quick Filters',
    noAppointments: 'No appointments found',
    noAppointmentsDesc: 'Try adjusting your search filters to find what you\'re looking for',
    loading: 'Loading appointments...',
    error: 'Failed to load appointments',
    retry: 'Retry'
  },
  si: {
    title: 'නියමයන් කළමණාකරණය',
    subtitle: 'පුරවසි නියමයන් සහ කාල සහයන් කළමණාකරණය කරන්න',
    totalAppointments: 'සම්පූර්ණ නියමයන්',
    pendingAppointments: 'සමාලෝචනය අපේක්ෂිත',
    todayAppointments: 'අද දිනයේ කාල සහයන',
    overview: 'සංඛ්‍යාලේඛන දළ විස්ලේෂණය',
    quickFilters: 'ඉක්මන් පෙරහන්',
    noAppointments: 'නියමයන් හමු නොවීය',
    noAppointmentsDesc: 'ඔබ සොයන දේ සොයාගනුමට ඔබේ සේවීම් පෙරහන් සකසන්න',
    loading: 'නියමයන් පුරණය වෙමින්...',
    error: 'නියමයන් පුරණය කිරීමට අසමත්',
    retry: 'නොවත උත්සාහ කරන්න'
  },
  ta: {
    title: 'சந்திப்பு மேலாண்மை',
    subtitle: 'குடிமக்கள் சந்திப்பு முன்பதிவுகள் மற்றும் அட்டவணைகளை நிர்வகிக்கவும்',
    totalAppointments: 'மொத்த சந்திப்புகள்',
    pendingAppointments: 'மதிப்பாய்வு நிலவையில்',
    todayAppointments: 'இன்றைய அட்டவணை',
    overview: 'புள்ளிவிவர கண்ணோட்டம்',
    quickFilters: 'விரைவு வடிப்பான்கள்',
    noAppointments: 'சந்திப்புகள் எதுவும் கிடைக்கவில்லை',
    noAppointmentsDesc: 'நீங்கள் தேடுவதைக் கண்டறிய உங்கள் தேடல் வடிப்பான்களை சரிசெய்ய முயற்சிக்கவும்',
    loading: 'சந்திப்புகள் ஏற்றப்படுகின்றன...',
    error: 'சந்திப்புகளை ஏற்ற முடியவில்லை',
    retry: 'மீண்டும் முயற்சிக்கவும்'
  }
};

// Filter translations
const filterTranslations: Record<Language, {
  searchPlaceholder: string;
  allServices: string;
  allStatuses: string;
  clearFilters: string;
  export: string;
}> = {
  en: {
    searchPlaceholder: 'Search by name, ID, or service...',
    allServices: 'All Service Types',
    allStatuses: 'All Statuses',
    clearFilters: 'Clear Filters',
    export: 'Export',
  },
  si: {
    searchPlaceholder: 'නම, හැඳුනුම්පත, හො සේව අනුව සොයන්න...',
    allServices: 'සියලුම සේව වර්ග',
    allStatuses: 'සියලුම තත්ත්ව',
    clearFilters: 'පෙරහන් ඉවත් කරන්න',
    export: 'නිර්යාත කරන්න',
  },
  ta: {
    searchPlaceholder: 'பெயர், ஐடி, அல்லது சேவை மூலம் தேடவும்...',
    allServices: 'அனைத்து சேவை வகைகளும்',
    allStatuses: 'அனைத்து நிலைகளும்',
    clearFilters: 'வடிப்பான்களை அழிக்கவும்',
    export: 'ஏற்றுமதி',
  }
};

// --- START: AppointmentFilters Component ---
const AppointmentFilters = ({ onFilterChange, language, isLoading }: {
  onFilterChange: (filters: AppointmentFilters) => void;
  language: Language;
  isLoading: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState('all');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const t = filterTranslations[language];

  const applyFilters = useCallback(() => {
    const filters: AppointmentFilters = {
      search: searchTerm || undefined,
      serviceType: serviceType !== 'all' ? serviceType as ServiceType : undefined,
      status: status !== 'all' ? status as AppointmentStatus : undefined,
      priority: priority !== 'all' ? priority as 'normal' | 'urgent' : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    };
    onFilterChange(filters);
  }, [searchTerm, serviceType, status, priority, dateFrom, dateTo, onFilterChange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [applyFilters]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setServiceType('all');
    setStatus('all');
    setPriority('all');
    setDateFrom('');
    setDateTo('');
  };

  const handleExport = async () => {
    try {
      const filters: AppointmentFilters = {
        search: searchTerm || undefined,
        serviceType: serviceType !== 'all' ? serviceType as ServiceType : undefined,
        status: status !== 'all' ? status as AppointmentStatus : undefined,
        priority: priority !== 'all' ? priority as 'normal' | 'urgent' : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        limit: 1000 // Get all results for export
      };

      const result = await appointmentService.getAppointments(filters);

      if (result.success && result.data) {
        const dataStr = JSON.stringify(result.data.appointments, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `appointments_export_${new Date().toISOString().split('T')[0]}.json`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const serviceTypes: ServiceType[] = ['passport', 'license', 'certificate', 'registration', 'visa'];
  const statuses: AppointmentStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];
  const priorities = ['normal', 'urgent'];

  return (
    <div className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow mb-8 animate-fade-in-up modern-card hover:shadow-2xl hover:border-[#FFC72C]/70 transition-all duration-500 relative overflow-hidden">
      {/* Header Section */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
          <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-foreground">{pageTranslations[language].quickFilters}</span>
        </div>
        <p className="text-sm text-muted-foreground">Search and filter appointments by various criteria</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="w-full bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FFC72C] focus:bg-card transition-all duration-300 hover:border-[#FFC72C]/50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <select 
          value={serviceType} 
          onChange={(e) => setServiceType(e.target.value)}
          disabled={isLoading}
          className="w-full bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer hover:border-[#FFC72C]/50 hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">{t.allServices}</option>
          {serviceTypes.map(s => <option key={s} value={s} className="capitalize bg-card">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          disabled={isLoading}
          className="w-full bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer hover:border-[#FFC72C]/50 hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">{t.allStatuses}</option>
          {statuses.map(s => <option key={s} value={s} className="capitalize bg-card">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
          disabled={isLoading}
          className="w-full bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer hover:border-[#FFC72C]/50 hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">All Priorities</option>
          {priorities.map(p => <option key={p} value={p} className="capitalize bg-card">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          disabled={isLoading}
          className="w-full bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 hover:border-[#FFC72C]/50 hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          disabled={isLoading}
          className="w-full bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 hover:border-[#FFC72C]/50 hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex items-center justify-end gap-3 mt-4">
        <button 
          onClick={handleClearFilters}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground bg-card/50 dark:bg-card/70 backdrop-blur-md hover:text-foreground hover:bg-card hover:border-[#FFC72C]/50 border border-border/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.clearFilters}
        </button>
        <button 
          onClick={handleExport}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#008060] to-[#FFC72C] hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.export}
        </button>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
      </div>
    </div>
  );
};
// --- END: AppointmentFilters Component ---

// Loading Component
const LoadingSpinner = ({ message }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-12 h-12 border-4 border-[#FFC72C]/20 border-t-[#FFC72C] rounded-full animate-spin mb-4"></div>
    {message && <p className="text-muted-foreground">{message}</p>}
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="text-center py-16 animate-fade-in-up">
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-8 rounded-2xl border border-border/50 shadow-glow modern-card hover:shadow-2xl transition-all duration-500 max-w-md mx-auto">
      <div className="p-4 bg-gradient-to-r from-[#FF5722]/10 to-[#8D153A]/10 rounded-2xl mb-6 inline-block" style={{border: '2px solid rgba(255, 87, 34, 0.3)'}}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Error</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-xl hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

export default function AppointmentsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    urgent: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<AppointmentFilters>({});

  const t = pageTranslations[currentLanguage];

  // Load initial appointments and stats
  const loadAppointments = useCallback(async (filters: AppointmentFilters = {}) => {
    try {
      setIsFilterLoading(true);
      setError(null);

      const [appointmentsResult, statsResult] = await Promise.all([
        appointmentService.getAppointments(filters),
        appointmentService.getStats()
      ]);

      if (appointmentsResult.success && appointmentsResult.data) {
        setAppointments(appointmentsResult.data.appointments);
        setFilteredAppointments(appointmentsResult.data.appointments);
      } else {
        setError(appointmentsResult.message || 'Failed to load appointments');
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data.overview);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setIsLoading(false);
      setIsFilterLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const handleFilterChange = useCallback(async (filters: AppointmentFilters) => {
    setCurrentFilters(filters);
    try {
      setIsFilterLoading(true);
      const result = await appointmentService.getAppointments(filters);
      
      if (result.success && result.data) {
        setFilteredAppointments(result.data.appointments);
      } else {
        setError(result.message || 'Failed to filter appointments');
      }
    } catch (error) {
      console.error('Error filtering appointments:', error);
      setError('Failed to filter appointments. Please try again.');
    } finally {
      setIsFilterLoading(false);
    }
  }, []);

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      const result = await appointmentService.updateStatus(appointmentId, newStatus);
      
      if (result.success) {
        // Update local state
        setAppointments(prev => prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        ));
        
        setFilteredAppointments(prev => prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        ));
        
        // Update selected appointment if it's open
        if (selectedAppointment?.id === appointmentId) {
          setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null);
        }

        // Refresh stats
        const statsResult = await appointmentService.getStats();
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data.overview);
        }
      } else {
        setError(result.message || 'Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setError('Failed to update appointment status. Please try again.');
    }
  };

  const handleRetry = () => {
    setError(null);
    loadAppointments(currentFilters);
  };

  if (error && appointments.length === 0) {
    return (
      <AppointmentsLayout
        title={
          <>
            <span className="text-foreground">{t.title.split(' ')[0]}</span>{' '}
            <span className="text-gradient">{t.title.split(' ')[1] || ''}</span>
          </>
        }
        subtitle={t.subtitle}
        language={currentLanguage}
        onLanguageChange={handleLanguageChange}
      >
        <ErrorMessage message={error} onRetry={handleRetry} />
      </AppointmentsLayout>
    );
  }

  return (
    <AppointmentsLayout
      title={
        <>
          <span className="text-foreground">{t.title.split(' ')[0]}</span>{' '}
          <span className="text-gradient">{t.title.split(' ')[1] || ''}</span>
        </>
      }
      subtitle={t.subtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className="space-y-8">
        {/* Stats Overview */}
        <section>
          <div className="mb-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
              <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-foreground">{t.overview}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {/* Total Appointments Card */}
            <div className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:shadow-2xl hover:border-[#FFC72C]/70 animate-fade-in-up modern-card hover-lift relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#FFC72C]/10 to-[#FFC72C]/5 transition-all duration-500 group-hover:scale-110"
                     style={{border: '2px solid rgba(255, 199, 44, 0.3)'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFC72C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:scale-110">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#FFC72C] mb-2 transition-all duration-500 group-hover:scale-105">{stats.total}</div>
              <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">{t.totalAppointments}</div>
              
              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl" style={{background: 'radial-gradient(circle at center, rgba(255, 199, 44, 0.05) 0%, transparent 70%)'}}></div>
              </div>
            </div>

            {/* Pending Appointments Card */}
            <div className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:shadow-2xl hover:border-[#FF5722]/70 animate-fade-in-up modern-card hover-lift relative overflow-hidden" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF5722]/10 to-[#FF5722]/5 transition-all duration-500 group-hover:scale-110"
                     style={{border: '2px solid rgba(255, 87, 34, 0.3)'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:scale-110">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#FF5722] mb-2 transition-all duration-500 group-hover:scale-105">{stats.pending}</div>
              <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">{t.pendingAppointments}</div>
              
              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl" style={{background: 'radial-gradient(circle at center, rgba(255, 87, 34, 0.05) 0%, transparent 70%)'}}></div>
              </div>
            </div>

            {/* Today's Appointments Card */}
            <div className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:shadow-2xl hover:border-[#008060]/70 animate-fade-in-up modern-card hover-lift relative overflow-hidden" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#008060]/10 to-[#008060]/5 transition-all duration-500 group-hover:scale-110"
                     style={{border: '2px solid rgba(0, 128, 96, 0.3)'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:scale-110">
                    <path d="M8 2v4"/>
                    <path d="M16 2v4"/>
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <path d="M3 10h18"/>
                    <path d="M8 14h.01"/>
                    <path d="M12 14h.01"/>
                    <path d="M16 14h.01"/>
                    <path d="M8 18h.01"/>
                    <path d="M12 18h.01"/>
                  </svg>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border text-[#008060] bg-[#008060]/10 border-[#008060]/20">
                  <span>Today</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#008060] mb-2 transition-all duration-500 group-hover:scale-105">{stats.today}</div>
              <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">{t.todayAppointments}</div>
              
              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl" style={{background: 'radial-gradient(circle at center, rgba(0, 128, 96, 0.05) 0%, transparent 70%)'}}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section>
          <AppointmentFilters
            onFilterChange={handleFilterChange}
            language={currentLanguage}
            isLoading={isFilterLoading}
          />
        </section>

        {/* Error Message for Filter Errors */}
        {error && appointments.length > 0 && (
          <div className="bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722] p-4 rounded-xl animate-fade-in-up">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span className="font-medium">{error}</span>
              <button onClick={handleRetry} className="ml-auto text-sm underline hover:no-underline">
                {t.retry}
              </button>
            </div>
          </div>
        )}

        {/* Loading State for Initial Load */}
        {isLoading && appointments.length === 0 && (
          <LoadingSpinner message={t.loading} />
        )}

        {/* Loading State for Filters */}
        {isFilterLoading && !isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#FFC72C]/20 border-t-[#FFC72C] rounded-full animate-spin mr-3"></div>
            <span className="text-muted-foreground">Filtering appointments...</span>
          </div>
        )}

        {/* Appointments List */}
        <section>
          <div className="space-y-4">
            {filteredAppointments.map((appointment, index) => (
              <div key={appointment.id} style={{animationDelay: `${0.1 * (index + 1)}s`}}>
                <AppointmentCard
                  appointment={appointment}
                  language={currentLanguage}
                  onClick={() => handleAppointmentClick(appointment)}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            ))}
            
            {!isLoading && !isFilterLoading && filteredAppointments.length === 0 && (
              <div className="text-center py-16 animate-fade-in-up">
                <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-8 rounded-2xl border border-border/50 shadow-glow modern-card hover:shadow-2xl transition-all duration-500 max-w-md mx-auto">
                  <div className="p-4 bg-gradient-to-r from-[#8D153A]/10 to-[#FF5722]/10 rounded-2xl mb-6 inline-block" style={{border: '2px solid rgba(141, 21, 58, 0.3)'}}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8D153A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t.noAppointments}</h3>
                  <p className="text-muted-foreground">{t.noAppointmentsDesc}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppointment(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          language={currentLanguage}
        />
      )}
    </AppointmentsLayout>
  );
}