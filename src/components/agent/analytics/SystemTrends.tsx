// src/components/agent/analytics/SystemTrends.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';
type TimeRange = 'today' | 'week' | 'month' | 'quarter';
type MetricType = 'traffic' | 'performance' | 'resources' | 'errors';

interface TrendDataPoint {
  period: number;
  traffic: number;
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  errorRate: number;
  activeUsers: number;
}

interface TrendsTranslation {
  peakHours: string;
  commonQueries: string;
  systemBottlenecks: string;
  operationalInsights: string;
  trafficPatterns: string;
  responseTimeAnalysis: string;
  resourceUtilization: string;
  userBehavior: string;
  peakTraffic: string;
  lowTraffic: string;
  avgTraffic: string;
  mostCommon: string;
  queryTypes: string;
  frequency: string;
  performance: string;
  critical: string;
  warning: string;
  normal: string;
  excellent: string;
  cpuUsage: string;
  memoryUsage: string;
  diskSpace: string;
  networkLoad: string;
  activeConnections: string;
  queueLength: string;
  errorRate: string;
  uptime: string;
  recommendations: string;
  optimizePerformance: string;
  scaleResources: string;
  updateProcesses: string;
  monitorAlerts: string;
  systemHealth: string;
  alerts: string;
  metrics: string;
  trends: string;
  insights: string;
  hourly: string;
  daily: string;
  weekly: string;
  monthly: string;
  viewDetails: string;
  exportData: string;
  refresh: string;
  lastUpdated: string;
  realTime: string;
  historical: string;
  comparison: string;
  forecast: string;
}

