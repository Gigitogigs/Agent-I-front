import React from "react";
import { rostex } from "@/lib/fonts";

interface WordmarkProps {
  className?: string;
  children?: React.ReactNode;
}

export function Wordmark({
  className = "text-3xl text-[var(--fg-base)]",
  children = "AUTONOMI",
}: WordmarkProps) {
  return (
    <span
      role="img"
      aria-label="Autonomi"
      className={`${rostex.className} ${className} tracking-wider select-none inline-block`}
    >
      {children}
    </span>
  );
}
