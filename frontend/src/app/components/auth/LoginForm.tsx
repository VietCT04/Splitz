"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export default function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") ?? "/dashboard";

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fd = new FormData(e.currentTarget);
      const body = {
        name: String(fd.get("username") || ""),
        password: String(fd.get("password") || ""),
      };

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        let msg = "Login failed.";
        try {
          const j = await res.json();
          msg = j?.message || j?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const { accessToken } = await res.json();
      localStorage.setItem("access_token", accessToken);

      router.replace(next);
    } catch (err) {
      setError(err + "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </div>
      )}

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
          disabled={loading}
          placeholder="youabc123"
          className="mt-1 w-full rounded-xl border border-gray-900 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none disabled:opacity-60"
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
          disabled={loading}
          placeholder="••••••••"
          className="mt-1 w-full rounded-xl border border-gray-900 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-70"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Logging in…
          </span>
        ) : (
          "Log In"
        )}
      </button>

      <button
        type="button"
        onClick={() => router.push("/signup")}
        className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-70"
      >
        Sign Up
      </button>

      <button
        type="button"
        onClick={() =>
          router.push("https://www.youtube.com/watch?v=IZF2HwLAFb0")
        }
        className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-70"
      >
        Cold Start (2-3 mins)? Try Demo
      </button>

      <p className="text-center text-sm text-gray-600">
        <a href="#" className="font-medium hover:underline">
          Forgot your password?
        </a>
      </p>
    </form>
  );
}
