/**
 * Authentication Configuration
 * Contains credentials for authentication with the evaluation server
 */

// These should be set via environment variables in production
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env || {};

export const AUTH_CREDENTIALS = {
  email: env.VITE_AUTH_EMAIL || "demo@example.com",
  name: env.VITE_AUTH_NAME || "Demo User",
  rollNo: env.VITE_AUTH_ROLL_NO || "2024001",
  accessCode: env.VITE_AUTH_ACCESS_CODE || "demo-access-code",
  clientID: env.VITE_CLIENT_ID || "demo-client-id",
  clientSecret: env.VITE_CLIENT_SECRET || "demo-client-secret",
};

export const API_BASE_URL = "http://20.207.122.201/evaluation-service";
