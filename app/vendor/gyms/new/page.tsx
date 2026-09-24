"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createGym } from "@/lib/actions/gym";
import { PageHeader } from "@/components/ui/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import LocationSwitch from "@/app/_components/LocationSwitch";
import type { LocationData } from "@/types";
import {
  Dumbbell,
  MapPin,
  IndianRupee,
  Phone,
  FileText,
  AlertCircle,
  Bookmark,
} from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all";

export default function NewGymPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Controlled location fields so LocationSwitch can autofill them
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Hidden location data stored in state, written to hidden inputs on submit
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  function handleLocationCaptured(data: LocationData) {
    setLocationData(data);
    if (data.address) setAddress(data.address);
    if (data.city) setCity(data.city);
    if (data.state) setState(data.state);
    if (data.pincode) setPincode(data.pincode);
  }

  function handleLocationCleared() {
    setLocationData(null);
    // Do NOT clear address fields — vendor may have typed them manually
  }

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <PageHeader
        title="New Gym Application"
        description="Register and configure your fitness center. You can save as draft now and submit for audit later."
        breadcrumbs={[
          { label: "Vendor Portal", href: "/vendor/dashboard" },
          { label: "New Gym Application" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl h-full flex flex-col">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-6">
              <div className="flex-1 space-y-6">

                {/* Basic Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Dumbbell className="w-4 h-4" />
                    <span>Basic Facility Info</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Gym / Center Name</label>
                      <input name="name" type="text" required placeholder="e.g. Apex Performance Arena" className={inputCls} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Contact Phone</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input name="phone" type="tel" required placeholder="+91 98765 00000" className={`${inputCls} pl-10`} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Monthly Membership Price (₹)</label>
                      <div className="relative">
                        <IndianRupee className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input name="price" type="number" required placeholder="2500" min="0" className={`${inputCls} pl-10`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4 pt-4 border-t border-zinc-800/60">
                  {/* Section heading + switch on same row */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <MapPin className="w-4 h-4" />
                      <span>Location &amp; Address</span>
                    </div>
                    <LocationSwitch
                      onLocationCaptured={handleLocationCaptured}
                      onLocationCleared={handleLocationCleared}
                    />
                  </div>

                  {/* Hidden inputs — carry location metadata through FormData */}
                  <input type="hidden" name="latitude" value={locationData?.latitude ?? ""} />
                  <input type="hidden" name="longitude" value={locationData?.longitude ?? ""} />
                  <input type="hidden" name="google_place_id" value={locationData?.google_place_id ?? ""} />
                  <input type="hidden" name="location_link" value={locationData?.location_link ?? ""} />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-3 space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Street Address</label>
                      <input
                        name="address"
                        type="text"
                        required
                        placeholder="Plot 42, 2nd Floor, Metro Avenue"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={inputCls}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">City</label>
                      <input
                        name="city"
                        type="text"
                        required
                        placeholder="Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={inputCls}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">State</label>
                      <input
                        name="state"
                        type="text"
                        required
                        placeholder="Maharashtra"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={inputCls}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">Pincode</label>
                      <input
                        name="pincode"
                        type="text"
                        required
                        placeholder="400001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4 pt-4 border-t border-zinc-800/60">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <FileText className="w-4 h-4" />
                    <span>Facility Overview</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Amenities &amp; Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Highlight key equipment, certified trainers, sauna/steam, shower rooms, parking..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-zinc-800/60">
                {!locationData && (
                  <p className="text-xs text-amber-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    Enable &quot;Share Current Location&quot; to save.
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <SubmitButton
                    isLoading={loading}
                    loadingText="Saving Draft..."
                    variant="primary"
                    className="flex-1 py-3 rounded-xl"
                    icon={<Bookmark className="w-4 h-4" />}
                    disabled={!locationData}
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
              </div>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-3xl border border-zinc-800/80 shadow-2xl shadow-black/50 h-full min-h-[600px]">
            <img
              src="/images/gym-showcase.jpg"
              alt="Professional Gym Showcase"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
