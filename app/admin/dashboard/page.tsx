import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import GymTabs from "@/app/admin/_components/GymTabs";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ShieldCheck, Users, Dumbbell, AlertCircle, ArrowRight, Building2, Mail, UserCheck } from "lucide-react";
import type { VendorStatus, GymSummary } from "@/types";

const VENDOR_STATUS_ORDER: VendorStatus[] = ["DRAFT", "APPROVED", "LIVE"];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "ADMIN") redirect("/");

  const [{ data: vendors }, { data: gyms }] = await Promise.all([
    supabase
      .from("vendors")
      .select("*, profiles(full_name, email)")
      .order("updated_at", { ascending: false }),
    supabase
      .from("gyms")
      .select("id, name, city, state, status, vendors(business_name)")
      .order("updated_at", { ascending: false }),
  ]);

  const normalizedGyms: GymSummary[] = (gyms ?? []).map((gym) => ({
    id: gym.id,
    name: gym.name,
    city: gym.city,
    state: gym.state,
    status: gym.status,
    vendors: Array.isArray(gym.vendors)
      ? (gym.vendors[0] as { business_name: string } | undefined) ?? null
      : (gym.vendors as { business_name: string } | null) ?? null,
  }));

  const vendorsByStatus = VENDOR_STATUS_ORDER.reduce((acc, status) => {
    const group = (vendors ?? []).filter((v) => v.status === status);
    if (group.length) acc[status] = group;
    return acc;
  }, {} as Record<string, typeof vendors>);

  const actionableVendors = (vendors ?? []).filter((v) => v.status === "DRAFT").length;
  const actionableGyms = (gyms ?? []).filter((g) =>
    ["PENDING", "UNDER_REVIEW", "APPROVED"].includes(g.status)
  ).length;

  const totalVendors = vendors?.length ?? 0;
  const totalGyms = gyms?.length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <PageHeader
        title="Admin Console"
        description="Verify vendor credentials, audit gym facilities, and manage live listings."
        breadcrumbs={[{ label: "Admin Console" }]}
        badge={
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400">
            Administrator Mode
          </span>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Vendors Needing Audit"
          value={actionableVendors}
          subtitle="Draft applications pending"
          icon={<AlertCircle className="w-5 h-5 text-amber-400" />}
          accent="amber"
        />
        <StatCard
          title="Gyms Needing Action"
          value={actionableGyms}
          subtitle="Pending or Under Review"
          icon={<ClockIcon className="w-5 h-5 text-blue-400" />}
          accent="blue"
        />
        <StatCard
          title="Total Vendors"
          value={totalVendors}
          subtitle="Registered businesses"
          icon={<Building2 className="w-5 h-5 text-emerald-400" />}
          accent="emerald"
        />
        <StatCard
          title="Total Facilities"
          value={totalGyms}
          subtitle="All platform gyms"
          icon={<Dumbbell className="w-5 h-5 text-purple-400" />}
          accent="purple"
        />
      </div>

      {/* ── VENDOR AUDIT QUEUE ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Vendor Management</h2>
            {actionableVendors > 0 && (
              <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-0.5 rounded-full font-bold">
                {actionableVendors} pending audit
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{totalVendors} total vendors</span>
        </div>

        {!vendors?.length ? (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-12 text-center text-muted-foreground">
            <Building2 className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
            <p className="text-sm font-medium text-zinc-300">No vendor applications yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {(Object.entries(vendorsByStatus) as [VendorStatus, typeof vendors][]).map(([status, group]) => (
              <div key={status} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    {status} ({group!.length})
                  </p>
                  <div className="flex-1 h-px bg-zinc-800/80" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group!.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-zinc-700 transition-all"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-base truncate">{vendor.business_name}</p>
                          <StatusBadge status={vendor.status} size="sm" />
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                          <span>{vendor.owner_name}</span>
                          <span>•</span>
                          <span className="text-zinc-400">{vendor.profiles?.email || vendor.email}</span>
                        </p>
                      </div>

                      <Link
                        href={`/admin/vendors/${vendor.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700/60 hover:border-emerald-500/40 transition-all shrink-0"
                      >
                        <span>{vendor.status === "DRAFT" ? "Audit" : "View"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── GYM APPLICATIONS WITH TABS ── */}
      <section className="space-y-4 pt-6 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Gym Facility Applications</h2>
            {actionableGyms > 0 && (
              <span className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2.5 py-0.5 rounded-full font-bold">
                {actionableGyms} need action
              </span>
            )}
          </div>
        </div>

        <GymTabs gyms={normalizedGyms} />
      </section>
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
