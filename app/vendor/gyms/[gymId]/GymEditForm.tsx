"use client";

import { useState, useTransition } from "react";
import { updateGym, submitGym } from "@/lib/actions/gym";
import { SubmitButton } from "@/components/ui/submit-button";
import LocationSwitch from "@/app/_components/LocationSwitch";
import type { LocationData, Gym } from "@/types";
import { Dumbbell, Phone, MapPin, IndianRupee, FileText, Send, Save, Loader2 } from "lucide-react";

const inputCls = (disabled: boolean) =>
  `w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all ${
    disabled ? "opacity-60 cursor-not-allowed" : ""
  }`;

interface Props {
  gym: Gym;
  isEditable: boolean;
}

export default function GymEditForm({ gym, isEditable }: Props) {
  // Controlled address fields — pre-filled from saved gym data
  const [address, setAddress] = useState(gym.address);
  const [city, setCity] = useState(gym.city);
  const [state, setState] = useState(gym.state);
  const [pincode, setPincode] = useState(gym.pincode);

  // Location metadata — pre-filled from saved gym data
  const [locationData, setLocationData] = useState<LocationData | null>(
    gym.latitude && gym.longitude
      ? {
          latitude: gym.latitude,
          longitude: gym.longitude,
          google_place_id: gym.google_place_id ?? "",
          location_link:
            gym.location_link ??
            `https://www.google.com/maps?q=${gym.latitude},${gym.longitude}`,
        }
      : null
  );

  function handleLocationCaptured(data: LocationData) {
    setLocationData(data);
    if (data.address) setAddress(data.address);
    if (data.city) setCity(data.city);
    if (data.state) setState(data.state);
    if (data.pincode) setPincode(data.pincode);
  }

  function handleLocationCleared() {
    setLocationData(null);
    // Don't clear address fields
  }

  const [submitting, setSubmitting] = useTransition();
  const updateAction = updateGym.bind(null, gym.id);

  function handleSubmitForReview() {
    setSubmitting(async () => {
      await submitGym(gym.id);
    });
  }

  return (
    <form action={updateAction} className="space-y-6">
      {/* General Info */}
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
              className={inputCls(!isEditable)}
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
                className={`${inputCls(!isEditable)} pl-10`}
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
                className={`${inputCls(!isEditable)} pl-10`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4 pt-4 border-t border-zinc-800/60">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <MapPin className="w-4 h-4" />
            <span>Location Details</span>
          </div>
          <LocationSwitch
            onLocationCaptured={handleLocationCaptured}
            onLocationCleared={handleLocationCleared}
            disabled={!isEditable}
            initialCaptured={!!(gym.latitude && gym.longitude)}
          />
        </div>

        {/* Show existing location link if captured */}
        {locationData?.location_link && (
          <a
            href={locationData.location_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
          >
            <MapPin className="w-3 h-3" />
            View on Google Maps
          </a>
        )}

        {/* Hidden location inputs */}
        <input type="hidden" name="latitude" value={locationData?.latitude ?? ""} />
        <input type="hidden" name="longitude" value={locationData?.longitude ?? ""} />
        <input type="hidden" name="google_place_id" value={locationData?.google_place_id ?? ""} />
        <input type="hidden" name="location_link" value={locationData?.location_link ?? ""} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Address</label>
            <input
              name="address"
              type="text"
              required
              disabled={!isEditable}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputCls(!isEditable)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">City</label>
            <input
              name="city"
              type="text"
              required
              disabled={!isEditable}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputCls(!isEditable)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">State</label>
            <input
              name="state"
              type="text"
              required
              disabled={!isEditable}
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputCls(!isEditable)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Pincode</label>
            <input
              name="pincode"
              type="text"
              required
              disabled={!isEditable}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className={inputCls(!isEditable)}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4 pt-4 border-t border-zinc-800/60">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <FileText className="w-4 h-4" />
          <span>Description &amp; Features</span>
        </div>
        <textarea
          name="description"
          rows={3}
          defaultValue={gym.description ?? ""}
          disabled={!isEditable}
          className={`${inputCls(!isEditable)} resize-none`}
        />
      </div>

      {isEditable && (
        <>
          {!locationData && (
            <p className="text-xs text-amber-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              Enable &quot;Share Current Location&quot; to save.
            </p>
          )}
          <SubmitButton
            variant="outline"
            loadingText="Saving Changes..."
            icon={<Save className="w-4 h-4" />}
            className="w-full py-3 rounded-xl"
            disabled={!locationData}
          >
            Save Changes
          </SubmitButton>

          {/* Submit for review — called directly to avoid nested <form> */}
          <div className="pt-4 border-t border-zinc-800/60">
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="w-full py-3 rounded-xl inline-flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Submitting for Review...</span></>
              ) : (
                <><Send className="w-4 h-4" /><span>Submit Application for Review</span></>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
