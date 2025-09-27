"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/dashboard/Sidebar";
import { LogOut } from "lucide-react";

type User = {
  name: string;
  email: string;
  currency: "USD" | "EUR" | "IDR" | "JPY" | "SGD";
  theme: "system" | "light" | "dark";
  notifications: { email: boolean; push: boolean };
};

const API = "http://localhost:8080";

// Demo fallback
const mockUser: User = {
  name: "Alex Johnson",
  email: "alex@example.com",
  currency: "USD",
  theme: "system",
  notifications: { email: true, push: false },
};

const getErrorMessage = (e: unknown): string => {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
};
export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>(mockUser);
  const [isDemo, setIsDemo] = useState(true);
  const [loading, setLoading] = useState(false);

  const [pwd, setPwd] = useState({ current: "", next: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // Load real user if JWT exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "omit",
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data: User = await res.json();
        setUser(data);
        setIsDemo(false);
      } catch {
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function toast(okMsg?: string, errMsg?: string) {
    setOk(okMsg || null);
    setError(errMsg || null);
    if (okMsg) setTimeout(() => setOk(null), 1800);
    if (errMsg) setTimeout(() => setError(null), 2500);
  }

  async function saveProfile() {
    const token = localStorage.getItem("access_token");
    if (!token) return toast(undefined, "Please log in");
    try {
      setSavingProfile(true);
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: user.name, email: user.email }),
      });
      if (!res.ok) throw new Error("Could not save profile");
      toast("Profile saved");
    } catch (e) {
      const msg = getErrorMessage(e);
      toast(undefined, msg);
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePreferences() {
    const token = localStorage.getItem("access_token");
    if (!token) return toast(undefined, "Please log in");
    try {
      setSavingPrefs(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + `/settings`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currency: user.currency,
            theme: user.theme,
            notifications: user.notifications,
          }),
        }
      );
      if (!res.ok) throw new Error("Could not save settings");
      toast("Settings saved");
    } catch (e) {
      const msg = getErrorMessage(e);
      toast(undefined, msg);
    } finally {
      setSavingPrefs(false);
    }
  }

  async function changePassword() {
    const token = localStorage.getItem("access_token");
    if (!token) return toast(undefined, "Please log in");
    if (!pwd.current || !pwd.next) return toast(undefined, "Fill both fields");
    try {
      setChangingPwd(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + `/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: pwd.current,
            newPassword: pwd.next,
          }),
        }
      );
      if (!res.ok) throw new Error("Password change failed");
      setPwd({ current: "", next: "" });
      toast("Password updated");
    } catch (e) {
      const msg = getErrorMessage(e);
      toast(undefined, msg);
    } finally {
      setChangingPwd(false);
    }
  }

  function signOut() {
    localStorage.removeItem("access_token");
    router.replace("/");
  }

  async function deleteAccount() {
    const sure = confirm(
      "This will permanently delete your account and data. Continue?"
    );
    if (!sure) return;
    const token = localStorage.getItem("access_token");
    if (!token) return toast(undefined, "Please log in");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      signOut();
    } catch (e) {
      const msg = getErrorMessage(e);
      toast(undefined, msg);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl gap-6 p-4 md:p-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          {/* banners */}
          {isDemo && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-900">
              Viewing demo data. Log in to manage your real settings.
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

          {/* header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          {/* content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left column: Profile + Password */}
            <section className="lg:col-span-2 space-y-6">
              {/* Profile */}
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-sm font-medium text-gray-900">Profile</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">
                    <span className="text-gray-700">Name</span>
                    <input
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-gray-700">Email</span>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
                    />
                  </label>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    disabled={savingProfile || isDemo}
                    onClick={saveProfile}
                    className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                  >
                    {savingProfile ? "Saving…" : "Save profile"}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-sm font-medium text-gray-900">
                  Change password
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">
                    <span className="text-gray-700">Current password</span>
                    <input
                      type="password"
                      value={pwd.current}
                      onChange={(e) =>
                        setPwd({ ...pwd, current: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-gray-700">New password</span>
                    <input
                      type="password"
                      value={pwd.next}
                      onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-900 px-3 py-2"
                    />
                  </label>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    disabled={changingPwd || isDemo}
                    onClick={changePassword}
                    className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                  >
                    {changingPwd ? "Updating…" : "Update password"}
                  </button>
                </div>
              </div>
            </section>

            {/* Right column: Preferences, Notifications, Danger */}
            <aside className="space-y-6">
              {/* Preferences */}
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-sm font-medium text-gray-900">
                  Preferences
                </h2>

                <div className="mt-3 text-sm">
                  <p className="text-gray-700">Theme</p>
                  <div className="mt-2 flex gap-3">
                    {(["system", "light", "dark"] as const).map((t) => (
                      <label key={t} className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="theme"
                          checked={user.theme === t}
                          onChange={() => setUser({ ...user, theme: t })}
                        />
                        <span className="capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-sm">
                  <p className="text-gray-700">Default currency</p>
                  <select
                    value={user.currency}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        currency: e.target.value as User["currency"],
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-gray-900 bg-white px-3 py-2"
                  >
                    {["USD", "EUR", "IDR", "JPY", "SGD"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    disabled={savingPrefs || isDemo}
                    onClick={savePreferences}
                    className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                  >
                    {savingPrefs ? "Saving…" : "Save preferences"}
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-sm font-medium text-gray-900">
                  Notifications
                </h2>
                <div className="mt-3 space-y-2 text-sm">
                  <label className="flex items-center justify-between">
                    <span>Email updates</span>
                    <input
                      type="checkbox"
                      checked={user.notifications.email}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          notifications: {
                            ...user.notifications,
                            email: e.target.checked,
                          },
                        })
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Push notifications</span>
                    <input
                      type="checkbox"
                      checked={user.notifications.push}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          notifications: {
                            ...user.notifications,
                            push: e.target.checked,
                          },
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Danger zone */}
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-sm font-medium text-gray-900">
                  Danger zone
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Permanently delete your account and all data.
                </p>
                <button
                  onClick={deleteAccount}
                  disabled={isDemo}
                  className="mt-3 w-full rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                >
                  Delete account
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
