/**
 * Notifications State Management
 * Manages notifications, read/unread status, and filtering
 */

import React, { createContext, ReactNode, useState, useEffect } from "react";
import { NotificationFromAPI, fetchNotifications } from "../api/notificationsAPI";
import { MOCK_NOTIFICATIONS } from "../utils/mockNotifications";
import { Log } from "../middleware/logger";

export interface NotificationData extends NotificationFromAPI {
  isRead: boolean;
}

const READ_STATUS_STORAGE_KEY = "campus-notifications-read-status";

interface NotificationsContextType {
  notifications: NotificationData[];
  filteredNotifications: NotificationData[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  selectedFilter: "Event" | "Result" | "Placement" | "All";
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSelectedFilter: (filter: "Event" | "Result" | "Placement" | "All") => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => Promise<void>;
  getTopPriorityNotifications: (n: number) => NotificationData[];
}

export const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined
);

interface NotificationsProviderProps {
  children: ReactNode;
  authToken: string;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
  authToken,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState<
    "Event" | "Result" | "Placement" | "All"
  >("All");

  // Load read status from localStorage
  const loadReadStatus = (notifs: NotificationFromAPI[]): NotificationData[] => {
    const storedStatus = localStorage.getItem(READ_STATUS_STORAGE_KEY);
    const readIds = storedStatus ? JSON.parse(storedStatus) : {};

    return notifs.map((notif) => ({
      ...notif,
      isRead: readIds[notif.ID] || false,
    }));
  };

  // Save read status to localStorage
  const saveReadStatus = (notifs: NotificationData[]) => {
    const readIds: Record<string, boolean> = {};
    notifs.forEach((notif) => {
      if (notif.isRead) {
        readIds[notif.ID] = true;
      }
    });
    localStorage.setItem(READ_STATUS_STORAGE_KEY, JSON.stringify(readIds));
  };

  // Fetch notifications from API
  const refreshNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      let apiNotifications: NotificationFromAPI[];
      try {
        apiNotifications = await fetchNotifications(authToken, {
          limit: 100, // Fetch a large batch for local filtering
        });
      } catch (apiError) {
        // Use mock data as fallback in development
        Log(
          "frontend",
          "warn",
          "state",
          "API fetch failed, using mock data for development"
        );
        apiNotifications = MOCK_NOTIFICATIONS;
      }
      const withReadStatus = loadReadStatus(apiNotifications);
      setNotifications(withReadStatus);
      Log(
        "frontend",
        "info",
        "state",
        `Notifications refreshed: ${withReadStatus.length} items`
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      Log("frontend", "error", "state", `Failed to refresh notifications: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const getFilteredNotifications = (): NotificationData[] => {
    let filtered = [...notifications];

    if (selectedFilter !== "All") {
      filtered = filtered.filter((n) => n.Type === selectedFilter);
    }

    // Sort by timestamp (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
    );

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.ID === id ? { ...n, isRead: true } : n
      );
      saveReadStatus(updated);
      Log("frontend", "info", "state", `Marked notification ${id} as read`);
      return updated;
    });
  };

  // Mark notification as unread
  const markAsUnread = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.ID === id ? { ...n, isRead: false } : n
      );
      saveReadStatus(updated);
      return updated;
    });
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      saveReadStatus(updated);
      Log("frontend", "info", "state", "Marked all notifications as read");
      return updated;
    });
  };

  // Get top priority notifications
  const getTopPriorityNotifications = (n: number): NotificationData[] => {
    const typeWeights = { Placement: 100, Result: 30, Event: 60 };

    const unread = notifications.filter((notif) => !notif.isRead);

    const scored = unread.map((notif) => {
      const ageMs = Date.now() - new Date(notif.Timestamp).getTime();
      const ageHours = ageMs / (1000 * 60 * 60);
      const recency = ageHours <= 1 ? 1 : Math.max(0.01, 1 / (1 + Math.log10(ageHours)));
      const weight = typeWeights[notif.Type as keyof typeof typeWeights] || 0;
      const score = weight * recency;
      return { ...notif, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map(({ score, ...notif }) => notif);
  };

  // Initial fetch
  useEffect(() => {
    refreshNotifications();
  }, [authToken]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        filteredNotifications,
        loading,
        error,
        currentPage,
        pageSize,
        selectedFilter,
        setCurrentPage,
        setPageSize,
        setSelectedFilter,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        refreshNotifications,
        getTopPriorityNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
