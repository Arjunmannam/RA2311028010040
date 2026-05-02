/**
 * Custom hook for accessing Notifications Context
 */

import { useContext } from "react";
import { NotificationsContext } from "../state/NotificationsContext";

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return context;
}
