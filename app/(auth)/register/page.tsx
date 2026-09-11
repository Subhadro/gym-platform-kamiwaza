"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Dumbbell, User, Mail, Phone, MapPin, Lock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await register(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred during registration.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md rounded-3xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-black/50 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto text-zinc-950 shadow-lg shadow-emerald-500/20 mb-3">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Create an Account</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Join thousands of fitness enthusiasts and find verified gyms
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                name="fullName"
                type="text"
                required
                placeholder="Alex Morgan"
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                name="email"
                type="email"
                required
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">City / Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  name="address"
                  type="text"
                  placeholder="Mumbai, MH"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          <SubmitButton
            isLoading={loading}
            loadingText="Registering..."
            variant="primary"
            className="w-full py-3 mt-3 rounded-xl"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Create Free Account
          </SubmitButton>
        </form>

        <p className="text-xs text-center text-muted-foreground pt-1">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
