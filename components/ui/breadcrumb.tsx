import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-muted-foreground ${className ?? ""}`}>
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors py-1 text-zinc-400"
            title="Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-emerald-400 transition-colors py-1 text-zinc-400 max-w-[150px] sm:max-w-none truncate"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-zinc-200 font-medium py-1 max-w-[200px] sm:max-w-none truncate">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
