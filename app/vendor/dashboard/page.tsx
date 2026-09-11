import { createClient } from "@/lib/supabase/server";
import { getVendorForUser } from "@/lib/actions/vendor";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Gym, GymStatus, VendorStatus } from "@/lib/types/db";

const VENDOR_STATUS_MESSAGES: Record<VendorStatus, { text: string; style: string }> = {
  DRAFT: {
    text: "Your vendor application is under review. You will be able to add gyms once approved.",
    style: "border-yellow-300 bg-yellow-50 text-yellow-800",
  },
  APPROVED: {
    text: "✓ Your vendor account is approved. You can now create and submit gym applications.",
    style: "border-green-300 bg-green-50 text-green-800",
  },
  LIVE: {
    text: "✓ Your vendor account is live.",
    style: "border-emerald-300 bg-emerald-50 text-emerald-800",
  },
};

const GYM_STATUS_STYLES: Record<GymStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING: "bg-yellow-100 text-yellow-800",
  UNDER_REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  LIVE: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function VendorDashboard() {
  const vendor = await getVendorForUser();
  if (!vendor) redirect("/become-vendor");

  const supabase = await createClient();
  const { data: gyms } = await supabase
    .from("gyms")
    .select("*")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  // Vendor can add gyms once APPROVED or LIVE
  const canAddGyms = vendor.status === "APPROVED" || vendor.status === "LIVE";
  const statusMsg = VENDOR_STATUS_MESSAGES[vendor.status];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">{vendor.business_name}</p>
        </div>
        {canAddGyms && (
          <Link
            href="/vendor/gyms/new"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            + New Gym Application
          </Link>
        )}
      </div>

      {/* Vendor status banner */}
      <div className={`border rounded-xl px-4 py-3 text-sm ${statusMsg.style}`}>
        {statusMsg.text}
      </div>

      {/* Gym list */}
      {canAddGyms && (
        <>
          {!gyms?.length ? (
            <div className="border rounded-xl p-12 text-center text-muted-foreground">
              <p className="text-lg font-medium">No gym applications yet</p>
              <p className="text-sm mt-1">Create your first gym application to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gyms.map((gym: Gym) => (
                <div key={gym.id} className="border rounded-xl p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{gym.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${GYM_STATUS_STYLES[gym.status as GymStatus]}`}>
                        {gym.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{gym.city}, {gym.state}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {(gym.status === "DRAFT" || gym.status === "REJECTED") && (
                      <Link
                        href={`/vendor/gyms/${gym.id}`}
                        className="text-sm border px-3 py-1.5 rounded-md hover:bg-accent transition"
                      >
                        Edit
                      </Link>
                    )}
                    {gym.status !== "DRAFT" && (
                      <Link
                        href={`/vendor/gyms/${gym.id}`}
                        className="text-sm border px-3 py-1.5 rounded-md hover:bg-accent transition"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
