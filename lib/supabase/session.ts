import { cache } from "react";
import { createClient } from "./server";
import type { Profile, UserRole } from "@/types";

/**
 * Returns the authenticated Supabase user for the current request.
 * Cached with React cache() — called at most once per server render cycle.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

/**
 * Returns the profile row for the current user.
 * Cached with React cache() — called at most once per server render cycle.
 */
export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data ?? null;
});

/**
 * Requires an authenticated user. Returns the user or throws/redirects.
 * Use in server actions and pages that need auth.
 */
export const requireUser = cache(async () => {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
});

/**
 * Requires a specific role. Throws if user lacks it.
 */
export const requireRole = cache(async (role: UserRole) => {
  const profile = await getProfile();
  if (!profile || profile.role !== role) throw new Error("Forbidden");
  return profile;
});
