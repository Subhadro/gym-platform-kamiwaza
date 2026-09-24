// ── Enums ─────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "VENDOR" | "USER";
export type VendorStatus = "DRAFT" | "APPROVED" | "LIVE";
export type GymStatus = "DRAFT" | "PENDING" | "UNDER_REVIEW" | "APPROVED" | "LIVE" | "REJECTED";

// ── DB Models ─────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  profile_id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  status: VendorStatus;
  created_at: string;
  updated_at: string;
}

export interface Gym {
  id: string;
  vendor_id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
  location_link: string | null;
  phone: string;
  price: number;
  status: GymStatus;
  created_at: string;
  updated_at: string;
}

// ── Shared UI / Component Types ───────────────────────────────────

/** Slim gym shape used in admin GymTabs and dashboard lists */
export interface GymSummary {
  id: string;
  name: string;
  city: string;
  state: string;
  status: GymStatus;
  vendors: { business_name: string } | null;
}

/** Location data captured by LocationSwitch and stored on Gym */
export interface LocationData {
  latitude: number;
  longitude: number;
  google_place_id: string;
  location_link: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}
