// src/components/agent/dashboard/DashboardCard.tsx
"use client";
import React from 'react';
import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string;
  badgeColor?: 'primary' | 'success' | 'warning' | 'info';
  animationDelay?: string;
  disabled?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  href,
  onClick,
  badge,
  badgeColor = 'primary',
  animationDelay = '0s',
  disabled = false
}) => {
  const getBadgeColors = (color: string) => {
    switch (color) {
      case 'success':
        return 'bg-[#008060]/20 text-[#008060] border-[#008060]/30';
      case 'warning':
        return 'bg-[#FFC72C]/20 text-[#FFC72C] border-[#FFC72C]/30';
      case 'info':
        return 'bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/30';
      default:
        return 'bg-[#FFC72C]/20 text-[#FFC72C] border-[#FFC72C]/30';
    }
  };

  const cardContent = (
    <div 
      className={`
        group relative bg-card/90 dark:bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-glow transition-all duration-500 animate-fade-in-up modern-card flex flex-col h-full min-h-[240px] sm:min-h-[260px] lg:min-h-[280px]
        ${disabled
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:border-[#FFC72C]/70 hover:shadow-2xl hover-lift cursor-pointer'
        }
      `}
      style={{animationDelay}}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getBadgeColors(badgeColor)} animate-pulse`}>
            {badge}
          </span>
        </div>
      )}

      {/* Card Content Container */}
      <div className="p-4 sm:p-6 flex flex-col h-full">
        {/* Icon Container */}
        <div className="relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl mb-4 transition-all duration-500 flex-shrink-0"
             style={{
               background: disabled 
                 ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
                 : 'linear-gradient(135deg, rgba(255, 199, 44, 0.1) 0%, rgba(255, 87, 34, 0.05) 50%, rgba(141, 21, 58, 0.08) 100%)',
               border: `2px solid ${disabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 199, 44, 0.3)'}`,
             }}
        >
          <div className={`text-2xl sm:text-3xl transition-all duration-500 ${
            disabled 
              ? 'text-muted-foreground' 
              : 'text-[#FFC72C] group-hover:text-[#FF5722] group-hover:scale-110'
          }`}>
            {icon}
          </div>
          
          {/* Success Badge for interactive cards */}
          {!disabled && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FFC72C] to-[#FF5722] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-lg">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          )}

          {/* Glow Effect */}
          {!disabled && (
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/15 via-transparent to-[#FF5722]/15 rounded-2xl blur-xl"></div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Title */}
          <div className="mb-3 flex-shrink-0">
            <h3 className={`text-lg sm:text-xl font-bold transition-colors duration-300 leading-tight min-h-[2.5rem] sm:min-h-[3rem] flex items-start break-words hyphens-auto ${
              disabled 
                ? 'text-muted-foreground' 
                : 'text-foreground group-hover:text-[#FFC72C]'
            }`}>
              {title}
            </h3>
          </div>
          
          {/* Description */}
          <div className="mb-4 flex-1">
            <p className={`leading-relaxed text-xs sm:text-sm min-h-[3rem] sm:min-h-[4rem] break-words hyphens-auto ${
              disabled 
                ? 'text-muted-foreground/60' 
                : 'text-muted-foreground'
            }`}>
              {description}
            </p>
          </div>

          {/* Action Indicator */}
          {!disabled && (
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground group-hover:text-[#FFC72C] transition-all duration-300 mt-auto">
              <span>Open</span>
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
          )}
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/5 via-transparent to-[#FF5722]/5 rounded-2xl"></div>
      </div>
      
      {/* Animated border glow */}
      <div className={`
        absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none
        ${!disabled ? 'group-hover:shadow-[0_0_30px_rgba(255,199,44,0.3)]' : ''}
      `}></div>
    </div>
  );

  if (href && !disabled) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
};

export default DashboardCard;