// components/orders/StatusSelect.tsx

"use client";

import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<OrderStatus, string> = {
  "Delivery In Progress": "bg-sky-100 text-sky-900 border-sky-300",
  "Not Loaded": "bg-amber-100 text-amber-900 border-amber-300",
  "Assembly In Progress": "bg-indigo-100 text-indigo-900 border-indigo-300",
  "Not Done": "bg-red-100 text-red-900 border-red-300",
  "Job Done": "bg-emerald-100 text-emerald-900 border-emerald-300",
  "Posted": "bg-slate-100 text-slate-700 border-slate-300",
  "Cancelled": "bg-gray-100 text-gray-500 border-gray-300",
};

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
      className={cn(
        "text-xs font-medium border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:opacity-50 min-w-[140px]",
        statusStyles[value]
      )}
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status} className="bg-white text-ink">
          {status}
        </option>
      ))}
    </select>
  );
}
