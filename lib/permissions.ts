// lib/permissions.ts

import type { UserRole } from "@/types";

export const PERMISSIONS = {
  canUpload: (role: UserRole) => role === "admin",
  canManageTrackers: (role: UserRole) => role === "admin",
  canManageUsers: (role: UserRole) => role === "admin",
  canManageConfig: (role: UserRole) => role === "admin",
  canReassign: (role: UserRole) => role === "admin",

  canEditOrder: (role: UserRole) =>
    role === "admin" || role === "tracking",

  canSetSolvingOwner: (role: UserRole) =>
    role === "admin" || role === "tracking",

  canViewTracking: (role: UserRole) =>
    role === "admin" || role === "tracking",

  canViewPending: (role: UserRole) =>
    role === "admin" ||
    role === "tracking" ||
    role === "planning" ||
    role === "aftersales",

  canViewArchive: (role: UserRole) => true, // everyone including public
} as const;
