"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";

// Note: metadata export works in server components only.
// Move to a separate layout.tsx if needed, or use generateMetadata.
// For simplicity, page title is set in the document head via layout.

export default function SignupPage() {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function validatePassword() {
    if (password.length > 0 && password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-subtle)] px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-[var(--fg-base)]">
              Autonomi
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
          <div className="px-8 pt-8 pb-2">
            <h1 className="text-sm font-semibold text-[var(--fg-base)]">
              Create your account
            </h1>
          </div>

          <form action="#" method="POST" className="px-8 pt-5 pb-7 space-y-4">

            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-name"
                className="block text-xs font-medium text-[var(--fg-muted)]"
              >
                Full name
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Jane Smith"
                className="
                  w-full px-3 py-2 text-sm
                  bg-[var(--bg-subtle)] text-[var(--fg-base)]
                  border border-[var(--border-hairline)]
                  placeholder:text-[var(--fg-subtle)]
                  focus:outline-none focus:border-[var(--fg-base)]
                  transition-colors
                "
                style={{ borderRadius: "var(--radius-interactive)" }}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-email"
                className="block text-xs font-medium text-[var(--fg-muted)]"
              >
                Email
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                className="
                  w-full px-3 py-2 text-sm
                  bg-[var(--bg-subtle)] text-[var(--fg-base)]
                  border border-[var(--border-hairline)]
                  placeholder:text-[var(--fg-subtle)]
                  focus:outline-none focus:border-[var(--fg-base)]
                  transition-colors
                "
                style={{ borderRadius: "var(--radius-interactive)" }}
              />
            </div>

            {/* Password — confirm-on-blur, no separate confirm field */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-password"
                className="block text-xs font-medium text-[var(--fg-muted)]"
              >
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
                className="
                  w-full px-3 py-2 text-sm
                  bg-[var(--bg-subtle)] text-[var(--fg-base)]
                  border transition-colors
                  placeholder:text-[var(--fg-subtle)]
                  focus:outline-none focus:border-[var(--fg-base)]
                "
                style={{
                  borderRadius: "var(--radius-interactive)",
                  borderColor: passwordError
                    ? "var(--color-danger)"
                    : "var(--border-hairline)",
                }}
              />
              {passwordError && (
                <p className="text-xs text-[var(--color-danger)]">{passwordError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              className="
                w-full py-2 text-sm font-medium mt-2
                bg-[var(--fg-base)] text-[var(--bg-surface)]
                hover:opacity-90 active:opacity-80 transition-opacity
              "
              style={{ borderRadius: "var(--radius-interactive)" }}
            >
              Create account
            </button>
          </form>
        </div>

        {/* Secondary link */}
        <p className="text-center text-xs text-[var(--fg-muted)] mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--fg-base)] font-medium underline-offset-2 hover:underline transition-colors"
          >
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}
