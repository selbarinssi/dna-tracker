// components/layout/Header.tsx

"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";

export function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-white">
      {/* Top row */}
      <div className="h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <h1 className="font-serif text-lg text-ink tracking-tight">
            Order Tracker
          </h1>
          <Sidebar />
        </div>

        <div className="flex items-center gap-4">
          {email && (
            <span className="text-sm text-muted-light truncate max-w-[180px]">
              {email}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="text-sm text-muted hover:text-ink transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
