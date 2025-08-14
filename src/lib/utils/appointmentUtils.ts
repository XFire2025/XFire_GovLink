// lib/utils/appointmentUtils.ts
import React from 'react';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
type ServiceType = 'passport' | 'license' | 'certificate' | 'registration' | 'visa';
type PriorityLevel = 'normal' | 'urgent';

// Define interfaces for better type safety
export interface AppointmentData {
  id: string;
  citizenName: string;
  citizenId: string;
  serviceType: ServiceType;
  date: string;
  time: string;
  status: AppointmentStatus;
  priority: PriorityLevel;
  notes?: string;
  contactEmail: string;
  contactPhone: string;
  submittedDate: string;
  bookingReference?: string;
  agentNotes?: string;
}

export interface AppointmentFilters {
  search?: string;
  status?: string;
  serviceType?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
  urgent: number;
  overdue?: number;
}

export interface FormattedAppointment extends AppointmentData {
  formattedDate: string;
  formattedTime: string;
  isToday: boolean;
  isOverdue: boolean;
  daysUntil: number;
  statusColor: string;
  priorityColor: string;
  serviceIcon: React.ReactElement;
}

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
export const getServiceIcon = (serviceType: ServiceType): React.ReactElement => {
  const icons = {
    passport: React.createElement('svg', {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, [
      React.createElement('rect', { key: '1', x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
      React.createElement('path', { key: '2', d: "M16 2v4" }),
      React.createElement('path', { key: '3', d: "M8 2v4" }),
      React.createElement('path', { key: '4', d: "M3 10h18" })
    ]),
    license: React.createElement('svg', {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, [
      React.createElement('rect', { key: '1', x: "14", y: "14", width: "4", height: "6", rx: "2" }),
      React.createElement('rect', { key: '2', x: "6", y: "4", width: "4", height: "6", rx: "2" }),
      React.createElement('path', { key: '3', d: "M6 20h4" }),
      React.createElement('path', { key: '4', d: "M14 10h4" }),
      React.createElement('path', { key: '5', d: "M6 14h2m6 0h2" })
    ]),
    certificate: React.createElement('svg', {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, [
      React.createElement('path', { key: '1', d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
      React.createElement('polyline', { key: '2', points: "14 2 14 8 20 8" })
    ]),
    registration: React.createElement('svg', {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, [
      React.createElement('path', { key: '1', d: "M3 21h18" }),
      React.createElement('path', { key: '2', d: "M5 21V7l8-4v18" }),
      React.createElement('path', { key: '3', d: "M19 21V11l-6-4" })
    ]),
    visa: React.createElement('svg', {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, [
      React.createElement('path', { key: '1', d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" })
    ])
  };
  
  return icons[serviceType] || React.createElement('svg', {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, [
    React.createElement('rect', { key: '1', x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" })
  ]);
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
export const sortAppointments = (appointments: AppointmentData[], sortBy: 'date' | 'priority' | 'status' = 'date'): AppointmentData[] => {
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
  appointments: AppointmentData[], 
  filters: AppointmentFilters
): AppointmentData[] => {
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
export const exportAppointmentsToCSV = (appointments: AppointmentData[], filename?: string): void => {
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
export const calculateAppointmentStats = (appointments: AppointmentData[]): AppointmentStats => {
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
export const groupAppointmentsByDate = (appointments: AppointmentData[]): Record<string, AppointmentData[]> => {
  return appointments.reduce((groups, appointment) => {
    const date = appointment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {} as Record<string, AppointmentData[]>);
};

/**
 * Get appointment conflicts (same date/time)
 */
export const getAppointmentConflicts = (appointments: AppointmentData[], newDate: string, newTime: string, excludeId?: string): AppointmentData[] => {
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
export const formatAppointmentForDisplay = (appointment: AppointmentData, language: 'en' | 'si' | 'ta' = 'en'): FormattedAppointment => {
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