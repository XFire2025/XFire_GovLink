"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/adminSystem/AdminSidebar";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    console.log("Active tab changed to:", tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to the GovLink administration panel.
            </p>
          </div>
        );
      case "normal-users":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Normal Users</h1>
            <p className="text-muted-foreground">
              Manage normal user accounts and permissions.
            </p>
          </div>
        );
      case "agents":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Agents</h1>
            <p className="text-muted-foreground">
              Manage government agents and their access levels.
            </p>
          </div>
        );
      case "user-verification":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">User Verification</h1>
            <p className="text-muted-foreground">
              Review and verify user identity documents.
            </p>
          </div>
        );
      case "customer-agent":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">
              Customer/Agent Management
            </h1>
            <p className="text-muted-foreground">
              Manage customer-agent relationships and assignments.
            </p>
          </div>
        );
      case "reports":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Reports</h1>
            <p className="text-muted-foreground">
              Generate and view system reports and analytics.
            </p>
          </div>
        );
      case "system-configuration":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">System Configuration</h1>
            <p className="text-muted-foreground">
              Configure system settings and parameters.
            </p>
          </div>
        );
      default:
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to the GovLink administration panel.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
