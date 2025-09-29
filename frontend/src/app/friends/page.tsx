"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Avatar from "../components/ui/Avatar";
import { Plus, Wallet } from "lucide-react";
import Link from "next/link";

type Friend = {
  id: string;
  name: string;
  updated: string; // e.g. "2h ago"
  yourShare: number; // + they owe you, - you owe them
  settled?: boolean;
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const mockFriends: Friend[] = [
  { id: "jacob", name: "Jacob", updated: "1h ago", yourShare: 50 },
  { id: "sophia", name: "Sophia", updated: "2d ago", yourShare: -15 },
  {
    id: "james",
    name: "James",
    updated: "4d ago",
    yourShare: 0,
    settled: true,
  },
];

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [isDemo, setIsDemo] = useState(true);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "owe" | "owed" | "settled">("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const loadFriends = async (token: string) => {
    const res = await fetch(`${API}/api/friends`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "omit",
    });
    if (!res.ok) throw new Error("Failed to load friends");
    const data: Friend[] = await res.json();
    setFriends(data);
    setIsDemo(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) loadFriends(token).catch(() => setIsDemo(true));
  }, []);

  const filtered = useMemo(() => {
    const byName = friends.filter((f) =>
      f.name.toLowerCase().includes(query.toLowerCase().trim())
    );
    switch (tab) {
      case "owe":
        return byName.filter((f) => f.yourShare < 0 && !f.settled);
      case "owed":
        return byName.filter((f) => f.yourShare > 0 && !f.settled);
      case "settled":
        return byName.filter((f) => f.settled || f.yourShare === 0);
      default:
        return byName;
    }
  }, [friends, query, tab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          {isDemo && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-900">
              Viewing demo data. Log in to see your real friends.
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search friends"
              className="w-full max-w-md rounded-xl border border-gray-900 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500"
            />
            <div className="flex items-center gap-2">
              <Link
                href="/settle-up"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
              >
                <Wallet className="h-4 w-4" /> Settle Up
              </Link>
              <button
                onClick={() => setOpenCreate(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" /> Add Friend
              </button>
              {isDemo && (
                <Link
                  href={"/"}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(["all", "owe", "owed", "settled"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-xl border px-3 py-1.5 text-sm capitalize ${
                  tab === t
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-900 text-gray-900 hover:bg-gray-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900">
                Your friends
              </h2>
              <span className="text-xs text-gray-600">
                {filtered.length} total
              </span>
            </div>

            <ul className="divide-y">
              {filtered.length ? (
                filtered.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar size={40} rounded="lg" src="/avatar.jpg" />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{f.name}</p>
                        <p className="text-gray-600">
                          {f.updated}
                          {f.settled ? " · Settled" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          f.yourShare > 0
                            ? "bg-emerald-100 text-emerald-700"
                            : f.yourShare < 0
                            ? "bg-rose-100 text-rose-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {f.yourShare > 0 ? "+" : f.yourShare < 0 ? "-" : ""}$
                        {Math.abs(f.yourShare).toFixed(2)}
                      </span>
                      <Link
                        href={`/friends/${f.id}`}
                        className="rounded-xl border border-gray-900 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-50"
                      >
                        Open
                      </Link>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-6 text-center text-sm text-gray-500">
                  No friends found
                </li>
              )}
            </ul>
          </div>

          {/* Add Friend modal (name only) */}
          {openCreate && (
            <AddFriendModal
              onClose={() => setOpenCreate(false)}
              onCreate={async (payload) => {
                const token = localStorage.getItem("access_token");
                if (!token) {
                  setErr("Please log in");
                  return;
                }
                try {
                  setSubmitting(true);
                  setErr(null);
                  const res = await fetch(`${API}/api/friends`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload), // { name }
                    credentials: "omit",
                  });
                  if (!res.ok) throw new Error("Create failed");
                  await loadFriends(token);
                  setOpenCreate(false);
                } catch (e) {
                  setErr(e + "Something went wrong");
                } finally {
                  setSubmitting(false);
                }
              }}
              submitting={submitting}
              error={err}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Modal ---------------- */

function AddFriendModal({
  onClose,
  onCreate,
  submitting,
  error,
}: {
  onClose: () => void;
  onCreate: (p: { name: string }) => Promise<void>;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">Add friend</h3>
        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget as HTMLFormElement);
            const name = String(fd.get("name") || "").trim();
            if (!name) return;
            await onCreate({ name });
          }}
        >
          <label className="block text-sm">
            <span className="text-gray-700">Name</span>
            <input
              name="name"
              className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
              placeholder="e.g. Emma"
              autoFocus
            />
          </label>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-900 px-3 py-2 text-sm text-gray-900"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
            >
              {submitting ? "Adding…" : "Add friend"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
