// components/orders/StatusBadge.tsx

import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const statusStyles: Record<OrderStatus, string> = {
  "Delivery In Progress": "bg-sky-100 text-sky-900 border-sky-200",
  "Not Loaded": "bg-amber-100 text-amber-900 border-amber-200",
  "Assembly In Progress": "bg-indigo-100 text-indigo-900 border-indigo-200",
  "Not Done": "bg-red-100 text-red-900 border-red-200",
  "Job Done": "bg-emerald-100 text-emerald-900 border-emerald-200",
  "Posted": "bg-slate-100 text-slate-700 border-slate-200",
  "Cancelled": "bg-gray-100 text-gray-500 border-gray-200 line-through",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
