"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RealtimeRefresh() {
  const router = useRouter();
  const pathname = usePathname();

  // 1. Supabase Realtime listener using useEffect
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  // 2. Window focus & visibility change listener to refresh stale tab data
  useEffect(() => {
    const handleFocus = () => {
      router.refresh();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  // 3. Re-sync router on pathname navigation
  useEffect(() => {
    router.refresh();
  }, [pathname, router]);

  return null;
}
