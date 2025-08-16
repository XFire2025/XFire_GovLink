"use client";
import React, { useState, useEffect, useCallback } from 'react';

type Language = 'en' | 'si' | 'ta';
type TimeRange = 'today' | 'week' | 'month' | 'quarter';

interface SimplifiedAnalyticsProps {
  language?: Language;
}

interface QuickStats {
  totalInteractions: { value: string; change: string; isPositive: boolean };
  avgResponseTime: { value: string; unit: string; change: string; isPositive: boolean };
  satisfactionRate: { value: string; unit: string; change: string; isPositive: boolean };
  resolutionRate: { value: string; unit: string; change: string; isPositive: boolean };
}

interface AnalyticsData {
  quickStats: QuickStats;
  chartData: Array<{ period: number; interactions: number; satisfaction: number; avgResponseTime: number }>;
}

interface PersonalMetrics {
  [key: string]: { value: string; change: string; isPositive: boolean; unit?: string; trend?: number };
}

interface SkillsData {
  skill: string;
  proficiency: number;
  improvement: number;
  isPositive: boolean;
  color: string;
}

interface PerformanceData {
  personalMetrics: PersonalMetrics;
  skillsData: SkillsData[];
  chartData: Array<{ period: number; responseTime: number; satisfaction: number; resolutionRate: number }>;
}

interface CommonQuery {
  query: string;
  count: number;
  successRate: number;
  trend?: string;
  type?: string;
  percentage?: number;
}

interface ResourceData {
  type: string;
  usage: number;
  trend: string;
  status: string;
  value: number;
  name: string;
  color: string;
}

interface TrendsData {
  commonQueriesData: CommonQuery[];
  resourceData: ResourceData[];
}

