// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseExcel } from "@/lib/excel";
import { DEFAULT_STATUS } from "@/lib/constants";
import { assignTrackers } from "@/lib/assignment";
import type { Tracker } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const rows = await parseExcel(buffer);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No valid rows found in the Excel file" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Active trackers for assignment
    const { data: trackersData, error: trackersError } = await supabase
      .from("trackers")
      .select("*")
      .eq("is_active", true);

    if (trackersError) {
      console.error("Trackers fetch error:", trackersError);
      return NextResponse.json(
        { error: "Failed to load trackers" },
        { status: 500 }
      );
    }

    const trackers = (trackersData as Tracker[]) || [];
    const assignedRows = assignTrackers(rows, trackers);

    // 1. Full replace: delete all non-archived orders
    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("is_archived", false);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to clear existing orders" },
        { status: 500 }
      );
    }

    // 2. Insert new rows (with tracker_id)
    const ordersToInsert = assignedRows.map((row) => ({
      ...row,
      status: DEFAULT_STATUS,
      solving_owner: null,
      rootcause_id: null,
      comment: null,
      is_archived: false,
    }));

    const { error: insertError } = await supabase
      .from("orders")
      .insert(ordersToInsert);

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to insert orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: rows.length,
      trackersUsed: trackers.length,
    });
  } catch (err: unknown) {
    console.error("Upload error:", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
