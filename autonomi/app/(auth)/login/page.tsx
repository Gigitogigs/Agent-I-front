"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, axiosInstance } from "@/lib/api-client";
import { tokenStore } from "@/lib/token-store";

interface LoginResponse {
  user: { id: string; name: string; email: string; avatarUrl?: string };
  activeWorkspaceId: string | null;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post<LoginResponse>("/auth/login", { email, password });
    },
    onSuccess: (data: LoginResponse) => {
      tokenStore.set(data.access_token, data.expires_in);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      // Invalidate (don't seed) the auth/me cache so useAuth refetches the full
      // UserOut from the server — including the `memberships` array that
      // initialises activeWorkspaceId.  Seeding data.user here was the bug:
      // the login response omits `memberships`, so activeWorkspaceId stayed
      // undefined and all workspace-scoped queries remained permanently disabled.
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      router.push("/");
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.detail || "Invalid email or password.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    loginMutation.mutate();
  };

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
              Log in to Autonomi
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pt-5 pb-7 space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs text-[var(--color-danger)] bg-[var(--bg-subtle)] border border-[var(--color-danger)] rounded">
                {errorMsg}
              </div>
            )}
            
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
                  tabIndex={-1}
                  className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-base)] underline-offset-2 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              disabled={loginMutation.isPending}
              className="
                w-full py-2 text-sm font-medium mt-2
                bg-[var(--fg-base)] text-[var(--bg-surface)]
                hover:opacity-90 active:opacity-80 transition-opacity
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              style={{ borderRadius: "var(--radius-interactive)" }}
            >
              {loginMutation.isPending ? "Logging in..." : "Log in"}
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
