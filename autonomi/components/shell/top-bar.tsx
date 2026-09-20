"use client";

import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";
import NotificationsCenter from "./notifications-center";

export default function TopBar() {
  const { theme, toggle } = useTheme();

  return (
    <header className="flex items-center justify-between h-12 px-4 shrink-0 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)]">
      {/* Global search */}
      <div className="flex items-center gap-2 flex-1 max-w-sm">
        <Search size={14} className="text-[var(--fg-subtle)] shrink-0" />
        <input
          id="global-search"
          type="text"
          placeholder="Search…"
          className="
            w-full text-sm bg-transparent text-[var(--fg-base)]
            placeholder:text-[var(--fg-subtle)]
            border-none outline-none
          "
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          id="theme-toggle"
          onClick={toggle}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="p-1 text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <NotificationsCenter />

        {/* Avatar */}
        <button
          id="account-avatar"
          className="w-7 h-7 rounded-full bg-[var(--color-gray-300)] dark:bg-[var(--color-gray-700)] flex items-center justify-center text-xs font-medium text-[var(--fg-base)]"
        >
          A
        </button>
      </div>
    </header>
  );
}
