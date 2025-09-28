"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/dashboard/Sidebar";
import Avatar from "../components/ui/Avatar";
import { Plus, Wallet } from "lucide-react";

type ActivityItem = {
  id: number;
  type: "expense" | "settlement";
  entityId: number;
  entityName: string;
  who: string;
  description: string;
  amount: number;
  date: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/* ---------- Demo data (groups only) ---------- */
const mockActivity: ActivityItem[] = [
  {
    id: 1,
    type: "expense",
    entityId: 101,
    entityName: "Trip to Bali",
    who: "Emma",
    description: "Airport taxi",
    amount: 42.5,
    date: "2025-09-20",
  },
  {
    id: 2,
    type: "expense",
    entityId: 101,
    entityName: "Trip to Bali",
    who: "Liam",
    description: "Villa deposit",
    amount: -75.0,
    date: "2025-09-19",
  },
  {
    id: 3,
    type: "settlement",
    entityId: 202,
    entityName: "Apartment 12B",
    who: "You",
    description: "Marked as paid",
    amount: -15.0,
    date: "2025-09-18",
  },
  {
    id: 4,
    type: "expense",
    entityId: 303,
    entityName: "Brunch Buddies",
    who: "Jacob",
    description: "Brunch",
    amount: 18.75,
    date: "2025-09-16",
  },
  {
    id: 5,
    type: "settlement",
    entityId: 202,
    entityName: "Apartment 12B",
    who: "You",
    description: "Rent split settled",
    amount: 120.0,
    date: "2025-09-15",
  },
];

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>(mockActivity);
  const [isDemo, setIsDemo] = useState(true);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "expenses" | "settlements">("all");
  const [loading, setLoading] = useState(false);

  // Load real activity if JWT exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/activity`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "omit",
        });
        if (!res.ok) throw new Error("Failed to load activity");
        const data: ActivityItem[] = await res.json();
        setItems(data);
        setIsDemo(false);
      } catch {
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let arr = items.filter(
      (i) =>
        i.entityName.toLowerCase().includes(q) ||
        i.who.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
    if (tab === "expenses") arr = arr.filter((i) => i.type === "expense");
    if (tab === "settlements") arr = arr.filter((i) => i.type === "settlement");
    // newest first
    return arr.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [items, query, tab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          {isDemo && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-900">
              Viewing demo data. Log in to see your real activity.
            </div>
          )}
          {loading && (
            <div className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700">
              Loading…
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search activity"
              className="w-full max-w-md rounded-xl border border-gray-900 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500"
            />
            <div className="flex items-center gap-2">
              <Link
                href="/settle-up"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
              >
                <Wallet className="h-4 w-4" /> Settle Up
              </Link>
              <Link
                href="/groups"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" /> Add Expense
              </Link>
              {isDemo && (
                <Link
                  href="/login?next=/activity"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(["all", "expenses", "settlements"] as const).map((t) => (
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

          {/* Activity list */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900">
                Recent activity
              </h2>
              <span className="text-xs text-gray-600">
                {filtered.length} items
              </span>
            </div>

            <ul className="divide-y">
              {filtered.length ? (
                filtered.map((i) => {
                  const positive = i.amount > 0;
                  const link = `/groups/${i.entityId}`; // entityId is number

                  return (
                    <li
                      key={i.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar size={36} rounded="lg" src="/groupavatar.png" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {i.type === "expense"
                              ? `${i.who} paid`
                              : `${i.who} settled`}{" "}
                            · {i.description}
                          </p>
                          <p className="text-gray-600">
                            {new Date(i.date).toLocaleDateString()} ·{" "}
                            {i.entityName} · Group
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            positive
                              ? "bg-emerald-100 text-emerald-700"
                              : i.amount < 0
                              ? "bg-rose-100 text-rose-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {positive ? "+" : i.amount < 0 ? "-" : ""}$
                          {Math.abs(i.amount).toFixed(2)}
                        </span>
                        <Link
                          href={link}
                          className="rounded-xl border border-gray-900 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-50"
                        >
                          Open
                        </Link>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="py-6 text-center text-sm text-gray-500">
                  No activity found
                </li>
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
