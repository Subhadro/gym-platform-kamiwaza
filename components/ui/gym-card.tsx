import React from "react";
import Link from "next/link";
import { MapPin, Phone, IndianRupee, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Gym, GymStatus } from "@/lib/types/db";
import { cn } from "@/lib/utils";

export interface GymCardProps {
  gym: Partial<Gym> & {
    id: string;
    name: string;
    city: string;
    state: string;
    status: GymStatus | string;
    price?: number;
    address?: string;
    phone?: string;
    description?: string | null;
  };
  actionHref?: string;
  actionLabel?: string;
  secondaryActionHref?: string;
  secondaryActionLabel?: string;
  imageUrl?: string;
  className?: string;
}

// Curated high quality fitness facility photos
const DEFAULT_GYM_IMAGES = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
];

function getGymImage(name: string, fallbackUrl?: string): string {
  if (fallbackUrl) return fallbackUrl;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DEFAULT_GYM_IMAGES.length;
  return DEFAULT_GYM_IMAGES[index];
}

export function GymCard({
  gym,
  actionHref,
  actionLabel = "View Details",
  secondaryActionHref,
  secondaryActionLabel,
  imageUrl,
  className,
}: GymCardProps) {
  const photo = getGymImage(gym.name, imageUrl);

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/20 hover:-translate-y-1",
        className
      )}
    >
      {/* Visual Image Header */}
      <div className="relative h-44 w-full overflow-hidden bg-zinc-800">
        <img
          src={photo}
          alt={gym.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <StatusBadge status={gym.status} size="sm" />
          {gym.status === "LIVE" && (
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/90 text-zinc-950 px-2 py-0.5 rounded-full shadow-md">
              <Sparkles className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Price Tag Overlay */}
        {gym.price !== undefined && (
          <div className="absolute bottom-3 left-3 flex items-baseline gap-0.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 px-2.5 py-1 rounded-lg text-white">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400 self-center" />
            <span className="text-base font-bold tracking-tight">{gym.price.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-zinc-400">/mo</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 space-y-3 justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-1">
            {gym.name}
          </h3>

          {gym.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {gym.description}
            </p>
          )}

          <div className="space-y-1.5 pt-1 text-xs text-zinc-400">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">
                {gym.address ? `${gym.address}, ` : ""}
                {gym.city}, {gym.state}
              </span>
            </div>

            {gym.phone && (
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{gym.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Actions */}
        {(actionHref || secondaryActionHref) && (
          <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/60 mt-2">
            {secondaryActionHref && secondaryActionLabel && (
              <Link
                href={secondaryActionHref}
                className="flex-1 text-center py-2 px-3 text-xs font-medium rounded-xl border border-zinc-700/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                {secondaryActionLabel}
              </Link>
            )}

            {actionHref && (
              <Link
                href={actionHref}
                className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all"
              >
                {actionLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
