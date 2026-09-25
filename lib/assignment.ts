// lib/assignment.ts

import type { Tracker } from "@/types";

export interface OrderForAssignment {
  team_code: string | null;
}

/**
 * Assigns tracker_id to each order.
 * Rules:
 * 1. Same team_code always gets the same tracker
 * 2. Load (order count) is balanced across active trackers
 * 3. Orders with null/empty team_code are assigned one-by-one to the current lightest tracker
 */
export function assignTrackers<T extends OrderForAssignment>(
  orders: T[],
  trackers: Tracker[]
): (T & { tracker_id: string | null })[] {
  const active = trackers.filter((t) => t.is_active);

  if (active.length === 0) {
    return orders.map((o) => ({ ...o, tracker_id: null }));
  }

  // Load counter per tracker
  const load = new Map<string, number>();
  active.forEach((t) => load.set(t.id, 0));

  const pickLightest = (): string => {
    let bestId = active[0].id;
    let bestLoad = load.get(bestId) ?? 0;
    for (const t of active) {
      const n = load.get(t.id) ?? 0;
      if (n < bestLoad) {
        bestLoad = n;
        bestId = t.id;
      }
    }
    return bestId;
  };

  // team_code → tracker_id
  const teamToTracker = new Map<string, string>();

  return orders.map((order) => {
    const code = order.team_code?.trim() || null;

    if (code) {
      let trackerId = teamToTracker.get(code);
      if (!trackerId) {
        trackerId = pickLightest();
        teamToTracker.set(code, trackerId);
      }
      load.set(trackerId, (load.get(trackerId) ?? 0) + 1);
      return { ...order, tracker_id: trackerId };
    }

    // No team code → assign to lightest
    const trackerId = pickLightest();
    load.set(trackerId, (load.get(trackerId) ?? 0) + 1);
    return { ...order, tracker_id: trackerId };
  });
}
