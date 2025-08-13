// lib/utils/appointmentUtils.ts
type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
type ServiceType = 'passport' | 'license' | 'certificate' | 'registration' | 'visa';
type PriorityLevel = 'normal' | 'urgent';

/**
 * Get the appropriate color class for appointment status
 */
export const getStatusColor = (status: AppointmentStatus): string => {
  const colors = {
    pending: 'text-[#FFC72C] bg-[#FFC72C]/20 border-[#FFC72C]/30',
    confirmed: 'text-[#008060] bg-[#008060]/20 border-[#008060]/30',
    cancelled: 'text-[#FF5722] bg-[#FF5722]/20 border-[#FF5722]/30',
    completed: 'text-[#8D153A] bg-[#8D153A]/20 border-[#8D153A]/30'
  };
  return colors[status] || 'text-muted-foreground bg-muted/20 border-border/30';
};

/**
 * Get the icon for a service type
 */
export const getServiceIcon = (serviceType: ServiceType): JSX.Element => {
  const icons = {
    passport: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <path d="M16 2v4"/>
        <path d="M8 2v4"/>
        <path d="M3 10h18"/>
      </svg>
    ),
    license: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="14" y="14" width="4" height="6" rx="2"/>
        <rect x="6" y="4" width="4" height="6" rx="2"/>
        <path d="M6 20h4"/>
        <path d="M14 10h4"/>
        <path d="M6 14h2m6 0h2"/>
      </svg>
    ),
    certificate: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    registration: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/>
        <path d="M5 21V7l8-4v18"/>
        <path d="M19 21V11l-6-4"/>
      </svg>
    ),
    visa: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    )
  };
  
  return icons[serviceType] || (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    </svg>
  );
};

/**
 * Format date to human-readable string
 */
