import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const initial =
    profile?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase();

  return (
    <header className="w-full border-b bg-background px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold tracking-tight">
        GymPlatform
      </Link>

      <div className="flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/gyms" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                Find Gyms
              </NavigationMenuLink>
            </NavigationMenuItem>

            {profile?.role === "VENDOR" && (
              <NavigationMenuItem>
                <NavigationMenuLink href="/vendor/dashboard" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                  Vendor Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {profile?.role === "ADMIN" && (
              <NavigationMenuItem>
                <NavigationMenuLink href="/admin/dashboard" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                  Admin Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {!user && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Programs</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 w-48">
                    <li>
                      <NavigationMenuLink href="/gyms" className="block px-2 py-1 rounded hover:bg-accent text-sm">
                        Browse Gyms
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {user ? (
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold hover:opacity-90 transition"
            title="View Profile"
          >
            {initial}
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-md border hover:bg-accent transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
