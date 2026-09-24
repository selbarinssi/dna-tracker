// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseExcel } from "@/lib/excel";
import { DEFAULT_STATUS } from "@/lib/constants";

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
      return NextResponse.json({ error: "No valid rows found in the Excel file" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Full replace: delete all non-archived orders
    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("is_archived", false);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json({ error: "Failed to clear existing orders" }, { status: 500 });
    }

    // 2. Insert new rows
    const ordersToInsert = rows.map((row) => ({
      ...row,
      status: DEFAULT_STATUS,
      solving_owner: null,
      rootcause_id: null,
      comment: null,
      tracker_id: null,
      is_archived: false,
    }));

    const { error: insertError } = await supabase
      .from("orders")
      .insert(ordersToInsert);

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Failed to insert orders" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: rows.length,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
