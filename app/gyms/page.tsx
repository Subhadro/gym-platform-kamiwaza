import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { GymCard } from "@/components/ui/gym-card";
import { Compass, Dumbbell, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import type { Gym } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GymsPage() {
  const supabase = await createClient();
  const { data: gyms } = await supabase
    .from("gyms")
    .select("*")
    .in("status", ["APPROVED", "LIVE"])
    .order("created_at", { ascending: false });

  const totalCount = gyms?.length ?? 0;
  const cities = Array.from(new Set((gyms ?? []).map((g) => g.city).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header with Breadcrumb */}
      <PageHeader
        title="Find a Gym"
        description="Browse verified fitness centers, crossfit boxes, and training studios near you."
        breadcrumbs={[{ label: "Find Gyms" }]}
        badge={
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {totalCount} {totalCount === 1 ? "Gym" : "Gyms"} Available
          </span>
        }
      />

      {/* City Filters if any */}
      {cities.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-muted-foreground font-medium flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Cities:
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500 text-zinc-950 font-bold shrink-0">
            All Cities
          </span>
          {cities.map((city) => (
            <span
              key={city}
              className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium shrink-0"
            >
              {city}
            </span>
          ))}
        </div>
      )}

      {/* Gym Grid */}
      {!gyms?.length ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-16 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <Dumbbell className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No gyms listed yet</h3>
            <p className="text-sm text-muted-foreground">
              We are currently onboarding top fitness facilities. Check back shortly or register your gym!
            </p>
          </div>
          <Link
            href="/become-vendor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>List Your Facility</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym: Gym) => (
            <GymCard
              key={gym.id}
              gym={gym}
              actionHref={`tel:${gym.phone}`}
              actionLabel="Contact Facility"
            />
          ))}
        </div>
      )}
    </div>
  );
}
