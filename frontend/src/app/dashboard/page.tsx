import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import SpendingByCategoryChart from "../components/dashboard/SpendingByCategoryChart";
import MonthlyNetChart from "../components/dashboard/MonthLyNetChart";
import { Plus, Wallet, Users } from "lucide-react";

export default function DashboardPage() {
  // --- mock data (replace with real data later) ---
  const spending = [
    { name: "Food", value: 300 },
    { name: "Travel", value: 180 },
    { name: "Utilities", value: 120 },
    { name: "Rent", value: 500 },
    { name: "Misc", value: 90 },
  ];

  const monthly = [
    { day: "S", value: 20 },
    { day: "M", value: -5 },
    { day: "T", value: 12 },
    { day: "W", value: 18 },
    { day: "T", value: 8 },
    { day: "F", value: 25 },
    { day: "S", value: 14 },
  ];

  const activity = [
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
  ];

  const friends = [
    { name: "Jacob", amount: 50, type: "owed" as const },
    { name: "Sophia", amount: -15, type: "owe" as const },
    { name: "James", amount: 8.25, type: "owed" as const },
  ];

  const groups = [
    { name: "Trip to Bali", status: "Total balance", updated: "23m ago" },
    { name: "Apartment 12B", status: "You are owed", updated: "2h ago" },
    { name: "Brunch Buddies", status: "Settled up", updated: "3w ago" },
  ];
  // -------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          {/* top bar */}
          <div className="flex items-center justify-between">
            <input
              type="search"
              placeholder="Search"
              className="w-full max-w-md rounded-xl border bg-white px-3 py-2 placeholder:text-black-500"
            />
            <div className="ml-4 flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white">
                <Plus className="h-4 w-4" /> Add Expense
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 border px-3 py-2 text-sm font-medium ">
                <Wallet className="h-4 w-4" /> Settle Up
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 border px-3 py-2 text-sm font-medium">
                <Users className="h-4 w-4" /> Create Group
              </button>
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="You owe" value="$445.20" variant="danger" />
            <StatCard title="You are owed" value="$123.50" variant="success" />
            <StatCard title="Net balance" value="+ $78.30" variant="success" />
          </div>

          {/* main grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2 space-y-6">
              {/* recent activity */}
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-800">
                    Recent activity
                  </h3>
                  <button className="rounded-lg border px-2 py-1 text-xs">
                    •••
                  </button>
                </div>
                <ul className="mt-3 divide-y">
                  {activity.map((a, i) => (
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
                          <p className="text-gray-500">
                            {a.detail} · {a.time} ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold">
                          ${a.amount.toFixed(2)}
                        </span>
                        <button className="rounded-xl border px-3 py-1.5 text-sm">
                          Settle
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* friends balances */}
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-800">
                  Friends balances
                </h3>
                <ul className="mt-3 space-y-3">
                  {friends.map((f, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{f.name}</p>
                          <p className="text-gray-500">
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
                  ))}
                </ul>
              </div>
            </section>

            {/* right column */}
            <aside className="space-y-6">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-800">Groups</h3>
                <ul className="mt-3 space-y-3">
                  {groups.map((g, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-gray-200" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{g.name}</p>
                          <p className="text-gray-500">{g.status}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{g.updated}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <SpendingByCategoryChart data={spending} />
              <MonthlyNetChart data={monthly} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
