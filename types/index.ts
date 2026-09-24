// types/index.ts

export type UserRole = "admin" | "tracking" | "planning" | "aftersales" | "public";

export type OrderStatus =
  | "Delivery In Progress"
  | "Not Loaded"
  | "Assembly In Progress"
  | "Not Done"
  | "Job Done"
  | "Posted"
  | "Cancelled";

export type SolvingOwner = "Planning" | "A/S" | "Planning & A/S";

export interface Tracker {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Rootcause {
  id: string;
  label: string;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;

  // From Excel
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

  // Operational fields
  tracker_id: string | null;
  status: OrderStatus;
  solving_owner: SolvingOwner | null;
  rootcause_id: string | null;
  comment: string | null;

  // Meta
  last_updated: string;
  created_at: string;
  is_archived: boolean;
  archived_at: string | null;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface TrackerSchedule {
  id: string;
  tracker_id: string;
  date: string;
  is_available: boolean;
}
