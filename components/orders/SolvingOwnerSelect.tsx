// components/orders/SolvingOwnerSelect.tsx

"use client";

import { SOLVING_OWNERS } from "@/lib/constants";
import type { SolvingOwner } from "@/types";

interface SolvingOwnerSelectProps {
  value: SolvingOwner | null;
  onChange: (value: SolvingOwner | null) => void;
  disabled?: boolean;
}

export function SolvingOwnerSelect({
  value,
  onChange,
  disabled,
}: SolvingOwnerSelectProps) {
  return (
    <select
      value={value || ""}
      onChange={(e) =>
        onChange(e.target.value === "" ? null : (e.target.value as SolvingOwner))
      }
      disabled={disabled}
      className="text-xs border border-border rounded-md px-2 py-1.5 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:opacity-50"
    >
      <option value="">—</option>
      {SOLVING_OWNERS.map((owner) => (
        <option key={owner} value={owner}>
          {owner}
        </option>
      ))}
    </select>
  );
}
