import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { adminUpdateVendor, approveVendor, makeVendorLive, resetVendorToDraft } from "@/lib/actions/vendor";
import Link from "next/link";
import type { GymStatus, VendorStatus } from "@/lib/types/db";

const VENDOR_STATUS_STYLES: Record<VendorStatus, string> = {
  DRAFT: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  LIVE: "bg-emerald-100 text-emerald-800",
};

const GYM_STATUS_STYLES: Record<GymStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING: "bg-yellow-100 text-yellow-800",
  UNDER_REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  LIVE: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminVendorReviewPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "ADMIN") redirect("/");

  const { data: vendor } = await supabase
    .from("vendors")
    .select("*, profiles(full_name, email, phone, address, created_at)")
    .eq("id", vendorId)
    .single();

  if (!vendor) redirect("/admin/dashboard");

  const { data: gyms } = await supabase
    .from("gyms")
    .select("id, name, city, state, status")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });

  const updateAction = adminUpdateVendor.bind(null, vendorId);
  const approve = approveVendor.bind(null, vendorId);
  const live = makeVendorLive.bind(null, vendorId);
  const resetDraft = resetVendorToDraft.bind(null, vendorId);

  return (
    <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition mb-2 block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">{vendor.business_name}</h1>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${VENDOR_STATUS_STYLES[vendor.status as VendorStatus]}`}>
          {vendor.status}
        </span>
      </div>

      {/* Editable vendor form */}
      <form action={updateAction} className="border rounded-xl p-4 space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Business Info <span className="normal-case font-normal">(editable)</span>
        </p>
        {[
          { name: "business_name", label: "Business Name", value: vendor.business_name },
          { name: "owner_name", label: "Owner Name", value: vendor.owner_name },
          { name: "email", label: "Business Email", value: vendor.email },
          { name: "phone", label: "Business Phone", value: vendor.phone },
        ].map(({ name, label, value }) => (
          <div key={name} className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            <input
              name={name}
              defaultValue={value}
              required
              className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        ))}

        <div className="border-t pt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account Info</p>
          {[
            ["Account Email", vendor.profiles?.email],
            ["Account Phone", vendor.profiles?.phone ?? "—"],
            ["Address", vendor.profiles?.address ?? "—"],
            ["Member Since", new Date(vendor.profiles?.created_at).toLocaleDateString()],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm gap-4">
              <span className="text-muted-foreground shrink-0">{label}</span>
              <span className="text-right">{value}</span>
            </div>
          ))}
        </div>

        <button type="submit" className="w-full border rounded-md py-2 text-sm font-medium hover:bg-accent transition">
          Save Changes
        </button>
      </form>

      {/* Gym applications */}
      <div className="border rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Gym Applications ({gyms?.length ?? 0})
        </p>
        {!gyms?.length ? (
          <p className="text-sm text-muted-foreground">No gym applications yet.</p>
        ) : (
          gyms.map((gym) => (
            <div key={gym.id} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{gym.name}</p>
                <p className="text-xs text-muted-foreground">{gym.city}, {gym.state}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${GYM_STATUS_STYLES[gym.status as GymStatus]}`}>
                  {gym.status}
                </span>
                <Link href={`/admin/gyms/${gym.id}`} className="text-xs border px-2 py-1 rounded-md hover:bg-accent transition">
                  Review
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status workflow actions */}
      <div className="space-y-2">
        {vendor.status === "DRAFT" && (
          <form action={approve}>
            <button type="submit" className="w-full bg-green-600 text-white rounded-md py-2 text-sm font-medium hover:bg-green-700 transition">
              Approve Vendor
            </button>
          </form>
        )}

        {vendor.status === "APPROVED" && (
          <>
            <form action={live}>
              <button type="submit" className="w-full bg-emerald-600 text-white rounded-md py-2 text-sm font-medium hover:bg-emerald-700 transition">
                Make Live
              </button>
            </form>
            <form action={resetDraft}>
              <button type="submit" className="w-full border border-destructive text-destructive rounded-md py-2 text-sm font-medium hover:bg-destructive hover:text-white transition">
                Revert to Draft
              </button>
            </form>
          </>
        )}

        {vendor.status === "LIVE" && (
          <>
            <p className="text-sm text-center text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-md py-2">
              ✓ Vendor is live.
            </p>
            <form action={resetDraft}>
              <button type="submit" className="w-full border border-destructive text-destructive rounded-md py-2 text-sm font-medium hover:bg-destructive hover:text-white transition">
                Revert to Draft
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
