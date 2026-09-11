import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import GymTabs from "@/app/admin/_components/GymTabs";
import type { VendorStatus } from "@/lib/types/db";

const VENDOR_STATUS_STYLES: Record<VendorStatus, string> = {
  DRAFT: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  LIVE: "bg-emerald-100 text-emerald-800",
};

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

  const normalizedGyms = (gyms ?? []).map((gym) => ({
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* ── VENDOR PANEL ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Vendors</h2>
          {actionableVendors > 0 && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
              {actionableVendors} pending approval
            </span>
          )}
        </div>

        {!vendors?.length ? (
          <p className="text-sm text-muted-foreground border rounded-xl px-4 py-8 text-center">
            No vendor applications yet.
          </p>
        ) : (
          <div className="space-y-6">
            {(Object.entries(vendorsByStatus) as [VendorStatus, typeof vendors][]).map(([status, group]) => (
              <div key={status} className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {status} ({group!.length})
                </p>
                {group!.map((vendor) => (
                  <div key={vendor.id} className="border rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{vendor.business_name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${VENDOR_STATUS_STYLES[vendor.status as VendorStatus]}`}>
                          {vendor.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {vendor.owner_name} · {vendor.profiles?.email}
                      </p>
                    </div>
                    <Link
                      href={`/admin/vendors/${vendor.id}`}
                      className="text-sm border px-3 py-1.5 rounded-md hover:bg-accent transition shrink-0"
                    >
                      {vendor.status === "DRAFT" ? "Review" : "View"}
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="border-t" />

      {/* ── GYM PANEL with 6 tabs ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Gym Applications</h2>
          {actionableGyms > 0 && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
              {actionableGyms} need action
            </span>
          )}
        </div>
        <GymTabs gyms={normalizedGyms} />
      </section>
    </div>
  );
}
