"use client";

import Avatar from "../components/ui/Avatar";
import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import { Plus, Wallet, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// -------- types --------
type Dash = {
  activity: {
    id: string;
    type: "expense" | "settlement";
    entityId: number;
    entityName: string;
    who: string;
    description: string;
    amount: number;
    date: string;
  }[];
  friends: { name: string; amount: number }[];
  groups: { name: string }[];
  stats: { net: number };
};
// -----------------------

// Mock now matches Dash exactly
function getMock(): Dash {
  return {
    activity: [
      {
        id: "a1",
        type: "expense",
        entityId: 101,
        entityName: "Trip to Bali",
        who: "Emma",
        description: "Airport taxi",
        amount: 32.5,
        date: "2025-09-20",
      },
      {
        id: "a2",
        type: "expense",
        entityId: 101,
        entityName: "Trip to Bali",
        who: "Liam",
        description: "Villa deposit",
        amount: -15,
        date: "2025-09-19",
      },
      {
        id: "a3",
        type: "settlement",
        entityId: 202,
        entityName: "Apartment 12B",
        who: "You",
        description: "Marked as paid",
        amount: 78.3,
        date: "2025-09-18",
      },
    ],
    friends: [
      { name: "Jacob", amount: 50 },
      { name: "Sophia", amount: -15 },
      { name: "James", amount: 8.25 },
    ],
    groups: [
      { name: "Trip to Bali" },
      { name: "Apartment 12B" },
      { name: "Brunch Buddies" },
    ],
    stats: { net: 78.3 },
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<Dash>(getMock());
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(
          (process.env.NEXT_PUBLIC_API_BASE_URL || "") + "/dashboard",
          { headers: { Authorization: `Bearer ${token}` }, credentials: "omit" }
        );
        if (!res.ok) throw new Error();
        const real: Dash = await res.json();
        setData(real);
        setIsDemo(false);
      } catch {
        setIsDemo(true);
      }
    })();
  }, []);

  // derive friendly activity list (newest first)
  const activity = useMemo(
    () =>
      [...data.activity].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [data.activity]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          {isDemo && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-900">
              Viewing demo data. Log in to see your real balances.
            </div>
          )}

          {/* top bar */}
          <div className="flex items-center justify-end">
            <div className="ml-4 flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black">
                <Plus className="h-4 w-4" /> Add Expense
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">
                <Wallet className="h-4 w-4" /> Settle Up
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">
                <Users className="h-4 w-4" /> Create Group
              </button>
              {isDemo && (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>

          {/* stats (only Net now) */}
          {/* 2-column page layout: LEFT (2/3) · RIGHT (1/3) */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* LEFT column (2/3): Net balance → Recent activity → Friends balances */}
            <div className="space-y-6 lg:col-span-2">
              {/* Net balance */}
              <div className="grid grid-cols-1">
                <StatCard
                  title="Net balance"
                  value={`${data.stats.net >= 0 ? "+" : "-"} $${Math.abs(
                    data.stats.net
                  ).toFixed(2)}`}
                  variant={data.stats.net >= 0 ? "success" : "danger"}
                />
              </div>

              {/* Recent activity */}
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    Recent activity
                  </h3>
                  <button className="rounded-lg border border-gray-900 px-2 py-1 text-xs">
                    •••
                  </button>
                </div>
                <ul className="mt-3 divide-y">
                  {data.activity.length ? (
                    data.activity.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            size={36}
                            rounded="lg"
                            src="/groupavatar.png"
                          />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {a.who}{" "}
                              {a.type === "expense" ? "paid" : "settled"} ·{" "}
                              {a.description}
                            </p>
                            <p className="text-gray-600">
                              {new Date(a.date).toLocaleDateString()} ·{" "}
                              {a.entityName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              a.amount > 0
                                ? "bg-emerald-100 text-emerald-700"
                                : a.amount < 0
                                ? "bg-rose-100 text-rose-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {a.amount > 0 ? "+" : a.amount < 0 ? "-" : ""}$
                            {Math.abs(a.amount).toFixed(2)}
                          </span>
                          <button className="rounded-xl border border-gray-900 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-50">
                            Open
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-6 text-center text-sm text-gray-500">
                      No activity yet
                    </li>
                  )}
                </ul>
              </div>

              {/* Friends balances */}
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-900">
                  Friends balances
                </h3>
                <ul className="mt-3 space-y-3">
                  {data.friends.length ? (
                    data.friends.map((f, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar size={40} rounded="lg" src="/avatar.jpg" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {f.name}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            f.amount > 0
                              ? "bg-emerald-100 text-emerald-700"
                              : f.amount < 0
                              ? "bg-rose-100 text-rose-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {f.amount > 0 ? "+" : f.amount < 0 ? "-" : ""}$
                          {Math.abs(f.amount).toFixed(2)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-sm text-gray-500">
                      No friends yet
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* RIGHT column (1/3): Groups */}
            <aside className="space-y-6">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-900">Groups</h3>
                <ul className="mt-3 space-y-3">
                  {data.groups.length ? (
                    data.groups.map((g, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src="/groupavatar.png"
                            alt=""
                            className="h-8 w-8 rounded-lg"
                          />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {g.name}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-sm text-gray-500">
                      You haven’t joined any groups
                    </li>
                  )}
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
