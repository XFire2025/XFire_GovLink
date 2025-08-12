// src/components/department/analytics/DepartmentPerformanceMetrics.tsx
"use client";
import React from 'react';
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';

// Simple chart component, as seen in agent analytics
const SimpleChart = ({ data, colorFrom, colorTo }: { data: number[], colorFrom: string, colorTo: string }) => {
  if (data.length === 0) return <div className="h-48" />;
  const maxValue = Math.max(...data);
  
  return (
    <div className="h-48 flex items-end justify-between gap-2">
      {data.map((value, index) => {
        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div 
            key={index}
            className="flex-1 rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
            style={{ 
              height: `${height}%`,
              background: `linear-gradient(to top, ${colorFrom}, ${colorTo})`
            }}
            title={`Period ${index + 1}: ${value} submissions`}
          />
        );
      })}
    </div>
  );
};

export default function DepartmentPerformanceMetrics() {
  const { t } = useTranslation('department');

  // Mock data for visualizations
  const submissionsTrendData = [120, 150, 130, 180, 200, 190, 220, 250, 230, 280, 300, 290];
  const topAgents = [
    { name: "Nimali Gunaratne", score: 98.2, isCurrentUser: false, rank: 1 },
    { name: "Bhanuka Rajapaksa", score: 95.5, isCurrentUser: false, rank: 2 },
    { name: "Priya De Silva", score: 92.1, isCurrentUser: false, rank: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions Trend Chart */}
        <div className="bg-card/90 modern-card rounded-xl p-6 shadow-glow">
          <h4 className="text-lg font-semibold text-foreground mb-4">{t('analytics.metrics.submissionsTrend')}</h4>
          <SimpleChart data={submissionsTrendData} colorFrom="#008060" colorTo="#FFC72C" />
        </div>
        
        {/* Top Performing Agents */}
        <div className="bg-card/90 modern-card rounded-xl p-6 shadow-glow">
          <h4 className="text-lg font-semibold text-foreground mb-6">{t('analytics.metrics.topPerformingAgents')}</h4>
          <div className="space-y-3">
            {topAgents.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-muted text-muted-foreground">#{agent.rank}</div>
                  <div className="font-semibold text-foreground">{agent.name}</div>
                </div>
                <div className="text-lg font-bold text-[#008060]">{agent.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}