/**
 * Navigation Component
 * Top navigation bar for switching between pages
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Typography, Badge } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import StarIcon from "@mui/icons-material/Star";
import { useNotifications } from "../hooks/useNotifications";

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mr: "auto",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <MailIcon sx={{ fontSize: 32 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "16px", sm: "20px" },
            }}
          >
            Campus Notifications
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            color="inherit"
            onClick={() => navigate("/")}
            sx={{
              backgroundColor:
                location.pathname === "/" ? "rgba(255,255,255,0.2)" : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <MailIcon />
            </Badge>
            <Box sx={{ display: { xs: "none", sm: "inline" } }}>
              All Notifications
            </Box>
          </Button>

          <Button
            color="inherit"
            onClick={() => navigate("/priority")}
            sx={{
              backgroundColor:
                location.pathname === "/priority"
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Badge badgeContent={notifications.filter(n => !n.isRead).length} color="error">
              <StarIcon />
            </Badge>
            <Box sx={{ display: { xs: "none", sm: "inline" } }}>
              Priority
            </Box>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