// Trends translations
const trendsTranslations: Record<Language, TrendsTranslation> = {
  en: {
    peakHours: 'Peak Traffic Hours',
    commonQueries: 'Common Query Types',
    systemBottlenecks: 'System Bottlenecks',
    operationalInsights: 'Operational Insights',
    trafficPatterns: 'Traffic Patterns',
    responseTimeAnalysis: 'Response Time Analysis',
    resourceUtilization: 'Resource Utilization',
    userBehavior: 'User Behavior Patterns',
    peakTraffic: 'Peak Traffic',
    lowTraffic: 'Low Traffic',
    avgTraffic: 'Average Traffic',
    mostCommon: 'Most Common',
    queryTypes: 'Query Types',
    frequency: 'Frequency',
    performance: 'Performance',
    critical: 'Critical',
    warning: 'Warning',
    normal: 'Normal',
    excellent: 'Excellent',
    cpuUsage: 'CPU Usage',
    memoryUsage: 'Memory Usage',
    diskSpace: 'Disk Space',
    networkLoad: 'Network Load',
    activeConnections: 'Active Connections',
    queueLength: 'Queue Length',
    errorRate: 'Error Rate',
    uptime: 'System Uptime',
    recommendations: 'System Recommendations',
    optimizePerformance: 'Optimize database queries for better performance',
    scaleResources: 'Consider scaling server resources during peak hours',
    updateProcesses: 'Update automated processes to reduce manual workload',
    monitorAlerts: 'Set up monitoring alerts for critical system metrics',
    systemHealth: 'System Health',
    alerts: 'Active Alerts',
    metrics: 'Key Metrics',
    trends: 'Trend Analysis',
    insights: 'Operational Insights',
    hourly: 'Hourly',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    viewDetails: 'View Details',
    exportData: 'Export Data',
    refresh: 'Refresh',
    lastUpdated: 'Last Updated',
    realTime: 'Real-time',
    historical: 'Historical',
    comparison: 'Comparison',
    forecast: 'Forecast'
  },
  si: {
    peakHours: 'ඉහළම ගමනාගමන් පැය',
    commonQueries: 'පොදු විමසුම් වර්ග',
    systemBottlenecks: 'පද්ධති බාධක',
    operationalInsights: 'මෙහෙයුම් තීක්ෂ්ණතා',
    trafficPatterns: 'ගමනාගමන් රටා',
    responseTimeAnalysis: 'ප්‍රතිචාර කාල විශ්ලේෂණය',
    resourceUtilization: 'සම්පත් උපයෝගීකරණය',
    userBehavior: 'පරිශීලක හැසිරීම් රටා',
    peakTraffic: 'ඉහළම ගමනාගමනය',
    lowTraffic: 'අඩු ගමනාගමනය',
    avgTraffic: 'සාමාන්‍ය ගමනාගමනය',
    mostCommon: 'වඩාත් පොදු',
    queryTypes: 'විමසුම් වර්ග',
    frequency: 'සංඛ්‍යාතය',
    performance: 'කාර්ය සාධනය',
    critical: 'තීරණාත්මක',
    warning: 'අනතුරු ඇඟවීම',
    normal: 'සාමාන්‍ය',
    excellent: 'විශිෂ්ට',
    cpuUsage: 'CPU භාවිතය',
    memoryUsage: 'මතක භාවිතය',
    diskSpace: 'තැටි ඉඩ',
    networkLoad: 'ජාල බරකර',
    activeConnections: 'ක්‍රියාකාරී සම්බන්ධතා',
    queueLength: 'පෝලිමේ දිග',
    errorRate: 'දෝෂ අනුපාතය',
    uptime: 'පද්ධති ක්‍රියාකාරී කාලය',
    recommendations: 'පද්ධති නිර්දේශ',
    optimizePerformance: 'වඩා හොඳ කාර්ය සාධනය සඳහා දත්ත සමුදාය විමසුම් ප්‍රශස්ත කරන්න',
    scaleResources: 'ඉහළම පැය වලදී සේවාදායක සම්පත් පරිමාණය කිරීම සලකා බලන්න',
    updateProcesses: 'අතින් කරන වැඩ ප්‍රමාණය අඩු කිරීම සඳහා ස්වයංක්‍රීය ක්‍රියාවලි යාවත්කාලීන කරන්න',
    monitorAlerts: 'තීරණාත්මක පද්ධති මිනුම් සඳහා නිරීක්ෂණ අනතුරු ඇඟවීම් සකසන්න',
    systemHealth: 'පද්ධති සෞඛ්‍යය',
    alerts: 'ක්‍රියාකාරී අනතුරු ඇඟවීම්',
    metrics: 'ප්‍රධාන මිනුම්',
    trends: 'ප්‍රවණතා විශ්ලේෂණය',
    insights: 'මෙහෙයුම් තීක්ෂ්ණතා',
    hourly: 'පැයකට',
    daily: 'දෛනික',
    weekly: 'සාප්ටාහික',
    monthly: 'මාසික',
    viewDetails: 'විස්තර බලන්න',
    exportData: 'දත්ත නිර්යාත කරන්න',
    refresh: 'නැවුම් කරන්න',
    lastUpdated: 'අවසන් යාවත්කාලීන',
    realTime: 'තත්‍ය කාලීන',
    historical: 'ඓතිහාසික',
    comparison: 'සන්සන්දනය',
    forecast: 'පුරෝකථනය'
  },
  ta: {
    peakHours: 'அதிக போக்குவரத்து நேரம்',
    commonQueries: 'பொதுவான வினவல் வகைகள்',
    systemBottlenecks: 'கணினி இடர்பாடுகள்',
    operationalInsights: 'செயல்பாட்டு நுண்ணறிவுகள்',
    trafficPatterns: 'போக்குவரத்து முறைகள்',
    responseTimeAnalysis: 'பதில் நேர பகுப்பாய்வு',
    resourceUtilization: 'வள பயன்பாடு',
    userBehavior: 'பயனர் நடத்தை முறைகள்',
    peakTraffic: 'அதிக போக்குவரத்து',
    lowTraffic: 'குறைந்த போக்குவரத்து',
    avgTraffic: 'சராசரி போக்குவரத்து',
    mostCommon: 'மிகவும் பொதுவான',
    queryTypes: 'வினவல் வகைகள்',
    frequency: 'அதிர்வெண்',
    performance: 'செயல்திறன்',
    critical: 'முக்கியமான',
    warning: 'எச்சரிக்கை',
    normal: 'சாதாரண',
    excellent: 'சிறந்த',
    cpuUsage: 'CPU பயன்பாடு',
    memoryUsage: 'நினைவக பயன்பாடு',
    diskSpace: 'வட்டு இடம்',
    networkLoad: 'நெட்வர்க் சுமை',
    activeConnections: 'செயலில் உள்ள இணைப்புகள்',
    queueLength: 'வரிசை நீளம்',
    errorRate: 'பிழை விகிதம்',
    uptime: 'கணினி இயக்க நேரம்',
    recommendations: 'கணினி பரிந்துரைகள்',
    optimizePerformance: 'சிறந்த செயல்திறனுக்காக தரவுத்தள வினவல்களை மேம்படுத்தவும்',
    scaleResources: 'உச்ச நேரங்களில் சேவையக வளங்களை அளவிடுவதை கருத்தில் கொள்ளவும்',
    updateProcesses: 'கைமுறை பணிभারத்தை குறைக்க தானியங்கு செயல்முறைகளை புதுப்பிக்கவும்',
    monitorAlerts: 'முக்கிய கணினி அளவீடுகளுக்கு கண்காணிப்பு எச்சரிக்கைகளை அமைக்கவும்',
    systemHealth: 'கணினி ஆரோக்கியம்',
    alerts: 'செயலில் உள்ள எச்சரிக்கைகள்',
    metrics: 'முக்கிய அளவீடுகள்',
    trends: 'போக்கு பகுப்பாய்வு',
    insights: 'செயல்பாட்டு நுண்ணறிவுகள்',
    hourly: 'மணிநேர',
    daily: 'தினசரி',
    weekly: 'வாராந்திர',
    monthly: 'மாதாந்திர',
    viewDetails: 'விவரங்களைப் பார்க்கவும்',
    exportData: 'தரவை ஏற்றுமதி செய்யவும்',
    refresh: 'புதுப்பிக்கவும்',
    lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
    realTime: 'நிகழ்நேர',
    historical: 'வரலாற்று',
    comparison: 'ஒப்பீடு',
    forecast: 'முன்னறிவிப்பு'
  }
};

