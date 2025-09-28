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
      // show an error UI if you like
      return;
    }
    const { accessToken } = await res.json();
    localStorage.setItem("access_token", accessToken);
    console.log(accessToken);
    // Replace so back button won't return to login
    router.replace(next);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="name"
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

      <button
        type="submit"
        className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-black"
      >
        Log In
      </button>
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-black"
      >
        Sign Up
      </button>

      <button
        type="button"
        onClick={() =>
          router.push(
            "https://www.youtube.com/watch?v=3JVpAIJM2lw&list=RD0chK12qHGfM&index=27"
          )
        }
        className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-black"
      >
        Cold Start? Try Demo
      </button>

      <p className="text-center text-sm text-gray-600">
        <a href="#" className="font-medium hover:underline">
          Forgot your password?
        </a>
      </p>
    </form>
  );
}
