// components/orders/StatusSelect.tsx

"use client";

import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderStatus } from "@/types";

interface StatusSelectProps {
  value: OrderStatus;
  onChange: (value: OrderStatus) => void;
  disabled?: boolean;
}

export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      disabled={disabled}
      className="text-xs border border-border rounded-md px-2 py-1.5 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:opacity-50"
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