interface SystemTrendsProps {
  language?: Language;
  timeRange: TimeRange;
}

const SystemTrends: React.FC<SystemTrendsProps> = ({ 
  language = 'en', 
  timeRange 
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('traffic');
  const [isRealTime, setIsRealTime] = useState(true);
  const [trendsData, setTrendsData] = useState<TrendDataPoint[]>([]);
  const [systemData, setSystemData] = useState<{
    trendsData?: TrendDataPoint[];
    peakHoursData?: Array<{ hour: string; traffic: number; label: string }>;
    commonQueriesData?: Array<{ type: string; count: number; percentage: number; trend: string }>;
    bottlenecksData?: Array<{ id: string; title: string; severity: string; impact: string; recommendation: string; trend: string }>;
    resourceData?: Array<{ name: string; value: number; max: number; color: string; status: string }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const t = trendsTranslations[language];

  // Fetch trends data from backend
  const fetchTrendsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agent/analytics/trends?timeRange=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setSystemData(result.data);
        setTrendsData(result.data.trendsData || []);
      } else {
        console.error('Failed to fetch trends data');
      }
    } catch (error) {
      console.error('Error fetching trends data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchTrendsData();
  }, [timeRange, fetchTrendsData]);

  // Use data from backend or fallback to empty arrays
  const peakHoursData = systemData?.peakHoursData || [];
  const commonQueriesData = systemData?.commonQueriesData || [];
  const bottlenecksData = systemData?.bottlenecksData || [];
  const resourceData = systemData?.resourceData || [];

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC72C]"></div>
      </div>
    );
  }

  // Simple chart component for trends
  const TrendChart = ({ data, metric, color }: { data: TrendDataPoint[], metric: keyof TrendDataPoint, color: string }) => {
    const maxValue = Math.max(...data.map(d => d[metric] as number));
    
    return (
      <div className="h-40 flex items-end justify-between gap-1">
        {data.slice(-20).map((item, index) => {
          const height = ((item[metric] as number) / maxValue) * 100;
          return (
            <div 
              key={index}
              className="flex-1 rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
              style={{ 
                height: `${height}%`,
                backgroundColor: color + '40',
                borderTop: `2px solid ${color}`
              }}
              title={`${item.period}: ${item[metric]}`}
            />
          );
        })}
      </div>
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/30';
      case 'warning': return 'text-[#FFC72C] bg-[#FFC72C]/10 border-[#FFC72C]/30';
      case 'normal': return 'text-[#008060] bg-[#008060]/10 border-[#008060]/30';
      default: return 'text-muted-foreground bg-muted/10 border-border/30';
    }
  };

  const getResourceStatus = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-[#008060]';
      case 'normal': return 'text-[#FFC72C]';
      case 'warning': return 'text-[#FF5722]';
      case 'critical': return 'text-[#8D153A]';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl p-1 modern-card">
            {(['traffic', 'performance', 'resources', 'errors'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-300 capitalize ${
                  selectedMetric === metric
                    ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
                }`}
              >
                {metric}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRealTime}
                onChange={(e) => setIsRealTime(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                isRealTime ? 'bg-gradient-to-r from-[#008060] to-[#FFC72C]' : 'bg-muted/50'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  isRealTime ? 'translate-x-5' : 'translate-x-0.5'
                } mt-0.5`}></div>
              </div>
              <span className="text-sm font-medium text-foreground">{t.realTime}</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C]/60 transition-all duration-300 text-sm shadow-md hover:shadow-lg modern-card">
            {t.exportData}
          </button>
        </div>
      </div>

      {/* Main Trends Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-foreground">{t.trafficPatterns}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/30 px-3 py-1 rounded-full border border-border/50">
              <div className="w-2 h-2 bg-[#FFC72C] rounded-full animate-pulse"></div>
              Live Data
            </div>
          </div>
          <TrendChart data={trendsData} metric="traffic" color="#FFC72C" />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-bold text-[#FFC72C]">{Math.max(...trendsData.map(d => d.traffic))}</div>
              <div className="text-muted-foreground">{t.peakTraffic}</div>
            </div>
            <div>
              <div className="font-bold text-foreground">
                {Math.round(trendsData.reduce((acc, d) => acc + d.traffic, 0) / trendsData.length)}
              </div>
              <div className="text-muted-foreground">{t.avgTraffic}</div>
            </div>
            <div>
              <div className="font-bold text-[#008060]">{Math.min(...trendsData.map(d => d.traffic))}</div>
              <div className="text-muted-foreground">{t.lowTraffic}</div>
            </div>
          </div>
        </div>

        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
          <h4 className="text-lg font-semibold text-foreground mb-6">{t.responseTimeAnalysis}</h4>
          <TrendChart data={trendsData} metric="responseTime" color="#FF5722" />
          <div className="mt-4 flex justify-between items-center text-sm">
            <div className="text-center">
              <div className="font-bold text-[#FF5722]">
                {Math.max(...trendsData.map(d => d.responseTime)).toFixed(1)}s
              </div>
              <div className="text-muted-foreground">Max</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-foreground">
                {(trendsData.reduce((acc, d) => acc + d.responseTime, 0) / trendsData.length).toFixed(1)}s
              </div>
              <div className="text-muted-foreground">Average</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-[#008060]">
                {Math.min(...trendsData.map(d => d.responseTime)).toFixed(1)}s
              </div>
              <div className="text-muted-foreground">Min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Peak Hours Analysis */}
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
        <h4 className="text-lg font-semibold text-foreground mb-6">{t.peakHours}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {peakHoursData.sort((a, b) => b.traffic - a.traffic).map((hour) => (
            <div key={hour.hour} className="text-center group">
              <div className="mb-2">
                <div 
                  className="w-full rounded-t-lg transition-all duration-500 group-hover:scale-105"
                  style={{ 
                    height: `${hour.traffic}px`,
                    backgroundColor: hour.traffic > 80 ? '#FF5722' : 
                                   hour.traffic > 60 ? '#FFC72C' : '#008060',
                    opacity: 0.7
                  }}
                />
              </div>
              <div className="text-sm font-medium text-foreground group-hover:text-[#FFC72C] transition-colors duration-300">{hour.hour}</div>
              <div className="text-xs text-muted-foreground">{hour.traffic}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Queries and System Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
          <h4 className="text-lg font-semibold text-foreground mb-6">{t.commonQueries}</h4>
          <div className="space-y-4">
            {commonQueriesData.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-xl hover:bg-card/70 transition-all duration-300 hover:scale-105">
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
                    <div className="text-sm text-muted-foreground">{query.count} requests</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-foreground">{query.percentage}%</div>
                  <div className={`text-xs flex items-center gap-1 ${
                    query.trend === 'up' ? 'text-[#008060]' : 
                    query.trend === 'down' ? 'text-[#FF5722]' : 'text-muted-foreground'
                  }`}>
                    {query.trend === 'up' ? '↗' : query.trend === 'down' ? '↘' : '→'}
                    {query.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
          <h4 className="text-lg font-semibold text-foreground mb-6">{t.systemBottlenecks}</h4>
          <div className="space-y-4">
            {bottlenecksData.map((bottleneck) => (
              <div key={bottleneck.id} className="p-4 bg-card/50 rounded-xl hover:bg-card/70 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-medium text-foreground">{bottleneck.title}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getSeverityColor(bottleneck.severity)}`}>
                    {bottleneck.severity}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{bottleneck.impact}</div>
                <div className="text-xs text-muted-foreground italic">{bottleneck.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Utilization */}
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
        <h4 className="text-lg font-semibold text-foreground mb-6">{t.resourceUtilization}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resourceData.map((resource) => (
            <div key={resource.name} className="text-center group">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={resource.color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - resource.value / 100)}`}
                    className="transition-all duration-1000 group-hover:stroke-width-10"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold group-hover:scale-110 transition-transform duration-300" style={{ color: resource.color }}>
                    {resource.value}%
                  </span>
                </div>
              </div>
              <div className="font-medium text-foreground mb-1 group-hover:text-[#FFC72C] transition-colors duration-300">{resource.name}</div>
              <div className={`text-xs font-semibold capitalize ${getResourceStatus(resource.status)}`}>
                {resource.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Recommendations - Enhanced with consistent styling */}
      <div className="bg-gradient-to-r from-[#008060]/10 to-[#FFC72C]/10 border border-[#008060]/30 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#008060]/20 rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c.552 0 1-.448 1-1V8a2 2 0 0 0-2-2h-3.17c-.31 0-.6-.15-.77-.41L14.83 4H9.17L7.94 5.59c-.17.26-.46.41-.77.41H4a2 2 0 0 0-2 2v3c0 .552.448 1 1 1h18z"/>
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-foreground">{t.recommendations}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-card/30 rounded-xl hover:bg-card/50 transition-all duration-300 hover:scale-105">
            <div className="w-1.5 h-1.5 bg-[#008060] rounded-full mt-2"></div>
            <span className="text-sm text-muted-foreground">{t.optimizePerformance}</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-card/30 rounded-xl hover:bg-card/50 transition-all duration-300 hover:scale-105">
            <div className="w-1.5 h-1.5 bg-[#008060] rounded-full mt-2"></div>
            <span className="text-sm text-muted-foreground">{t.scaleResources}</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-card/30 rounded-xl hover:bg-card/50 transition-all duration-300 hover:scale-105">
            <div className="w-1.5 h-1.5 bg-[#008060] rounded-full mt-2"></div>
            <span className="text-sm text-muted-foreground">{t.updateProcesses}</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-card/30 rounded-xl hover:bg-card/50 transition-all duration-300 hover:scale-105">
            <div className="w-1.5 h-1.5 bg-[#008060] rounded-full mt-2"></div>
            <span className="text-sm text-muted-foreground">{t.monitorAlerts}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemTrends;