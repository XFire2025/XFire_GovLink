// src/components/agent/analytics/ReportGenerator.tsx
"use client";
import React, { useState, useEffect } from 'react';

// Types
type Language = 'en' | 'si' | 'ta';
type ReportType = 'performance' | 'service' | 'operational' | 'custom';
type ReportFormat = 'pdf' | 'excel' | 'csv';
type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
type ReportSchedule = 'once' | 'daily' | 'weekly' | 'monthly';

interface ReportConfig {
  title: string;
  type: ReportType;
  format: ReportFormat;
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  includeCharts: boolean;
  includeComparisons: boolean;
  includeDetails: boolean;
  recipients: string[];
  schedule: ReportSchedule;
}

interface Report {
  id: string;
  title: string;
  type: ReportType;
  format: ReportFormat;
  generatedAt: string;
  size: string;
  status: 'completed' | 'generating' | 'failed';
}

interface ReportTranslation {
  generateReport: string;
  quickReports: string;
  customReport: string;
  reportType: string;
  reportFormat: string;
  timePeriod: string;
  customDateRange: string;
  startDate: string;
  endDate: string;
  reportOptions: string;
  includeCharts: string;
  includeComparisons: string;
  includeDetailedData: string;
  emailSettings: string;
  recipients: string;
  deliverySchedule: string;
  generateNow: string;
  scheduleReport: string;
  generating: string;
  reportTypes: {
    [key in ReportType]: string;
  };
  formats: {
    [key in ReportFormat]: string;
  };
  periods: {
    [key in ReportPeriod]: string;
  };
  schedules: {
    [key in ReportSchedule]: string;
  };
  recentReports: string;
  reportHistory: string;
  download: string;
  view: string;
  delete: string;
  reportGenerated: string;
  reportScheduled: string;
  templateSaved: string;
  previewReport: string;
  saveTemplate: string;
  templates: string;
  quickTemplates: string;
  performanceTemplate: string;
  serviceTemplate: string;
  operationalTemplate: string;
}

