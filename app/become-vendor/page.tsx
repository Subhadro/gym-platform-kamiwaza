"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { becomeVendor } from "./action";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SubmitButton } from "@/components/ui/submit-button";
import { Store, User, Phone, Mail, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function BecomeVendorPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await becomeVendor(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        typeof (err as { digest?: unknown }).digest === "string" &&
        (err as { digest: string }).digest.includes("NEXT_REDIRECT")
      ) {
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to register vendor account");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Breadcrumb items={[{ label: "Become a Vendor" }]} />

      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Partner Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Become a Gym Vendor</h1>
          <p className="text-sm text-muted-foreground">
            Register your business on GymPlatform to start listing fitness centers and managing memberships.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Business / Gym Brand Name</label>
            <div className="relative">
              <Store className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                name="business_name"
                type="text"
                required
                placeholder="e.g. Iron Forge Fitness Co."
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Authorized Owner / Representative Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                name="owner_name"
                type="text"
                required
                placeholder="e.g. Marcus Vance"
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Business Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  name="business_phone"
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Business Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  name="business_email"
                  type="email"
                  required
                  placeholder="contact@ironforge.com"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-800/60">
            <SubmitButton
              isLoading={loading}
              loadingText="Submitting application..."
              variant="primary"
              className="flex-1 py-3 rounded-xl"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Partner Application
            </SubmitButton>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-3 rounded-xl border border-zinc-700/80 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
