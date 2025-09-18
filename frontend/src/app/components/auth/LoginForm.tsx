"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export default function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") ?? "/dashboard";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // show an error UI if you like
      return;
    }

    // Replace so back button won't return to login
    router.replace(next);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
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
          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-black"
      >
        Log In
      </button>

      <p className="text-center text-sm text-gray-600">
        <a href="#" className="font-medium hover:underline">
          Forgot your password?
        </a>
      </p>
    </form>
  );
}
