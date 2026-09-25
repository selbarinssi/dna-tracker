// app/(dashboard)/admin/trackers/page.tsx

import { createClient } from "@/lib/supabase/server";
import { TrackersManager } from "@/components/admin/TrackersManager";
import type { Tracker } from "@/types";
import Link from "next/link";

export default async function TrackersPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("trackers")
    .select("*")
    .order("name", { ascending: true });

  const trackers = (data as Tracker[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-muted hover:text-ink transition-colors"
        >
          ← Admin
        </Link>
        <h1 className="font-serif text-2xl text-ink tracking-tight mt-2">
          Trackers
        </h1>
        <p className="text-sm text-muted mt-1">
          Manage who receives daily order assignments
        </p>
      </div>

      <TrackersManager initialTrackers={trackers} />
    </div>
  );
}
