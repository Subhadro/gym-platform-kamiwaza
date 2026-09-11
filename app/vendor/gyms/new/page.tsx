"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGym } from "@/lib/actions/gym";
import { PageHeader } from "@/components/ui/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { Dumbbell, MapPin, IndianRupee, Phone, FileText, AlertCircle, Bookmark } from "lucide-react";

export default function NewGymPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      await createGym(formData);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        typeof (err as { digest?: unknown }).digest === "string" &&
        (err as { digest: string }).digest.includes("NEXT_REDIRECT")
      ) {
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to create gym");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <PageHeader
        title="New Gym Application"
        description="Fill in your facility details. You can save as draft now and submit for audit later."
        breadcrumbs={[
          { label: "Vendor Portal", href: "/vendor/dashboard" },
          { label: "New Gym" },
        ]}
      />

      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Dumbbell className="w-4 h-4" />
              <span>Basic Facility Info</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Gym / Center Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Apex Performance Arena"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Contact Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Monthly Membership Price (₹)</label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    name="price"
                    type="number"
                    required
                    placeholder="2500"
                    min="0"
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/60">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <MapPin className="w-4 h-4" />
              <span>Location & Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Street Address</label>
                <input
                  name="address"
                  type="text"
                  required
                  placeholder="Plot 42, 2nd Floor, Metro Avenue"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">City</label>
                <input
                  name="city"
                  type="text"
                  required
                  placeholder="Mumbai"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">State</label>
                <input
                  name="state"
                  type="text"
                  required
                  placeholder="Maharashtra"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Pincode</label>
                <input
                  name="pincode"
                  type="text"
                  required
                  placeholder="400001"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section: Description */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/60">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <FileText className="w-4 h-4" />
              <span>Facility Overview</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Amenities & Description</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Highlight key equipment, certified trainers, sauna/steam, shower rooms, parking..."
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-zinc-800/60">
            <SubmitButton
              isLoading={loading}
              loadingText="Saving Draft..."
              variant="primary"
              className="flex-1 py-3 rounded-xl"
              icon={<Bookmark className="w-4 h-4" />}
            >
              Save as Draft
            </SubmitButton>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-3 rounded-xl border border-zinc-700/80 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
