"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CheckCircle,
  MessageSquare,
  BookOpen,
  BarChart2,
  Settings2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import WorkspaceSwitcher from "./workspace-switcher";

const NAV_ITEMS = [
  { href: "/",             label: "Home",                icon: Home },
  { href: "/approvals",    label: "Approvals",           icon: CheckCircle },
  { href: "/conversations",label: "Conversations",       icon: MessageSquare },
  { href: "/knowledge-base", label: "Knowledge Base",   icon: BookOpen },
  { href: "/agent-stats",  label: "Agent Stats",         icon: BarChart2 },
  { href: "/agent-config", label: "Agent Configuration", icon: Settings2 },
  { href: "/team",         label: "Team & Roles",        icon: Users },
  { href: "/settings",     label: "Settings",            icon: Settings },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full border-r transition-all duration-200",
        "bg-[var(--bg-surface)] border-[var(--border-hairline)]",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Workspace switcher */}
      <div className="border-b border-[var(--border-hairline)] shrink-0">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 mx-2 my-0.5 rounded text-sm font-medium transition-colors",
                "text-[var(--fg-muted)] hover:text-[var(--fg-base)] hover:bg-[var(--bg-muted)]",
                active && "text-[var(--fg-base)] bg-[var(--bg-muted)]"
              )}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.2 : 1.8}
                className={cn(
                  "shrink-0",
                  active ? "text-[var(--fg-base)]" : "text-[var(--fg-subtle)]"
                )}
              />
              {!collapsed && (
                <span className={cn(active && "font-semibold")}>{label}</span>
              )}
              {/* Active indicator bar */}
              {active && !collapsed && (
                <span className="ml-auto w-0.5 h-4 rounded-full bg-[var(--fg-base)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="border-t border-[var(--border-hairline)] p-3 shrink-0 flex items-center gap-2 overflow-hidden">
        <Link 
          href="/settings"
          className="flex-1 flex items-center gap-2 min-w-0 hover:bg-[var(--bg-muted)] p-1 -ml-1 rounded transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--color-gray-300)] dark:bg-[var(--color-gray-700)] shrink-0" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--fg-base)] truncate">Admin User</p>
              <p className="text-xs text-[var(--fg-muted)] truncate">admin@autonomi.ai</p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <button
            title="Logout"
            onClick={() => window.location.href = "/login"}
            className="text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors p-1"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute -right-3 top-1/2 -translate-y-1/2 z-10",
          "w-6 h-6 rounded-full flex items-center justify-center",
          "bg-[var(--bg-surface)] border border-[var(--border-hairline)]",
          "text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors shadow-sm"
        )}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
