// components/orders/OrderTable.tsx

import type { Order } from "@/types";
import { StatusBadge } from "./StatusBadge";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
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
              <th className="text-left font-medium text-muted px-4 py-3">Team Code</th>
              <th className="text-left font-medium text-muted px-4 py-3">Status</th>
              <th className="text-left font-medium text-muted px-4 py-3">Phone</th>
              <th className="text-left font-medium text-muted px-4 py-3">Timeslot</th>
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
                  <StatusBadge status={order.status} />
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
                <td className="px-4 py-3 text-muted">
                  {order.timeslot || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
