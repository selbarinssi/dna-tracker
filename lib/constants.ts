// lib/constants.ts

import type { OrderStatus, SolvingOwner, UserRole } from "@/types";

export const ORDER_STATUSES: OrderStatus[] = [
  "Delivery In Progress",
  "Not Loaded",
  "Assembly In Progress",
  "Not Done",
  "Job Done",
  "Posted",
  "Cancelled",
];

export const ACTIVE_STATUSES: OrderStatus[] = [
  "Delivery In Progress",
  "Not Loaded",
  "Assembly In Progress",
  "Not Done",
  "Job Done",
];

export const TERMINAL_STATUSES: OrderStatus[] = ["Posted", "Cancelled"];

export const SOLVING_OWNERS: SolvingOwner[] = [
  "Planning",
  "A/S",
  "Planning & A/S",
];

export const USER_ROLES: UserRole[] = [
  "admin",
  "tracking",
  "planning",
  "aftersales",
  "public",
];

export const DEFAULT_STATUS: OrderStatus = "Delivery In Progress";

export const STATUSES_REQUIRING_ROOTCAUSE: OrderStatus[] = ["Not Done"];
