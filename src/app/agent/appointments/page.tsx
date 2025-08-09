// src/app/agent/appointments/page.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import AppointmentsLayout from '@/components/agent/appointments/AppointmentsLayout';
import AppointmentCard from '@/components/agent/appointments/AppointmentCard';
import AppointmentModal from '@/components/agent/appointments/AppointmentModal';

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
}

// Mock appointment data
const mockAppointments: Appointment[] = [
  {
    id: 'APT001',
    citizenName: 'Nimal Perera',
    citizenId: '199012345678V',
    serviceType: 'passport',
    date: '2025-08-15',
    time: '09:00',
    status: 'pending',
    priority: 'urgent',
    contactEmail: 'nimal.perera@email.com',
    contactPhone: '+94 77 123 4567',
    submittedDate: '2025-08-07',
    notes: 'Emergency travel required for medical treatment abroad'
  },
  {
    id: 'APT002',
    citizenName: 'Kamala Silva',
    citizenId: '198567891234V',
    serviceType: 'license',
    date: '2025-08-15',
    time: '10:30',
    status: 'confirmed',
    priority: 'normal',
    contactEmail: 'kamala.silva@email.com',
    contactPhone: '+94 71 987 6543',
    submittedDate: '2025-08-05'
  },
  {
    id: 'APT003',
    citizenName: 'Sunil Fernando',
    citizenId: '197734567890V',
    serviceType: 'certificate',
    date: '2025-08-16',
    time: '14:00',
    status: 'pending',
    priority: 'normal',
    contactEmail: 'sunil.fernando@email.com',
    contactPhone: '+94 76 456 7890',
    submittedDate: '2025-08-06'
  },
  {
    id: 'APT004',
    citizenName: 'Priya Jayawardena',
    citizenId: '199223456789V',
    serviceType: 'registration',
    date: '2025-08-17',
    time: '11:15',
    status: 'cancelled',
    priority: 'normal',
    contactEmail: 'priya.jayawardena@email.com',
    contactPhone: '+94 75 234 5678',
    submittedDate: '2025-08-04'
  },
  {
    id: 'APT005',
    citizenName: 'Ravi Wickramasinghe',
    citizenId: '198845678901V',
    serviceType: 'visa',
    date: '2025-08-18',
    time: '13:45',
    status: 'completed',
    priority: 'normal',
    contactEmail: 'ravi.wickramasinghe@email.com',
    contactPhone: '+94 78 345 6789',
    submittedDate: '2025-08-03'
  }
];

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
    noAppointmentsDesc: 'Try adjusting your search filters to find what you\'re looking for'
  },
  si: {
    title: 'නියමයන් කළමනාකරණය',
    subtitle: 'පුරවැසි නියමයන් සහ කාල සටහන් කළමනාකරණය කරන්න',
    totalAppointments: 'සම්පූර්ණ නියමයන්',
    pendingAppointments: 'සමාලෝචනය අපේක්ෂිත',
    todayAppointments: 'අද දිනයේ කාල සටහන',
    overview: 'සංඛ්‍යාලේඛන දළ විශ්ලේෂණය',
    quickFilters: 'ඉක්මන් පෙරහන්',
    noAppointments: 'නියමයන් හමු නොවිය',
    noAppointmentsDesc: 'ඔබ සොයන දේ සොයා ගැනීමට ඔබේ සෙවුම් පෙරහන් සකසන්න'
  },
  ta: {
    title: 'சந்திப்பு மேலாண்மை',
    subtitle: 'குடிமக்கள் சந்திப்பு முன்பதிவுகள் மற்றும் அட்டவணைகளை நிர்வகிக்கவும்',
    totalAppointments: 'மொத்த சந்திப்புகள்',
    pendingAppointments: 'மதிப்பாய்வு நிலுவையில்',
    todayAppointments: 'இன்றைய அட்டவணை',
    overview: 'புள்ளிவிவர கண்ணோட்டம்',
    quickFilters: 'விரைவு வடிப்பான்கள்',
    noAppointments: 'சந்திப்புகள் எதுவும் கிடைக்கவில்லை',
    noAppointmentsDesc: 'நீங்கள் தேடுவதைக் கண்டறிய உங்கள் தேடல் வடிப்பான்களை சரிசெய்ய முயற்சிக்கவும்'
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
    searchPlaceholder: 'නම, හැඳුනුම්පත, හෝ සේවාව අනුව සොයන්න...',
    allServices: 'සියලුම සේවා වර්ග',
    allStatuses: 'සියලුම තත්ත්ව',
    clearFilters: 'පෙරහන් ඉවත් කරන්න',
    export: 'නිර්යාත කරන්න',
  },
  ta: {
    searchPlaceholder: 'பெயர், ஐடி, அல்லது சேவை மூலம் தேடவும்...',
    allServices: 'அனைத்து சேவை வகைகள்',
    allStatuses: 'அனைத்து நிலைகளும்',
    clearFilters: 'வடிப்பான்களை அழிக்கவும்',
    export: 'ஏற்றுமதி',
  }
};

