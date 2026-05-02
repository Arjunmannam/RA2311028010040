/**
 * NotificationCard Component
 * Displays a single notification with read/unread status
 */

import React from "react";
import { NotificationData } from "../state/NotificationsContext";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

interface NotificationCardProps {
  notification: NotificationData;
  onMarkRead?: (id: string) => void;
  showRank?: boolean;
  rank?: number;
}

const TypeConfig: Record<string, { color: string; label: string }> = {
  Placement: {
    color: "#185FA5",
    label: "Placement",
  },
  Result: {
    color: "#854F0B",
    label: "Result",
  },
  Event: {
    color: "#3B6D11",
    label: "Event",
  },
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  showRank = false,
  rank = 0,
}) => {
  const config = TypeConfig[notification.Type] || TypeConfig.Event;
  const timestamp = new Date(notification.Timestamp);
  const timeAgo = getTimeAgo(timestamp);

  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: notification.isRead ? "#f5f5f5" : "#fff",
        border: notification.isRead ? "1px solid #e0e0e0" : "1px solid #1976d2",
        borderLeft: notification.isRead
          ? "4px solid #e0e0e0"
          : "4px solid #1976d2",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: 1, minWidth: "0" }}>
            {showRank && (
              <Box
                sx={{
                  display: "inline-block",
                  mb: 1,
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: "#e3f2fd",
                  borderRadius: "4px",
                  mr: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "bold", color: "#1976d2" }}
                >
                  #{rank}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
              <Chip
                label={config.label}
                size="small"
                sx={{
                  backgroundColor: config.color,
                  color: "white",
                  fontWeight: "bold",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#757575",
                  fontStyle: "italic",
                }}
              >
                {timeAgo}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: notification.isRead ? 400 : 600,
                color: notification.isRead ? "#757575" : "#212121",
                mb: 0.5,
                wordBreak: "break-word",
              }}
            >
              {notification.Message}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#616161",
                wordBreak: "break-word",
              }}
            >
              {notification.ID}
            </Typography>
          </Box>

          {onMarkRead && (
            <Tooltip
              title={notification.isRead ? "Mark as unread" : "Mark as read"}
            >
              <IconButton
                size="small"
                onClick={() => onMarkRead(notification.ID)}
                sx={{
                  color: notification.isRead ? "#bdbdbd" : "#1976d2",
                }}
              >
                {notification.isRead ? (
                  <MailOutlineIcon />
                ) : (
                  <MailIcon />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
