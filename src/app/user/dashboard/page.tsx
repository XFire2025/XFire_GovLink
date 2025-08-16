// src/app/user/dashboard/page.tsx
"use client";
import { useState } from 'react';
import UserDashboardLayout from '@/components/user/dashboard/UserDashboardLayout';
import { useAuth } from '@/lib/auth/AuthContext';
import { CitizenProtectedRoute } from '@/lib/auth/ProtectedRoute';
import Link from 'next/link';

// Types
type Language = 'en' | 'si' | 'ta';

// Dashboard translations
const dashboardTranslations: Record<Language, {
  welcome: string;
  subtitle: string;
  overview: string;
  quickActions: string;
  services: {
    bookAppointment: {
      title: string;
      description: string;
    };
    submitApplication: {
      title: string;
      description: string;
    };
    liveSupport: {
      title: string;
      description: string;
    };
    trackStatus: {
      title: string;
      description: string;
    };
  };
  stats: {
    activeBookings: string;
    applications: string;
    messages: string;
    completed: string;
  };
}> = {
  en: {
    welcome: 'Citizen Dashboard',
    subtitle: 'Access government services and manage your applications',
    overview: 'Services Overview',
    quickActions: 'Quick Actions',
    services: {
      bookAppointment: {
        title: 'Book Appointment',
        description: 'Schedule meetings with government officers for various services and consultations.'
      },
      submitApplication: {
        title: 'Submit Application',
        description: 'Submit forms and applications for government services, permits, and documentation.'
      },
      liveSupport: {
        title: 'Live Support',
        description: 'Get real-time help and guidance for your government service inquiries.'
      },
      trackStatus: {
        title: 'Track Applications',
        description: 'Monitor the progress of your submitted applications and requests.'
      }
    },
    stats: {
      activeBookings: 'Active Bookings',
      applications: 'Applications',
      messages: 'Messages',
      completed: 'Completed'
    }
  },
  si: {
    welcome: 'පුරවැසි පාලනය',
    subtitle: 'රාජ්‍ය සේවා ප්‍රවේශ කිරීම සහ ඔබගේ අයදුම්පත් කළමනාකරණය',
    overview: 'සේවා දළ විශ්ලේෂණය',
    quickActions: 'ඉක්මන් ක්‍රියා',
    services: {
      bookAppointment: {
        title: 'සකස්කිරීම්',
        description: 'විවිධ සේවා සහ උපදේශන සඳහා රජයේ නිලධාරීන් සමඟ හමුවීම් සැකසීම.'
      },
      submitApplication: {
        title: 'අයදුම්පත් ඉදිරිපත් කරන්න',
        description: 'රජයේ සේවා, බලපත්‍ර සහ ලේඛනකරණය සඳහා ආකෘති සහ අයදුම්පත් ඉදිරිපත් කරන්න.'
      },
      liveSupport: {
        title: 'සජීවී සහාය',
        description: 'ඔබගේ රජයේ සේවා විමසීම් සඳහා තත්‍ය කාලීන උදව් සහ මඟ පෙන්වීම ලබා ගන්න.'
      },
      trackStatus: {
        title: 'අයදුම්පත් සොයන්න',
        description: 'ඔබ ඉදිරිපත් කළ අයදුම්පත් සහ ඉල්ලීම්වල ප්‍රගතිය නිරීක්ෂණය කරන්න.'
      }
    },
    stats: {
      activeBookings: 'ක්‍රියාකාරී වෙන්කිරීම්',
      applications: 'අයදුම්පත්',
      messages: 'පණිවිඩ',
      completed: 'සම්පූර්ණ'
    }
  },
  ta: {
    welcome: 'குடிமக்கள் டாஷ்போர்டு',
    subtitle: 'அரசு சேவைகளை அணுகி உங்கள் விண்ணப்பங்களை நிர்வகிக்கவும்',
    overview: 'சேவைகள் கண்ணோட்டம்',
    quickActions: 'விரைவு நடவடிக்கைகள்',
    services: {
      bookAppointment: {
        title: 'சந்திப்பு முன்பதிவு',
        description: 'பல்வேறு சேவைகள் மற்றும் ஆலோசனைகளுக்காக அரசு அதிகாரிகளுடன் சந்திப்புகளை திட்டமிடுங்கள்.'
      },
      submitApplication: {
        title: 'விண்ணப்பம் சமர்ப்பிக்கவும்',
        description: 'அரசு சேவைகள், அனுமதிகள் மற்றும் ஆவணங்களுக்கான படிவங்கள் மற்றும் விண்ணப்பங்களை சமர்ப்பிக்கவும்.'
      },
      liveSupport: {
        title: 'நேரடி ஆதரவு',
        description: 'உங்கள் அரசு சேவை விசாரணைகளுக்கு நிகழ்நேர உதவி மற்றும் வழிகாட்டுதலைப் பெறுங்கள்.'
      },
      trackStatus: {
        title: 'விண்ணப்பங்களைக் கண்காணிக்கவும்',
        description: 'உங்கள் சமர்ப்பித்த விண்ணப்பங்கள் மற்றும் கோரிக்கைகளின் முன்னேற்றத்தைக் கண்காணிக்கவும்.'
      }
    },
    stats: {
      activeBookings: 'செயலில் முன்பதிவுகள்',
      applications: 'விண்ணப்பங்கள்',
      messages: 'செய்திகள்',
      completed: 'முடிக்கப்பட்டது'
    }
  }
};

