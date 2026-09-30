"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Wordmark } from "@/components/Wordmark";

// Note: metadata export works in server components only.
// Move to a separate layout.tsx if needed, or use generateMetadata.
// For simplicity, page title is set in the document head via layout.

export default function SignupPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const signupMutation = useMutation({
    mutationFn: async () => {
      // API may expect full_name, passing it along with standard email/password
      return apiClient.post("/auth/register", { full_name: name, email, password });
    },
    onSuccess: () => {
      // Some systems auto-login on register, some don't.
      // If not, we might need to call login here, but let's try pushing to home
      // and let the Auth check route/redirect if necessary, or push to /login
      router.push("/login");
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || "Failed to create account.");
    }
  });

  function validatePassword() {
    if (password.length > 0 && password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    validatePassword();
    if (password.length < 8) return;
    signupMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-subtle)] px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <Wordmark className="text-3xl text-[var(--fg-base)]" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
          <div className="px-8 pt-8 pb-2">
            <h1 className="text-sm font-semibold text-[var(--fg-base)]">
              Create your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pt-5 pb-7 space-y-4">

            {errorMsg && (
              <div className="p-3 text-xs text-[var(--color-danger)] bg-[var(--bg-subtle)] border border-[var(--color-danger)] rounded">
                {errorMsg}
              </div>
            )}

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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                Email address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                aria-describedby={passwordError ? "signup-password-error" : undefined}
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
                <p id="signup-password-error" className="text-xs text-[var(--color-danger)]">{passwordError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={signupMutation.isPending}
              className="
                w-full py-2 text-sm font-medium mt-2
                bg-[var(--fg-base)] text-[var(--bg-surface)]
                hover:opacity-90 active:opacity-80 transition-opacity
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              style={{ borderRadius: "var(--radius-interactive)" }}
            >
              {signupMutation.isPending ? "Creating account..." : "Create account"}
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
