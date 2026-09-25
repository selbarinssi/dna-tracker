// app/(dashboard)/tracking/page.tsx

import { createClient } from "@/lib/supabase/server";
import { OrderTable } from "@/components/orders/OrderTable";
import type { Order } from "@/types";

export default async function TrackingPage() {
  const supabase = await createClient();

  const [{ data: ordersData }, { data: rootcausesData }] = await Promise.all([
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
  ]);

  const orders = (ordersData as Order[]) || [];
  const rootcauses = rootcausesData || [];

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
        canEdit={true}
      />
    </div>
  );
}
