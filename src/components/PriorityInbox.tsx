/**
 * Campus Notifications – Priority Inbox
 * Stage 1: Top-N priority unread notifications
 *
 * Priority = category weight (placement > event > result) × recency factor
 * Allows user to configure N (top 10, 15, 20 etc.)
 */

import { useState, useEffect, useCallback } from "react";
import {
  Notification,
  getTopPriorityNotifications,
  priorityScore,
  NotificationCategory,
} from "../utils/priorityScore";
import { MOCK_NOTIFICATIONS } from "../utils/mockData";
import { Log } from "../middleware/logger";

// ─── helpers ─────────────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const BADGE_CONFIG: Record<
  NotificationCategory,
  { label: string; color: string; bg: string }
> = {
  placement: { label: "Placement", color: "#185FA5", bg: "#E6F1FB" },
  event: { label: "Event", color: "#3B6D11", bg: "#EAF3DE" },
  result: { label: "Result", color: "#854F0B", bg: "#FAEEDA" },
};

// ─── NotificationCard ─────────────────────────────────────────────────────────

interface CardProps {
  notif: Notification;
  rank: number;
  onMarkRead: (id: string) => void;
}

function NotificationCard({ notif, rank, onMarkRead }: CardProps) {
  const badge = BADGE_CONFIG[notif.category];
  const score = priorityScore(notif).toFixed(1);

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        padding: "16px 20px",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        background: "var(--color-background-primary)",
        transition: "background 0.15s",
        cursor: "default",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background =
          "var(--color-background-secondary)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background =
          "var(--color-background-primary)")
      }
    >
      {/* rank badge */}
      <div
        style={{
          minWidth: 32,
          height: 32,
          borderRadius: "50%",
          background: rank <= 3 ? "#185FA5" : "var(--color-background-tertiary)",
          color: rank <= 3 ? "#fff" : "var(--color-text-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 500,
          fontSize: 13,
          marginTop: 2,
        }}
      >
        #{rank}
      </div>

      {/* content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontWeight: 500,
              fontSize: 15,
              color: "var(--color-text-primary)",
              lineHeight: 1.3,
            }}
          >
            {notif.title}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: "2px 8px",
              borderRadius: 20,
              background: badge.bg,
              color: badge.color,
              letterSpacing: "0.3px",
            }}
          >
            {badge.label}
          </span>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-secondary)",
            margin: "0 0 8px",
            lineHeight: 1.5,
          }}
        >
          {notif.body}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 12,
            color: "var(--color-text-tertiary)",
          }}
        >
          <span>{timeAgo(notif.timestamp)}</span>
          <span>·</span>
          <span>score: {score}</span>
          <span style={{ marginLeft: "auto" }}>
            <button
              onClick={() => onMarkRead(notif.id)}
              style={{
                fontSize: 12,
                padding: "3px 10px",
                borderRadius: 6,
                border: "0.5px solid var(--color-border-secondary)",
                background: "transparent",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
              }}
            >
              Mark read
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── PriorityInbox ────────────────────────────────────────────────────────────

export default function PriorityInbox() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [topN, setTopN] = useState<number>(10);
  const [logStatus, setLogStatus] = useState<string>("");

  const topNotifications = getTopPriorityNotifications(notifications, topN);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Log on mount
  useEffect(() => {
    Log(
      "frontend",
      "info",
      "page",
      "Priority Inbox page mounted. Displaying top priority unread notifications."
    ).then((res) => {
      if (res) setLogStatus(`Log sent: ${res.logID.slice(0, 8)}…`);
    });
  }, []);

  // Log when topN changes
  useEffect(() => {
    Log(
      "frontend",
      "debug",
      "component",
      `User changed priority inbox display count to top-${topN}`
    );
  }, [topN]);

  const markRead = useCallback(
    async (id: string) => {
      const notif = notifications.find((n) => n.id === id);
      if (!notif) return;

      await Log(
        "frontend",
        "info",
        "state",
        `User marked notification as read: id=${id}, title="${notif.title}"`
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    },
    [notifications]
  );

  const markAllRead = useCallback(async () => {
    await Log(
      "frontend",
      "info",
      "state",
      `User marked all ${topNotifications.length} priority notifications as read`
    );
    const ids = new Set(topNotifications.map((n) => n.id));
    setNotifications((prev) =>
      prev.map((n) => (ids.has(n.id) ? { ...n, isRead: true } : n))
    );
  }, [topNotifications]);

  return (
    <div
      style={{
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        maxWidth: 720,
        margin: "0 auto",
        padding: "24px 16px 64px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#E6F1FB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#185FA5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              Priority Inbox
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--color-text-secondary)",
              }}
            >
              {unreadCount} unread · sorted by placement weight × recency
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label
            style={{ fontSize: 13, color: "var(--color-text-secondary)" }}
          >
            Show top
          </label>
          <select
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            style={{
              fontSize: 13,
              padding: "4px 8px",
              borderRadius: 6,
              border: "0.5px solid var(--color-border-secondary)",
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)",
              cursor: "pointer",
            }}
          >
            {[5, 10, 15, 20].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <span
            style={{ fontSize: 13, color: "var(--color-text-secondary)" }}
          >
            notifications
          </span>
        </div>

        <button
          onClick={markAllRead}
          style={{
            fontSize: 13,
            padding: "6px 14px",
            borderRadius: 6,
            border: "0.5px solid var(--color-border-secondary)",
            background: "transparent",
            color: "var(--color-text-secondary)",
            cursor: "pointer",
          }}
        >
          Mark all read
        </button>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 12,
          padding: "10px 14px",
          background: "var(--color-background-secondary)",
          borderRadius: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginRight: 4 }}
        >
          Weight:
        </span>
        {(
          [
            ["Placement", "100", "#185FA5", "#E6F1FB"],
            ["Event", "60", "#3B6D11", "#EAF3DE"],
            ["Result", "30", "#854F0B", "#FAEEDA"],
          ] as const
        ).map(([label, weight, color, bg]) => (
          <span
            key={label}
            style={{
              fontSize: 12,
              padding: "2px 8px",
              borderRadius: 20,
              background: bg,
              color: color,
            }}
          >
            {label} ×{weight}
          </span>
        ))}
        <span
          style={{
            fontSize: 12,
            color: "var(--color-text-tertiary)",
            marginLeft: 4,
          }}
        >
          · score decays with age
        </span>
      </div>

      {/* Notification list */}
      <div
        style={{
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: 12,
          overflow: "hidden",
          background: "var(--color-background-primary)",
        }}
      >
        {topNotifications.length === 0 ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "var(--color-text-secondary)",
              fontSize: 14,
            }}
          >
            No unread notifications
          </div>
        ) : (
          topNotifications.map((notif, i) => (
            <NotificationCard
              key={notif.id}
              notif={notif}
              rank={i + 1}
              onMarkRead={markRead}
            />
          ))
        )}
      </div>

      {/* Log status */}
      {logStatus && (
        <p
          style={{
            marginTop: 12,
            fontSize: 11,
            color: "var(--color-text-tertiary)",
          }}
        >
          {logStatus}
        </p>
      )}
    </div>
  );
}
