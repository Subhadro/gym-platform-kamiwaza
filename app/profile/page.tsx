import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/(auth)/logout/action";
import { SubmitButton } from "@/components/ui/submit-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { User, Mail, Phone, MapPin, Calendar, Shield, Store, LogOut, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    user.email?.[0]?.toUpperCase() ??
    "U";

  const memberDate = new Date(profile?.created_at ?? user.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: "My Profile" }]} />

      {/* Main Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/40 space-y-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Avatar & Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-zinc-800/60">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-zinc-950 text-3xl font-extrabold shadow-xl shadow-emerald-500/20">
              {initial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-zinc-900 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-zinc-950" />
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {profile?.full_name || "Fitness Member"}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit mx-auto sm:mx-0">
                <Shield className="w-3 h-3" />
                {profile?.role ?? "USER"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              <span>{profile?.email ?? user.email}</span>
            </p>
          </div>
        </div>

        {/* Personal Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phone Number</span>
            </div>
            <p className="text-sm font-medium text-zinc-200">{profile?.phone || "Not provided"}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Location / Address</span>
            </div>
            <p className="text-sm font-medium text-zinc-200">{profile?.address || "Not provided"}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Member Since</span>
            </div>
            <p className="text-sm font-medium text-zinc-200">{memberDate}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Account Status</span>
            </div>
            <p className="text-sm font-medium text-emerald-400">Verified Active</p>
          </div>
        </div>

        {/* Role Navigation Actions */}
        <div className="space-y-3 pt-2">
          {profile?.role === "USER" && (
            <Link
              href="/become-vendor"
              className="flex items-center justify-between p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-semibold">Become a Gym Vendor</p>
                  <p className="text-xs text-emerald-400/80 font-normal">List and manage your fitness center on the platform</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {profile?.role === "VENDOR" && (
            <Link
              href="/vendor/dashboard"
              className="flex items-center justify-between p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-semibold">Go to Vendor Dashboard</p>
                  <p className="text-xs text-emerald-400/80 font-normal">View submissions and manage facilities</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {profile?.role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className="flex items-center justify-between p-4 rounded-2xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-semibold text-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-semibold">Go to Admin Dashboard</p>
                  <p className="text-xs text-teal-400/80 font-normal">Review applications, audit gyms and vendors</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Logout Form with Loading Button */}
        <div className="pt-4 border-t border-zinc-800/60">
          <form action={logout}>
            <SubmitButton
              variant="destructive"
              loadingText="Logging out..."
              icon={<LogOut className="w-4 h-4" />}
              className="w-full py-3 rounded-xl"
            >
              Log Out of Account
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}
