"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function SignUpClient({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("username") || "").trim();
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm") || "");

    if (!name || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // 1) Register
      const reg = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      if (!reg.ok) {
        const msg = await safeMsg(reg);
        throw new Error(msg || "Sign up failed.");
      }

      // 2) Auto-login
      const login = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      if (!login.ok) {
        const msg = await safeMsg(login);
        throw new Error(msg || "Auto login failed.");
      }
      const { accessToken } = await login.json();
      localStorage.setItem("access_token", accessToken);

      // 3) Navigate
      router.replace(next);
    } catch (err) {
      setError(
        (err instanceof Error ? err.message : String(err)) ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-6 sm:p-8">
        <h1 className="text-xl font-semibold text-gray-900 text-center">
          Create account
        </h1>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="youabc123"
              className="mt-1 w-full rounded-xl border border-gray-900 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-gray-900 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              required
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-gray-900 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-70"
          >
            {loading ? "Creating…" : "Create account"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("https://www.youtube.com/watch?v=IZF2HwLAFb0")
            }
            className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-black"
          >
            Cold Start? Try Demo
          </button>

          <button
            type="button"
            onClick={() => router.push(`/`)}
            className="w-full rounded-xl border border-gray-900 px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Already have an account? Log in
          </button>
        </form>
      </div>
    </main>
  );
}

async function safeMsg(res: Response): Promise<string | null> {
  try {
    const data = await res.json();
    return data?.message || data?.error || null;
  } catch {
    return null;
  }
}
