/**
 * AllNotifications Page
 * Displays all notifications with filtering, sorting, and pagination
 */

import React, { useState } from "react";
import {
  Box,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCard } from "../components/NotificationCard";
import { Log } from "../middleware/logger";

export const AllNotifications: React.FC = () => {
  const {
    filteredNotifications,
    loading,
    error,
    selectedFilter,
    setSelectedFilter,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    markAsRead,
    markAsUnread,
    refreshNotifications,
    markAllAsRead,
  } = useNotifications();

  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = filteredNotifications.filter((n) => !n.isRead).length;

  // Apply search filter
  const searchFiltered = filteredNotifications.filter((notif) =>
    notif.Message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(searchFiltered.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedNotifications = searchFiltered.slice(startIndex, endIndex);

  const handleRefresh = async () => {
    Log("frontend", "info", "page", "Refreshing all notifications");
    await refreshNotifications();
  };

  const handleFilterChange = (
    e: any
  ) => {
    setSelectedFilter(
      e.target.value as "Event" | "Result" | "Placement" | "All"
    );
    setCurrentPage(1); // Reset to first page
    Log("frontend", "info", "page", `Filter changed to: ${e.target.value}`);
  };

  const handlePageSizeChange = (e: any) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleMarkRead = (id: string) => {
    const notif = filteredNotifications.find((n) => n.ID === id);
    if (notif?.isRead) {
      markAsUnread(id);
    } else {
      markAsRead(id);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#212121",
          }}
        >
          All Notifications
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Toolbar */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search notifications..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ flex: 1, minWidth: "200px" }}
          />

          <FormControl sx={{ minWidth: "150px" }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={selectedFilter}
              onChange={handleFilterChange}
              label="Type"
              size="small"
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: "120px" }}>
            <InputLabel>Items/Page</InputLabel>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Items/Page"
              size="small"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            variant="outlined"
            startIcon={<ClearAllIcon />}
            onClick={markAllAsRead}
            color="warning"
            disabled={unreadCount === 0}
          >
            Mark All Read
          </Button>
        </Box>

        {/* Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            p: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <Typography variant="body2" sx={{ color: "#616161" }}>
            <strong>{searchFiltered.length}</strong> notifications found
            {unreadCount > 0 && (
              <>
                {" "}
                • <strong style={{ color: "#d32f2f" }}>{unreadCount}</strong>{" "}
                unread
              </>
            )}
          </Typography>
          {totalPages > 1 && (
            <Typography variant="caption" sx={{ color: "#757575" }}>
              Page {currentPage} of {totalPages}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Notifications List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : paginatedNotifications.length === 0 ? (
        <Alert severity="info">No notifications found</Alert>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            {paginatedNotifications.map((notif) => (
              <NotificationCard
                key={notif.ID}
                notification={notif}
                onMarkRead={handleMarkRead}
              />
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};