export const formatAppointmentDate = (dateString: string, language: 'en' | 'si' | 'ta' = 'en'): string => {
  const date = new Date(dateString);
  const locales = {
    en: 'en-US',
    si: 'si-LK', 
    ta: 'ta-LK'
  };
  
  return date.toLocaleDateString(locales[language], {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date for detailed view
 */
export const formatDetailedDate = (dateString: string, language: 'en' | 'si' | 'ta' = 'en'): string => {
  const date = new Date(dateString);
  const locales = {
    en: 'en-US',
    si: 'si-LK', 
    ta: 'ta-LK'
  };
  
  return date.toLocaleDateString(locales[language], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format time from HH:MM string
 */
export const formatAppointmentTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Check if appointment is today
 */
export const isAppointmentToday = (dateString: string): boolean => {
  const appointmentDate = new Date(dateString);
  const today = new Date();
  return appointmentDate.toDateString() === today.toDateString();
};

/**
 * Check if appointment is overdue
 */
export const isAppointmentOverdue = (dateString: string, timeString: string): boolean => {
  const appointmentDate = new Date(dateString);
  const [hours, minutes] = timeString.split(':');
  appointmentDate.setHours(parseInt(hours), parseInt(minutes));
  return appointmentDate < new Date();
};

/**
 * Get days until appointment
 */
export const getDaysUntilAppointment = (dateString: string): number => {
  const appointmentDate = new Date(dateString);
  const today = new Date();
  const diffTime = appointmentDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Validate status transitions
 */
export const canTransitionStatus = (currentStatus: AppointmentStatus, newStatus: AppointmentStatus): boolean => {
  const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    cancelled: [], // Cannot change from cancelled
    completed: [] // Cannot change from completed
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
};

/**
 * Get next valid statuses for current status
 */
export const getValidNextStatuses = (currentStatus: AppointmentStatus): AppointmentStatus[] => {
  const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    cancelled: [],
    completed: []
  };
  
  return validTransitions[currentStatus] || [];
};

/**
 * Get priority badge color
 */
export const getPriorityColor = (priority: PriorityLevel): string => {
  return priority === 'urgent' 
    ? 'text-[#FF5722] bg-[#FF5722]/20 border-[#FF5722]/30'
    : 'text-muted-foreground bg-muted/20 border-border/30';
};

/**
 * Sort appointments by priority and date
 */
export const sortAppointments = (appointments: any[], sortBy: 'date' | 'priority' | 'status' = 'date'): any[] => {
  return [...appointments].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        // Urgent first, then by date
        if (a.priority === 'urgent' && b.priority === 'normal') return -1;
        if (a.priority === 'normal' && b.priority === 'urgent') return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
        
      case 'status':
        // Pending first, then confirmed, then others
        const statusOrder = { pending: 0, confirmed: 1, cancelled: 2, completed: 3 };
        const aOrder = statusOrder[a.status as AppointmentStatus] ?? 4;
        const bOrder = statusOrder[b.status as AppointmentStatus] ?? 4;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
        
      case 'date':
      default:
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });
};

/**
 * Filter appointments by various criteria
 */
export const filterAppointments = (
  appointments: any[], 
  filters: {
    search?: string;
    status?: string;
    serviceType?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): any[] => {
  return appointments.filter(appointment => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        appointment.citizenName.toLowerCase().includes(searchTerm) ||
        appointment.citizenId.toLowerCase().includes(searchTerm) ||
        appointment.contactEmail.toLowerCase().includes(searchTerm) ||
        appointment.serviceType.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all' && appointment.status !== filters.status) {
      return false;
    }
    
    // Service type filter
    if (filters.serviceType && filters.serviceType !== 'all' && appointment.serviceType !== filters.serviceType) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority !== 'all' && appointment.priority !== filters.priority) {
      return false;
    }
    
    // Date range filter
    if (filters.dateFrom && appointment.date < filters.dateFrom) {
      return false;
    }
    
    if (filters.dateTo && appointment.date > filters.dateTo) {
      return false;
    }
    
    return true;
  });
};

/**
 * Export appointments to CSV
 */
export const exportAppointmentsToCSV = (appointments: any[], filename?: string): void => {
  const headers = [
    'ID',
    'Citizen Name',
    'Citizen ID',
    'Service Type',
    'Date',
    'Time',
    'Status',
    'Priority',
    'Contact Email',
    'Contact Phone',
    'Submitted Date',
    'Notes'
  ];
  
  const csvContent = [
    headers.join(','),
    ...appointments.map(apt => [
      apt.id,
      `"${apt.citizenName}"`,
      apt.citizenId,
      apt.serviceType,
      apt.date,
      apt.time,
      apt.status,
      apt.priority,
      apt.contactEmail,
      apt.contactPhone,
      apt.submittedDate,
      `"${apt.notes || ''}"`
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `appointments_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate booking reference
 */
export const generateBookingReference = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `APT${year}${month}${day}${random}`;
};

/**
 * Calculate appointment statistics
 */
export const calculateAppointmentStats = (appointments: any[]) => {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === 'pending').length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    today: appointments.filter(apt => apt.date === today).length,
    urgent: appointments.filter(apt => apt.priority === 'urgent').length,
    overdue: appointments.filter(apt => 
      apt.status !== 'completed' && 
      apt.status !== 'cancelled' && 
      isAppointmentOverdue(apt.date, apt.time)
    ).length
  };
};

/**
 * Group appointments by date
 */
export const groupAppointmentsByDate = (appointments: any[]): Record<string, any[]> => {
  return appointments.reduce((groups, appointment) => {
    const date = appointment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {} as Record<string, any[]>);
};

/**
 * Get appointment conflicts (same date/time)
 */
export const getAppointmentConflicts = (appointments: any[], newDate: string, newTime: string, excludeId?: string): any[] => {
  return appointments.filter(apt => 
    apt.id !== excludeId &&
    apt.date === newDate && 
    apt.time === newTime &&
    apt.status !== 'cancelled' &&
    apt.status !== 'completed'
  );
};

/**
 * Format appointment for display
 */
export const formatAppointmentForDisplay = (appointment: any, language: 'en' | 'si' | 'ta' = 'en') => {
  return {
    ...appointment,
    formattedDate: formatAppointmentDate(appointment.date, language),
    formattedTime: formatAppointmentTime(appointment.time),
    isToday: isAppointmentToday(appointment.date),
    isOverdue: isAppointmentOverdue(appointment.date, appointment.time),
    daysUntil: getDaysUntilAppointment(appointment.date),
    statusColor: getStatusColor(appointment.status),
    priorityColor: getPriorityColor(appointment.priority),
    serviceIcon: getServiceIcon(appointment.serviceType)
  };
};