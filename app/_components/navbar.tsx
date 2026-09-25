import Link from "next/link";
import { getUser, getProfile } from "@/lib/supabase/session";
import { Dumbbell, User, ShieldAlert, Store, Compass, LogIn } from "lucide-react";

export default async function Navbar() {
  const [user, profile] = await Promise.all([getUser(), getProfile()]);

  const initial =
    profile?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/70 bg-zinc-950/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Gym<span className="text-emerald-400">Platform</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-zinc-300">
          <Link
            href="/gyms"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:bg-zinc-800/70 hover:text-white transition-colors"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Find Gyms</span>
          </Link>

          {profile?.role === "VENDOR" && (
            <Link
              href="/vendor/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:bg-zinc-800/70 hover:text-emerald-400 transition-colors"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Vendor Portal</span>
            </Link>
          )}

          {profile?.role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:bg-zinc-800/70 hover:text-emerald-400 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Admin Console</span>
            </Link>
          )}

          {(!profile || profile.role === "USER") && (
            <Link
              href="/become-vendor"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
            >
              Become a Vendor
            </Link>
          )}
        </nav>

        {/* User Auth actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {profile?.role && profile.role !== "USER" && (
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800/90 border border-zinc-700/80 text-zinc-300 uppercase tracking-wide">
                  {profile.role}
                </span>
              )}

              <Link
                href="/profile"
                className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-600/60 text-white font-bold text-sm shadow-md hover:border-emerald-500/60 hover:shadow-emerald-500/20 hover:scale-105 transition-all"
                title="View Your Profile"
              >
                <span className="group-hover:text-emerald-300 transition-colors">{initial}</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
