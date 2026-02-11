"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: string;
  onDelete?: () => void;
}

export function Chip({
  selected = false,
  icon,
  onDelete,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg",
        "text-sm font-medium transition-all duration-200",
        "border",
        selected
          ? "bg-secondary-container text-on-secondary-container border-secondary-container"
          : "bg-transparent text-on-surface border-outline hover:bg-on-surface/8",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="material-symbols-rounded text-lg" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-1 -mr-2 p-2 rounded-full hover:bg-on-secondary-container/12 min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Remove"
        >
          <span className="material-symbols-rounded text-base" aria-hidden="true">
            close
          </span>
        </button>
      )}
    </button>
  );
}

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <div
      role="group"
      aria-label="Filter by product category"
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => (
        <Chip
          key={option.value}
          selected={selected === option.value}
          onClick={() => onSelect(option.value)}
          aria-pressed={selected === option.value}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
}
