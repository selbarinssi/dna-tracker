// components/orders/TrackerSelect.tsx

"use client";

import type { Tracker } from "@/types";

interface TrackerSelectProps {
  value: string | null;
  trackers: Tracker[];
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export function TrackerSelect({
  value,
  trackers,
  onChange,
  disabled,
}: TrackerSelectProps) {
  const active = trackers.filter((t) => t.is_active);
  // Keep current assignment visible even if that tracker was deactivated
  const current = trackers.find((t) => t.id === value);
  const options =
    current && !current.is_active ? [...active, current] : active;

  return (
    <select
      value={value || ""}
      onChange={(e) =>
        onChange(e.target.value === "" ? null : e.target.value)
      }
      disabled={disabled}
      className="text-xs border border-border rounded-md px-2 py-1.5 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:opacity-50 min-w-[100px]"
    >
      <option value="">—</option>
      {options.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
          {!t.is_active ? " (inactive)" : ""}
        </option>
      ))}
    </select>
  );
}
