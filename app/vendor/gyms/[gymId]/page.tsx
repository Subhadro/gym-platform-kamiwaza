import { createClient } from "@/lib/supabase/server";
import { getVendorForUser } from "@/lib/actions/vendor";
import { redirect } from "next/navigation";
import { submitGym, updateGym } from "@/lib/actions/gym";
import type { Gym, GymStatus } from "@/lib/types/db";

const STATUS_STYLES: Record<GymStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING: "bg-yellow-100 text-yellow-800",
  UNDER_REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  LIVE: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

const STATUS_MESSAGES: Partial<Record<GymStatus, string>> = {
  PENDING: "Your application has been submitted and is awaiting review.",
  UNDER_REVIEW: "An admin is currently reviewing your application.",
  APPROVED: "Your gym has been approved! It will go live shortly.",
  LIVE: "Your gym is live and visible to users.",
  REJECTED: "Your application was rejected. Edit and resubmit.",
};

const fields = [
  { name: "name", label: "Gym Name", type: "text" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "pincode", label: "Pincode", type: "text" },
  { name: "price", label: "Monthly Price (₹)", type: "number" },
] as const;

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

  return (
    <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{gym.name}</h1>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[gym.status as GymStatus]}`}>
          {gym.status}
        </span>
      </div>

      {STATUS_MESSAGES[gym.status as GymStatus] && (
        <p className="text-sm text-muted-foreground border rounded-lg px-4 py-3">
          {STATUS_MESSAGES[gym.status as GymStatus]}
        </p>
      )}

      <form action={updateGymAction} className="space-y-4">
        {fields.map(({ name, label, type }) => (
          <div key={name} className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <input
              name={name}
              type={type}
              defaultValue={gym[name as keyof Gym] as string}
              disabled={!isEditable}
              required
              className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        ))}

        <div className="space-y-1">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={gym.description ?? ""}
            disabled={!isEditable}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        {isEditable && (
          <button
            type="submit"
            className="w-full border rounded-md py-2 text-sm font-medium hover:bg-accent transition"
          >
            Save Changes
          </button>
        )}
      </form>

      {isEditable && (
        <form action={submitGymAction}>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90 transition"
          >
            Submit for Review
          </button>
        </form>
      )}
    </div>
  );
}
