"use client";

import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import TopBar from "./top-bar";
import { ScheduledDeletionView } from "@/features/settings/tabs/scheduled-deletion-view";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [deletionType, setDeletionType] = useState<"workspace" | "account" | null>(null);

  useEffect(() => {
    const status = localStorage.getItem("workspace_deletion_status");
    if (status === "grace_period") {
      setDeletionType("workspace");
    } else if (status === "account_grace_period") {
      setDeletionType("account");
    }
  }, []);

  if (deletionType) {
    return <ScheduledDeletionView type={deletionType} />;
  }

  return (
    <div className="flex h-full bg-[var(--bg-subtle)]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
