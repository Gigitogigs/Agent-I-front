import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Log in — Autonomi",
  description: "Log in to your Autonomi workspace",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-subtle)] px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            {/* Wordmark */}
            <span className="text-xl font-semibold tracking-tight text-[var(--fg-base)]">
              Autonomi
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
          <div className="px-8 pt-8 pb-2">
            <h1 className="text-sm font-semibold text-[var(--fg-base)]">
              Log in to Autonomi
            </h1>
          </div>

          <form action="#" method="POST" className="px-8 pt-5 pb-7 space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-medium text-[var(--fg-muted)]"
              >
                Email
              </label>
              <input
                id="login-email"
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

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-[var(--fg-muted)]"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] underline-offset-2 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
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

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="
                w-full py-2 text-sm font-medium mt-2
                bg-[var(--fg-base)] text-[var(--bg-surface)]
                hover:opacity-90 active:opacity-80 transition-opacity
              "
              style={{ borderRadius: "var(--radius-interactive)" }}
            >
              Log in
            </button>
          </form>
        </div>

        {/* Secondary link */}
        <p className="text-center text-xs text-[var(--fg-muted)] mt-5">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[var(--fg-base)] font-medium underline-offset-2 hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
