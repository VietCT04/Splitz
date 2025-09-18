"use client";

import Image from "next/image";
import * as React from "react";
import { JSX } from "react";

export default function Home(): JSX.Element {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    console.log({ email, password }); // replace with your auth call
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Sign in</h1>
        </div>

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
            className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Log in
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-gray-600">
          <a href="#" className="font-medium hover:underline">
            Forgot your password?
          </a>
        </p>
      </div>
    </main>
  );
}
