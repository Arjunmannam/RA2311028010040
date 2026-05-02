/**
 * PriorityNotifications Page
 * Displays top-n priority unread notifications
 */

import React, { useState } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import StarIcon from "@mui/icons-material/Star";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCard } from "../components/NotificationCard";
import { Log } from "../middleware/logger";

export const PriorityNotifications: React.FC = () => {
  const {
    getTopPriorityNotifications,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAsUnread,
  } = useNotifications();

  const [topN, setTopN] = useState(10);
  const [tempInput, setTempInput] = useState("10");

  const priorityNotifications = getTopPriorityNotifications(topN);

  const handleRefresh = async () => {
    Log("frontend", "info", "page", `Refreshing priority notifications (top ${topN})`);
    await refreshNotifications();
  };

  const handleUpdateN = () => {
    const num = parseInt(tempInput) || 10;
    if (num > 0 && num <= 100) {
      setTopN(num);
      Log("frontend", "info", "page", `Priority inbox size changed to: ${num}`);
    }
  };

  const handleMarkRead = (id: string) => {
    const notif = priorityNotifications.find((n) => n.ID === id);
    if (notif?.isRead) {
      markAsUnread(id);
    } else {
      markAsRead(id);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <StarIcon sx={{ color: "#fbc02d", fontSize: 32 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#212121",
            }}
          >
            Priority Inbox
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Priority Configuration */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#fff3cd",
            borderLeft: "4px solid #ffc107",
            borderRadius: "4px",
            mb: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{ mb: 2, color: "#856404", fontWeight: 500 }}
          >
            📌 Priority is determined by:
            <br />
            • <strong>Type Weight:</strong> Placement (100) &gt; Result (30) &gt;
            Event (60)
            <br />
            • <strong>Recency:</strong> Recent notifications weighted higher
            <br />
            • <strong>Unread Only:</strong> Only unread notifications are
            prioritized
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              type="number"
              label="Top N Notifications"
              variant="outlined"
              size="small"
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              inputProps={{ min: 1, max: 100 }}
              sx={{ width: "180px" }}
            />
            <Button
              variant="contained"
              onClick={handleUpdateN}
            >
              Update
            </Button>
            <Typography
              variant="caption"
              sx={{ color: "#666" }}
            >
              (max 100)
            </Typography>
          </Box>
        </Box>

        {/* Toolbar */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {/* Info */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            mb: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: "#616161" }}>
            Showing <strong>{Math.min(priorityNotifications.length, topN)}</strong> of{" "}
            <strong>{priorityNotifications.length}</strong> unread notifications
          </Typography>
        </Box>
      </Box>

      {/* Notifications List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : priorityNotifications.length === 0 ? (
        <Alert severity="info">
          No unread notifications. Great job keeping up to date!
        </Alert>
      ) : (
        <Box sx={{ mb: 3 }}>
          {priorityNotifications.slice(0, topN).map((notif, index) => (
            <NotificationCard
              key={notif.ID}
              notification={notif}
              onMarkRead={handleMarkRead}
              showRank={true}
              rank={index + 1}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};