// Stats Card Component
interface StatCard {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: string;
}

const StatsOverview = ({ language = 'en' }: { language: Language }) => {
  const t = dashboardTranslations[language];

  const stats: StatCard[] = [
    {
      id: 'bookings',
      value: '3',
      label: t.stats.activeBookings,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      color: '#FF5722',
      bgColor: 'from-[#FF5722]/10 to-[#FF5722]/5',
      trend: '+2'
    },
    {
      id: 'applications',
      value: '7',
      label: t.stats.applications,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      color: '#FFC72C',
      bgColor: 'from-[#FFC72C]/10 to-[#FFC72C]/5',
      trend: '+1'
    },
    {
      id: 'messages',
      value: '12',
      label: t.stats.messages,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      color: '#008060',
      bgColor: 'from-[#008060]/10 to-[#008060]/5',
      trend: '+5'
    },
    {
      id: 'completed',
      value: '24',
      label: t.stats.completed,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ),
      color: '#8D153A',
      bgColor: 'from-[#8D153A]/10 to-[#8D153A]/5',
      trend: '+3'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
      {stats.map((stat, index) => (
        <div 
          key={stat.id} 
          className="group bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-glow transition-all duration-500 hover:shadow-2xl hover-lift animate-fade-in-up modern-card relative overflow-hidden"
          style={{ animationDelay: `${0.1 * (index + 1)}s` }}
        >
          {/* Header with Icon */}
          <div className="flex items-center justify-between mb-4">
            <div 
              className={`relative p-3 rounded-xl bg-gradient-to-r ${stat.bgColor} transition-all duration-500 group-hover:scale-110`}
              style={{ border: `2px solid ${stat.color}30` }}
            >
              <div style={{color: stat.color}} className="transition-all duration-300 group-hover:scale-110">
                {stat.icon}
              </div>
            </div>
            
            {stat.trend && (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border text-[#008060] bg-[#008060]/10 border-[#008060]/20 transition-all duration-300 hover:scale-105">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17l10-10"/>
                  <path d="M17 7h-10v10"/>
                </svg>
                <span>{stat.trend}</span>
              </div>
            )}
          </div>

          {/* Stats Value */}
          <div className="mb-2">
            <div 
              className="text-3xl sm:text-4xl font-bold transition-all duration-500 group-hover:scale-105" 
              style={{color: stat.color}}
            >
              {stat.value}
            </div>
          </div>

          {/* Stats Label */}
          <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-tight">
            {stat.label}
          </div>

          {/* Hover Effect Gradient */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{ background: `radial-gradient(circle at center, ${stat.color}05 0%, transparent 70%)` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Service Card Component
interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  animationDelay: string;
}

const ServiceCard = ({ title, description, href, icon, animationDelay }: ServiceCardProps) => (
  <Link href={href}>
    <div 
      className="group relative bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow transition-all duration-500 animate-fade-in-up modern-card hover:border-[#FFC72C]/70 hover:shadow-2xl hover-lift cursor-pointer p-6 h-full min-h-[280px] flex flex-col"
      style={{animationDelay}}
    >
      {/* Icon Container */}
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-500 flex-shrink-0"
           style={{
             background: 'linear-gradient(135deg, rgba(255, 199, 44, 0.1) 0%, rgba(255, 87, 34, 0.05) 50%, rgba(141, 21, 58, 0.08) 100%)',
             border: `2px solid rgba(255, 199, 44, 0.3)`,
           }}
      >
        <div className="text-2xl transition-all duration-500 text-[#FFC72C] group-hover:text-[#FF5722] group-hover:scale-110">
          {icon}
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
        {/* Title */}
        <div className="mb-3 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold transition-colors duration-300 leading-tight text-foreground group-hover:text-[#FFC72C]">
            {title}
          </h3>
        </div>
        
        {/* Description */}
        <div className="mb-4 flex-1">
          <p className="leading-relaxed text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Action Indicator */}
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground group-hover:text-[#FFC72C] transition-all duration-300 mt-auto">
          <span>Access Service</span>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform duration-300"
          >
            <path d="M5 12h14"/>
            <path d="M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
      </div>
    </div>
  </Link>
);

export default function UserDashboardPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const { user } = useAuth();
  
  const t = dashboardTranslations[currentLanguage];

  const handleLanguageChange = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  return (
    <CitizenProtectedRoute>
      <UserDashboardLayout
        title={
          <span className="animate-title-wave">
            <span className="text-foreground">{t.welcome.split(' ')[0]}</span>{' '}
            <span className="text-gradient">
              {user?.firstName || user?.email?.split('@')[0] || 'User'}
            </span>
          </span>
        }
        subtitle={`Welcome to GovLink, ${user?.firstName || 'Citizen'}! ${t.subtitle}`}
        language={currentLanguage}
        onLanguageChange={handleLanguageChange}
      >
      <div className="space-y-12">
        {/* Profile Completion Banner */}
        {user && !user.isProfileComplete && (
          <section className="animate-fade-in-up">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                    Complete your profile to access all government services. Your profile is {user.profileCompletionPercentage}% complete.
                  </p>
                  <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${user.profileCompletionPercentage}%` }}
                    ></div>
                  </div>
                  <Link 
                    href="/user/profile?complete=true"
                    className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Complete Profile
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Account Status Banner */}
        {user && user.accountStatus !== 'active' && (
          <section className="animate-fade-in-up">
            <div className={`border rounded-2xl p-6 shadow-lg ${
              user.accountStatus === 'pending' 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  user.accountStatus === 'pending' ? 'bg-blue-500' : 'bg-red-500'
                }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    user.accountStatus === 'pending' 
                      ? 'text-blue-800 dark:text-blue-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    Account {user.accountStatus === 'pending' ? 'Pending Verification' : 'Issue'}
                  </h3>
                  <p className={`${
                    user.accountStatus === 'pending' 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {user.accountStatus === 'pending' 
                      ? 'Your account is pending verification. Some services may be limited until verification is complete.'
                      : 'There is an issue with your account. Please contact support for assistance.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick Stats Overview */}
        <section>
          <div className="mb-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
              <div className="w-2 h-2 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-foreground">{t.overview}</span>
            </div>
          </div>
          <StatsOverview language={currentLanguage} />
        </section>

        {/* Main Services Grid */}
        <section>
          <div className="mb-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="inline-flex items-center gap-2 bg-card/90 dark:bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-4 modern-card">
              <div className="w-2 h-2 bg-gradient-to-r from-[#008060] to-[#FFC72C] rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-foreground">{t.quickActions}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <ServiceCard
              title={t.services.bookAppointment.title}
              description={t.services.bookAppointment.description}
              href="/user/booking"
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              }
              color="#FF5722"
              animationDelay="0.1s"
            />

            <ServiceCard
              title={t.services.submitApplication.title}
              description={t.services.submitApplication.description}
              href="/User/Submission"
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              }
              color="#FFC72C"
              animationDelay="0.2s"
            />

            <ServiceCard
              title={t.services.liveSupport.title}
              description={t.services.liveSupport.description}
              href="/User/Chat/Bot"
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="11" r="1"/>
                  <circle cx="8" cy="11" r="1"/>
                  <circle cx="16" cy="11" r="1"/>
                </svg>
              }
              color="#008060"
              animationDelay="0.3s"
            />

            <ServiceCard
              title={t.services.trackStatus.title}
              description={t.services.trackStatus.description}
              href="/User/Submission"
              icon={
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              }
              color="#8D153A"
              animationDelay="0.4s"
            />
          </div>
        </section>

        {/* Welcome Message */}
        <section className="animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <div className="bg-card/90 dark:bg-card/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-glow border border-border/50 hover:border-[#FFC72C]/50 hover:shadow-2xl transition-all duration-500 modern-card group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center mx-auto mb-4 animate-glow group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-[#FFC72C] transition-colors duration-300">
                Welcome, Sanduni Perera
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Citizen ID: 199512345678
              </p>
              
              {/* Status Indicators */}
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#008060]/10 text-[#008060] rounded-full text-xs font-medium border border-[#008060]/20">
                  <div className="w-2 h-2 bg-[#008060] rounded-full animate-pulse"></div>
                  <span>Account Verified</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFC72C]/10 text-[#FFC72C] rounded-full text-xs font-medium border border-[#FFC72C]/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  <span>Profile Complete</span>
                </div>
              </div>
            </div>
            
            {/* Hover Effect Gradient */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
            </div>
          </div>
        </section>
      </div>
    </UserDashboardLayout>
    </CitizenProtectedRoute>
  );
}