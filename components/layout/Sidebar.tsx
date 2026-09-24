// components/layout/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/tracking", label: "Tracking" },
  { href: "/pending", label: "Pending" },
  { href: "/archive", label: "Archive" },
  { href: "/admin", label: "Admin" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-white flex flex-col">
      <div className="px-5 py-6 border-b border-border">
        <h1 className="font-serif text-lg text-ink tracking-tight">
          Order Tracker
        </h1>
        <p className="text-xs text-muted-light mt-0.5">Daily operations</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-surface text-ink font-medium"
                  : "text-muted hover:bg-surface/70 hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
