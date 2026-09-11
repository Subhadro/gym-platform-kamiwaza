"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath("/vendor/dashboard");
  revalidatePath("/admin/dashboard");
  redirect("/login");
}
