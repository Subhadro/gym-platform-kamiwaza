"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function becomeVendor(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const business_name = formData.get("business_name") as string;
  const owner_name = formData.get("owner_name") as string;
  const phone = formData.get("business_phone") as string;
  const email = formData.get("business_email") as string;

  const { error: vendorError } = await supabase.from("vendors").insert({
    profile_id: user.id,
    business_name,
    owner_name,
    phone,
    email,
    status: "DRAFT",
  });

  if (vendorError) return { error: vendorError.message };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "VENDOR" })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/vendor/dashboard");
  revalidatePath("/admin/dashboard");

  redirect("/vendor/dashboard");
}
