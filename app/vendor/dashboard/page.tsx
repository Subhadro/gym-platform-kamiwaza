import { createClient } from "@/lib/supabase/server";
import { getVendorForUser } from "@/lib/actions/vendor";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { GymCard } from "@/components/ui/gym-card";
import { Plus, Dumbbell, ShieldCheck, Clock, CheckCircle2, Sparkles, AlertTriangle } from "lucide-react";
import type { Gym, VendorStatus } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VendorDashboard() {
  const vendor = await getVendorForUser();
  if (!vendor) redirect("/become-vendor");

  const supabase = await createClient();
  const { data: gyms } = await supabase
    .from("gyms")
    .select("*")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  const canAddGyms = vendor.status === "APPROVED" || vendor.status === "LIVE";

  const totalGyms = gyms?.length ?? 0;
  const liveGyms = gyms?.filter((g) => g.status === "LIVE").length ?? 0;
  const pendingGyms = gyms?.filter((g) => ["PENDING", "UNDER_REVIEW"].includes(g.status)).length ?? 0;
  const draftGyms = gyms?.filter((g) => ["DRAFT", "REJECTED"].includes(g.status)).length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <PageHeader
        title="Vendor Dashboard"
        description={`Manage your fitness business: ${vendor.business_name}`}
        breadcrumbs={[{ label: "Vendor Portal" }]}
        badge={<StatusBadge status={vendor.status} />}
        actions={
          canAddGyms ? (
            <Link
              href="/vendor/gyms/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Gym Application</span>
            </Link>
          ) : undefined
        }
      />

      {/* Vendor Status Alert Banner */}
      {vendor.status === "DRAFT" && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-md flex items-start gap-3.5 text-amber-300">
          <Clock className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Vendor Application Under Review</p>
            <p className="text-xs text-amber-400/80 leading-relaxed">
              Our admin team is currently validating your business details. Once approved, you will be able to submit gym locations and manage pricing.
            </p>
          </div>
        </div>
      )}

      {vendor.status === "APPROVED" && (
        <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-5 backdrop-blur-md flex items-start gap-3.5 text-teal-300">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-teal-400" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Vendor Account Approved</p>
            <p className="text-xs text-teal-400/80 leading-relaxed">
              Your account is verified! You can now create gym listings and submit them for final audit.
            </p>
          </div>
        </div>
      )}

      {vendor.status === "LIVE" && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur-md flex items-start gap-3.5 text-emerald-300">
          <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Vendor Account is Live</p>
            <p className="text-xs text-emerald-400/80 leading-relaxed">
              Your facilities are discoverable by fitness enthusiasts across the platform.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gyms"
          value={totalGyms}
          subtitle="All locations registered"
          icon={<Dumbbell className="w-5 h-5 text-emerald-400" />}
          accent="emerald"
        />
        <StatCard
          title="Live Facilities"
          value={liveGyms}
          subtitle="Publicly visible"
          icon={<Sparkles className="w-5 h-5 text-teal-400" />}
          accent="blue"
        />
        <StatCard
          title="Pending Audit"
          value={pendingGyms}
          subtitle="Awaiting admin approval"
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          accent="amber"
        />
        <StatCard
          title="Drafts & Revisions"
          value={draftGyms}
          subtitle="Action required"
          icon={<AlertTriangle className="w-5 h-5 text-purple-400" />}
          accent="purple"
        />
      </div>

      {/* Gym Listings Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">Your Gym Applications</h2>
          <span className="text-xs text-muted-foreground">{totalGyms} total registered</span>
        </div>

        {!gyms?.length ? (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No gym applications yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {canAddGyms
                  ? "Create your first gym listing to get reviewed and published on the platform."
                  : "Once your vendor application is approved, you will be able to create listings."}
              </p>
            </div>
            {canAddGyms && (
              <Link
                href="/vendor/gyms/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Your First Gym</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gyms.map((gym: Gym) => (
              <GymCard
                key={gym.id}
                gym={gym}
                actionHref={`/vendor/gyms/${gym.id}`}
                actionLabel={gym.status === "DRAFT" || gym.status === "REJECTED" ? "Edit Application" : "View Application"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
