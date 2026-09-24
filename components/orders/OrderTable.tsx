// components/orders/OrderTable.tsx

"use client";

import { useState } from "react";
import type { Order, OrderStatus, SolvingOwner } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { StatusSelect } from "./StatusSelect";
import { SolvingOwnerSelect } from "./SolvingOwnerSelect";
import { createClient } from "@/lib/supabase/client";

interface OrderTableProps {
  orders: Order[];
  canEdit?: boolean;
}

export function OrderTable({ orders: initialOrders, canEdit = false }: OrderTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const supabase = createClient();

  async function updateOrder(
    id: string,
    field: "status" | "solving_owner" | "comment",
    value: any
  ) {
    setUpdatingId(id);

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );

    const { error } = await supabase
      .from("orders")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error("Update failed:", error);
      // Revert on error
      setOrders(initialOrders);
    }

    setUpdatingId(null);
  }

  if (orders.length === 0) {
    return (
      <div className="border border-border rounded-xl bg-white p-12 text-center">
        <p className="text-muted text-sm">No orders for today yet.</p>
        <p className="text-muted-light text-xs mt-1">
          Upload an Excel file from the Admin page.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="text-left font-medium text-muted px-4 py-3">Order Code</th>
              <th className="text-left font-medium text-muted px-4 py-3">Customer</th>
              <th className="text-left font-medium text-muted px-4 py-3">City</th>
              <th className="text-left font-medium text-muted px-4 py-3">Team</th>
              <th className="text-left font-medium text-muted px-4 py-3">Status</th>
              <th className="text-left font-medium text-muted px-4 py-3">Solving Owner</th>
              <th className="text-left font-medium text-muted px-4 py-3">Phone</th>
              <th className="text-left font-medium text-muted px-4 py-3 min-w-[180px]">Comment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0 hover:bg-surface/30 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-ink">
                  {order.order_code}
                </td>
                <td className="px-4 py-3 text-ink">
                  {order.customer_name || "—"}
                </td>
                <td className="px-4 py-3 text-muted">
                  {order.city || "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">
                  {order.team_code || "—"}
                </td>
                <td className="px-4 py-3">
                  {canEdit ? (
                    <StatusSelect
                      value={order.status}
                      onChange={(value) => updateOrder(order.id, "status", value)}
                      disabled={updatingId === order.id}
                    />
                  ) : (
                    <StatusBadge status={order.status} />
                  )}
                </td>
                <td className="px-4 py-3">
                  {canEdit ? (
                    <SolvingOwnerSelect
                      value={order.solving_owner}
                      onChange={(value) =>
                        updateOrder(order.id, "solving_owner", value)
                      }
                      disabled={updatingId === order.id}
                    />
                  ) : (
                    order.solving_owner || "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  {order.phone_no ? (
                    <a
                      href={`https://wa.me/${order.phone_no.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink hover:underline"
                    >
                      {order.phone_no}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  {canEdit ? (
                    <input
                      type="text"
                      defaultValue={order.comment || ""}
                      onBlur={(e) => {
                        const newValue = e.target.value.trim() || null;
                        if (newValue !== order.comment) {
                          updateOrder(order.id, "comment", newValue);
                        }
                      }}
                      disabled={updatingId === order.id}
                      placeholder="Add comment…"
                      className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:opacity-50"
                    />
                  ) : (
                    <span className="text-muted text-xs">
                      {order.comment || "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
