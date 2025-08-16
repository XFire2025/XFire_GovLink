// src/components/department/analytics/AppointmentSubmissions.tsx
"use client";
import React from 'react';
import { Calendar, Clock, Phone, Mail, User, FileText, AlertCircle } from 'lucide-react';

interface Appointment {
  id: string;
  citizenName: string;
  email: string;
  nic: string;
  phone: string;
  appointmentType: string;
  reference: string;
  date: string;
  time: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  submittedOn: string;
  agent: string;
}

export default function AppointmentSubmissions() {
  // Dummy appointment data based on your provided data
  const appointments: Appointment[] = [
    {
      id: '1',
      citizenName: 'Adeepa K',
      email: 'adeepa@gmail.com',
      nic: '200209401281',
      phone: '0764881254',
      appointmentType: 'Certificate Appointment',
      reference: 'APT2508169887',
      date: '8/19/2025',
      time: '10:00',
      priority: 'NORMAL',
      status: 'Pending',
      submittedOn: '8/16/2025',
      agent: 'Unaccepted',
    },
    {
      id: '2',
      citizenName: 'Adeepa K',
      email: 'adeepa@gmail.com',
      nic: '200209401281',
      phone: '0764881254',
      appointmentType: 'Certificate Appointment',
      reference: 'APT2508166643',
      date: '8/18/2025',
      time: '11:00',
      priority: 'NORMAL',
      status: 'Pending',
      submittedOn: '8/16/2025',
      agent: 'Unaccepted',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'URGENT': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Appointment Submissions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} awaiting review
          </p>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-card/90 modern-card rounded-2xl border border-border/50 shadow-glow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border/50">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">Citizen</th>
                <th className="text-left p-4 font-semibold text-foreground">Appointment Details</th>
                <th className="text-left p-4 font-semibold text-foreground">Priority</th>
                <th className="text-left p-4 font-semibold text-foreground">Status</th>
                <th className="text-left p-4 font-semibold text-foreground">Submitted On</th>
                <th className="text-left p-4 font-semibold text-foreground">Agent</th>
                <th className="text-left p-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.id} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${index % 2 === 0 ? 'bg-card/30' : 'bg-transparent'}`}>
                  <td className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{appointment.citizenName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span>{appointment.email}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        NIC: {appointment.nic}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{appointment.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      <div className="font-medium text-foreground">{appointment.appointmentType}</div>
                      <div className="text-sm text-muted-foreground">
                        Ref: {appointment.reference}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-[#008060]" />
                        <span className="text-foreground">{appointment.date} at {appointment.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(appointment.priority)}`}>
                      {appointment.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">{appointment.submittedOn}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {appointment.agent === 'Unaccepted' ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-600 font-medium text-sm">Unaccepted</span>
                        </>
                      ) : (
                        <span className="text-foreground text-sm">{appointment.agent}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-[#008060] text-white text-xs rounded-lg hover:bg-[#006850] transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1 bg-[#8D153A] text-white text-xs rounded-lg hover:bg-[#731129] transition-colors">
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {appointments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No appointments found</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card/90 modern-card p-6 rounded-xl border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Appointments</p>
              <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-[#008060]" />
          </div>
        </div>
        
        <div className="bg-card/90 modern-card p-6 rounded-xl border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
              <p className="text-2xl font-bold text-foreground">
                {appointments.filter(a => a.status === 'Pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-[#FFC72C]" />
          </div>
        </div>
        
        <div className="bg-card/90 modern-card p-6 rounded-xl border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unassigned</p>
              <p className="text-2xl font-bold text-foreground">
                {appointments.filter(a => a.agent === 'Unaccepted').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-[#FF5722]" />
          </div>
        </div>
      </div>
    </div>
  );
}
