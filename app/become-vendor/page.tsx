"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { becomeVendor } from "./action";

export default function BecomeVendorPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await becomeVendor(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // on success, server redirects to /profile
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm border rounded-xl p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Become a Vendor</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set up your business on GymPlatform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "business_name", label: "Business Name", type: "text" },
            { name: "owner_name", label: "Owner Name", type: "text" },
            { name: "business_phone", label: "Business Phone", type: "tel" },
            { name: "business_email", label: "Business Email", type: "email" },
          ].map(({ name, label, type }) => (
            <div key={name} className="space-y-1">
              <label className="text-sm font-medium">{label}</label>
              <input
                name={name}
                type={type}
                required
                className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full border rounded-md py-2 text-sm font-medium hover:bg-accent transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
