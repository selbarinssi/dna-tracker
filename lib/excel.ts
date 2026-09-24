// lib/excel.ts

import ExcelJS from "exceljs";

export interface ParsedOrderRow {
  order_code: string;
  service_date: string | null;
  delivery_date: string | null;
  customer_name: string | null;
  area: string | null;
  order_value: number | null;
  service_name: string | null;
  segment: string | null;
  phone_no: string | null;
  volume: number | null;
  city: string | null;
  cw1: string | null;
  cw2: string | null;
  cw3: string | null;
  team_code: string | null;
  timeslot: string | null;
  planner: string | null;
  caller: string | null;
}

function clean(value: any): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value).trim();
}

function cleanNumber(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}

function cleanDate(value: any): string | null {
  if (!value) return null;
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  const str = String(value).trim();
  if (!str) return null;
  return str;
}

export async function parseExcel(buffer: ArrayBuffer): Promise<ParsedOrderRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("No worksheet found in the Excel file");
  }

  const rows: ParsedOrderRow[] = [];

  // Assume first row is header
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header

    const values = row.values as any[];

    // ExcelJS is 1-indexed and has an empty first element
    const get = (index: number) => values[index] ?? null;

    const order_code = clean(get(1));
    if (!order_code) return; // skip empty rows

    rows.push({
      order_code,
      service_date: cleanDate(get(2)),
      delivery_date: cleanDate(get(3)),
      customer_name: clean(get(4)),
      area: clean(get(5)),
      order_value: cleanNumber(get(6)),
      service_name: clean(get(7)),
      segment: clean(get(8)),
      phone_no: clean(get(9)),
      volume: cleanNumber(get(10)),
      city: clean(get(11)),
      cw1: clean(get(12)),
      cw2: clean(get(13)),
      cw3: clean(get(14)),
      team_code: clean(get(15)),
      timeslot: clean(get(16)),
      planner: clean(get(17)),
      caller: clean(get(18)),
    });
  });

  return rows;
}
