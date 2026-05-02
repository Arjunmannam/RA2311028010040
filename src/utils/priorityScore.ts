/**
 * Notification domain types and priority scoring algorithm.
 * Priority = weight (by category) * recency factor
 */

export type NotificationCategory = "placement" | "event" | "result";

export interface Notification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  timestamp: number; // Unix epoch ms
  isRead: boolean;
}

/**
 * Weight map per product manager's spec:
 * placement > event > result
 */
const CATEGORY_WEIGHT: Record<NotificationCategory, number> = {
  placement: 100,
  event: 60,
  result: 30,
};

/**
 * Recency factor: notifications decay in importance over time.
 * Full weight within 1 hour, then logarithmic decay.
 * Returns a value in (0, 1].
 */
function recencyFactor(timestampMs: number): number {
  const ageMs = Date.now() - timestampMs;
  const ageHours = ageMs / (1000 * 60 * 60);
  if (ageHours <= 1) return 1;
  // log decay: score halves every ~10 hours
  return Math.max(0.01, 1 / (1 + Math.log10(ageHours)));
}

/**
 * Computes a priority score for a notification.
 * Higher = more important.
 */
export function priorityScore(n: Notification): number {
  const weight = CATEGORY_WEIGHT[n.category];
  const recency = recencyFactor(n.timestamp);
  return weight * recency;
}

/**
 * Returns top-N unread notifications sorted by priority score (descending).
 */
export function getTopPriorityNotifications(
  notifications: Notification[],
  n: number = 10
): Notification[] {
  const unread = notifications.filter((notif) => !notif.isRead);
  return unread
    .slice()
    .sort((a, b) => priorityScore(b) - priorityScore(a))
    .slice(0, n);
}
