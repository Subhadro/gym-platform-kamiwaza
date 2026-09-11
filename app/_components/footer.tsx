import Link from "next/link";
import { Dumbbell, ShieldCheck, MapPin, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-zinc-950/60 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span>Gym<span className="text-emerald-400">Platform</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover top-tier fitness centers, boutique studios, and verified training spaces across your city.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Gym Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/gyms" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  Find Gyms
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/become-vendor" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  Partner with Us
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-emerald-400 transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendors & Partners */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">For Partners</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/vendor/dashboard" className="hover:text-emerald-400 transition-colors">
                  Vendor Portal
                </Link>
              </li>
              <li>
                <Link href="/become-vendor" className="hover:text-emerald-400 transition-colors">
                  List Your Facility
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-emerald-400 transition-colors">
                  Admin Control
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Locations</h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
              {["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Pune", "Chennai"].map((city) => (
                <span
                  key={city}
                  className="px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} GymPlatform Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern performance <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400" /> for fitness enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
