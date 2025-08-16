// src/components/agent/analytics/PerformanceMetrics.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';
type TimeRange = 'today' | 'week' | 'month' | 'quarter';

interface ChartDataPoint {
  period: number;
  responseTime: number;
  satisfaction: number;
  resolution: number;
  tickets: number;
}

type PlottableMetric = keyof Omit<ChartDataPoint, 'period'>;

interface MetricsTranslation {
  personalMetrics: string;
  teamMetrics: string;
  responseTime: string;
  resolutionRate: string;
  satisfactionScore: string;
  ticketsHandled: string;
  avgResolutionTime: string;
  firstContactResolution: string;
  customerFeedback: string;
  performanceTrend: string;
  excellent: string;
  good: string;
  average: string;
  needsImprovement: string;
  minutesAbbr: string;
  hoursAbbr: string;
  daysAbbr: string;
  comparison: string;
  vsLastPeriod: string;
  teamRanking: string;
  topPerformer: string;
  skillsAssessment: string;
  communicationSkills: string;
  technicalKnowledge: string;
  problemSolving: string;
  efficiency: string;
  goals: string;
  monthlyTarget: string;
  progress: string;
  achieved: string;
}

// Metrics translations
const metricsTranslations: Record<Language, MetricsTranslation> = {
  en: {
    personalMetrics: 'Personal Performance',
    teamMetrics: 'Team Performance',
    responseTime: 'Response Time',
    resolutionRate: 'Resolution Rate',
    satisfactionScore: 'Satisfaction Score',
    ticketsHandled: 'Cases Handled',
    avgResolutionTime: 'Avg Resolution Time',
    firstContactResolution: 'First Contact Resolution',
    customerFeedback: 'Customer Feedback',
    performanceTrend: 'Performance Trend',
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    needsImprovement: 'Needs Improvement',
    minutesAbbr: 'min',
    hoursAbbr: 'hrs',
    daysAbbr: 'days',
    comparison: 'Comparison',
    vsLastPeriod: 'vs Last Period',
    teamRanking: 'Team Ranking',
    topPerformer: 'Top Performer',
    skillsAssessment: 'Skills Assessment',
    communicationSkills: 'Communication',
    technicalKnowledge: 'Technical Knowledge',
    problemSolving: 'Problem Solving',
    efficiency: 'Efficiency',
    goals: 'Goals & Targets',
    monthlyTarget: 'Monthly Target',
    progress: 'Progress',
    achieved: 'Achieved'
  },
  si: {
    personalMetrics: 'පුද්ගලික කාර්ය සාධනය',
    teamMetrics: 'කණ්ඩායම් කාර්ය සාධනය',
    responseTime: 'ප්‍රතිචාර කාලය',
    resolutionRate: 'විසඳුම් අනුපාතය',
    satisfactionScore: 'තෘප්තිමත් ලකුණ',
    ticketsHandled: 'කළමනාකරණය කරන ලද අවස්ථා',
    avgResolutionTime: 'සාමාන්‍ය විසඳුම් කාලය',
    firstContactResolution: 'පළමු සම්බන්ධතා විසඳුම',
    customerFeedback: 'පාරිභෝගික ප්‍රතිපෝෂණ',
    performanceTrend: 'කාර්ය සාධන ප්‍රවණතාව',
    excellent: 'විශිෂ්ට',
    good: 'හොඳ',
    average: 'සාමාන්‍ය',
    needsImprovement: 'වැඩිදියුණු කිරීම අවශ්‍ය',
    minutesAbbr: 'මිනි',
    hoursAbbr: 'පැය',
    daysAbbr: 'දින',
    comparison: 'සංසන්දනය',
    vsLastPeriod: 'අවසන් කාලය සමඟ',
    teamRanking: 'කණ්ඩායම් ශ්‍රේණිගත කිරීම',
    topPerformer: 'ඉහළම ක්‍රියාකාරක',
    skillsAssessment: 'කුසලතා ඇගැයීම',
    communicationSkills: 'සන්නිවේදනය',
    technicalKnowledge: 'තාක්ෂණික දැනුම',
    problemSolving: 'ගැටලු විසඳීම',
    efficiency: 'කාර්යක්ෂමතාව',
    goals: 'ඉලක්ක සහ ටිකට්',
    monthlyTarget: 'මාසික ඉලක්කය',
    progress: 'ප්‍රගතිය',
    achieved: 'සාක්ෂාත් කළ'
  },
  ta: {
    personalMetrics: 'தனிப்பட்ட செயல்திறன்',
    teamMetrics: 'குழு செயல்திறன்',
    responseTime: 'பதில் நேரம்',
    resolutionRate: 'தீர்வு விகிதம்',
    satisfactionScore: 'திருப்தி மதிப்பெண்',
    ticketsHandled: 'கையாளப்பட்ட வழக்குகள்',
    avgResolutionTime: 'சராசரி தீர்வு நேரம்',
    firstContactResolution: 'முதல் தொடர்பு தீர்வு',
    customerFeedback: 'வாடிக்கையாளர் கருத்து',
    performanceTrend: 'செயல்திறன் போக்கு',
    excellent: 'சிறந்த',
    good: 'நல்ல',
    average: 'சராசரி',
    needsImprovement: 'மேம்பாடு தேவை',
    minutesAbbr: 'நிமி',
    hoursAbbr: 'மணி',
    daysAbbr: 'நாட்கள்',
    comparison: 'ஒப்பீடு',
    vsLastPeriod: 'கடந்த காலத்துடன்',
    teamRanking: 'குழு தரவரிசை',
    topPerformer: 'சிறந்த செயல்பாட்டாளர்',
    skillsAssessment: 'திறன் மதிப்பீடு',
    communicationSkills: 'தொடர்பு',
    technicalKnowledge: 'தொழில்நுட்ப அறிவு',
    problemSolving: 'சிக்கல் தீர்த்தல்',
    efficiency: 'திறமை',
    goals: 'இலக்குகள் மற்றும் இலக்குகள்',
    monthlyTarget: 'மாதாந்திர இலக்கு',
    progress: 'முன்னேற்றம்',
    achieved: 'அடைந்தது'
  }
};

