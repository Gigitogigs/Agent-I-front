import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set up your workspace — Autonomi",
  description: "One-time workspace setup wizard",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-subtle)] dark px-4">
      <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-10">
        {/* Logo */}
        <div className="text-base font-semibold tracking-tight text-[var(--fg-base)] mb-8">Autonomi</div>

        {/* Progress */}
        <div className="flex items-center gap-1.5 mb-8">
          {[1,2,3,4,5,6].map((step) => (
            <span
              key={step}
              className={`h-1.5 flex-1 rounded-full ${step <= 2 ? "bg-[var(--fg-base)]" : "bg-[var(--border-hairline)]"}`}
            />
          ))}
        </div>
        <p className="text-xs text-[var(--fg-muted)] mb-1">Step 2 of 6</p>

        <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-1">Connect your backend</h2>
        <p className="text-xs text-[var(--fg-muted)] mb-8">
          Link Autonomi to where your orders and customer data live.
        </p>

        {/* Adapter choice */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {[
            { id: "shopify",  label: "Shopify",   icon: "🛍" },
            { id: "inhouse",  label: "In-house",  icon: "🏢" },
          ].map((opt) => (
            <button
              key={opt.id}
              className="
                flex flex-col items-center gap-2 py-8 px-4
                border border-[var(--border-hairline)]
                text-sm font-medium text-[var(--fg-base)]
                hover:bg-[var(--bg-muted)] transition-colors
              "
            >
              <span className="text-2xl">{opt.icon}</span>
              {opt.label}
              <span className="text-xs text-[var(--fg-muted)] font-normal">Connect</span>
            </button>
          ))}
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between">
          <button className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] underline transition-colors">
            ← Back
          </button>
          <button className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] transition-colors">
            Skip for now
          </button>
          <button
            className="
              px-4 py-1.5 text-xs font-medium
              bg-[var(--fg-base)] text-[var(--bg-surface)]
              hover:opacity-90 transition-opacity
            "
            style={{ borderRadius: "var(--radius-interactive)" }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
