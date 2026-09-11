"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function register(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        full_name: fullName,
        phone,
        address,
      },
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/profile");

  return {
    success: true,
    user: data.user,
  };
}