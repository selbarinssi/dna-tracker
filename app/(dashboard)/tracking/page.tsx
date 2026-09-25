// app/(dashboard)/tracking/page.tsx

import { createClient } from "@/lib/supabase/server";
import { OrderTable } from "@/components/orders/OrderTable";
import type { Order, Tracker } from "@/types";

export default async function TrackingPage() {
  const supabase = await createClient();

  const [
    { data: ordersData },
    { data: rootcausesData },
    { data: trackersData },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .eq("is_archived", false)
      .order("tracker_id", { ascending: true, nullsFirst: false })
      .order("team_code", { ascending: true, nullsFirst: false }),
    supabase
      .from("rootcauses")
      .select("id, label")
      .eq("is_active", true)
      .order("label"),
    supabase
      .from("trackers")
      .select("*")
      .order("name", { ascending: true }),
  ]);

  const orders = (ordersData as Order[]) || [];
  const rootcauses = rootcausesData || [];
  const trackers = (trackersData as Tracker[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink tracking-tight">
            Tracking
          </h1>
          <p className="text-sm text-muted mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} today
          </p>
        </div>
      </div>

      <OrderTable
        orders={orders}
        rootcauses={rootcauses}
        trackers={trackers}
        canEdit={true}
      />
    </div>
  );
}
