import { createClient } from "@/lib/supabase/server";
import type { Gym } from "@/lib/types/db";

export default async function GymsPage() {
  const supabase = await createClient();
  const { data: gyms } = await supabase
    .from("gyms")
    .select("*")
    .in("status", ["APPROVED", "LIVE"])
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Find a Gym</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse verified gyms near you</p>
      </div>

      {!gyms?.length ? (
        <div className="border rounded-xl p-12 text-center text-muted-foreground">
          <p className="text-lg font-medium">No gyms available yet</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {gyms.map((gym: Gym) => (
            <div key={gym.id} className="border rounded-xl p-5 space-y-3 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-lg leading-tight">{gym.name}</h2>
                {gym.status === "LIVE" && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium shrink-0">
                    LIVE
                  </span>
                )}
              </div>
              {gym.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{gym.description}</p>
              )}
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{gym.address}, {gym.city}, {gym.state} - {gym.pincode}</p>
                <p>{gym.phone}</p>
              </div>
              <p className="text-sm font-semibold">₹{gym.price}/month</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
