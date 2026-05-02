/**
 * App.tsx – Root component
 * Campus Notifications Microservice – Stage 2
 */

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { Log, setLoggerToken } from "./middleware/logger";
import { NotificationsProvider } from "./state/NotificationsContext";
import { Navigation } from "./components/Navigation";
import { AllNotifications } from "./pages/AllNotifications";
import { PriorityNotifications } from "./pages/PriorityNotifications";
import "./styles/global.css";

// Material UI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
});

/**
 * In production: call getAuthToken(credentials) here and setLoggerToken().
 * For demo purposes we pre-set a placeholder so the logger doesn't warn.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DEMO_TOKEN = (import.meta as any).env?.VITE_AUTH_TOKEN || "demo-token-12345";
setLoggerToken(DEMO_TOKEN);

export default function App() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    async function initializeAuth() {
      try {
        // Try to get token from environment or use demo token
        const token =
          (import.meta as any).env?.VITE_AUTH_TOKEN ||
          localStorage.getItem("campus_notif_token") ||
          DEMO_TOKEN;

        setAuthToken(token);
        setLoggerToken(token);

        Log(
          "frontend",
          "info",
          "page",
          "App component mounted. Campus Notifications Microservice – Stage 2 initialised."
        );
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        setAuthError(errorMsg);
        Log("frontend", "error", "page", `Auth initialization failed: ${errorMsg}`);
      } finally {
        setAuthLoading(false);
      }
    }

    initializeAuth();
  }, []);

  if (authLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div>Loading...</div>
        </Box>
      </ThemeProvider>
    );
  }

  if (authError || !authToken) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <div>Authentication Error: {authError || "No token available"}</div>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <NotificationsProvider authToken={authToken}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              backgroundColor: "#fafafa",
            }}
          >
            <Navigation />
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<AllNotifications />} />
                <Route path="/priority" element={<PriorityNotifications />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Box>
        </NotificationsProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
