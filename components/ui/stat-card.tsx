import React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: "emerald" | "blue" | "amber" | "rose" | "purple";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent = "emerald",
  className,
}: StatCardProps) {
  const accentGlow = {
    emerald: "from-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500/40",
    blue: "from-blue-500/10 border-blue-500/20 text-blue-400 group-hover:border-blue-500/40",
    amber: "from-amber-500/10 border-amber-500/20 text-amber-400 group-hover:border-amber-500/40",
    rose: "from-rose-500/10 border-rose-500/20 text-rose-400 group-hover:border-rose-500/40",
    purple: "from-purple-500/10 border-purple-500/20 text-purple-400 group-hover:border-purple-500/40",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 border bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
        accentGlow[accent],
        className
      )}
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br opacity-20 blur-xl pointer-events-none rounded-full" />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/50 shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}
