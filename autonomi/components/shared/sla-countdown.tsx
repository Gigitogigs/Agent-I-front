"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCountdown } from "@/lib/utils";

interface SlaCountdownProps {
  expiresAt: string; // ISO datetime
  className?: string;
}

export function SlaCountdown({ expiresAt, className }: SlaCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    // Calculate initial value client-side to avoid hydration mismatch
    const initial = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
    setSecondsLeft(initial);
    setMounted(true);
  }, [expiresAt]);

  useEffect(() => {
    if (!mounted || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [mounted, secondsLeft]);

  const urgencyClass =
    !mounted
      ? "text-[var(--fg-muted)]"
      : secondsLeft === 0 || secondsLeft < 300   // expired or < 5 min
      ? "text-[var(--color-danger)]"
      : secondsLeft < 900                         // < 15 min
      ? "text-[var(--color-warning)]"
      : "text-[var(--fg-muted)]";

  return (
    <span
      className={cn("text-xs font-mono tabular-nums", urgencyClass, className)}
      suppressHydrationWarning
    >
      ⏱ {mounted ? formatCountdown(secondsLeft) : "—"}
    </span>
  );
}
