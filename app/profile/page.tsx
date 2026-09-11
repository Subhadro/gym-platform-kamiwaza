import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/(auth)/logout/action";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, address, role, created_at")
    .eq("id", user.id)
    .single();

  const initial =
    profile?.full_name?.[0]?.toUpperCase() ??
    user.email?.[0]?.toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md border rounded-xl p-8 shadow-sm space-y-6">

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
            {initial}
          </div>
          <h1 className="text-2xl font-bold">{profile?.full_name ?? "User"}</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            <span className="text-xs border rounded-full px-2 py-0.5 font-medium">
              {profile?.role ?? "USER"}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 border-t pt-4">
          {profile?.phone && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone</span>
              <span>{profile.phone}</span>
            </div>
          )}
          {profile?.address && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Address</span>
              <span>{profile.address}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member since</span>
            <span>{new Date(profile?.created_at ?? user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {profile?.role === "USER" && (
          <Link
            href="/become-vendor"
            className="block w-full text-center border border-primary text-primary rounded-md py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition"
          >
            Become a Vendor
          </Link>
        )}

        {profile?.role === "VENDOR" && (
          <Link
            href="/vendor/dashboard"
            className="block w-full text-center border border-primary text-primary rounded-md py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition"
          >
            Go to Vendor Dashboard
          </Link>
        )}

        {profile?.role === "ADMIN" && (
          <Link
            href="/admin/dashboard"
            className="block w-full text-center border border-primary text-primary rounded-md py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition"
          >
            Go to Admin Dashboard
          </Link>
        )}

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="w-full border border-destructive text-destructive rounded-md py-2 text-sm font-medium hover:bg-destructive hover:text-white transition"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
