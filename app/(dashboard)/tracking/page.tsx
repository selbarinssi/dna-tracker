// app/(dashboard)/tracking/page.tsx

import { createClient } from "@/lib/supabase/server";
import { OrderTable } from "@/components/orders/OrderTable";
import type { Order } from "@/types";

export default async function TrackingPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  const orders = (data as Order[]) || [];

  // For now we allow editing for everyone who can see Tracking.
  // Later we will restrict it based on the real user role.
  const canEdit = true;

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

      <OrderTable orders={orders} canEdit={canEdit} />
    </div>
  );
}