// Report translations
const reportTranslations: Record<Language, ReportTranslation> = {
  en: {
    generateReport: 'Generate Report',
    quickReports: 'Quick Reports',
    customReport: 'Custom Report Builder',
    reportType: 'Report Type',
    reportFormat: 'Format',
    timePeriod: 'Time Period',
    customDateRange: 'Custom Date Range',
    startDate: 'Start Date',
    endDate: 'End Date',
    reportOptions: 'Report Options',
    includeCharts: 'Include Charts & Graphs',
    includeComparisons: 'Include Period Comparisons',
    includeDetailedData: 'Include Detailed Data',
    emailSettings: 'Email & Delivery',
    recipients: 'Email Recipients',
    deliverySchedule: 'Delivery Schedule',
    generateNow: 'Generate Now',
    scheduleReport: 'Schedule Report',
    generating: 'Generating...',
    reportTypes: {
      performance: 'Performance Report',
      service: 'Service Usage Report',
      operational: 'Operational Summary',
      custom: 'Custom Analysis'
    },
    formats: {
      pdf: 'PDF Document',
      excel: 'Excel Spreadsheet',
      csv: 'CSV Data File'
    },
    periods: {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      custom: 'Custom Range'
    },
    schedules: {
      once: 'Generate Once',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly'
    },
    recentReports: 'Recent Reports',
    reportHistory: 'Report History',
    download: 'Download',
    view: 'View',
    delete: 'Delete',
    reportGenerated: 'Report generated successfully!',
    reportScheduled: 'Report scheduled successfully!',
    templateSaved: 'Template saved successfully!',
    previewReport: 'Preview Report',
    saveTemplate: 'Save as Template',
    templates: 'Saved Templates',
    quickTemplates: 'Quick Templates',
    performanceTemplate: 'Performance Summary',
    serviceTemplate: 'Service Analytics',
    operationalTemplate: 'Operational Report'
  },
  si: {
    generateReport: 'වාර්තාව ජනනය කරන්න',
    quickReports: 'ඉක්මන් වාර්තා',
    customReport: 'අභිරුචි වාර්තා සාදන්නා',
    reportType: 'වාර්තා වර්ගය',
    reportFormat: 'ආකෘතිය',
    timePeriod: 'කාල පරිච්ඡේදය',
    customDateRange: 'අභිරුචි දින පරාසය',
    startDate: 'ආරම්භක දිනය',
    endDate: 'අවසාන දිනය',
    reportOptions: 'වාර්තා විකල්ප',
    includeCharts: 'ප්‍රස්ථාර සහ ප්‍රස්ථාර ඇතුළත් කරන්න',
    includeComparisons: 'කාල සන්සන්දන ඇතුළත් කරන්න',
    includeDetailedData: 'විස්තරාත්මක දත්ත ඇතුළත් කරන්න',
    emailSettings: 'ඊමේල් සහ බෙදා හැරීම',
    recipients: 'ඊමේල් ලබන්නන්',
    deliverySchedule: 'බෙදා හැරීමේ කාලසටහන',
    generateNow: 'දැන් ජනනය කරන්න',
    scheduleReport: 'වාර්තාව කාලසටහන් කරන්න',
    generating: 'ජනනය කරමින්...',
    reportTypes: {
      performance: 'කාර්ය සාධන වාර්තාව',
      service: 'සේවා භාවිත වාර්තාව',
      operational: 'මෙහෙයුම් සාරාංශය',
      custom: 'අභිරුචි විශ්ලේෂණය'
    },
    formats: {
      pdf: 'PDF ලේඛනය',
      excel: 'Excel පැතුරුම්පත',
      csv: 'CSV දත්ත ගොනුව'
    },
    periods: {
      daily: 'දෛනික',
      weekly: 'සාප්ටාහික',
      monthly: 'මාසික',
      quarterly: 'කාර්තු',
      custom: 'අභිරුචි පරාසය'
    },
    schedules: {
      once: 'එක් වරක් ජනනය කරන්න',
      daily: 'දෛනික',
      weekly: 'සාප්ටාහික',
      monthly: 'මාසික'
    },
    recentReports: 'මෑත වාර්තා',
    reportHistory: 'වාර්තා ඉතිහාසය',
    download: 'බාගන්න',
    view: 'බලන්න',
    delete: 'මකන්න',
    reportGenerated: 'වාර්තාව සාර්ථකව ජනනය කරන ලදී!',
    reportScheduled: 'වාර්තාව සාර්ථකව කාලසටහන් කරන ලදී!',
    templateSaved: 'අච්චුව සාර්ථකව සුරකින ලදී!',
    previewReport: 'වාර්තාව පෙරදසුන',
    saveTemplate: 'අච්චුව ලෙස සුරකින්න',
    templates: 'සුරකින ලද අච්චු',
    quickTemplates: 'ඉක්මන් අච්චු',
    performanceTemplate: 'කාර්ය සාධන සාරාංශය',
    serviceTemplate: 'සේවා විශ්ලේෂණ',
    operationalTemplate: 'මෙහෙයුම් වාර්තාව'
  },
  ta: {
    generateReport: 'அறிக்கையை உருவாக்கவும்',
    quickReports: 'விரைவு அறிக்கைகள்',
    customReport: 'தனிப்பயன் அறிக்கை உருவாக்கி',
    reportType: 'அறிக்கை வகை',
    reportFormat: 'வடிவம்',
    timePeriod: 'நேர காலம்',
    customDateRange: 'தனிப்பயன் தேதி வரம்பு',
    startDate: 'தொடக்க தேதி',
    endDate: 'முடிவு தேதி',
    reportOptions: 'அறிக்கை விருப்பங்கள்',
    includeCharts: 'விளக்கப்படங்கள் மற்றும் வரைபடங்களைச் சேர்க்கவும்',
    includeComparisons: 'கால ஒப்பீடுகளைச் சேர்க்கவும்',
    includeDetailedData: 'விரிவான தரவைச் சேர்க்கவும்',
    emailSettings: 'மின்னஞ்சல் மற்றும் விநியோகம்',
    recipients: 'மின்னஞ்சல் பெறுநர்கள்',
    deliverySchedule: 'விநியோக அட்டவணை',
    generateNow: 'இப்போது உருவாக்கவும்',
    scheduleReport: 'அறிக்கையை திட்டமிடவும்',
    generating: 'உருவாக்குகிறது...',
    reportTypes: {
      performance: 'செயல்திறன் அறிக்கை',
      service: 'சேவை பயன்பாட்டு அறிக்கை',
      operational: 'செயல்பாட்டு சுருக்கம்',
      custom: 'தனிப்பயன் பகுப்பாய்வு'
    },
    formats: {
      pdf: 'PDF ஆவணம்',
      excel: 'Excel விரிதாள்',
      csv: 'CSV தரவு கோப்பு'
    },
    periods: {
      daily: 'தினசரி',
      weekly: 'வாராந்திர',
      monthly: 'மாதாந்திர',
      quarterly: 'காலாண்டு',
      custom: 'தனிப்பயன் வரம்பு'
    },
    schedules: {
      once: 'ஒருமுறை உருவாக்கவும்',
      daily: 'தினசரி',
      weekly: 'வாராந்திர',
      monthly: 'மாதாந்திர'
    },
    recentReports: 'சமீபத்திய அறிக்கைகள்',
    reportHistory: 'அறிக்கை வரலாறு',
    download: 'பதிவிறக்கம்',
    view: 'பார்க்கவும்',
    delete: 'நீக்கவும்',
    reportGenerated: 'அறிக்கை வெற்றிகரமாக உருவாக்கப்பட்டது!',
    reportScheduled: 'அறிக்கை வெற்றிகரமாக திட்டமிடப்பட்டது!',
    templateSaved: 'டெம்ப்ளேட் வெற்றிகரமாக சேமிக்கப்பட்டது!',
    previewReport: 'அறிக்கை முன்னோட்டம்',
    saveTemplate: 'டெம்ப்ளேட்டாக சேமிக்கவும்',
    templates: 'சேமிக்கப்பட்ட டெம்ப்ளேட்கள்',
    quickTemplates: 'விரைவு டெம்ப்ளேட்கள்',
    performanceTemplate: 'செயல்திறன் சுருக்கம்',
    serviceTemplate: 'சேவை பகுப்பாய்வு',
    operationalTemplate: 'செயல்பாட்டு அறிக்கை'
  }
};

