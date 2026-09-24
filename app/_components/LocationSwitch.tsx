"use client";

import { useState } from "react";
import { MapPin, Loader2, AlertCircle, CheckCircle2, Navigation } from "lucide-react";
import type { LocationData } from "@/types";

interface Props {
  /** Called once when location is successfully captured */
  onLocationCaptured: (data: LocationData) => void;
  /** Called when switch is turned off */
  onLocationCleared: () => void;
  /** Whether the form fields are disabled (non-editable gym) */
  disabled?: boolean;
  /** Pre-existing coords to show as already captured */
  initialCaptured?: boolean;
}

type Status = "idle" | "requesting" | "geocoding" | "done" | "error";

export default function LocationSwitch({
  onLocationCaptured,
  onLocationCleared,
  disabled = false,
  initialCaptured = false,
}: Props) {
  const [on, setOn] = useState(initialCaptured);
  const [status, setStatus] = useState<Status>(initialCaptured ? "done" : "idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function capture() {
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setStatus("requesting");
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setStatus("geocoding");

        try {
          const res = await fetch(
            `/api/geocode?lat=${latitude}&lng=${longitude}`,
            { cache: "no-store" }
          );
          const json = await res.json();

          if (!res.ok) {
            // Geocoding failed but we still have coords — store them, skip autofill
            const data: LocationData = {
              latitude,
              longitude,
              google_place_id: "",
              location_link: `https://www.google.com/maps?q=${latitude},${longitude}`,
            };
            onLocationCaptured(data);
            setStatus("done");
            return;
          }

          const data: LocationData = {
            latitude,
            longitude,
            google_place_id: json.google_place_id ?? "",
            location_link: `https://www.google.com/maps?q=${latitude},${longitude}`,
            address: json.address,
            city: json.city,
            state: json.state,
            pincode: json.pincode,
          };

          onLocationCaptured(data);
          setStatus("done");
        } catch {
          // Network error — still save coords
          const data: LocationData = {
            latitude,
            longitude,
            google_place_id: "",
            location_link: `https://www.google.com/maps?q=${latitude},${longitude}`,
          };
          onLocationCaptured(data);
          setStatus("done");
        }
      },
      (err) => {
        setStatus("error");
        setErrorMsg(
          err.code === 1
            ? "Location permission denied. Please allow access or enter address manually."
            : err.code === 2
            ? "Location unavailable. Please enter address manually."
            : "Location request timed out. Please try again."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function toggle() {
    if (disabled) return;
    if (on) {
      setOn(false);
      setStatus("idle");
      setErrorMsg(null);
      onLocationCleared();
    } else {
      setOn(true);
      capture();
    }
  }

  return (
    <div className="space-y-2">
      {/* Switch row */}
      <button
        type="button"
        onClick={toggle}
        disabled={disabled || status === "requesting" || status === "geocoding"}
        className="flex items-center gap-3 group disabled:cursor-not-allowed"
        aria-label="Toggle location capture"
      >
        {/* Track */}
        <div
          className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${
            on ? "bg-emerald-500" : "bg-zinc-700"
          } ${disabled ? "opacity-50" : "group-hover:opacity-90"}`}
        >
          {/* Thumb */}
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
              on ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>

        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          Share Current Location
        </span>

        {(status === "requesting" || status === "geocoding") && (
          <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
        )}
        {status === "done" && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        )}
      </button>

      {/* Status messages */}
      {status === "requesting" && (
        <p className="text-xs text-zinc-400 flex items-center gap-1.5 pl-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          Requesting GPS permission…
        </p>
      )}
      {status === "geocoding" && (
        <p className="text-xs text-zinc-400 flex items-center gap-1.5 pl-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          Fetching address from coordinates…
        </p>
      )}
      {status === "done" && (
        <p className="text-xs text-emerald-400 flex items-center gap-1.5 pl-1">
          <CheckCircle2 className="w-3 h-3" />
          Location captured. Fields auto-filled — you can still edit them.
        </p>
      )}
      {status === "error" && errorMsg && (
        <p className="text-xs text-rose-400 flex items-center gap-1.5 pl-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {errorMsg}
        </p>
      )}
    </div>
  );
}
