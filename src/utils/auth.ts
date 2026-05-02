/**
 * Auth Utility
 * Handles obtaining and caching the bearer token from the evaluation server.
 */

import { Log, setLoggerToken } from "../middleware/logger";

const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";

interface AuthRequest {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Returns a valid bearer token, refreshing if expired.
 * Credentials should be loaded from environment variables in production.
 */
export async function getAuthToken(credentials: AuthRequest): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && tokenExpiry && now < tokenExpiry - 60) {
    return cachedToken;
  }

  try {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status} ${response.statusText}`);
    }

    const data: AuthResponse = await response.json();
    cachedToken = data.access_token;
    tokenExpiry = data.expires_in;

    setLoggerToken(cachedToken);

    await Log(
      "frontend",
      "info",
      "auth",
      `Successfully obtained bearer token. Expires at epoch: ${tokenExpiry}`
    );

    return cachedToken;
  } catch (err) {
    await Log(
      "frontend",
      "error",
      "auth",
      `Failed to obtain bearer token: ${String(err)}`
    );
    throw err;
  }
}
