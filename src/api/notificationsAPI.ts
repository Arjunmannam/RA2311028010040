/**
 * Notifications API Service
 * Handles fetching notifications from the evaluation server API
 */

import { Log } from "../middleware/logger";

export interface NotificationFromAPI {
  ID: string;
  Type: "Event" | "Result" | "Placement";
  Message: string;
  Timestamp: string;
}

export interface NotificationsResponse {
  notifications: NotificationFromAPI[];
}

const API_BASE_URL = "http://20.207.122.201/evaluation-service/notifications";

/**
 * Fetch notifications from the API with optional query parameters
 */
export async function fetchNotifications(
  token: string,
  options?: {
    limit?: number;
    page?: number;
    notification_type?: "Event" | "Result" | "Placement";
  }
): Promise<NotificationFromAPI[]> {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.page) params.append("page", options.page.toString());
    if (options?.notification_type)
      params.append("notification_type", options.notification_type);

    const url = params.toString()
      ? `${API_BASE_URL}?${params.toString()}`
      : API_BASE_URL;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API error: ${response.status} ${response.statusText}`
      );
    }

    const data: NotificationsResponse = await response.json();

    Log(
      "frontend",
      "info",
      "api",
      `Fetched ${data.notifications.length} notifications`
    );

    return data.notifications;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error";
    Log("frontend", "error", "api", `Failed to fetch notifications: ${errorMsg}`);
    throw error;
  }
}
