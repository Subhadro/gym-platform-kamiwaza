"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dumbbell, MapPin, Building2, ArrowRight } from "lucide-react";
import type { GymStatus, GymSummary } from "@/types";

const ALL_TABS: GymStatus[] = ["DRAFT", "PENDING", "UNDER_REVIEW", "APPROVED", "LIVE", "REJECTED"];

export default function GymTabs({ gyms }: { gyms: GymSummary[] }) {
  const [active, setActive] = useState<GymStatus>("PENDING");

  const counts = ALL_TABS.reduce((acc, s) => {
    acc[s] = gyms.filter((g) => g.status === s).length;
    return acc;
  }, {} as Record<GymStatus, number>);

  const filtered = gyms.filter((g) => g.status === active);

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-800/80">
        {ALL_TABS.map((tab) => {
          const isActive = active === tab;
          const count = counts[tab];

          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                isActive
                  ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800/60"
              }`}
            >
              <span>{tab.replace("_", " ")}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-zinc-950/20 text-zinc-950" : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {!filtered.length ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-12 text-center text-muted-foreground space-y-2">
          <Dumbbell className="w-8 h-8 mx-auto text-zinc-600" />
          <p className="text-sm font-medium text-zinc-300">No gym applications in {active.replace("_", " ")}</p>
          <p className="text-xs text-zinc-500">Applications will appear here as vendors update their status.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((gym) => (
            <div
              key={gym.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-bold text-white text-base truncate">{gym.name}</h3>
                  <StatusBadge status={gym.status} size="sm" />
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  {gym.vendors?.business_name && (
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      {gym.vendors.business_name}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {gym.city}, {gym.state}
                  </span>
                </div>
              </div>

              <Link
                href={`/admin/gyms/${gym.id}`}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700/60 hover:border-emerald-500/40 transition-all shrink-0"
              >
                <span>{["PENDING", "UNDER_REVIEW", "APPROVED"].includes(gym.status) ? "Audit & Review" : "View Details"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
