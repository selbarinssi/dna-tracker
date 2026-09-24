// components/orders/ColumnToggle.tsx

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ColumnKey =
  | "service_date"
  | "delivery_date"
  | "customer_name"
  | "area"
  | "order_value"
  | "service_name"
  | "segment"
  | "phone_no"
  | "volume"
  | "city"
  | "cw1"
  | "cw2"
  | "cw3"
  | "team_code"
  | "timeslot"
  | "planner"
  | "caller";

export const ALL_TOGGLEABLE_COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: "service_date", label: "Service Date" },
  { key: "delivery_date", label: "Delivery Date" },
  { key: "customer_name", label: "Customer" },
  { key: "area", label: "Area" },
  { key: "order_value", label: "Order Value" },
  { key: "service_name", label: "Service" },
  { key: "segment", label: "Segment" },
  { key: "phone_no", label: "Phone" },
  { key: "volume", label: "Volume" },
  { key: "city", label: "City" },
  { key: "cw1", label: "CW1" },
  { key: "cw2", label: "CW2" },
  { key: "cw3", label: "CW3" },
  { key: "team_code", label: "Team Code" },
  { key: "timeslot", label: "Timeslot" },
  { key: "planner", label: "Planner" },
  { key: "caller", label: "Caller" },
];

const STORAGE_KEY = "order-tracker-visible-columns";

const DEFAULT_VISIBLE: ColumnKey[] = [
  "customer_name",
  "city",
  "team_code",
  "phone_no",
  "timeslot",
  "service_date",
];

export function useColumnVisibility() {
  const [visible, setVisible] = useState<ColumnKey[]>(DEFAULT_VISIBLE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setVisible(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  function toggle(key: ColumnKey) {
    setVisible((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function isVisible(key: ColumnKey) {
    return visible.includes(key);
  }

  return { visible, toggle, isVisible, ready };
}

interface ColumnToggleProps {
  visible: ColumnKey[];
  toggle: (key: ColumnKey) => void;
}

export function ColumnToggle({ visible, toggle }: ColumnToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm px-3 py-1.5 border border-border rounded-lg bg-white text-muted hover:text-ink hover:border-border-strong transition-colors"
      >
        Columns
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-white border border-border rounded-xl shadow-soft p-2 max-h-80 overflow-y-auto">
            {ALL_TOGGLEABLE_COLUMNS.map((col) => (
              <label
                key={col.key}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={visible.includes(col.key)}
                  onChange={() => toggle(col.key)}
                  className="rounded border-border"
                />
                <span className="text-ink">{col.label}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
