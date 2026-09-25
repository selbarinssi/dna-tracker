// components/admin/TrackersManager.tsx

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tracker } from "@/types";
import { useRouter } from "next/navigation";

interface TrackersManagerProps {
  initialTrackers: Tracker[];
}

export function TrackersManager({ initialTrackers }: TrackersManagerProps) {
  const [trackers, setTrackers] = useState(initialTrackers);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("trackers")
      .insert({ name: trimmed, is_active: true })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setTrackers((prev) => [...prev, data as Tracker]);
    setName("");
    setLoading(false);
    router.refresh();
  }

  async function toggleActive(tracker: Tracker) {
    setError(null);
    const next = !tracker.is_active;

    const { error: updateError } = await supabase
      .from("trackers")
      .update({ is_active: next, updated_at: new Date().toISOString() })
      .eq("id", tracker.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setTrackers((prev) =>
      prev.map((t) =>
        t.id === tracker.id ? { ...t, is_active: next } : t
      )
    );
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-xl">
      <form onSubmit={handleAdd} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm text-muted mb-1.5">
            Tracker name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sara"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-ink placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="px-5 py-2.5 bg-ink text-ivory rounded-lg text-sm font-medium hover:bg-[#2A2927] disabled:opacity-50 transition-colors"
        >
          {loading ? "Adding…" : "Add"}
        </button>
      </form>

      {error && (
        <div className="text-sm text-red-800 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-lg">
          {error}
        </div>
      )}

      <div className="border border-border rounded-xl bg-white overflow-hidden shadow-soft">
        {trackers.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">
            No trackers yet. Add the first one above.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {trackers.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <span className="text-ink font-medium">{t.name}</span>
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      t.is_active
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-surface text-muted"
                    }`}
                  >
                    {t.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleActive(t)}
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  {t.is_active ? "Deactivate" : "Activate"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-muted-light">
        Only active trackers receive new orders on the next Excel upload.
      </p>
    </div>
  );
}
