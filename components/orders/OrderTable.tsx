// components/orders/OrderTable.tsx

"use client";

import { RootcauseSelect } from "./RootcauseSelect";
import { useState, useEffect } from "react";
import type { Order, Tracker } from "@/types";
import { StatusSelect } from "./StatusSelect";
import { SolvingOwnerSelect } from "./SolvingOwnerSelect";
import { TrackerSelect } from "./TrackerSelect";
import { createClient } from "@/lib/supabase/client";
import {
  useColumnVisibility,
  ColumnToggle,
} from "./ColumnToggle";

interface OrderTableProps {
  orders: Order[];
  rootcauses: { id: string; label: string }[];
  trackers?: Tracker[];
  canEdit?: boolean;
}

export function OrderTable({
  orders: initialOrders,
  rootcauses,
  trackers = [],
  canEdit = false,
}: OrderTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const supabase = createClient();
  const { visible, toggle, isVisible, ready } = useColumnVisibility();

    // Keep local state in sync if server re-fetches (e.g. navigation)
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Live updates from other users
  useEffect(() => {
    const channel = supabase
      .channel("orders-tracking")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Order;
            // Ignore archived rows on Tracking
            if (updated.is_archived) {
              setOrders((prev) => prev.filter((o) => o.id !== updated.id));
              return;
            }
            setOrders((prev) => {
              const exists = prev.some((o) => o.id === updated.id);
              if (exists) {
                return prev.map((o) =>
                  o.id === updated.id ? { ...o, ...updated } : o
                );
              }
              return prev;
            });
          }

          if (payload.eventType === "INSERT") {
            const inserted = payload.new as Order;
            if (inserted.is_archived) return;
            setOrders((prev) => {
              if (prev.some((o) => o.id === inserted.id)) return prev;
              return [...prev, inserted];
            });
          }

          if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id?: string })?.id;
            if (!oldId) return;
            setOrders((prev) => prev.filter((o) => o.id !== oldId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function updateOrder(
    id: string,
    field: "status" | "solving_owner" | "comment" | "rootcause_id" | "tracker_id",
    value: unknown
  ) {
    setUpdatingId(id);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, [field]: value, last_updated: new Date().toISOString() }
          : o
      )
    );

    const { error } = await supabase
      .from("orders")
      .update({
        [field]: value,
        last_updated: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Update failed:", error);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? initialOrders.find((orig) => orig.id === id) || o
            : o
        )
      );
      alert(`Failed to save: ${error.message}`);
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

  if (!ready) return null;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <ColumnToggle visible={visible} toggle={toggle} />
      </div>

      <div className="border border-border rounded-xl bg-white overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                {/* Always visible */}
                <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                  Order Code
                </th>

                {/* Toggleable columns */}
                {isVisible("service_date") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Service Date
                  </th>
                )}
                {isVisible("delivery_date") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Delivery Date
                  </th>
                )}
                {isVisible("customer_name") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Customer
                  </th>
                )}
                {isVisible("area") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Area
                  </th>
                )}
                {isVisible("order_value") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Value
                  </th>
                )}
                {isVisible("service_name") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Service
                  </th>
                )}
                {isVisible("segment") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Segment
                  </th>
                )}
                {isVisible("phone_no") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Phone
                  </th>
                )}
                {isVisible("volume") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Volume
                  </th>
                )}
                {isVisible("city") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    City
                  </th>
                )}
                {isVisible("cw1") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    CW1
                  </th>
                )}
                {isVisible("cw2") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    CW2
                  </th>
                )}
                {isVisible("cw3") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    CW3
                  </th>
                )}
                {isVisible("team_code") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Team Code
                  </th>
                )}
                {isVisible("timeslot") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Timeslot
                  </th>
                )}
                {isVisible("planner") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Planner
                  </th>
                )}
                {isVisible("caller") && (
                  <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                    Caller
                  </th>
                )}

                {/* Always visible operational columns */}
                <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                  Tracker
                </th>
                <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                  Status
                </th>
                <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                  Solving Owner
                </th>
                <th className="text-left font-medium text-muted px-4 py-3 whitespace-nowrap">
                  Rootcause
                </th>
                <th className="text-left font-medium text-muted px-4 py-3 min-w-[180px]">
                  Comment
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0 hover:bg-surface/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-ink whitespace-nowrap">
                    {order.order_code}
                  </td>

                  {isVisible("service_date") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.service_date || "—"}
                    </td>
                  )}
                  {isVisible("delivery_date") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.delivery_date || "—"}
                    </td>
                  )}
                  {isVisible("customer_name") && (
                    <td className="px-4 py-3 text-ink whitespace-nowrap">
                      {order.customer_name || "—"}
                    </td>
                  )}
                  {isVisible("area") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.area || "—"}
                    </td>
                  )}
                  {isVisible("order_value") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.order_value ?? "—"}
                    </td>
                  )}
                  {isVisible("service_name") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.service_name || "—"}
                    </td>
                  )}
                  {isVisible("segment") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.segment || "—"}
                    </td>
                  )}
                  {isVisible("phone_no") && (
                    <td className="px-4 py-3 whitespace-nowrap">
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
                  )}
                  {isVisible("volume") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.volume ?? "—"}
                    </td>
                  )}
                  {isVisible("city") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.city || "—"}
                    </td>
                  )}
                  {isVisible("cw1") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.cw1 || "—"}
                    </td>
                  )}
                  {isVisible("cw2") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.cw2 || "—"}
                    </td>
                  )}
                  {isVisible("cw3") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.cw3 || "—"}
                    </td>
                  )}
                  {isVisible("team_code") && (
                    <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">
                      {order.team_code || "—"}
                    </td>
                  )}
                  {isVisible("timeslot") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.timeslot || "—"}
                    </td>
                  )}
                  {isVisible("planner") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.planner || "—"}
                    </td>
                  )}
                  {isVisible("caller") && (
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {order.caller || "—"}
                    </td>
                  )}

                  {/* Always visible operational */}
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <TrackerSelect
                        value={order.tracker_id}
                        trackers={trackers}
                        onChange={(value) =>
                          updateOrder(order.id, "tracker_id", value)
                        }
                        disabled={updatingId === order.id}
                      />
                    ) : (
                      trackers.find((t) => t.id === order.tracker_id)?.name ||
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <StatusSelect
                        value={order.status}
                        onChange={(value) =>
                          updateOrder(order.id, "status", value)
                        }
                        disabled={updatingId === order.id}
                      />
                    ) : (
                      order.status
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
                    {canEdit ? (
                      <RootcauseSelect
                        value={order.rootcause_id}
                        rootcauses={rootcauses}
                        onChange={(value) =>
                          updateOrder(order.id, "rootcause_id", value)
                        }
                        disabled={updatingId === order.id}
                        required={order.status === "Not Done"}
                      />
                    ) : (
                      rootcauses.find((r) => r.id === order.rootcause_id)?.label || "—"
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
    </div>
  );
}
