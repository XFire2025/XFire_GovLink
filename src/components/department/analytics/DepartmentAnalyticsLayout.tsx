// src/components/department/analytics/DepartmentAnalyticsLayout.tsx
"use client";
import React from 'react';

interface DepartmentAnalyticsLayoutProps {
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
}

const DepartmentAnalyticsLayout: React.FC<DepartmentAnalyticsLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="space-y-8">
      <header className="animate-fade-in-up">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default DepartmentAnalyticsLayout;