"use client";
import React from 'react';

interface Option { value: string; label: string; }

export interface SelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
  hideLabel?: boolean;
}

const ChevronDownIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required,
  disabled,
  helperText,
  className = '',
  hideLabel
}) => {
  const selectId = id || name || label || 'select-' + Math.random().toString(36).slice(2);
  return (
    <div className={`space-y-2 ${className}`}>
      {!hideLabel && label && (
        <label htmlFor={selectId} className="text-sm font-medium text-foreground flex items-center gap-1">
          {label}{required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border bg-card/40 border-border/50 focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/30 appearance-none pr-10 text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all outline-none"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDownIcon className="w-5 h-5 text-[#FFC72C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
};

export default SelectField;