interface PerformanceMetricsProps {
  language?: Language;
  timeRange: TimeRange;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  language = 'en', 
  timeRange 
}) => {
  const [selectedView, setSelectedView] = useState<'personal' | 'team'>('personal');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [performanceData, setPerformanceData] = useState<{
    personalMetrics?: Record<string, { value: string; unit: string; trend: number; isPositive: boolean }>;
    skillsData?: Array<{ skill: string; score: number; color: string }>;
    teamRankingData?: Array<{ name: string; score: number; rank: number; isCurrentUser: boolean }>;
    chartData?: ChartDataPoint[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const t = metricsTranslations[language];

  // Fetch performance data from backend
  const fetchPerformanceData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agent/analytics/performance?timeRange=${timeRange}&view=${selectedView}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setPerformanceData(result.data);
        setChartData(result.data.chartData || []);
      } else {
        console.error('Failed to fetch performance data');
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange, selectedView]);

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange, selectedView, fetchPerformanceData]);

  // Use data from backend or fallback to default
  const personalMetrics = performanceData?.personalMetrics || {};
  const personalMetricKeys = Object.keys(personalMetrics) as (keyof typeof personalMetrics)[];

  // Skills data from backend or mock
  const skillsData = performanceData?.skillsData || [
    { skill: t.communicationSkills, score: 0, color: '#FFC72C' },
    { skill: t.technicalKnowledge, score: 0, color: '#008060' },
    { skill: t.problemSolving, score: 0, color: '#FF5722' },
    { skill: t.efficiency, score: 0, color: '#8D153A' }
  ];

  // Team ranking data from backend or mock
  const teamRankingData = performanceData?.teamRankingData || [];

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC72C]"></div>
      </div>
    );
  }

  // Simple chart component
  const SimpleChart = ({ data, type }: { data: ChartDataPoint[], type: PlottableMetric }) => {
    if (data.length === 0) return <div className="h-32" />;
    const maxValue = Math.max(...data.map(d => d[type]));
    
    return (
      <div className="h-32 flex items-end justify-between gap-1">
        {data.slice(-12).map((item, index) => {
          const height = maxValue > 0 ? (item[type] / maxValue) * 100 : 0;
          return (
            <div 
              key={index}
              className="flex-1 bg-gradient-to-t from-[#FFC72C] to-[#FF5722] rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
              style={{ height: `${height}%` }}
              title={`${item.period}: ${item[type].toFixed(1)}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* View Toggle - EXACT SAME pattern as other components */}
      <div className="flex bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl p-1 modern-card">
        <button
          onClick={() => setSelectedView('personal')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            selectedView === 'personal'
              ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
          }`}
        >
          {t.personalMetrics}
        </button>
        <button
          onClick={() => setSelectedView('team')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            selectedView === 'team'
              ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
          }`}
        >
          {t.teamMetrics}
        </button>
      </div>

      {selectedView === 'personal' && (
        <div className="space-y-6">
          {/* Key Metrics Grid - EXACT SAME styling as DashboardCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalMetricKeys.map((key) => {
              const metric = personalMetrics[key];
              return (
              <div key={key} className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-glow transition-all duration-500 hover:shadow-2xl hover:scale-105 modern-card group">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {t[key as keyof MetricsTranslation]}
                  </h4>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
                    metric.isPositive 
                      ? 'text-[#008060] bg-[#008060]/10 border-[#008060]/20' 
                      : 'text-[#FF5722] bg-[#FF5722]/10 border-[#FF5722]/20'
                  }`}>
                    {metric.isPositive ? '↗' : '↘'}
                    <span>{Math.abs(metric.trend)}%</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#FFC72C] group-hover:text-[#FF5722] transition-colors duration-300">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
              </div>
            )})}
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
              <h4 className="text-lg font-semibold text-foreground mb-4">{t.responseTime}</h4>
              <SimpleChart data={chartData} type="responseTime" />
              <div className="mt-2 text-xs text-muted-foreground text-center">
                Last {chartData.length} periods
              </div>
            </div>

            <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
              <h4 className="text-lg font-semibold text-foreground mb-4">{t.satisfactionScore}</h4>
              <SimpleChart data={chartData} type="satisfaction" />
              <div className="mt-2 text-xs text-muted-foreground text-center">
                Customer satisfaction trend
              </div>
            </div>
          </div>

          {/* Skills Assessment */}
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
            <h4 className="text-lg font-semibold text-foreground mb-6">{t.skillsAssessment}</h4>
            <div className="space-y-4">
              {skillsData.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                    <span className="text-sm font-bold" style={{ color: skill.color }}>
                      {skill.score}%
                    </span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${skill.score}%`,
                        backgroundColor: skill.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Progress - Enhanced with consistent styling */}
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
            <h4 className="text-lg font-semibold text-foreground mb-6">{t.goals}</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#008060]/10 to-[#FFC72C]/10 border border-[#008060]/30 rounded-xl hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#008060]/20 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{t.monthlyTarget}</div>
                    <div className="text-sm text-muted-foreground">150 cases resolved</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#008060]">127/150</div>
                  <div className="text-sm text-muted-foreground">84.7% {t.achieved}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'team' && (
        <div className="space-y-6">
          {/* Team Ranking */}
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
            <h4 className="text-lg font-semibold text-foreground mb-6">{t.teamRanking}</h4>
            <div className="space-y-3">
              {teamRankingData.map((agent) => (
                <div 
                  key={agent.name}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                    agent.isCurrentUser 
                      ? 'bg-gradient-to-r from-[#FFC72C]/20 to-[#FF5722]/20 border border-[#FFC72C]/30 shadow-glow' 
                      : 'bg-card/50 hover:bg-card/70 border border-border/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      agent.rank === 1 ? 'bg-[#FFC72C] text-white' :
                      agent.rank === 2 ? 'bg-[#C0C0C0] text-white' :
                      agent.rank === 3 ? 'bg-[#CD7F32] text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      #{agent.rank}
                    </div>
                    <div>
                      <div className={`font-semibold ${agent.isCurrentUser ? 'text-[#FFC72C]' : 'text-foreground'}`}>
                        {agent.name}
                      </div>
                      {agent.rank === 1 && (
                        <div className="text-xs text-[#FFC72C] font-medium">{t.topPerformer}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">{agent.score}%</div>
                    <div className="text-xs text-muted-foreground">Overall Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Performance Chart */}
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-glow hover:shadow-2xl transition-all duration-500 modern-card">
            <h4 className="text-lg font-semibold text-foreground mb-4">{t.performanceTrend}</h4>
            <SimpleChart data={chartData} type="tickets" />
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full"></div>
                <span className="text-muted-foreground">Team Average</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics;