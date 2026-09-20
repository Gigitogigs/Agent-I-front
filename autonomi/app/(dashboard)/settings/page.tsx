import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings — Autonomi" };

export default function SettingsPage() {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-lg font-semibold text-[var(--fg-base)] px-1 mb-4">Settings</h1>
      <div className="flex-1 border border-[var(--border-hairline)] bg-[var(--bg-surface)] flex items-center justify-center">
        <p className="text-sm text-[var(--fg-muted)]">Profile, Notifications, Billing, Integrations coming soon.</p>
      </div>
    </div>
  );
}
