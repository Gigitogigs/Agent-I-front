import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autonomi",
};

// Auth pages get no sidebar — just render children directly inside the root layout
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
