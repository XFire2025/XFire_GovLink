// src/app/agent/appointments/page.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import AppointmentsLayout from '@/components/agent/appointments/AppointmentsLayout';
// import AppointmentFilters from '@/components/agent/appointments/AppointmentFilters'; // We will define this component in this file
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
}> = {
  en: {
    title: 'Appointment Management',
    subtitle: 'Manage citizen appointment bookings and schedules',
    totalAppointments: 'Total Appointments',
    pendingAppointments: 'Pending Review',
    todayAppointments: 'Today\'s Schedule'
  },
  si: {
    title: 'නියමයන් කළමනාකරණය',
    subtitle: 'පුරවැසි නියමයන් සහ කාල සටහන් කළමනාකරණය කරන්න',
    totalAppointments: 'සම්පූර්ණ නියමයන්',
    pendingAppointments: 'සමාලෝචනය අපේක්ෂිත',
    todayAppointments: 'අද දිනයේ කාල සටහන'
  },
  ta: {
    title: 'சந்திப்பு மேலாண்மை',
    subtitle: 'குடிமக்கள் சந்திப்பு முன்பதிவுகள் மற்றும் அட்டவணைகளை நிர்வகிக்கவும்',
    totalAppointments: 'மொத்த சந்திப்புகள்',
    pendingAppointments: 'மதிப்பாய்வு நிலுவையில்',
    todayAppointments: 'இன்றைய அட்டவணை'
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
  const inputStyles = "w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors";

  return (
    <div className="glass-morphism p-4 rounded-2xl border border-border/50 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={inputStyles}
        />
        <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={inputStyles}>
          <option value="all">{t.allServices}</option>
          {serviceTypes.map(s => <option key={s} value={s} className="capitalize bg-background">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputStyles}>
          <option value="all">{t.allStatuses}</option>
          {statuses.map(s => <option key={s} value={s} className="capitalize bg-background">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputStyles} pr-8`}
          />
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 mt-4">
        <button onClick={handleClearFilters} className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700/90 border border-border/50 transition-colors">
          {t.clearFilters}
        </button>
        <button onClick={handleExport} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#008060] to-[#FFC72C] hover:opacity-90 transition-opacity shadow-md">
          {t.export}
        </button>
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
    // This is a simplified approach. A more robust solution might re-trigger the filter component.
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
          <span>{t.title.split(' ')[0]}</span>{' '}
          <span className="text-gradient">{t.title.split(' ')[1] || ''}</span>
        </>
      }
      subtitle={t.subtitle}
      language={currentLanguage}
      onLanguageChange={handleLanguageChange}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="glass-morphism p-6 rounded-2xl border border-border/50 shadow-glow">
          <div className="text-3xl font-bold text-[#FFC72C] mb-2">{totalAppointments}</div>
          <div className="text-sm text-muted-foreground">{t.totalAppointments}</div>
        </div>
        <div className="glass-morphism p-6 rounded-2xl border border-border/50 shadow-glow">
          <div className="text-3xl font-bold text-[#FF5722] mb-2">{pendingAppointments}</div>
          <div className="text-sm text-muted-foreground">{t.pendingAppointments}</div>
        </div>
        <div className="glass-morphism p-6 rounded-2xl border border-border/50 shadow-glow">
          <div className="text-3xl font-bold text-[#008060] mb-2">{todayAppointments}</div>
          <div className="text-sm text-muted-foreground">{t.todayAppointments}</div>
        </div>
      </div>

      {/* Filters */}
      <AppointmentFilters
        appointments={appointments}
        onFilterChange={handleFilterChange}
        language={currentLanguage}
        filteredAppointments={filteredAppointments}
      />

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            language={currentLanguage}
            onClick={() => handleAppointmentClick(appointment)}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
        
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <div className="glass-morphism p-8 rounded-2xl border border-border/50">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <h3 className="text-lg font-semibold text-foreground mb-2">No appointments found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          </div>
        )}
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
