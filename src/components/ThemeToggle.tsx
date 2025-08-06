// components/ThemeToggle.tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const createThemeRipple = (event: React.MouseEvent<HTMLButtonElement>, isDark: boolean) => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  
  // Get the center point of the button relative to the viewport
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Create the ripple overlay
  const rippleOverlay = document.createElement("div");
  rippleOverlay.className = "theme-ripple-overlay";
  
  // Calculate the maximum distance to cover the entire screen
  const maxDistance = Math.sqrt(
    Math.pow(Math.max(centerX, window.innerWidth - centerX), 2) +
    Math.pow(Math.max(centerY, window.innerHeight - centerY), 2)
  ) * 2;
  
  // Set up the ripple styles
  rippleOverlay.style.cssText = `
    position: fixed;
    top: ${centerY}px;
    left: ${centerX}px;
    width: 0px;
    height: 0px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    background: ${isDark 
      ? 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0.6) 60%, rgba(255, 255, 255, 0.3) 80%, transparent 100%)'
      : 'radial-gradient(circle, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.8) 30%, rgba(8, 8, 8, 0.6) 60%, rgba(8, 8, 8, 0.3) 80%, transparent 100%)'
    };
    animation: themeRippleExpand 1.0s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  `;
  
  // Add keyframes for the ripple animation
  if (!document.querySelector('#theme-ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'theme-ripple-styles';
    style.textContent = `
      @keyframes themeRippleExpand {
        0% {
          width: 0px;
          height: 0px;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0);
        }
        15% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(0.1);
        }
        100% {
          width: ${maxDistance}px;
          height: ${maxDistance}px;
          opacity: 0;
          transform: translate(-50%, -50%) scale(1);
        }
      }
      
      @keyframes buttonRipple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(3);
          opacity: 0;
        }
      }
      
      @keyframes iconSpin {
        0% { 
          transform: rotate(0deg) scale(1);
          filter: brightness(1);
        }
        50% { 
          transform: rotate(180deg) scale(0.85);
          filter: brightness(1.3);
        }
        100% { 
          transform: rotate(360deg) scale(1);
          filter: brightness(1);
        }
      }
      
      @keyframes buttonPulse {
        0% { 
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 199, 44, 0.8);
        }
        50% { 
          transform: scale(1.08);
          box-shadow: 0 0 0 8px rgba(255, 199, 44, 0);
        }
        100% { 
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 199, 44, 0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to document
  document.body.appendChild(rippleOverlay);
  
  // Clean up after animation
  setTimeout(() => {
    if (rippleOverlay.parentNode) {
      rippleOverlay.parentNode.removeChild(rippleOverlay);
    }
  }, 800);
  
  // Create button-specific ripple effect
  const buttonRipple = document.createElement("span");
  const buttonRect = button.getBoundingClientRect();
  const size = Math.max(buttonRect.width, buttonRect.height);
  const x = event.clientX - buttonRect.left - size / 2;
  const y = event.clientY - buttonRect.top - size / 2;

  buttonRipple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: ${isDark 
      ? 'rgba(255, 255, 255, 0.7)' 
      : 'rgba(255, 199, 44, 0.7)'
    };
    transform: scale(0);
    animation: buttonRipple 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    pointer-events: none;
  `;

  button.appendChild(buttonRipple);

  setTimeout(() => {
    if (buttonRipple.parentNode) {
      buttonRipple.parentNode.removeChild(buttonRipple);
    }
  }, 400);
};

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  
  React.useEffect(() => setMounted(true), []);

  const effective = mounted ? (theme === "system" ? systemTheme : theme) : undefined;
  const isDark = effective === "dark";

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;
    
    createThemeRipple(event, isDark);
    setIsAnimating(true);
    
    // Start the theme change faster to sync with animation
    setTimeout(() => {
      setTheme(isDark ? "light" : "dark");
    }, 150);
    
    // Reset animation state faster
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isAnimating}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative overflow-hidden glass-morphism rounded-full border transition-all duration-200 group
        ${isAnimating 
          ? 'scale-108 cursor-not-allowed' 
          : 'hover:scale-105 active:scale-95 cursor-pointer hover:shadow-2xl'
        }
      `}
      style={{
        padding: '8px sm:10px',
        background: isDark 
          ? 'linear-gradient(135deg, rgba(255, 199, 44, 0.1) 0%, rgba(255, 87, 34, 0.05) 100%)' 
          : 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(30, 58, 138, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: `2px solid ${isDark 
          ? 'rgba(255, 199, 44, 0.3)' 
          : 'rgba(30, 64, 175, 0.3)'
        }`,
        boxShadow: isDark 
          ? '0 6px 24px rgba(255, 199, 44, 0.15), 0 0 16px rgba(255, 199, 44, 0.08)' 
          : '0 6px 24px rgba(30, 64, 175, 0.15), 0 0 16px rgba(30, 64, 175, 0.08)',
        animation: isAnimating ? "buttonPulse 0.8s cubic-bezier(0.23, 1, 0.32, 1)" : "none",
      }}
    >
      <div
        className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full transition-all duration-500"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #FFC72C 0%, #FF5722 100%)' 
            : 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          animation: isAnimating ? "iconSpin 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
          boxShadow: isDark
            ? '0 3px 16px rgba(255, 199, 44, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.15)'
            : '0 3px 16px rgba(30, 64, 175, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.2)',
        }}
      >
        {isDark ? (
          // Sun Icon - Mobile Responsive
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] drop-shadow-lg filter brightness-110"
          >
            <circle cx="12" cy="12" r="4" fill="white" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
          </svg>
        ) : (
          // Moon Icon - Mobile Responsive
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="white" 
            className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] drop-shadow-lg filter brightness-110"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </div>
      
      {/* Animated background glow */}
      <div 
        className={`
          absolute inset-0 rounded-full opacity-0 transition-all duration-500 pointer-events-none
          ${isAnimating ? 'opacity-100' : 'group-hover:opacity-60'}
        `}
        style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(255, 199, 44, 0.4) 0%, rgba(255, 87, 34, 0.2) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(30, 64, 175, 0.4) 0%, rgba(30, 58, 138, 0.2) 40%, transparent 70%)',
          filter: 'blur(12px)',
          animation: isAnimating ? "buttonPulse 1.2s ease-in-out" : "none",
        }}
      />
      
      {/* Sparkle effects */}
      <div className={`absolute inset-0 rounded-full pointer-events-none overflow-hidden ${isAnimating ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${25 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>
    </button>
  );
}