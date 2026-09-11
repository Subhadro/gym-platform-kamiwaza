import React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "subtle" | "glow" | "elevated";
  className?: string;
}

export function GlassCard({
  children,
  variant = "default",
  className,
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl shadow-xl shadow-black/20",
    subtle: "bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-md",
    glow: "bg-zinc-900/70 border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(16,185,129,0.12)]",
    elevated: "bg-zinc-900/80 border border-zinc-700/80 backdrop-blur-2xl shadow-2xl shadow-black/40",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
