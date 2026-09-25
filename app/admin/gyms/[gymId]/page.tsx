import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/supabase/session";
import { redirect } from "next/navigation";
import { adminUpdateGym, setGymUnderReview, reviewGym, goLive } from "@/lib/actions/gym";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import Link from "next/link";
import { Dumbbell, Building2, Phone, MapPin, IndianRupee, FileText, CheckCircle2, XCircle, Sparkles, Clock, Save, AlertTriangle, ArrowRight } from "lucide-react";
import type { GymStatus, VendorStatus } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminGymReviewPage({
  params,
}: {
  params: Promise<{ gymId: string }>;
}) {
  const { gymId } = await params;
  const supabase = await createClient();
  await requireRole("ADMIN");

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <PageHeader
        title={gym.name}
        description="Audit facility infrastructure, edit details, and advance publishing workflow."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin/dashboard" },
          { label: "Gyms", href: "/admin/dashboard" },
          { label: gym.name },
        ]}
        badge={<StatusBadge status={gym.status} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editable Facility Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Vendor Overview Card */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Building2 className="w-4 h-4" />
                <span>Associated Vendor</span>
              </div>
              {vendor?.id && (
                <Link
                  href={`/admin/vendors/${vendor.id}`}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>View Vendor</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-bold text-white">{vendor?.business_name || "Unknown Vendor"}</p>
                <p className="text-xs text-muted-foreground">
                  {vendor?.owner_name} • {vendor?.email}
                </p>
              </div>
              <StatusBadge status={vendor?.status as VendorStatus} size="sm" />
            </div>

            {!vendorVerified && gym.status === "APPROVED" && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  Vendor must be made <strong className="font-semibold text-white">LIVE</strong> before this gym can be published.
                </span>
              </div>
            )}
          </div>

          {/* Gym Edit Form */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Dumbbell className="w-4 h-4" />
              <span>Facility Details (Admin Editable)</span>
            </div>

            <form action={updateAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Facility Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={gym.name}
                  required
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={gym.phone}
                    required
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Monthly Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={String(gym.price)}
                    required
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Street Address</label>
                <input
                  name="address"
                  type="text"
                  defaultValue={gym.address}
                  required
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">City</label>
                  <input
                    name="city"
                    type="text"
                    defaultValue={gym.city}
                    required
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">State</label>
                  <input
                    name="state"
                    type="text"
                    defaultValue={gym.state}
                    required
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Pincode</label>
                  <input
                    name="pincode"
                    type="text"
                    defaultValue={gym.pincode}
                    required
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={gym.description ?? ""}
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                />
              </div>

              <SubmitButton
                variant="outline"
                loadingText="Saving Changes..."
                icon={<Save className="w-4 h-4" />}
                className="w-full py-2.5 rounded-xl"
              >
                Save Facility Changes
              </SubmitButton>
            </form>
          </div>
        </div>

        {/* Right Col: Admin Workflow Actions */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Review & Publishing Actions</h3>

            <div className="space-y-3">
              {gym.status === "PENDING" && (
                <div className="space-y-3">
                  <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                    Application is submitted by vendor and waiting in queue.
                  </p>
                  <form action={startReview}>
                    <SubmitButton
                      variant="primary"
                      loadingText="Starting Audit..."
                      icon={<Clock className="w-4 h-4" />}
                      className="w-full py-3 rounded-xl"
                    >
                      Start Audit Review
                    </SubmitButton>
                  </form>
                </div>
              )}

              {gym.status === "UNDER_REVIEW" && (
                <div className="space-y-3">
                  <p className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
                    Gym is currently under active audit. You can approve or reject the facility.
                  </p>
                  <form action={approve}>
                    <SubmitButton
                      variant="emerald"
                      loadingText="Approving..."
                      icon={<CheckCircle2 className="w-4 h-4" />}
                      className="w-full py-3 rounded-xl"
                    >
                      Approve Application
                    </SubmitButton>
                  </form>
                  <form action={reject}>
                    <SubmitButton
                      variant="destructive"
                      loadingText="Rejecting..."
                      icon={<XCircle className="w-4 h-4" />}
                      className="w-full py-2.5 rounded-xl"
                    >
                      Reject Application
                    </SubmitButton>
                  </form>
                </div>
              )}

              {gym.status === "APPROVED" && (
                <div className="space-y-3">
                  <p className="text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 p-3 rounded-xl">
                    Facility has been approved. Publish live to make it publicly discoverable.
                  </p>
                  <form action={makeLive}>
                    <SubmitButton
                      variant="primary"
                      disabled={!vendorVerified}
                      loadingText="Publishing Live..."
                      icon={<Sparkles className="w-4 h-4" />}
                      className="w-full py-3 rounded-xl"
                    >
                      {vendorVerified ? "Publish Live" : "Go Live (Verify Vendor First)"}
                    </SubmitButton>
                  </form>
                </div>
              )}

              {gym.status === "LIVE" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>This gym is live and discoverable by users.</span>
                </div>
              )}

              {gym.status === "REJECTED" && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>This gym application was rejected.</span>
                </div>
              )}

              {gym.status === "DRAFT" && (
                <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-400">
                  This facility application is still in draft. The vendor has not submitted it yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
