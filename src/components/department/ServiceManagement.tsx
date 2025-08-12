// src/components/department/ServiceManagement.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Layers, // Icon for Services
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AddServiceModal from "./AddServiceModal";

// Interface for a Service
interface Service {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  fee: number;
  agentsAssigned: number;
}

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([
    { id: "svc-1", name: "New Passport Application", description: "Standard 32-page passport.", status: "active", fee: 5000, agentsAssigned: 12 },
    { id: "svc-2", name: "Passport Renewal", description: "Renewal for expired or nearly expired passports.", status: "active", fee: 4500, agentsAssigned: 12 },
    { id: "svc-3", name: "ID Card Correction", description: "Request for corrections on National ID card.", status: "inactive", fee: 500, agentsAssigned: 4 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = (newServiceData: Omit<Service, 'id' | 'agentsAssigned'>) => {
    const newService: Service = {
      ...newServiceData,
      id: `svc-${services.length + 1}`,
      agentsAssigned: 0, // New services have 0 agents
    };
    setServices(prev => [newService, ...prev]);
  };

  return (
    <div className="relative min-h-full">
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex justify-between items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold">
              <Layers className="w-8 h-8 text-[#008060]" />
              <span className="text-foreground">Service</span>{' '}
              <span className="bg-gradient-to-r from-[#008060] to-[#FFC72C] bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-muted-foreground">Define and manage the services offered by your department.</p>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] hover:from-[#FFC72C] hover:to-[#FF5722] text-white px-4 py-2.5 rounded-xl">
                      <Plus className="w-4 h-4" />
            Add Service
          </button>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-[#008060]" />
            <input type="text" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-sm pl-10 pr-4 py-2.5 bg-card/60 border border-border/50 rounded-xl focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]/50 modern-card" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }} className="bg-card/90 modern-card rounded-2xl border border-border/50 shadow-glow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#008060]/5 to-[#FF5722]/5 border-b border-border/30">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Service Name</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">Service Fee (LKR)</th>
                  <th className="text-left p-4 font-semibold text-foreground">Agents Assigned</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id} className="border-t border-border/20 hover:bg-card/30">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{service.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">{service.description}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${service.status === "active" ? "bg-[#008060]/10 text-[#008060]" : "bg-[#FF5722]/10 text-[#FF5722]"}`}>
                        {service.status === "active" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-muted-foreground">{service.fee.toFixed(2)}</td>
                    <td className="p-4 text-center font-medium text-muted-foreground">{service.agentsAssigned}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#008060]/10 rounded-lg text-[#008060]" title="View"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-[#FFC72C]/10 rounded-lg text-[#FFC72C]" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-[#FF5722]/10 rounded-lg text-[#FF5722]" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <AddServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddService} />
    </div>
  );
}