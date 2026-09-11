import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { adminUpdateGym, setGymUnderReview, reviewGym, goLive } from "@/lib/actions/gym";
import Link from "next/link";
import type { GymStatus, VendorStatus } from "@/lib/types/db";

const GYM_STATUS_STYLES: Record<GymStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING: "bg-yellow-100 text-yellow-800",
  UNDER_REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  LIVE: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

const VENDOR_STATUS_STYLES: Record<VendorStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  APPROVED: "bg-blue-100 text-blue-800",
  LIVE: "bg-green-100 text-green-800"
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminGymReviewPage({
  params,
}: {
  params: Promise<{ gymId: string }>;
}) {
  const { gymId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "ADMIN") redirect("/");

  const { data: gym } = await supabase
    .from("gyms")
    .select("*, vendors(id, business_name, owner_name, email, phone, status)")
    .eq("id", gymId)
    .single();

  if (!gym) redirect("/admin/dashboard");

  const vendor = Array.isArray(gym.vendors) ? gym.vendors[0] : gym.vendors;
  const vendorVerified = vendor?.status === "LIVE";

  const updateAction = adminUpdateGym.bind(null, gymId);
  const startReview = setGymUnderReview.bind(null, gymId);
  const approve = reviewGym.bind(null, gymId, "approve");
  const reject = reviewGym.bind(null, gymId, "reject");
  const makeLive = goLive.bind(null, gymId);

  return (
    <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground transition mb-2 block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">{gym.name}</h1>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${GYM_STATUS_STYLES[gym.status as GymStatus]}`}>
          {gym.status}
        </span>
      </div>

      {/* Vendor info */}
      <div className="border rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vendor</p>
          <Link href={`/admin/vendors/${vendor?.id}`} className="text-xs text-primary underline hover:opacity-80">
            View Vendor
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-medium">{vendor?.business_name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${VENDOR_STATUS_STYLES[vendor?.status as VendorStatus]}`}>
            {vendor?.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{vendor?.owner_name} · {vendor?.email}</p>
      </div>

      {/* Vendor not verified warning for APPROVED gyms */}
      {!vendorVerified && gym.status === "APPROVED" && (
        <div className="border border-yellow-300 bg-yellow-50 rounded-xl px-4 py-3 text-sm text-yellow-800">
          ⚠ Vendor is not yet verified.{" "}
          <Link href={`/admin/vendors/${vendor?.id}`} className="underline font-medium">
            Verify the vendor
          </Link>{" "}
          before going live.
        </div>
      )}

      {/* Editable gym form */}
      <form action={updateAction} className="border rounded-xl p-4 space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Gym Details <span className="normal-case font-normal">(editable)</span>
        </p>
        {[
          { name: "name", label: "Gym Name", defaultValue: gym.name, type: "text" },
          { name: "phone", label: "Phone", defaultValue: gym.phone, type: "tel" },
          { name: "address", label: "Address", defaultValue: gym.address, type: "text" },
          { name: "city", label: "City", defaultValue: gym.city, type: "text" },
          { name: "state", label: "State", defaultValue: gym.state, type: "text" },
          { name: "pincode", label: "Pincode", defaultValue: gym.pincode, type: "text" },
          { name: "price", label: "Monthly Price (₹)", defaultValue: String(gym.price), type: "number" },
        ].map(({ name, label, defaultValue, type }) => (
          <div key={name} className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            <input
              name={name}
              type={type}
              defaultValue={defaultValue}
              required
              className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        ))}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={gym.description ?? ""}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full border rounded-md py-2 text-sm font-medium hover:bg-accent transition"
        >
          Save Changes
        </button>
      </form>

      {/* Status actions */}
      <div className="space-y-2">
        {gym.status === "PENDING" && (
          <form action={startReview}>
            <button type="submit" className="w-full border border-blue-500 text-blue-600 rounded-md py-2 text-sm font-medium hover:bg-blue-50 transition">
              Start Review
            </button>
          </form>
        )}

        {gym.status === "UNDER_REVIEW" && (
          <>
            <form action={approve}>
              <button type="submit" className="w-full bg-green-600 text-white rounded-md py-2 text-sm font-medium hover:bg-green-700 transition">
                Approve
              </button>
            </form>
            <form action={reject}>
              <button type="submit" className="w-full border border-destructive text-destructive rounded-md py-2 text-sm font-medium hover:bg-destructive hover:text-white transition">
                Reject
              </button>
            </form>
          </>
        )}

        {gym.status === "APPROVED" && (
          <form action={makeLive}>
            <button
              type="submit"
              disabled={!vendorVerified}
              className="w-full bg-emerald-600 text-white rounded-md py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {vendorVerified ? "Go Live" : "Go Live (verify vendor first)"}
            </button>
          </form>
        )}

        {gym.status === "LIVE" && (
          <p className="text-sm text-center text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-md py-2">
            ✓ This gym is live and visible to users.
          </p>
        )}

        {gym.status === "REJECTED" && (
          <p className="text-sm text-center text-destructive border border-red-200 bg-red-50 rounded-md py-2">
            This gym application was rejected.
          </p>
        )}

        {gym.status === "DRAFT" && (
          <p className="text-sm text-center text-muted-foreground border rounded-md py-2">
            This gym is still a draft. The vendor has not submitted it yet.
          </p>
        )}
      </div>
    </div>
  );
}
