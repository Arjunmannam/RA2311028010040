/**
 * Logging Middleware
 * Affordmed Campus Notifications Microservice
 * Reusable logging package that sends logs to the evaluation test server.
 */

type Stack = "frontend" | "backend";

type Level = "debug" | "info" | "warn" | "error" | "fatal";

type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";
type BackendPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service";
type SharedPackage = "auth" | "config" | "middleware" | "utils";

type Package = FrontendPackage | BackendPackage | SharedPackage;

interface LogPayload {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

interface LogResponse {
  logID: string;
  message: string;
}

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

let _authToken: string | null = null;

/**
 * Set the bearer token for authenticated log requests.
 * Call this once after obtaining your token from the auth endpoint.
 */
export function setLoggerToken(token: string): void {
  _authToken = token;
}

/**
 * Core logging function - sends a structured log entry to the test server.
 *
 * @param stack   - "frontend" or "backend"
 * @param level   - "debug" | "info" | "warn" | "error" | "fatal"
 * @param pkg     - Package name (see allowed values per stack)
 * @param message - Descriptive message about the event
 * @returns       - Promise resolving to the log response or null on failure
 */
export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<LogResponse | null> {
  if (!_authToken) {
    console.warn("[Logger] No auth token set. Call setLoggerToken() first.");
    return null;
  }

  const payload: LogPayload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        `[Logger] Log API returned non-OK status: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data: LogResponse = await response.json();
    return data;
  } catch (err) {
    console.error("[Logger] Failed to send log to server:", err);
    return null;
  }
}

export type { Stack, Level, Package, LogPayload, LogResponse };
