"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loadingText?: string;
  variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost" | "emerald" | "glow";
  size?: "sm" | "default" | "lg";
  icon?: React.ReactNode;
  isLoading?: boolean; // Optional override when not using form status
}

export function SubmitButton({
  children,
  loadingText,
  variant = "primary",
  size = "default",
  icon,
  isLoading: manualLoading,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const loading = manualLoading ?? pending;

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30",
    emerald:
      "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20",
    glow:
      "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.35)]",
    secondary:
      "bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-100 border border-zinc-700/60",
    outline:
      "border border-zinc-700/80 hover:border-emerald-500/50 bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-200",
    destructive:
      "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50",
    ghost:
      "hover:bg-zinc-800/60 text-zinc-300 hover:text-white",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    default: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base rounded-xl gap-2.5",
  };

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
          <span>{loadingText ?? "Processing..."}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
