"use client";

import { useState } from "react";
import Link from "next/link";
import type { GymStatus } from "@/lib/types/db";

const GYM_STATUS_STYLES: Record<GymStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING: "bg-yellow-100 text-yellow-800",
  UNDER_REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  LIVE: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

const ALL_TABS: GymStatus[] = ["DRAFT", "PENDING", "UNDER_REVIEW", "APPROVED", "LIVE", "REJECTED"];

type Gym = {
  id: string;
  name: string;
  city: string;
  state: string;
  status: GymStatus;
  vendors: { business_name: string } | null;
};

export default function GymTabs({ gyms }: { gyms: Gym[] }) {
  const [active, setActive] = useState<GymStatus>("DRAFT");

  const counts = ALL_TABS.reduce((acc, s) => {
    acc[s] = gyms.filter((g) => g.status === s).length;
    return acc;
  }, {} as Record<GymStatus, number>);

  const filtered = gyms.filter((g) => g.status === active);

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap border-b">
        {ALL_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition -mb-px ${
              active === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {counts[tab] > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${GYM_STATUS_STYLES[tab]}`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {!filtered.length ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No gym applications with status {active}.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((gym) => (
            <div key={gym.id} className="border rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{gym.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${GYM_STATUS_STYLES[gym.status]}`}>
                    {gym.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {gym.vendors?.business_name} · {gym.city}, {gym.state}
                </p>
              </div>
              <Link
                href={`/admin/gyms/${gym.id}`}
                className="text-sm border px-3 py-1.5 rounded-md hover:bg-accent transition shrink-0"
              >
                {["PENDING", "UNDER_REVIEW", "APPROVED"].includes(gym.status) ? "Review" : "View"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
