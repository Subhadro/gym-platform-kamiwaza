"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGym } from "@/lib/actions/gym";

const fields = [
  { name: "name", label: "Gym Name", type: "text" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "pincode", label: "Pincode", type: "text" },
  { name: "price", label: "Monthly Price (₹)", type: "number" },
] as const;

export default function NewGymPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      await createGym(formData);
    } catch (err: unknown) {
      // Re-throw Next.js redirect exceptions
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        typeof (err as { digest?: unknown }).digest === "string" &&
        (err as { digest: string }).digest.includes("NEXT_REDIRECT")
      ) {
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to create gym");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Gym Application</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details. You can save as draft and submit later.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, label, type }) => (
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

        <div className="space-y-1">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border rounded-md py-2 text-sm font-medium hover:bg-accent transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
