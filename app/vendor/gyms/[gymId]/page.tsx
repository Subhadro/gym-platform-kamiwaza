import { createClient } from "@/lib/supabase/server";
import { getVendorForUser } from "@/lib/actions/vendor";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
import type { GymStatus } from "@/types";
import GymEditForm from "./GymEditForm";

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

      {statusInfo && (
        <div className={`rounded-2xl border p-4 backdrop-blur-md flex items-start gap-3 text-sm ${statusInfo.style}`}>
          <statusInfo.icon className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{statusInfo.text}</p>
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
        <GymEditForm gym={gym} isEditable={isEditable} />
      </div>
    </div>
  );
}
