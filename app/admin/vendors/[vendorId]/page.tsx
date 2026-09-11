import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { adminUpdateVendor, approveVendor, makeVendorLive, resetVendorToDraft } from "@/lib/actions/vendor";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import Link from "next/link";
import { Building2, User, Mail, Phone, MapPin, Calendar, CheckCircle2, Sparkles, RotateCcw, Save, Dumbbell, ArrowRight } from "lucide-react";
import type { GymStatus } from "@/lib/types/db";

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <PageHeader
        title={vendor.business_name}
        description="Review vendor documentation, edit operational details, and control verification status."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin/dashboard" },
          { label: "Vendors", href: "/admin/dashboard" },
          { label: vendor.business_name },
        ]}
        badge={<StatusBadge status={vendor.status} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editable Vendor Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Building2 className="w-4 h-4" />
              <span>Business Information (Editable)</span>
            </div>

            <form action={updateAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Registered Business Name</label>
                <input
                  name="business_name"
                  defaultValue={vendor.business_name}
                  required
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Authorized Owner Name</label>
                <input
                  name="owner_name"
                  defaultValue={vendor.owner_name}
                  required
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Business Phone</label>
                  <input
                    name="phone"
                    defaultValue={vendor.phone}
                    required
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Business Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={vendor.email}
                    required
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Account Link Details */}
              <div className="pt-4 border-t border-zinc-800/80 space-y-2 text-xs">
                <p className="font-bold text-zinc-400 uppercase tracking-wider mb-2">Linked User Account</p>
                <div className="flex justify-between py-1 border-b border-zinc-800/40">
                  <span className="text-muted-foreground">Account Email</span>
                  <span className="text-zinc-200 font-medium">{vendor.profiles?.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/40">
                  <span className="text-muted-foreground">Account Phone</span>
                  <span className="text-zinc-200 font-medium">{vendor.profiles?.phone ?? "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/40">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-zinc-200 font-medium">{vendor.profiles?.address ?? "—"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="text-zinc-200 font-medium">
                    {new Date(vendor.profiles?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <SubmitButton
                variant="outline"
                loadingText="Saving Changes..."
                icon={<Save className="w-4 h-4" />}
                className="w-full py-2.5 rounded-xl"
              >
                Save Business Info
              </SubmitButton>
            </form>
          </div>

          {/* Attached Gym Applications */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Dumbbell className="w-4 h-4" />
                <span>Gym Applications ({gyms?.length ?? 0})</span>
              </div>
            </div>

            {!gyms?.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">No facilities submitted by this vendor yet.</p>
            ) : (
              <div className="space-y-2.5">
                {gyms.map((gym) => (
                  <div
                    key={gym.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800/60 hover:border-zinc-700 transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-bold text-white truncate">{gym.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {gym.city}, {gym.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={gym.status} size="sm" />
                      <Link
                        href={`/admin/gyms/${gym.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors"
                      >
                        Audit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Workflow Actions */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Status Workflow</h3>

            <div className="space-y-3">
              {vendor.status === "DRAFT" && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                    Vendor application is in Draft. Approving gives the vendor permission to create and submit gym listings.
                  </div>
                  <form action={approve}>
                    <SubmitButton
                      variant="emerald"
                      loadingText="Approving Vendor..."
                      icon={<CheckCircle2 className="w-4 h-4" />}
                      className="w-full py-3 rounded-xl"
                    >
                      Approve Vendor
                    </SubmitButton>
                  </form>
                </div>
              )}

              {vendor.status === "APPROVED" && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300">
                    Vendor is Approved. Making Live will display the vendor brand publicly on the platform.
                  </div>
                  <form action={live}>
                    <SubmitButton
                      variant="primary"
                      loadingText="Publishing Live..."
                      icon={<Sparkles className="w-4 h-4" />}
                      className="w-full py-3 rounded-xl"
                    >
                      Make Live
                    </SubmitButton>
                  </form>

                  <form action={resetDraft}>
                    <SubmitButton
                      variant="destructive"
                      loadingText="Reverting..."
                      icon={<RotateCcw className="w-4 h-4" />}
                      className="w-full py-2.5 rounded-xl"
                    >
                      Revert to Draft
                    </SubmitButton>
                  </form>
                </div>
              )}

              {vendor.status === "LIVE" && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Vendor is currently live and verified.</span>
                  </div>

                  <form action={resetDraft}>
                    <SubmitButton
                      variant="destructive"
                      loadingText="Reverting..."
                      icon={<RotateCcw className="w-4 h-4" />}
                      className="w-full py-2.5 rounded-xl"
                    >
                      Revert to Draft
                    </SubmitButton>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
