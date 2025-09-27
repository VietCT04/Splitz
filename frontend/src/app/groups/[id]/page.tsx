"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Wallet, Users, MoreHorizontal } from "lucide-react";

/** ---------- types ---------- **/
type Member = { id: number; name: string };
type Expense = {
  id: number;
  description: string;
  amount: number;
  paidBy: number;
  date: string;
};
type Group = {
  id: number;
  name: string;
  members: Member[];
  expenses: Expense[];
};
/** ---------------------------- **/

/** Demo data (used if no JWT in localStorage) */
const mockGroup = (id: number): Group => ({
  id,
  name: "Trip to Bali",
  members: [
    { id: 1, name: "Emma" },
    { id: 2, name: "Liam" },
    { id: 3, name: "Olivia" },
    { id: 4, name: "William" },
  ],
  expenses: [
    {
      id: 1,
      description: "Airport taxi",
      amount: 42.5,
      paidBy: 1,
      date: "2025-09-20",
    },
    {
      id: 2,
      description: "Villa deposit",
      amount: 300,
      paidBy: 2,
      date: "2025-09-18",
    },
    {
      id: 3,
      description: "Dinner",
      amount: 85.2,
      paidBy: 3,
      date: "2025-09-17",
    },
  ],
});

export default function GroupDetail({ params }: { params: { id: number } }) {
  const groupId = params.id;

  const [group, setGroup] = useState<Group>(mockGroup(groupId));
  const [isDemo, setIsDemo] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    (async () => {
      try {
        console.log("fetching real data...");
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_BASE_URL + `/groups/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "omit",
          }
        );
        console.log(res);
        if (!res.ok) throw new Error("bad");
        console.log(res);
        const real: Group = await res.json();
        setGroup(real);
        setIsDemo(false);
      } catch {
        setIsDemo(true);
      }
    })();
  }, [groupId]);

  const perHead = useMemo(() => {
    if (!group.members.length || !group.expenses.length) return 0;
    const total = group.expenses.reduce((s, e) => s + e.amount, 0);
    return total / group.members.length;
  }, [group]);

  const total = useMemo(
    () => group.expenses.reduce((s, e) => s + e.amount, 0),
    [group]
  );

  async function handleAddExpense(payload: {
    description: string;
    amount: number;
    paidBy: string;
    date: string;
    groupId: number;
  }) {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + `/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "omit",
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("bad");
      const id: number = await res.json();
      setGroup((g) => ({
        ...g,
        expenses: [
          ...g.expenses,
          {
            id: id,
            description: payload.description,
            amount: payload.amount,
            paidBy: Number(payload.paidBy),
            date: payload.date,
          },
        ],
      }));
      setOpenAdd(false);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl p-4 md:p-6 space-y-6">
        {/* top bar */}
        <div className="sticky top-0 z-10 -mx-4 mb-2 border-b bg-gray-50/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/groups"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {group.name}
              </h1>
              {isDemo && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Demo data
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">
                <Wallet className="h-4 w-4" /> Settle Up
              </button>
              <button
                onClick={() => setOpenAdd(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
              >
                <Plus className="h-4 w-4" /> Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* summary row */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700">Total spent</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              ${total.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700">Per person (equal split)</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              ${perHead.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700">Members</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.members.map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-900 px-3 py-1 text-sm"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* main grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* EXPENSE LIST */}
          <section className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900">
                Recent expenses
              </h2>
              <button className="rounded-xl border border-gray-900 px-2 py-1 text-xs">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <ul className="rounded-xl border bg-white shadow-sm divide-y">
              {group.expenses.length ? (
                group.expenses.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-gray-200 grid place-items-center">
                        <Users className="h-4 w-4 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {e.description}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(e.date).toLocaleDateString()} · paid by{" "}
                          <span className="font-medium">
                            {group.members.find((m) => m.id === e.paidBy)
                              ?.name ?? "—"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-gray-900 px-2 py-1 text-xs font-semibold">
                        ${e.amount.toFixed(2)}
                      </span>
                      <button className="rounded-xl border border-gray-900 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-50">
                        Settle
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-6 text-center text-sm text-gray-600">
                  No expenses yet. Add your first one!
                </li>
              )}
            </ul>
          </section>

          {/* SIDE CARD: Group actions */}
          <aside className="space-y-4">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900">
                Quick actions
              </h3>
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setOpenAdd(true)}
                  className="w-full rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
                >
                  + Add Expense
                </button>
                <button className="w-full rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Settle Up
                </button>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900">Members</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-900">
                {group.members.map((m) => (
                  <li key={m.id} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                    {m.name}
                  </li>
                ))}
              </ul>
              <button className="mt-3 w-full rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">
                Invite member
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {openAdd && (
        <AddExpenseModal
          members={group.members}
          onClose={() => setOpenAdd(false)}
          onCreate={(payload) => handleAddExpense({ ...payload, groupId })}
        />
      )}
    </div>
  );
}

/** ---------------- Add Expense Modal ---------------- */
function AddExpenseModal({
  members,
  onCreate,
  onClose,
}: {
  members: Member[];
  onCreate: (p: {
    description: string;
    amount: number;
    paidBy: string;
    date: string;
  }) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">Add expense</h3>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const description = String(fd.get("description") || "").trim();
            const amount = Number(fd.get("amount") || 0);
            const paidBy = String(fd.get("paidBy") || "");
            const date = String(
              fd.get("date") || new Date().toISOString().slice(0, 10)
            );
            if (!description || !amount || !paidBy) return;
            onCreate({ description, amount, paidBy, date });
          }}
        >
          <label className="block text-sm">
            <span className="text-gray-700">Description</span>
            <input
              name="description"
              placeholder="e.g. Dinner"
              className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
              autoFocus
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-gray-700">Amount</span>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-700">Date</span>
              <input
                name="date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-gray-700">Paid by</span>
            <select
              name="paidBy"
              className="mt-1 w-full rounded-xl border border-gray-900 bg-white px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>
                Select member
              </option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-900 px-3 py-2 text-sm"
            >
              Cancel
            </button>
            <button className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black">
              Add expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
