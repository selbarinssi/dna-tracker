// components/orders/StatusBadge.tsx

import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const statusStyles: Record<OrderStatus, string> = {
  "Delivery In Progress": "bg-blue-50 text-blue-800 border-blue-100",
  "Not Loaded": "bg-amber-50 text-amber-800 border-amber-100",
  "Assembly In Progress": "bg-indigo-50 text-indigo-800 border-indigo-100",
  "Not Done": "bg-red-50 text-red-800 border-red-100",
  "Job Done": "bg-emerald-50 text-emerald-800 border-emerald-100",
  "Posted": "bg-gray-100 text-gray-700 border-gray-200",
  "Cancelled": "bg-gray-100 text-gray-500 border-gray-200 line-through",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