const SimplifiedAnalytics: React.FC<SimplifiedAnalyticsProps> = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all analytics data
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [analyticsResponse, performanceResponse, trendsResponse] = await Promise.all([
        fetch(`/api/agent/analytics?timeRange=${timeRange}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        fetch(`/api/agent/analytics/performance?timeRange=${timeRange}&view=personal`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }),
        fetch(`/api/agent/analytics/trends?timeRange=${timeRange}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
      ]);

      if (analyticsResponse.ok) {
        const result = await analyticsResponse.json();
        console.log('Analytics data received:', result);
        setAnalyticsData(result.data);
      } else {
        console.error('Analytics API error:', analyticsResponse.status, await analyticsResponse.text());
        setAnalyticsData(null);
      }

      if (performanceResponse.ok) {
        const result = await performanceResponse.json();
        console.log('Performance data received:', result);
        setPerformanceData(result.data);
      } else {
        console.error('Performance API error:', performanceResponse.status, await performanceResponse.text());
        setPerformanceData(null);
      }

      if (trendsResponse.ok) {
        const result = await trendsResponse.json();
        console.log('Trends data received:', result);
        setTrendsData(result.data);
      } else {
        console.error('Trends API error:', trendsResponse.status, await trendsResponse.text());
        setTrendsData(null);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAllData();
  }, [timeRange, fetchAllData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC72C]"></div>
      </div>
    );
  }

  const quickStats = analyticsData?.quickStats || {
    totalInteractions: { value: '0', change: '0%', isPositive: false },
    avgResponseTime: { value: '0', unit: 'min', change: '0%', isPositive: false },
    satisfactionRate: { value: '0', unit: '%', change: '0%', isPositive: false },
    resolutionRate: { value: '0', unit: '%', change: '0%', isPositive: false }
  };
  const personalMetrics = performanceData?.personalMetrics || {};
  const skillsData = performanceData?.skillsData || [];
  const commonQueries = trendsData?.commonQueriesData || [];
  const resourceData = trendsData?.resourceData || [];

  // Add fallback chart data if analytics data is missing
  const chartData = analyticsData?.chartData || [];
  const hasChartData = chartData && chartData.length > 0;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <div className="flex bg-card/60 rounded-xl p-1 border border-border/50">
          {(['today', 'week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 capitalize ${
                timeRange === range
                  ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Appointments',
            value: quickStats.totalInteractions?.value || '0',
            change: quickStats.totalInteractions?.change || '0%',
            isPositive: quickStats.totalInteractions?.isPositive || false,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            ),
            color: '#FFC72C'
          },
          {
            title: 'Response Time',
            value: `${quickStats.avgResponseTime?.value || '0'}${quickStats.avgResponseTime?.unit || 'min'}`,
            change: quickStats.avgResponseTime?.change || '0%',
            isPositive: quickStats.avgResponseTime?.isPositive || false,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            ),
            color: '#008060'
          },
          {
            title: 'Completion Rate',
            value: `${quickStats.satisfactionRate?.value || '0'}${quickStats.satisfactionRate?.unit || '%'}`,
            change: quickStats.satisfactionRate?.change || '0%',
            isPositive: quickStats.satisfactionRate?.isPositive || false,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            ),
            color: '#FF5722'
          },
          {
            title: 'Resolution Rate',
            value: `${quickStats.resolutionRate?.value || '0'}${quickStats.resolutionRate?.unit || '%'}`,
            change: quickStats.resolutionRate?.change || '0%',
            isPositive: quickStats.resolutionRate?.isPositive || false,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3l8-8"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02"/>
              </svg>
            ),
            color: '#8D153A'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-card/90 rounded-xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700" style={{color: stat.color}}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                stat.isPositive 
                  ? 'text-green-600 bg-green-100 dark:bg-green-900/30' 
                  : 'text-red-600 bg-red-100 dark:bg-red-900/30'
              }`}>
                {stat.isPositive ? '↗' : '↘'} {stat.change}
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-card/90 rounded-xl p-6 border border-border/50 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Weekly Performance</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FFC72C] rounded"></div>
              <span className="text-muted-foreground">Appointments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FF5722] rounded"></div>
              <span className="text-muted-foreground">Completion %</span>
            </div>
          </div>
        </div>
        <div className="h-48 flex items-end justify-between gap-2">
          {hasChartData ? (
            chartData.slice(0, 7).map((item, index: number) => {
              const appointments = item.interactions || 0;
              const completion = item.satisfaction || 0;
              const appointmentHeight = appointments > 0 ? Math.max(15, (appointments / 25) * 100) : 0;
              const completionHeight = completion > 0 ? Math.max(20, (completion / 100) * 100) : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end" style={{ height: '120px' }}>
                    {appointments > 0 && (
                      <div 
                        className="flex-1 bg-[#FFC72C] rounded-t transition-all duration-300 hover:opacity-80"
                        style={{ height: `${appointmentHeight}%` }}
                        title={`Period ${item.period}: ${appointments} appointments`}
                      />
                    )}
                    {completion > 0 && (
                      <div 
                        className="flex-1 bg-[#FF5722] rounded-t transition-all duration-300 hover:opacity-80"
                        style={{ height: `${completionHeight}%` }}
                        title={`Period ${item.period}: ${completion}% completion`}
                      />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Period {item.period}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center">
              <div className="text-sm text-muted-foreground">No chart data available</div>
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#FFC72C]">{chartData?.reduce((sum, item) => sum + (item.interactions || 0), 0) || 0}</div>
            <div className="text-xs text-muted-foreground">Total This {timeRange}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#FF5722]">{analyticsData?.quickStats?.satisfactionRate?.value || 0}%</div>
            <div className="text-xs text-muted-foreground">Average Completion</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#008060]">{analyticsData?.quickStats?.avgResponseTime?.value || 0}min</div>
            <div className="text-xs text-muted-foreground">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Skills Overview */}
      <div className="bg-card/90 rounded-xl p-6 border border-border/50 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillsData.length > 0 ? skillsData.map((skill, index: number) => (
            <div key={index} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="currentColor" strokeWidth="6" fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="50" cy="50" r="40"
                    stroke={skill.color} strokeWidth="6" fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - skill.proficiency / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: skill.color }}>
                    {skill.proficiency}%
                  </span>
                </div>
              </div>
              <div className="font-medium text-foreground text-sm">{skill.skill}</div>
            </div>
          )) : (
            <div className="col-span-full text-center text-muted-foreground">
              No skills data available
            </div>
          )}
        </div>
      </div>

      {/* Service Types */}
      <div className="bg-card/90 rounded-xl p-6 border border-border/50 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Service Types Handled</h3>
        <div className="space-y-3">
          {commonQueries.length > 0 ? commonQueries.map((query, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-[#FFC72C]' : 
                  index === 1 ? 'bg-[#FF5722]' : 
                  index === 2 ? 'bg-[#008060]' : 'bg-[#8D153A]'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-foreground">{query.type}</div>
                  <div className="text-sm text-muted-foreground">{query.count} appointments</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-foreground">{query.percentage}%</div>
                <div className={`text-xs ${
                  query.trend === 'up' ? 'text-green-600' : 
                  query.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  {query.trend === 'up' ? '↗' : query.trend === 'down' ? '↘' : '→'} {query.trend}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-muted-foreground py-4">
              No service type data available
            </div>
          )}
        </div>
      </div>

      {/* Resource Usage */}
      <div className="bg-card/90 rounded-xl p-6 border border-border/50 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourceData.length > 0 ? resourceData.map((resource, index: number) => (
            <div key={index} className="text-center">
              <div className="mb-3">
                <div className="text-3xl font-bold" style={{ color: resource.color }}>
                  {resource.value}%
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${resource.value}%`,
                      backgroundColor: resource.color 
                    }}
                  />
                </div>
              </div>
              <div className="font-medium text-foreground text-sm">{resource.name}</div>
              <div className={`text-xs capitalize ${
                resource.status === 'excellent' ? 'text-green-600' :
                resource.status === 'normal' ? 'text-blue-600' :
                resource.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {resource.status}
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center text-muted-foreground py-4">
              No resource data available
            </div>
          )}
        </div>
      </div>

      {/* Personal Metrics Summary */}
      <div className="bg-card/90 rounded-xl p-6 border border-border/50 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Personal Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(personalMetrics).length > 0 ? Object.entries(personalMetrics).slice(0, 6).map(([key, metric]) => (
            <div key={key} className="bg-card/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
                <div className={`text-xs ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend && metric.trend > 0 ? '+' : ''}{metric.trend || 0}%
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {metric.value}{metric.unit}
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center text-muted-foreground py-4">
              No personal metrics available
            </div>
          )}
        </div>
      </div>

      {/* Data Summary */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleTimeString()} • 
        Showing {timeRange} data • 
        {chartData?.reduce((sum, item) => sum + (item.interactions || 0), 0) || 0} total appointments
      </div>
    </div>
  );
};

export default SimplifiedAnalytics;