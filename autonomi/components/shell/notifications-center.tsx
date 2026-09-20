"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Stub notifications — will be replaced with real data from TanStack Query
const STUB_NOTIFICATIONS = [
  { id: "1", text: "SLA breach: Refund #4471 — 2m remaining", unread: true },
  { id: "2", text: "New escalation from Customer #223",       unread: true },
  { id: "3", text: "Approval expired: Cancel order #4402",    unread: false },
];

export default function NotificationsCenter() {
  const [open, setOpen] = useState(false);
  const unreadCount = STUB_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        id="notifications-bell"
        onClick={() => setOpen((o) => !o)}
        className="relative p-1 text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--color-danger)]" />
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-8 z-30 w-80 bg-[var(--bg-surface)] border border-[var(--border-hairline)] shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-hairline)]">
              <span className="text-sm font-semibold text-[var(--fg-base)]">Notifications</span>
              <span className="text-xs text-[var(--fg-muted)]">{unreadCount} unread</span>
            </div>
            <ul>
              {STUB_NOTIFICATIONS.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "px-4 py-3 text-xs border-b border-[var(--border-hairline)] last:border-0",
                    n.unread
                      ? "text-[var(--fg-base)] bg-[var(--bg-subtle)]"
                      : "text-[var(--fg-muted)]"
                  )}
                >
                  {n.unread && (
                    <span className="inline-block w-1 h-1 rounded-full bg-[var(--color-danger)] mr-2 align-middle" />
                  )}
                  {n.text}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
