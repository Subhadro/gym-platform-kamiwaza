export type UserRole = "ADMIN" | "VENDOR" | "USER";
export type VendorStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "APPROVED" | "LIVE";
export type GymStatus = "DRAFT" | "LIVE" | "INACTIVE";

export interface Profile {
  id?: string;
  full_name: string;
  email: string;
  phone: string | null;
	address:string | null;
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
  phone: string;
  price: number;
  status: GymStatus;
  created_at: string;
  updated_at: string;
}