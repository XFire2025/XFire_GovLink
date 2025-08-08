// src/components/agent/appointments/AppointmentFilters.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';

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

interface FilterState {
  search: string;
  status: AppointmentStatus | 'all';
  serviceType: ServiceType | 'all';
  dateFrom: string;
  dateTo: string;
  priority: 'normal' | 'urgent' | 'all';
}

interface AppointmentFiltersProps {
  appointments: Appointment[];
  onFilterChange: (filteredAppointments: Appointment[]) => void;
  language?: Language;
}

// Filter translations
const filterTranslations: Record<Language, {
  searchPlaceholder: string;
  status: string;
  serviceType: string;
  dateRange: string;
  priority: string;
  allStatuses: string;
  allServices: string;
  allPriorities: string;
  from: string;
  to: string;
  clearFilters: string;
  export: string;
  filterAppointments: string;
  searchAndFilter: string;
  activeFilters: string;
  statuses: Record<AppointmentStatus, string>;
  services: Record<ServiceType, string>;
  priorities: Record<'normal' | 'urgent', string>;
}> = {
  en: {
    searchPlaceholder: 'Search by name, ID, or email...',
    status: 'Status',
    serviceType: 'Service Type',
    dateRange: 'Date Range',
    priority: 'Priority',
    allStatuses: 'All Statuses',
    allServices: 'All Services',
    allPriorities: 'All Priorities',
    from: 'From',
    to: 'To',
    clearFilters: 'Clear Filters',
    export: 'Export',
    filterAppointments: 'Filter Appointments',
    searchAndFilter: 'Search and filter appointments by various criteria',
    activeFilters: 'Active filters',
    statuses: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed'
    },
    services: {
      passport: 'Passport',
      license: 'Driving License',
      certificate: 'Certificate',
      registration: 'Registration',
      visa: 'Visa'
    },
    priorities: {
      normal: 'Normal',
      urgent: 'Urgent'
    }
  },
  si: {
    searchPlaceholder: 'නම, හැඳුනුම්පත හෝ විද්‍යුත් ලිපිනයෙන් සොයන්න...',
    status: 'තත්ත්වය',
    serviceType: 'සේවාවේ වර්ගය',
    dateRange: 'දින පරාසය',
    priority: 'ප්‍රමුඛතාව',
    allStatuses: 'සියලුම තත්ත්වයන්',
    allServices: 'සියලුම සේවාවන්',
    allPriorities: 'සියලුම ප්‍රමුඛතාවන්',
    from: 'සිට',
    to: 'දක්වා',
    clearFilters: 'පෙරහන් මකන්න',
    export: 'නිර්යාත කරන්න',
    filterAppointments: 'නියමයන් පෙරහන් කරන්න',
    searchAndFilter: 'විවිධ නිර්ණායක මගින් නියමයන් සොයන්න සහ පෙරහන් කරන්න',
    activeFilters: 'ක්‍රියාකාරී පෙරහන්',
    statuses: {
      pending: 'අපේක්ෂිත',
      confirmed: 'තහවුරු කළ',
      cancelled: 'අවලංගු කළ',
      completed: 'සම්පූර්ණ කළ'
    },
    services: {
      passport: 'ගමන් බලපත්‍රය',
      license: 'රියදුරු බලපත්‍රය',
      certificate: 'සහතිකය',
      registration: 'ලියාපදිංචිය',
      visa: 'වීසා'
    },
    priorities: {
      normal: 'සාමාන්‍ය',
      urgent: 'ගඩු'
    }
  },
  ta: {
    searchPlaceholder: 'பெயர், அடையாள எண் அல்லது மின்னஞ்சல் மூலம் தேடுங்கள்...',
    status: 'நிலை',
    serviceType: 'சேவை வகை',
    dateRange: 'தேதி வரம்பு',
    priority: 'முன்னுரிமை',
    allStatuses: 'அனைத்து நிலைகள்',
    allServices: 'அனைத்து சேவைகள்',
    allPriorities: 'அனைத்து முன்னுரிமைகள்',
    from: 'இருந்து',
    to: 'வரை',
    clearFilters: 'வடிகட்டிகளை அழிக்கவும்',
    export: 'ஏற்றுமதி',
    filterAppointments: 'சந்திப்புகளை வடிகட்டவும்',
    searchAndFilter: 'பல்வேறு அளவுகோல்களின் மூலம் சந்திப்புகளைத் தேடவும் மற்றும் வடிகட்டவும்',
    activeFilters: 'செயலில் உள்ள வடிப்பான்கள்',
    statuses: {
      pending: 'நிலுவையில்',
      confirmed: 'உறுதிப்படுத்தப்பட்டது',
      cancelled: 'ரத்துசெய்யப்பட்டது',
      completed: 'முடிந்தது'
    },
    services: {
      passport: 'பாஸ்போர்ட்',
      license: 'ஓட்டுநர் உரிமம்',
      certificate: 'சான்றிதழ்',
      registration: 'பதிவு',
      visa: 'விசா'
    },
    priorities: {
      normal: 'சாதாரண',
      urgent: 'அவசர'
    }
  }
};

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  appointments,
  onFilterChange,
  language = 'en'
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    serviceType: 'all',
    dateFrom: '',
    dateTo: '',
    priority: 'all'
  });

  const t = filterTranslations[language];

  // Apply filters whenever filters change
  const applyFilters = useCallback(() => {
    let filtered = [...appointments];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.citizenName.toLowerCase().includes(searchTerm) ||
        apt.citizenId.toLowerCase().includes(searchTerm) ||
        apt.contactEmail.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }

    // Service type filter
    if (filters.serviceType !== 'all') {
      filtered = filtered.filter(apt => apt.serviceType === filters.serviceType);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(apt => apt.priority === filters.priority);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(apt => apt.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(apt => apt.date <= filters.dateTo);
    }

    onFilterChange(filtered);
  }, [filters, appointments, onFilterChange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      serviceType: 'all',
      dateFrom: '',
      dateTo: '',
      priority: 'all'
    });
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting appointments...');
    // In real implementation, this would generate CSV/PDF
  };

  return (
    <div className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow mb-8 animate-fade-in-up modern-card hover:shadow-2xl hover:border-[#FFC72C]/70 transition-all duration-500 relative overflow-hidden">
      {/* Header Section - EXACT SAME as Dashboard Cards */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
          <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-foreground">{t.filterAppointments}</span>
        </div>
        <p className="text-sm text-muted-foreground">{t.searchAndFilter}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Search */}
        <div className="lg:col-span-4">
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-[#FFC72C] transition-colors duration-300">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#FFC72C] focus:bg-card transition-all duration-300 hover:border-[#FFC72C]/50"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-2">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full py-3 px-4 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer hover:border-[#FFC72C]/50 hover:bg-card"
          >
            <option value="all">{t.allStatuses}</option>
            {Object.entries(t.statuses).map(([value, label]) => (
              <option key={value} value={value} className="bg-card text-foreground">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Service Type Filter */}
        <div className="lg:col-span-2">
          <select
            value={filters.serviceType}
            onChange={(e) => handleFilterChange('serviceType', e.target.value)}
            className="w-full py-3 px-4 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer hover:border-[#FFC72C]/50 hover:bg-card"
          >
            <option value="all">{t.allServices}</option>
            {Object.entries(t.services).map(([value, label]) => (
              <option key={value} value={value} className="bg-card text-foreground">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="lg:col-span-2">
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full py-3 px-4 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer hover:border-[#FFC72C]/50 hover:bg-card"
          >
            <option value="all">{t.allPriorities}</option>
            {Object.entries(t.priorities).map(([value, label]) => (
              <option key={value} value={value} className="bg-card text-foreground">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="lg:col-span-2 flex gap-2">
          <button
            onClick={clearFilters}
            className="flex-1 px-4 py-3 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card hover:border-[#FFC72C]/50 transition-all duration-300 text-sm font-medium modern-card hover:scale-105"
          >
            {t.clearFilters}
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#008060] to-[#FFC72C] text-white rounded-xl hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 text-sm font-medium hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {t.export}
          </button>
        </div>
      </div>

      {/* Date Range - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FFC72C] rounded-full"></div>
            {t.from}
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full py-3 px-4 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 hover:border-[#FFC72C]/50 hover:bg-card"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FF5722] rounded-full"></div>
            {t.to}
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full py-3 px-4 bg-card/50 dark:bg-card/70 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 hover:border-[#FFC72C]/50 hover:bg-card"
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.search || filters.status !== 'all' || filters.serviceType !== 'all' || filters.priority !== 'all' || filters.dateFrom || filters.dateTo) && (
        <div className="mt-6 pt-4 border-t border-border/30">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#8D153A] rounded-full"></div>
              {t.activeFilters}:
            </span>
            {filters.search && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFC72C]/20 text-[#FFC72C] border border-[#FFC72C]/30 rounded-full text-xs font-medium backdrop-blur-md">
                Search: &quot;{filters.search}&quot;
                <button 
                  onClick={() => handleFilterChange('search', '')}
                  className="text-[#FFC72C] hover:text-[#FF5722] transition-colors duration-200 hover:scale-110"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30 rounded-full text-xs font-medium backdrop-blur-md">
                Status: {t.statuses[filters.status as AppointmentStatus]}
                <button 
                  onClick={() => handleFilterChange('status', 'all')}
                  className="text-[#FF5722] hover:text-[#8D153A] transition-colors duration-200 hover:scale-110"
                >
                  ×
                </button>
              </span>
            )}
            {filters.serviceType !== 'all' && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#008060]/20 text-[#008060] border border-[#008060]/30 rounded-full text-xs font-medium backdrop-blur-md">
                Service: {t.services[filters.serviceType as ServiceType]}
                <button 
                  onClick={() => handleFilterChange('serviceType', 'all')}
                  className="text-[#008060] hover:text-[#FFC72C] transition-colors duration-200 hover:scale-110"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priority !== 'all' && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#8D153A]/20 text-[#8D153A] border border-[#8D153A]/30 rounded-full text-xs font-medium backdrop-blur-md">
                Priority: {t.priorities[filters.priority as 'normal' | 'urgent']}
                <button 
                  onClick={() => handleFilterChange('priority', 'all')}
                  className="text-[#8D153A] hover:text-[#FF5722] transition-colors duration-200 hover:scale-110"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#008060]/20 text-[#008060] border border-[#008060]/30 rounded-full text-xs font-medium backdrop-blur-md">
                Date: {filters.dateFrom || '...'} - {filters.dateTo || '...'}
                <button 
                  onClick={() => {
                    handleFilterChange('dateFrom', '');
                    handleFilterChange('dateTo', '');
                  }}
                  className="text-[#008060] hover:text-[#FFC72C] transition-colors duration-200 hover:scale-110"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Hover Effect Gradient - EXACT SAME as Dashboard Cards */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default AppointmentFilters;