"use server";

import { createClient } from "@/lib/supabase/server";
import { getVendorForUser } from "@/lib/actions/vendor";
import { redirect } from "next/navigation";
import type { GymStatus } from "@/lib/types/db";

// ── Vendor actions ────────────────────────────────────────────────

export async function createGym(formData: FormData) {
  const supabase = await createClient();
  const vendor = await getVendorForUser();
  if (!vendor) throw new Error("Vendor account not found");

  const { data, error } = await supabase
    .from("gyms")
    .insert({
      vendor_id: vendor.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      phone: formData.get("phone") as string,
      price: parseFloat(formData.get("price") as string) || 0,
      status: "DRAFT",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  redirect(`/vendor/gyms/${data.id}`);
}

export async function updateGym(gymId: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const vendor = await getVendorForUser();
  if (!vendor) throw new Error("Vendor account not found");

  const { error } = await supabase
    .from("gyms")
    .update({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      phone: formData.get("phone") as string,
      price: parseFloat(formData.get("price") as string) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", gymId)
    .eq("vendor_id", vendor.id);

  if (error) throw new Error(error.message);
}

export async function submitGym(gymId: string): Promise<void> {
  const supabase = await createClient();
  const vendor = await getVendorForUser();
  if (!vendor) throw new Error("Vendor account not found");

  const { error } = await supabase
    .from("gyms")
    .update({ status: "PENDING", updated_at: new Date().toISOString() })
    .eq("id", gymId)
    .eq("vendor_id", vendor.id)
    .in("status", ["DRAFT", "REJECTED"]);

  if (error) throw new Error(error.message);
  redirect("/vendor/dashboard");
}

// ── Admin helpers ─────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "ADMIN") throw new Error("Unauthorized");
  return supabase;
}

// ── Admin gym actions ─────────────────────────────────────────────

export async function adminUpdateGym(gymId: string, formData: FormData): Promise<void> {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("gyms")
    .update({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      phone: formData.get("phone") as string,
      price: parseFloat(formData.get("price") as string) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", gymId);

  if (error) throw new Error(error.message);
}

export async function advanceGymStatus(gymId: string, status: GymStatus): Promise<void> {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("gyms")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", gymId);

  if (error) throw new Error(error.message);
}

export async function setGymUnderReview(gymId: string): Promise<void> {
  return advanceGymStatus(gymId, "UNDER_REVIEW");
}

export async function reviewGym(gymId: string, action: "approve" | "reject"): Promise<void> {
  return advanceGymStatus(gymId, action === "approve" ? "APPROVED" : "REJECTED");
}

export async function goLive(gymId: string): Promise<void> {
  return advanceGymStatus(gymId, "LIVE");
}
