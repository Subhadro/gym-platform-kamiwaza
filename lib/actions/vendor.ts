"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Vendor, VendorStatus } from "@/types";

// ── Shared helper ─────────────────────────────────────────────────

export async function getVendorForUser(): Promise<Vendor | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("vendors")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  return data ?? null;
}

// ── Admin helper ──────────────────────────────────────────────────

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

// ── Admin vendor actions ──────────────────────────────────────────

export async function adminUpdateVendor(vendorId: string, formData: FormData): Promise<void> {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("vendors")
    .update({
      business_name: formData.get("business_name") as string,
      owner_name: formData.get("owner_name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      updated_at: new Date().toISOString(),
    })
    .eq("id", vendorId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/vendors/${vendorId}`);
  revalidatePath("/admin/dashboard");
  revalidatePath("/vendor/dashboard");
  revalidatePath("/", "layout");
}

export async function advanceVendorStatus(vendorId: string, status: VendorStatus): Promise<void> {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("vendors")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", vendorId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/vendors/${vendorId}`);
  revalidatePath("/admin/dashboard");
  revalidatePath("/vendor/dashboard");
  revalidatePath("/profile");
  revalidatePath("/", "layout");
}

export async function approveVendor(vendorId: string): Promise<void> {
  return advanceVendorStatus(vendorId, "APPROVED");
}

export async function makeVendorLive(vendorId: string): Promise<void> {
  return advanceVendorStatus(vendorId, "LIVE");
}

export async function resetVendorToDraft(vendorId: string): Promise<void> {
  return advanceVendorStatus(vendorId, "DRAFT");
}
