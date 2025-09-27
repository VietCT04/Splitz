"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Avatar from "../components/ui/Avatar";
import { Wallet } from "lucide-react";

type BalanceItem = {
  id: string;
  kind: "friend" | "group";
  name: string;
  amount: number; // + means they owe you, - means you owe them
};

type SettlePayload = {
  counterpartyId: string;
  kind: "friend" | "group";
  amount: number; // positive number
  direction: "pay" | "receive"; // pay = you pay them, receive = they pay you
  note?: string;
  date: string; // ISO yyyy-mm-dd
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/** Demo data if no JWT is present */
const mockBalances: BalanceItem[] = [
  { id: "jacob", kind: "friend", name: "Jacob", amount: 50 }, // they owe you $50
  { id: "sophia", kind: "friend", name: "Sophia", amount: -15 }, // you owe them $15
  { id: "bali", kind: "group", name: "Trip to Bali", amount: 42.8 },
];

export default function SettleUpPage() {
  const [balances, setBalances] = useState<BalanceItem[]>(mockBalances);
  const [isDemo, setIsDemo] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<BalanceItem | null>(balances[0]);
  const [form, setForm] = useState<{
    amount: string;
    note: string;
    date: string;
  }>({
    amount: Math.abs(balances[0].amount).toFixed(2),
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load real balances if JWT exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/balances`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "omit",
        });
        if (!res.ok) throw new Error("Failed to load balances");
        const data: BalanceItem[] = await res.json();
        setBalances(data);
        setSelected(data[0] ?? null);
        setForm((f) => ({
          ...f,
          amount: data[0] ? Math.abs(data[0].amount).toFixed(2) : "",
        }));
        setIsDemo(false);
      } catch {
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Direction inferred by balance sign
  const direction = useMemo<"pay" | "receive">(() => {
    if (!selected) return "pay";
    return selected.amount < 0 ? "pay" : "receive";
  }, [selected]);

  function toast(okMsg?: string, errMsg?: string) {
    setOk(okMsg || null);
    setError(errMsg || null);
    if (okMsg) setTimeout(() => setOk(null), 1500);
    if (errMsg) setTimeout(() => setError(null), 2500);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast(undefined, "Please log in to record a settlement.");
      return;
    }

    const amountNum = Number(form.amount);
    if (!amountNum || amountNum < 0) {
      toast(undefined, "Enter a valid amount.");
      return;
    }

    const payload: SettlePayload = {
      counterpartyId: selected.id,
      kind: selected.kind,
      amount: amountNum,
      direction,
      note: form.note || undefined,
      date: form.date,
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API}/api/settlements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "omit",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to record settlement");

      // Refresh balances after success
      const ref = await fetch(`${API}/api/balances`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "omit",
      });
      if (ref.ok) {
        const updated: BalanceItem[] = await ref.json();
        setBalances(updated);
        const next =
          updated.find((b) => b.id === selected.id) ?? updated[0] ?? null;
        setSelected(next);
        setForm((f) => ({
          ...f,
          amount: next ? Math.abs(next.amount).toFixed(2) : "",
        }));
      }

      toast("Settlement recorded");
    } catch (e: any) {
      toast(undefined, e.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          {isDemo && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-900">
              Viewing demo data. Log in to record real settlements.
            </div>
          )}
          {loading && (
            <div className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700">
              Loading…
            </div>
          )}
          {ok && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-emerald-800">
              {ok}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-rose-800">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Settle up</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* LEFT: Balances list */}
            <section className="lg:col-span-2 rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="text-sm font-medium text-gray-900">
                Outstanding balances
              </h2>
              <ul className="mt-3 divide-y">
                {balances.length ? (
                  balances.map((b) => {
                    const positive = b.amount > 0;
                    return (
                      <li
                        key={b.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            size={36}
                            rounded="lg"
                            src={
                              b.kind === "group"
                                ? "/groupavatar.png"
                                : "/avatar.jpg"
                            }
                          />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {b.name}
                            </p>
                            <p className="text-gray-600">
                              {b.kind === "group" ? "Group" : "Friend"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              positive
                                ? "bg-emerald-100 text-emerald-700"
                                : b.amount < 0
                                ? "bg-rose-100 text-rose-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {positive ? "+" : b.amount < 0 ? "-" : ""}$
                            {Math.abs(b.amount).toFixed(2)}
                          </span>
                          <button
                            onClick={() => {
                              setSelected(b);
                              setForm((f) => ({
                                ...f,
                                amount: Math.abs(b.amount).toFixed(2),
                              }));
                            }}
                            className="rounded-xl border border-gray-900 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-50"
                          >
                            Select
                          </button>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="py-6 text-center text-sm text-gray-500">
                    No balances to settle
                  </li>
                )}
              </ul>
            </section>

            {/* RIGHT: Settle form */}
            <aside className="space-y-4">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-900">
                  Record a settlement
                </h3>

                {!selected ? (
                  <p className="mt-3 text-sm text-gray-600">
                    Select a friend or group from the list.
                  </p>
                ) : (
                  <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-3">
                      <Avatar
                        size={36}
                        rounded="lg"
                        src={
                          selected.kind === "group"
                            ? "/groupavatar.png"
                            : "/avatar.jpg"
                        }
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selected.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {direction === "pay" ? "You pay" : "You receive"}
                        </p>
                      </div>
                    </div>

                    <label className="block text-sm">
                      <span className="text-gray-700">Amount</span>
                      <input
                        name="amount"
                        value={form.amount}
                        onChange={(e) =>
                          setForm({ ...form, amount: e.target.value })
                        }
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-sm">
                        <span className="text-gray-700">Date</span>
                        <input
                          name="date"
                          type="date"
                          value={form.date}
                          onChange={(e) =>
                            setForm({ ...form, date: e.target.value })
                          }
                          className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
                        />
                      </label>

                      <label className="block text-sm">
                        <span className="text-gray-700">Note (optional)</span>
                        <input
                          name="note"
                          value={form.note}
                          onChange={(e) =>
                            setForm({ ...form, note: e.target.value })
                          }
                          placeholder="e.g. cash transfer"
                          className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
                        />
                      </label>
                    </div>

                    <button
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                    >
                      <Wallet className="h-4 w-4" />
                      {submitting
                        ? "Recording…"
                        : direction === "pay"
                        ? "Mark as Paid"
                        : "Mark as Received"}
                    </button>
                  </form>
                )}
              </div>

              <div className="rounded-xl border bg-white p-4 text-xs text-gray-600">
                <p className="font-medium text-gray-900">How this works</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>
                    Positive amounts mean they owe you; negative means you owe
                    them.
                  </li>
                  <li>
                    “Mark as Paid” records that you paid the selected amount.
                  </li>
                  <li>“Mark as Received” records that they paid you.</li>
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
