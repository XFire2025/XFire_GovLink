// src/components/agent/submissions/SubmissionFilters.tsx
"use client";
import React, { useState, useEffect } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';
type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'needs_info';
type FormType = 'passport' | 'license' | 'certificate' | 'registration' | 'visa';
type Priority = 'normal' | 'urgent';

interface SubmissionFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

interface FormSubmission {
  id: string;
  citizenName: string;
  citizenId: string;
  formType: FormType;
  submittedDate: string;
  status: SubmissionStatus;
  priority: Priority;
  contactEmail: string;
  lastUpdated: string;
  attachments: SubmissionFile[];
  formData: Record<string, string | number | boolean>;
  contactPhone: string;
}

interface FilterState {
  search: string;
  status: SubmissionStatus | 'all';
  formType: FormType | 'all';
  priority: Priority | 'all';
  dateFrom: string;
  dateTo: string;
}

interface SubmissionFiltersProps {
  submissions: FormSubmission[];
  onFilterChange: (filteredSubmissions: FormSubmission[]) => void;
  language?: Language;
}

// Filter translations
const filterTranslations: Record<Language, {
  searchPlaceholder: string;
  status: string;
  formType: string;
  priority: string;
  dateRange: string;
  allStatuses: string;
  allFormTypes: string;
  allPriorities: string;
  from: string;
  to: string;
  clearFilters: string;
  export: string;
  statuses: Record<SubmissionStatus, string>;
  formTypes: Record<FormType, string>;
  priorities: Record<Priority, string>;
}> = {
  en: {
    searchPlaceholder: 'Search by name, ID, or email...',
    status: 'Status',
    formType: 'Form Type',
    priority: 'Priority',
    dateRange: 'Date Range',
    allStatuses: 'All Statuses',
    allFormTypes: 'All Form Types',
    allPriorities: 'All Priorities',
    from: 'From',
    to: 'To',
    clearFilters: 'Clear Filters',
    export: 'Export',
    statuses: {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      needs_info: 'Needs Info'
    },
    formTypes: {
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
    formType: 'ආකෘතියේ වර්ගය',
    priority: 'ප්‍රමුඛතාව',
    dateRange: 'දින පරාසය',
    allStatuses: 'සියලුම තත්ත්වයන්',
    allFormTypes: 'සියලුම ආකෘති වර්ග',
    allPriorities: 'සියලුම ප්‍රමුඛතාවන්',
    from: 'සිට',
    to: 'දක්වා',
    clearFilters: 'පෙරහන් මකන්න',
    export: 'නිර්යාත කරන්න',
    statuses: {
      pending: 'සමාලෝචනය අපේක්ෂිත',
      approved: 'අනුමත කළ',
      rejected: 'ප්‍රතික්ෂේප කළ',
      needs_info: 'තොරතුරු අවශ්‍යයි'
    },
    formTypes: {
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
    formType: 'படிவ வகை',
    priority: 'முன்னுரிமை',
    dateRange: 'தேதி வரம்பு',
    allStatuses: 'அனைத்து நிலைகள்',
    allFormTypes: 'அனைத்து படிவ வகைகள்',
    allPriorities: 'அனைத்து முன்னுரிமைகள்',
    from: 'இருந்து',
    to: 'வரை',
    clearFilters: 'வடிகட்டிகளை அழிக்கவும்',
    export: 'ஏற்றுமதி',
    statuses: {
      pending: 'மதிப்பாய்வு நிலுவையில்',
      approved: 'ஒப்புதல் அளிக்கப்பட்டது',
      rejected: 'நிராகரிக்கப்பட்டது',
      needs_info: 'தகவல் தேவை'
    },
    formTypes: {
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

const SubmissionFilters: React.FC<SubmissionFiltersProps> = ({
  submissions,
  onFilterChange,
  language = 'en'
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    formType: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const t = filterTranslations[language];

  // Apply filters whenever filters change
  useEffect(() => {
    let filtered = [...submissions];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.citizenName.toLowerCase().includes(searchTerm) ||
        sub.citizenId.toLowerCase().includes(searchTerm) ||
        sub.contactEmail.toLowerCase().includes(searchTerm) ||
        sub.id.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }

    // Form type filter
    if (filters.formType !== 'all') {
      filtered = filtered.filter(sub => sub.formType === filters.formType);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(sub => sub.priority === filters.priority);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(sub => sub.submittedDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(sub => sub.submittedDate <= filters.dateTo);
    }

    onFilterChange(filtered);
  }, [filters, submissions, onFilterChange]);

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
      formType: 'all',
      priority: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting submissions...');
    // In real implementation, this would generate CSV/PDF
  };

  return (
    <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow mb-8 animate-fade-in-up modern-card">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Search */}
        <div className="lg:col-span-4">
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 shadow-md modern-card"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-2">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full py-3 px-4 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer shadow-md modern-card"
          >
            <option value="all">{t.allStatuses}</option>
            {Object.entries(t.statuses).map(([value, label]) => (
              <option key={value} value={value} className="bg-card text-foreground">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Form Type Filter */}
        <div className="lg:col-span-2">
          <select
            value={filters.formType}
            onChange={(e) => handleFilterChange('formType', e.target.value)}
            className="w-full py-3 px-4 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer shadow-md modern-card"
          >
            <option value="all">{t.allFormTypes}</option>
            {Object.entries(t.formTypes).map(([value, label]) => (
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
            className="w-full py-3 px-4 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 appearance-none cursor-pointer shadow-md modern-card"
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
        <div className="lg:col-span-2 flex gap-3">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-lg text-sm font-medium text-foreground hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 shadow-md hover:shadow-lg modern-card"
          >
            {t.clearFilters}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] text-white rounded-lg hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl"
          >
            {t.export}
          </button>
        </div>
      </div>

      {/* Date Range - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t.from}</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full py-3 px-4 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 shadow-md modern-card"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t.to}</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full py-3 px-4 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 shadow-md modern-card"
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.search || filters.status !== 'all' || filters.formType !== 'all' || filters.priority !== 'all' || filters.dateFrom || filters.dateTo) && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFC72C]/20 text-[#FFC72C] border border-[#FFC72C]/30 rounded-full text-xs font-medium backdrop-blur-md">
                Search: &quot;{filters.search}&quot;
                <button 
                  onClick={() => handleFilterChange('search', '')}
                  className="text-[#FFC72C] hover:text-[#FF5722] transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30 rounded-full text-xs font-medium backdrop-blur-md">
                Status: {t.statuses[filters.status as SubmissionStatus]}
                <button 
                  onClick={() => handleFilterChange('status', 'all')}
                  className="text-[#FF5722] hover:text-[#8D153A] transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.formType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#008060]/20 text-[#008060] border border-[#008060]/30 rounded-full text-xs font-medium backdrop-blur-md">
                Type: {t.formTypes[filters.formType as FormType]}
                <button 
                  onClick={() => handleFilterChange('formType', 'all')}
                  className="text-[#008060] hover:text-[#FFC72C] transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priority !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#8D153A]/20 text-[#8D153A] border border-[#8D153A]/30 rounded-full text-xs font-medium backdrop-blur-md">
                Priority: {t.priorities[filters.priority as Priority]}
                <button 
                  onClick={() => handleFilterChange('priority', 'all')}
                  className="text-[#8D153A] hover:text-[#FF5722] transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionFilters;