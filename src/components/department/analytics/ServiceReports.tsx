// src/components/department/analytics/ServiceReports.tsx
"use client";
import React from 'react';
import { FileText, TrendingUp, Clock } from 'lucide-react';

interface ServiceStats {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
  processingTime: string;
  fee: number;
  submissionsCount: number;
  avgProcessingDays: number;
  completionRate: number;
}

export default function ServiceReports() {

  // Dummy service data for display
  const serviceStats = [
    {
      id: '1',
      name: 'Project Accept',
      category: 'No dis',
      isActive: true,
      processingTime: '35 days',
      fee: 120,
      submissionsCount: 1,
      avgProcessingDays: 35,
      completionRate: 100,
    },
    {
      id: '2', 
      name: 'Certificate Services',
      category: 'Official Documents',
      isActive: true,
      processingTime: '5-7 days',
      fee: 250,
      submissionsCount: 47,
      avgProcessingDays: 6,
      completionRate: 96,
    },
    {
      id: '3',
      name: 'Robot Processing', 
      category: 'Automated Services',
      isActive: true,
      processingTime: '7-10 days',
      fee: 2500,
      submissionsCount: 156,
      avgProcessingDays: 8,
      completionRate: 87,
    },
    {
      id: '4',
      name: 'Death Certificate Request',
      category: 'Vital Records', 
      isActive: true,
      processingTime: '1-2 days',
      fee: 300,
      submissionsCount: 45,
      avgProcessingDays: 1,
      completionRate: 100,
    },
    {
      id: '5',
      name: 'Property Tax Assessment',
      category: 'Property Services',
      isActive: false,
      processingTime: '5-7 days',
      fee: 1000,
      submissionsCount: 23,
      avgProcessingDays: 6,
      completionRate: 82,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card/90 modern-card rounded-xl p-6 shadow-glow">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-[#008060]" />
            <span className="text-sm font-medium text-muted-foreground">Active Services</span>
          </div>
          <div className="text-2xl font-bold text-foreground">4</div>
        </div>
        
        <div className="bg-card/90 modern-card rounded-xl p-6 shadow-glow">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[#FFC72C]" />
            <span className="text-sm font-medium text-muted-foreground">Total Services</span>
          </div>
          <div className="text-2xl font-bold text-foreground">5</div>
        </div>
        
        <div className="bg-card/90 modern-card rounded-xl p-6 shadow-glow">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-[#8D153A]" />
            <span className="text-sm font-medium text-muted-foreground">Avg Processing</span>
          </div>
          <div className="text-2xl font-bold text-foreground">2.3 days</div>
        </div>
      </div>

      <div className="bg-card/90 modern-card rounded-xl shadow-glow overflow-hidden">
        <div className="p-6 border-b border-border/30">
          <h3 className="text-lg font-semibold text-foreground">Service Performance Report</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Avg Processing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {serviceStats.map((service: ServiceStats) => (
                <tr key={service.id} className="hover:bg-muted/10">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{service.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-muted rounded-full text-muted-foreground">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {service.submissionsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {service.avgProcessingDays} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-[#008060] h-2 rounded-full"
                          style={{ width: `${service.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{service.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
