// src/components/department/CustomBadge.tsx
import React from 'react';

interface CustomBadgeProps {
  children: React.ReactNode;
  className?: string;
}

const CustomBadge: React.FC<CustomBadgeProps> = ({ children, className }) => {
  // Base styles for the badge, consistent with the rest of the app
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  // Specific styles for a "secondary" variant, matching shadcn's visual
  const secondaryStyles = "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80";

  return (
    <span className={`${baseStyles} ${secondaryStyles} ${className}`}>
      {children}
    </span>
  );
};

export default CustomBadge;