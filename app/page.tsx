import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Dumbbell, ShieldCheck, Zap, ArrowRight, Compass, Users, Award, CheckCircle2 } from "lucide-react";
import { GymCard } from "@/components/ui/gym-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  // Fetch top 3 live or approved gyms for showcase
  const { data: featuredGyms } = await supabase
    .from("gyms")
    .select("*")
    .in("status", ["LIVE", "APPROVED"])
    .order("created_at", { ascending: false })
    .limit(3);

  const { count: totalGymsCount } = await supabase
    .from("gyms")
    .select("*", { count: "exact", head: true })
    .in("status", ["LIVE", "APPROVED"]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 px-6">
        {/* Ambient Glow Backlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Fitness Clubs & Premium Studios</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Transform Your Body. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Elevate Your Routine.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed">
            Discover top-rated fitness centers, strength arenas, and wellness clubs near you. 
            Transparent monthly pricing, verified amenities, and flexible gym access.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/gyms"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all text-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Verified Gyms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/become-vendor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-zinc-700/80 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-200 font-semibold transition-colors text-sm"
            >
              <span>List Your Facility</span>
            </Link>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 border-t border-zinc-800/60">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
              <p className="text-2xl font-bold text-white">{totalGymsCount ? `${totalGymsCount}+` : "150+"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Verified Facilities</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
              <p className="text-2xl font-bold text-emerald-400">100%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Direct Pricing</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
              <p className="text-2xl font-bold text-white">4.9/5</p>
              <p className="text-xs text-muted-foreground mt-0.5">Member Rating</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
              <p className="text-2xl font-bold text-cyan-400">24/7</p>
              <p className="text-xs text-muted-foreground mt-0.5">Instant Discovery</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE SECTION ── */}
      {featuredGyms && featuredGyms.length > 0 && (
        <section className="py-16 px-6 border-t border-zinc-800/50 bg-zinc-950/40">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Top Rated Venues</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Gyms & Studios</h2>
              </div>
              <Link
                href="/gyms"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>View all locations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredGyms.map((gym) => (
                <GymCard
                  key={gym.id}
                  gym={gym}
                  actionHref={`/gyms`}
                  actionLabel="Check Gym Details"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES SECTION ── */}
      <section className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Why GymPlatform</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Designed for Athletes, Built for Gym Owners
            </h2>
            <p className="text-sm text-muted-foreground">
              A frictionless bridge connecting dedicated fitness seekers with verified premium facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Manual Quality Audits</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every gym application undergoes multi-step admin review to verify equipment standards, safety protocols, and certified staff.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Realtime Sync</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instant updates on status approvals, pricing revisions, and gym submissions without stale data or manual page reloads.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Empowering Vendors</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dedicated vendor portal allows owners to manage locations, monitor application pipelines, and showcase amenities with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNER CTA BANNER ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-zinc-900/80 to-zinc-950 backdrop-blur-xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Gym Partner Program
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Are You a Gym Owner or Studio Operator?
              </h2>
              <p className="text-sm text-zinc-400 max-w-lg">
                Join our verified network today and reach thousands of members actively looking for training spaces in your area.
              </p>
            </div>

            <Link
              href="/become-vendor"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all shrink-0"
            >
              List Your Facility Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
