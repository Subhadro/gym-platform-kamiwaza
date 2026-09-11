import React from "react";
import type { GymStatus, VendorStatus } from "@/lib/types/db";
import { cn } from "@/lib/utils";

export type AnyStatus = VendorStatus | GymStatus | string;

export interface StatusBadgeProps {
  status: AnyStatus;
  size?: "sm" | "default" | "lg";
  showDot?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string; glow?: string }
> = {
  LIVE: {
    label: "Live",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  },
  APPROVED: {
    label: "Approved",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    border: "border-teal-500/30",
    dot: "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
  },
  PENDING: {
    label: "Pending Review",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
  },
  DRAFT: {
    label: "Draft",
    bg: "bg-zinc-800/80",
    text: "text-zinc-400",
    border: "border-zinc-700/60",
    dot: "bg-zinc-500",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
  },
};

export function StatusBadge({
  status,
  size = "default",
  showDot = true,
  className,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    bg: "bg-zinc-800/80",
    text: "text-zinc-300",
    border: "border-zinc-700",
    dot: "bg-zinc-400",
  };

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5",
    default: "text-xs px-2.5 py-1 gap-2",
    lg: "text-sm px-3.5 py-1.5 gap-2.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border shrink-0 transition-colors backdrop-blur-sm select-none",
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            config.dot
          )}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}