interface ReportGeneratorProps {
  language?: Language;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ language = 'en' }) => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: '',
    type: 'performance',
    format: 'pdf',
    period: 'weekly',
    startDate: '',
    endDate: '',
    includeCharts: true,
    includeComparisons: true,
    includeDetails: false,
    recipients: [],
    schedule: 'once'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'custom' | 'history'>('quick');
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const t = reportTranslations[language];

  // Fetch real report data from backend
  // Fetch real report data from backend
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const historyResponse = await fetch('/api/agent/analytics/reports?action=getHistory', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setRecentReports(historyData.data.recentReports || []);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReportData();
  }, []);

  const handleConfigChange = <K extends keyof ReportConfig>(
    key: K,
    value: ReportConfig[K]
  ) => {
    setReportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/agent/analytics/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: reportConfig.schedule === 'once' ? 'generateReport' : 'scheduleReport',
          reportConfig
        })
      });

      if (response.ok) {
        await response.json();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Refresh report history
        await fetchReportData();
      } else {
        console.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickReport = async (reportType: ReportType = 'performance') => {
    try {
      setIsGenerating(true);
      const quickConfig = {
        title: `Quick ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        type: reportType,
        format: 'pdf' as ReportFormat,
        period: 'weekly' as ReportPeriod,
        includeCharts: true,
        includeComparisons: true,
        includeDetails: false
      };

      const response = await fetch('/api/agent/analytics/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'generateReport',
          reportConfig: quickConfig
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Refresh report history
        await fetchReportData();
      }
    } catch (error) {
      console.error('Error generating quick report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const inputStyles = "w-full bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-[#FFC72C] transition-all duration-300 shadow-md hover:shadow-lg modern-card";
  const labelStyles = "block text-sm font-medium text-foreground mb-2";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language === 'si' ? 'si-LK' : 'ta-LK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-[#008060]/20 border border-[#008060]/30 text-[#008060] p-4 rounded-xl animate-fade-in-up flex items-center gap-3 shadow-glow modern-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-medium">{t.reportGenerated}</span>
        </div>
      )}

      {/* Tab Navigation - EXACT SAME pattern as other components */}
      <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-2 rounded-2xl border border-border/50 shadow-glow modern-card">
        <div className="flex">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'quick'
                ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            {t.quickReports}
          </button>
          
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'custom'
                ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            {t.customReport}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {t.reportHistory}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'quick' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Template Cards - EXACT SAME styling as DashboardCard */}
            <div className="group relative bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:border-[#FFC72C]/70 hover:shadow-2xl hover-lift cursor-pointer modern-card flex flex-col h-full min-h-[240px]"
                 onClick={() => handleQuickReport('performance')}>
              <div className="p-6 flex flex-col h-full">
                {/* Icon Container */}
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-500 flex-shrink-0"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255, 199, 44, 0.1) 0%, rgba(255, 87, 34, 0.05) 50%, rgba(141, 21, 58, 0.08) 100%)',
                       border: '2px solid rgba(255, 199, 44, 0.3)',
                     }}>
                  <div className="text-2xl text-[#FFC72C] group-hover:text-[#FF5722] transition-all duration-500 group-hover:scale-110">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  </div>
                  
                  {/* Success Badge */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/15 via-transparent to-[#FF5722]/15 rounded-2xl blur-xl"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div className="mb-3 flex-shrink-0">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-[#FFC72C] transition-colors duration-300 leading-tight">
                      {t.performanceTemplate}
                    </h3>
                  </div>
                  
                  <div className="mb-4 flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Weekly performance metrics
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    disabled={isGenerating}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-lg hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl"
                  >
                    {isGenerating ? t.generating : t.generateNow}
                  </button>
                </div>
              </div>

              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
              </div>
            </div>

            <div className="group relative bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:border-[#008060]/70 hover:shadow-2xl hover-lift cursor-pointer modern-card flex flex-col h-full min-h-[240px]"
                 onClick={() => handleQuickReport('service')}>
              <div className="p-6 flex flex-col h-full">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-500 flex-shrink-0"
                     style={{
                       background: 'linear-gradient(135deg, rgba(0, 128, 96, 0.1) 0%, rgba(255, 199, 44, 0.05) 50%, rgba(141, 21, 58, 0.08) 100%)',
                       border: '2px solid rgba(0, 128, 96, 0.3)',
                     }}>
                  <div className="text-2xl text-[#008060] group-hover:text-[#FFC72C] transition-all duration-500 group-hover:scale-110">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      <path d="M13 8H7"/>
                      <path d="M17 12H7"/>
                    </svg>
                  </div>
                  
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>

                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#008060]/15 via-transparent to-[#FFC72C]/15 rounded-2xl blur-xl"></div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="mb-3 flex-shrink-0">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-[#008060] transition-colors duration-300 leading-tight">
                      {t.serviceTemplate}
                    </h3>
                  </div>
                  
                  <div className="mb-4 flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Service usage analysis
                    </p>
                  </div>

                  <button
                    disabled={isGenerating}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] text-white rounded-lg hover:from-[#FFC72C] hover:to-[#FF5722] transition-all duration-300 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl"
                  >
                    {isGenerating ? t.generating : t.generateNow}
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#008060]/5 via-transparent to-[#FFC72C]/5 rounded-2xl"></div>
              </div>
            </div>

            <div className="group relative bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:border-[#FF5722]/70 hover:shadow-2xl hover-lift cursor-pointer modern-card flex flex-col h-full min-h-[240px]"
                 onClick={() => handleQuickReport('operational')}>
              <div className="p-6 flex flex-col h-full">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-500 flex-shrink-0"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.1) 0%, rgba(141, 21, 58, 0.05) 50%, rgba(255, 199, 44, 0.08) 100%)',
                       border: '2px solid rgba(255, 87, 34, 0.3)',
                     }}>
                  <div className="text-2xl text-[#FF5722] group-hover:text-[#8D153A] transition-all duration-500 group-hover:scale-110">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FF5722] to-[#8D153A] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>

                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/15 via-transparent to-[#8D153A]/15 rounded-2xl blur-xl"></div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="mb-3 flex-shrink-0">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-[#FF5722] transition-colors duration-300 leading-tight">
                      {t.operationalTemplate}
                    </h3>
                  </div>
                  
                  <div className="mb-4 flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Operational summary
                    </p>
                  </div>

                  <button
                    disabled={isGenerating}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#FF5722] to-[#8D153A] text-white rounded-lg hover:from-[#8D153A] hover:to-[#FF5722] transition-all duration-300 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl"
                  >
                    {isGenerating ? t.generating : t.generateNow}
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/5 via-transparent to-[#8D153A]/5 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); handleGenerateReport(); }} className="space-y-6">
            {/* Report Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className={labelStyles}>Report Title</label>
                  <input
                    type="text"
                    value={reportConfig.title}
                    onChange={(e) => handleConfigChange('title', e.target.value)}
                    placeholder="Enter report title..."
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className={labelStyles}>{t.reportType}</label>
                  <select
                    value={reportConfig.type}
                    onChange={(e) => handleConfigChange('type', e.target.value as ReportType)}
                    className={inputStyles}
                  >
                    {Object.entries(t.reportTypes).map(([key, label]) => (
                      <option key={key} value={key} className="bg-card text-foreground">{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyles}>{t.reportFormat}</label>
                  <select
                    value={reportConfig.format}
                    onChange={(e) => handleConfigChange('format', e.target.value as ReportFormat)}
                    className={inputStyles}
                  >
                    {Object.entries(t.formats).map(([key, label]) => (
                      <option key={key} value={key} className="bg-card text-foreground">{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyles}>{t.timePeriod}</label>
                  <select
                    value={reportConfig.period}
                    onChange={(e) => handleConfigChange('period', e.target.value as ReportPeriod)}
                    className={inputStyles}
                  >
                    {Object.entries(t.periods).map(([key, label]) => (
                      <option key={key} value={key} className="bg-card text-foreground">{label}</option>
                    ))}
                  </select>
                </div>

                {reportConfig.period === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyles}>{t.startDate}</label>
                      <input
                        type="date"
                        value={reportConfig.startDate}
                        onChange={(e) => handleConfigChange('startDate', e.target.value)}
                        className={inputStyles}
                      />
                    </div>
                    <div>
                      <label className={labelStyles}>{t.endDate}</label>
                      <input
                        type="date"
                        value={reportConfig.endDate}
                        onChange={(e) => handleConfigChange('endDate', e.target.value)}
                        className={inputStyles}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">{t.reportOptions}</h4>
                  <div className="space-y-4">
                    {[
                      { key: 'includeCharts', label: t.includeCharts },
                      { key: 'includeComparisons', label: t.includeComparisons },
                      { key: 'includeDetails', label: t.includeDetailedData }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center justify-between p-3 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl cursor-pointer hover:bg-card/80 dark:hover:bg-card/90 transition-all duration-300 shadow-md hover:shadow-lg modern-card">
                        <span className="font-medium text-foreground">{label}</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={reportConfig[key as keyof ReportConfig] as boolean}
                            onChange={(e) => handleConfigChange(key as keyof ReportConfig, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                            reportConfig[key as keyof ReportConfig]
                              ? 'bg-gradient-to-r from-[#FFC72C] to-[#FF5722]'
                              : 'bg-muted/50'
                          }`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                              reportConfig[key as keyof ReportConfig]
                                ? 'translate-x-6'
                                : 'translate-x-0.5'
                            } mt-0.5`}></div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">{t.emailSettings}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className={labelStyles}>{t.recipients}</label>
                      <input
                        type="email"
                        placeholder="Enter email addresses separated by commas"
                        className={inputStyles}
                      />
                    </div>

                    <div>
                      <label className={labelStyles}>{t.deliverySchedule}</label>
                      <select
                        value={reportConfig.schedule}
                        onChange={(e) => handleConfigChange('schedule', e.target.value as ReportSchedule)}
                        className={inputStyles}
                      >
                        {Object.entries(t.schedules).map(([key, label]) => (
                          <option key={key} value={key} className="bg-card text-foreground">{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-end pt-6 border-t border-border/30">
              <button
                type="button"
                className="px-6 py-3 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C]/60 transition-all duration-300 shadow-md hover:shadow-lg modern-card"
              >
                {t.previewReport}
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-card/60 dark:bg-card/80 backdrop-blur-md border border-border/50 rounded-xl text-foreground hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C]/60 transition-all duration-300 shadow-md hover:shadow-lg modern-card"
              >
                {t.saveTemplate}
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-8 py-3 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] text-white rounded-xl hover:from-[#FF5722] hover:to-[#8D153A] transition-all duration-300 font-semibold hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {t.generating}
                  </div>
                ) : reportConfig.schedule === 'once' ? t.generateNow : t.scheduleReport}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC72C]"></div>
            </div>
          ) : recentReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-muted/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Reports Yet</h3>
              <p className="text-muted-foreground">Generate your first report to see it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-6 bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/50 rounded-xl hover:bg-card/80 dark:hover:bg-card/90 hover:border-[#FFC72C]/60 transition-all duration-300 shadow-glow hover:shadow-2xl modern-card">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-[#008060]/10 to-[#FFC72C]/10 rounded-xl">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{report.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{t.reportTypes[report.type as ReportType]}</span>
                          <span>•</span>
                          <span>{report.format.toUpperCase()}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                          <span>•</span>
                          <span>{formatDate(report.generatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="p-2 bg-[#008060]/10 text-[#008060] rounded-lg hover:bg-[#008060]/20 transition-all duration-300 hover:scale-105">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </button>
                      <button className="p-2 bg-[#FFC72C]/10 text-[#FFC72C] rounded-lg hover:bg-[#FFC72C]/20 transition-all duration-300 hover:scale-105">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button className="p-2 bg-[#FF5722]/10 text-[#FF5722] rounded-lg hover:bg-[#FF5722]/20 transition-all duration-300 hover:scale-105">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;