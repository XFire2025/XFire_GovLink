// src/components/department/CustomMultiSelect.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronsUpDown, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Assuming badge is acceptable as it's just a styled div. If not, we can replace it.

interface Option {
  value: string;
  label: string;
}

interface CustomMultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export default function CustomMultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options..."
}: CustomMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter(option => selectedValues.includes(option.value));

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left p-2.5 bg-card/50 border border-border/50 rounded-xl hover:border-[#008060]/50 transition-all duration-300"
      >
        <div className="flex flex-wrap gap-1 items-center min-h-[24px]">
          {selectedOptions.length > 0
            ? selectedOptions.map(option => (
                <Badge key={option.value} variant="secondary" className="bg-[#008060]/20 text-[#008060] border-transparent">
                  {option.label}
                </Badge>
              ))
            : <span className="text-muted-foreground ml-2">{placeholder}</span>}
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {/* Popover Content */}
      {isOpen && (
        <div className="absolute z-10 top-full mt-2 w-full glass-morphism rounded-xl border border-border/50 shadow-glow animate-fade-in-up">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card/70 border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#008060]"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    className="w-full flex items-center text-left p-2 rounded-md text-sm hover:bg-muted/50"
                  >
                    <div className={`w-4 h-4 mr-2 flex items-center justify-center border-2 rounded ${selectedValues.includes(option.value) ? 'bg-[#008060] border-[#008060]' : 'border-muted-foreground'}`}>
                      {selectedValues.includes(option.value) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {option.label}
                  </button>
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-sm text-muted-foreground">No results found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}