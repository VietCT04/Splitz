"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import SpendingByCategoryChart from "../components/dashboard/SpendingByCategoryChart";
// fix casing if needed:
import MonthlyNetChart from "../components/dashboard/MonthLyNetChart";
import { Plus, Wallet, Users } from "lucide-react";

// -------- types (optional but helpful) --------
type Dash = {
  spending: { name: string; value: number }[];
  monthly: { day: string; value: number }[];
  activity: {
    name: string;
    action: string;
    detail: string;
    time: string;
    amount: number;
  }[];
  friends: { name: string; amount: number; type: "owed" | "owe" }[];
  groups: { name: string; status: string; updated: string }[];
  stats: { youOwe: number; youAreOwed: number; net: number };
};
// ---------------------------------------------

function getMock(): Dash {
  return {
    spending: [
      { name: "Food", value: 300 },
      { name: "Travel", value: 180 },
      { name: "Utilities", value: 120 },
      { name: "Rent", value: 500 },
      { name: "Misc", value: 90 },
    ],
    monthly: [
      { day: "S", value: 20 },
      { day: "M", value: -5 },
      { day: "T", value: 12 },
      { day: "W", value: 18 },
      { day: "T", value: 8 },
      { day: "F", value: 25 },
      { day: "S", value: 14 },
    ],
    activity: [
      {
        name: "Emma",
        action: "paid",
        detail: "Trip to Bali",
        time: "2h",
        amount: 32.5,
      },
      {
        name: "Liam",
        action: "paid",
        detail: "Housemates",
        time: "2d",
        amount: 15,
      },
      {
        name: "Olivia",
        action: "paid",
        detail: "Project team",
        time: "3d",
        amount: 8.25,
      },
      {
        name: "William",
        action: "paid",
        detail: "Trip to Bali",
        time: "4d",
        amount: 21.0,
      },
    ],
    friends: [
      { name: "Jacob", amount: 50, type: "owed" },
      { name: "Sophia", amount: -15, type: "owe" },
      { name: "James", amount: 8.25, type: "owed" },
    ],
    groups: [
      { name: "Trip to Bali", status: "Total balance", updated: "23m ago" },
      { name: "Apartment 12B", status: "You are owed", updated: "2h ago" },
      { name: "Brunch Buddies", status: "Settled up", updated: "3w ago" },
    ],
    stats: { youOwe: 445.2, youAreOwed: 123.5, net: 78.3 },
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<Dash>(getMock());
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log(token);
    if (!token) return;

    (async () => {
      try {
        const res = await fetch("http://localhost:8080/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
          // no cookies, so:
          credentials: "omit",
        });
        if (!res.ok) throw new Error("unauthorized");
        const real: Dash = await res.json();
        setData(real);
        setIsDemo(false);
      } catch {
        console.log("Using demo data");
        // leave mock data
        setIsDemo(false);
      }
    })();
  }, []);

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
          <div className="flex items-center justify-between">
            <input
              type="search"
              placeholder="Search"
              className="w-full max-w-md rounded-xl border border-gray-900 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500"
            />
            <div className="ml-4 flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black">
                <Plus className="h-4 w-4" /> Add Expense
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">
                <Wallet className="h-4 w-4" /> Settle Up
              </button>
              <button 
                className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">
                <Users className="h-4 w-4" /> Create Group
              </button>
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="You owe"
              value={`$${data.stats.youOwe.toFixed(2)}`}
              variant="danger"
            />
            <StatCard
              title="You are owed"
              value={`$${data.stats.youAreOwed.toFixed(2)}`}
              variant="success"
            />
            <StatCard
              title="Net balance"
              value={`${data.stats.net >= 0 ? "+" : "-"} $${Math.abs(
                data.stats.net
              ).toFixed(2)}`}
              variant="success"
            />
          </div>

          {/* ...use data.activity, data.friends, data.groups, data.spending, data.monthly exactly like before... */}
          {/* main grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* LEFT: activity + friends */}
            <section className="lg:col-span-2 space-y-6">
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
                    data.activity.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {a.name} {a.action}
                            </p>
                            <p className="text-gray-600">
                              {a.detail} · {a.time} ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold">
                            ${a.amount.toFixed(2)}
                          </span>
                          <button className="rounded-xl border border-gray-900 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-50">
                            Settle
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
                          <div className="h-8 w-8 rounded-full bg-gray-200" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {f.name}
                            </p>
                            <p className="text-gray-600">
                              {f.type === "owed" ? "Owed" : "Owe"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            f.type === "owed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {f.type === "owed" ? "+" : "-"}$
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
            </section>

            {/* RIGHT: groups + charts */}
            <aside className="space-y-6">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-900">Groups</h3>
                <ul className="mt-3 space-y-3">
                  {data.groups.length ? (
                    data.groups.map((g, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-md bg-gray-200" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {g.name}
                            </p>
                            <p className="text-gray-600">{g.status}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {g.updated}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-sm text-gray-500">
                      You haven’t joined any groups
                    </li>
                  )}
                </ul>
              </div>

              <SpendingByCategoryChart data={data.spending} />
              <MonthlyNetChart data={data.monthly} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