// --- START: AppointmentFilters Component ---
const AppointmentFilters = ({ appointments, onFilterChange, language, filteredAppointments }: {
  appointments: Appointment[];
  onFilterChange: (filtered: Appointment[]) => void;
  language: Language;
  filteredAppointments: Appointment[];
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState('all');
  const [status, setStatus] = useState('all');
  const [date, setDate] = useState('');

  const t = filterTranslations[language];

  const applyFilters = useCallback(() => {
    let filtered = [...appointments];
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.citizenName.toLowerCase().includes(lowercasedSearchTerm) ||
        apt.citizenId.toLowerCase().includes(lowercasedSearchTerm) ||
        apt.serviceType.toLowerCase().includes(lowercasedSearchTerm)
      );
    }
    if (serviceType !== 'all') {
      filtered = filtered.filter(apt => apt.serviceType === serviceType);
    }
    if (status !== 'all') {
      filtered = filtered.filter(apt => apt.status === status);
    }
    if (date) {
      filtered = filtered.filter(apt => apt.date === date);
    }

    onFilterChange(filtered);
  }, [appointments, searchTerm, serviceType, status, date, onFilterChange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setServiceType('all');
    setStatus('all');
    setDate('');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredAppointments, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'appointments_export.json';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const serviceTypes: ServiceType[] = ['passport', 'license', 'certificate', 'registration', 'visa'];
  const statuses: AppointmentStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];

  return (
    <div className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow mb-8 animate-fade-in-up modern-card hover:shadow-2xl hover:border-[#FFC72C]/70 transition-all duration-500 relative overflow-hidden">
      {/* Header Section - EXACT SAME as Dashboard Cards */}
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
          className="w-full bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#FFC72C] focus:bg-card transition-all duration-300 hover:border-[#FFC72C]/50"
        />
        <select 
          value={serviceType} 
          onChange={(e) => setServiceType(e.target.value)} 
          className="w-full bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer hover:border-[#FFC72C]/50 hover:bg-card"
        >
          <option value="all">{t.allServices}</option>
          {serviceTypes.map(s => <option key={s} value={s} className="capitalize bg-card">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="w-full bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer hover:border-[#FFC72C]/50 hover:bg-card"
        >
          <option value="all">{t.allStatuses}</option>
          {statuses.map(s => <option key={s} value={s} className="capitalize bg-card">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 pr-12 text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 hover:border-[#FFC72C]/50 hover:bg-card"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 mt-4">
        <button 
          onClick={handleClearFilters} 
          className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground bg-card/50 dark:bg-card/70 backdrop-blur-md hover:text-foreground hover:bg-card hover:border-[#FFC72C]/50 border border-border/50 transition-all duration-300 hover:scale-105"
        >
          {t.clearFilters}
        </button>
        <button 
          onClick={handleExport} 
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#008060] to-[#FFC72C] hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          {t.export}
        </button>
      </div>

      {/* Hover Effect Gradient - EXACT SAME as Dashboard Cards */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
      </div>
    </div>
  );
};
// --- END: AppointmentFilters Component ---

export default function AppointmentsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = pageTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  const handleFilterChange = (filtered: Appointment[]) => {
    setFilteredAppointments(filtered);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (appointmentId: string, newStatus: AppointmentStatus) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updatedAppointments);
    
    // Re-apply filters after status update
    const currentlyFiltered = updatedAppointments.filter(apt => filteredAppointments.some(f => f.id === apt.id));
    setFilteredAppointments(currentlyFiltered.map(apt => apt.id === appointmentId ? { ...apt, status: newStatus } : apt));
    
    // Close modal if it's open
    if (selectedAppointment?.id === appointmentId) {
      setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Calculate stats
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
  const todayAppointments = appointments.filter(apt => apt.date === '2025-08-15').length; // Mock today's date

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
        {/* Stats Overview - Enhanced with Dashboard Styling */}
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
                  {/* Icon Glow Effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-xl blur-xl" style={{background: 'radial-gradient(circle, rgba(255, 199, 44, 0.2) 0%, transparent 70%)'}}></div>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#FFC72C] mb-2 transition-all duration-500 group-hover:scale-105">{totalAppointments}</div>
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
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/20 transition-all duration-300 hover:scale-105">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l10-10"/>
                    <path d="M17 7h-10v10"/>
                  </svg>
                  <span>+15%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#FF5722] mb-2 transition-all duration-500 group-hover:scale-105">{pendingAppointments}</div>
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
              <div className="text-3xl font-bold text-[#008060] mb-2 transition-all duration-500 group-hover:scale-105">{todayAppointments}</div>
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
            appointments={appointments}
            onFilterChange={handleFilterChange}
            language={currentLanguage}
            filteredAppointments={filteredAppointments}
          />
        </section>

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
            
            {filteredAppointments.length === 0 && (
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