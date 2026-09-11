import { createClient } from "@/lib/supabase/server";
import { getVendorForUser } from "@/lib/actions/vendor";
import { redirect } from "next/navigation";
import { submitGym, updateGym } from "@/lib/actions/gym";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { Dumbbell, Phone, MapPin, IndianRupee, FileText, Send, Save, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { Gym, GymStatus } from "@/lib/types/db";

const STATUS_MESSAGES: Partial<Record<GymStatus, { text: string; icon: typeof Clock; style: string }>> = {
  DRAFT: {
    text: "This application is currently in Draft. You can update details and submit it for admin audit whenever ready.",
    icon: FileText,
    style: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
  },
  PENDING: {
    text: "Your application has been submitted and is currently in the audit queue awaiting review.",
    icon: Clock,
    style: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  UNDER_REVIEW: {
    text: "An administrator is currently inspecting your facility details and verification documents.",
    icon: Clock,
    style: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  },
  APPROVED: {
    text: "Your facility has passed audit! It will be published live to members shortly.",
    icon: CheckCircle2,
    style: "border-teal-500/30 bg-teal-500/10 text-teal-300",
  },
  LIVE: {
    text: "Your gym listing is live! Members can discover your facility, pricing, and contact info.",
    icon: CheckCircle2,
    style: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  REJECTED: {
    text: "Your application was rejected. Please review your details, update the information, and resubmit.",
    icon: AlertCircle,
    style: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GymDetailPage({ params }: { params: Promise<{ gymId: string }> }) {
  const { gymId } = await params;
  const vendor = await getVendorForUser();
  if (!vendor) redirect("/become-vendor");

  const supabase = await createClient();
  const { data: gym } = await supabase
    .from("gyms")
    .select("*")
    .eq("id", gymId)
    .eq("vendor_id", vendor.id)
    .single();

  if (!gym) redirect("/vendor/dashboard");

  const isEditable = gym.status === "DRAFT" || gym.status === "REJECTED";

  const updateGymAction = updateGym.bind(null, gymId);
  const submitGymAction = submitGym.bind(null, gymId);

  const statusInfo = STATUS_MESSAGES[gym.status as GymStatus];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <PageHeader
        title={gym.name}
        description={`Facility ID: ${gym.id.slice(0, 8)}...`}
        breadcrumbs={[
          { label: "Vendor Portal", href: "/vendor/dashboard" },
          { label: gym.name },
        ]}
        badge={<StatusBadge status={gym.status} />}
      />

      {/* Status Message Alert */}
      {statusInfo && (
        <div className={`rounded-2xl border p-4.5 backdrop-blur-md flex items-start gap-3 text-sm ${statusInfo.style}`}>
          <statusInfo.icon className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{statusInfo.text}</p>
        </div>
      )}

      {/* Main Details Form */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <form action={updateGymAction} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Dumbbell className="w-4 h-4" />
              <span>General Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Facility Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={gym.name}
                  disabled={!isEditable}
                  required
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={gym.phone}
                    disabled={!isEditable}
                    required
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Monthly Price (₹)</label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    name="price"
                    type="number"
                    defaultValue={String(gym.price)}
                    disabled={!isEditable}
                    required
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800/60">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <MapPin className="w-4 h-4" />
              <span>Location Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Address</label>
                <input
                  name="address"
                  type="text"
                  defaultValue={gym.address}
                  disabled={!isEditable}
                  required
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">City</label>
                <input
                  name="city"
                  type="text"
                  defaultValue={gym.city}
                  disabled={!isEditable}
                  required
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">State</label>
                <input
                  name="state"
                  type="text"
                  defaultValue={gym.state}
                  disabled={!isEditable}
                  required
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Pincode</label>
                <input
                  name="pincode"
                  type="text"
                  defaultValue={gym.pincode}
                  disabled={!isEditable}
                  required
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800/60">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <FileText className="w-4 h-4" />
              <span>Description & Features</span>
            </div>

            <div className="space-y-1.5">
              <textarea
                name="description"
                rows={3}
                defaultValue={gym.description ?? ""}
                disabled={!isEditable}
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none"
              />
            </div>
          </div>

          {isEditable && (
            <SubmitButton
              variant="outline"
              loadingText="Saving Changes..."
              icon={<Save className="w-4 h-4" />}
              className="w-full py-3 rounded-xl"
            >
              Save Changes
            </SubmitButton>
          )}
        </form>

        {isEditable && (
          <div className="pt-4 border-t border-zinc-800/60">
            <form action={submitGymAction}>
              <SubmitButton
                variant="primary"
                loadingText="Submitting for Review..."
                icon={<Send className="w-4 h-4" />}
                className="w-full py-3 rounded-xl"
              >
                Submit Application for Review
              </SubmitButton>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
