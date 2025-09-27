"use client";
const API = "http://localhost:8080";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { Plus, Users, Wallet } from "lucide-react";

type Group = {
  id: string;
  name: string;
  updated: string; 
  members: number;
  yourShare: number;
  settled?: boolean;
};

const mockGroups: Group[] = [
  {
    id: "bali",
    name: "Trip to Bali",
    updated: "23m ago",
    members: 6,
    yourShare: 42.8,
  },
  {
    id: "apt12b",
    name: "Apartment 12B",
    updated: "2h ago",
    members: 3,
    yourShare: -15,
  },
  {
    id: "brunch",
    name: "Brunch Buddies",
    updated: "3w ago",
    members: 4,
    yourShare: 0,
    settled: true,
  },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [isDemo, setIsDemo] = useState(true);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "owe" | "owed" | "settled">("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadGroups(token: string) {
    const res = await fetch(`${API}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "omit",
    });
    if (!res.ok) throw new Error("Failed to load groups");
    const data: Group[] = await res.json();
    setGroups(data);
    setIsDemo(false);
  }
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) loadGroups(token).catch(() => setIsDemo(true));
  }, []);

  const filtered = useMemo(() => {
    const byName = groups.filter((g) =>
      g.name.toLowerCase().includes(query.toLowerCase().trim())
    );
    switch (tab) {
      case "owe":
        return byName.filter((g) => g.yourShare < 0 && !g.settled);
      case "owed":
        return byName.filter((g) => g.yourShare > 0 && !g.settled);
      case "settled":
        return byName.filter((g) => g.settled || g.yourShare === 0);
      default:
        return byName;
    }
  }, [groups, query, tab]);

  const addGroup = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setGroups((prev) => [
      { id, name, updated: "just now", members: 1, yourShare: 0 },
      ...prev,
    ]);
    setOpenCreate(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          {isDemo && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-900">
              Viewing demo data. Log in to see your real groups.
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search groups"
              className="w-full max-w-md rounded-xl border border-gray-900 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500"
            />
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black">
                <Wallet className="h-4 w-4" /> Settle Up
              </button>
              <button
                onClick={() => setOpenCreate(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" /> Create Group
              </button>
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
              <h2 className="text-sm font-medium text-gray-900">Your groups</h2>
              <span className="text-xs text-gray-600">
                {filtered.length} total
              </span>
            </div>
            <ul className="divide-y">
              {filtered.length ? (
                filtered.map((g) => (
                  <li
                    key={g.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gray-200">
                        <Users className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{g.name}</p>
                        <p className="text-gray-600">
                          {g.members} members · {g.updated}
                          {g.settled ? " · Settled" : null}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          g.yourShare > 0
                            ? "bg-emerald-100 text-emerald-700"
                            : g.yourShare < 0
                            ? "bg-rose-100 text-rose-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {g.yourShare > 0 ? "+" : g.yourShare < 0 ? "-" : ""}$
                        {Math.abs(g.yourShare).toFixed(2)}
                      </span>
                      <Link
                        href={`/groups/${g.id}`}
                        className="rounded-xl border border-gray-900 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-50"
                      >
                        Open
                      </Link>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-6 text-center text-sm text-gray-500">
                  No groups yet
                </li>
              )}
            </ul>
          </div>

          {/* Create Group modal (simple) */}
          {openCreate && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900">
                  Create a group
                </h3>
                <form
                  className="mt-4 space-y-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError(null);
                    const name =
                      new FormData(e.currentTarget)
                        .get("name")
                        ?.toString()
                        .trim() || "";
                    if (!name) {
                      setError("Group name required");
                      return;
                    }

                    const token = localStorage.getItem("access_token");
                    if (!token) {
                      setError("Please log in");
                      return;
                    }

                    try {
                      setSubmitting(true);
                      const res = await fetch(`${API}/groups`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ name }),
                        credentials: "omit",
                      });
                      if (!res.ok) throw new Error("Create failed");

                      await loadGroups(token); // <— refresh list
                      setOpenCreate(false); // close modal
                    } catch (err: any) {
                      setError(err.message ?? "Something went wrong");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  <input
                    name="name"
                    placeholder="Group name"
                    className="w-full rounded-xl border border-gray-900 px-3 py-2"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setOpenCreate(false)}
                      className="rounded-xl border border-gray-900 px-3 py-2 text-sm text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
                      disabled={submitting}
                    >
                      {submitting ? "Creating..." : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
