// components/layout/Sidebar.tsx
// (Now used as TopNav)

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
    <nav className="flex items-center gap-1 px-2">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-sm transition-colors",
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
  );
}
