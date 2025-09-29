"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/dashboard/Sidebar";
import { LogOut } from "lucide-react";

type User = {
  username: string;
};

const mockUser: User = {
  username: "Alex Johnson",
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
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_BASE_URL + `/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "omit",
          }
        );
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        console.log("Fetched user:", data);
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
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + `/auth/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username: user.username }),
        }
      );
      if (!res.ok) throw new Error("Could not save profile");
      toast("Profile saved");
    } catch (e) {
      toast(undefined, getErrorMessage(e));
    } finally {
      setSavingProfile(false);
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
      toast(undefined, getErrorMessage(e));
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
      toast(undefined, getErrorMessage(e));
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
            <div className="flex items-center gap-3 justify-end">
              {!isDemo && (
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              )}
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

          {/* content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left column: Profile + Password */}
            <section className="lg:col-span-2 space-y-6">
              {/* Profile (Name only) */}
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-sm font-medium text-gray-900">Profile</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm sm:col-span-2">
                    <span className="text-gray-700">Username</span>
                    <input
                      value={user.username ?? ""}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                      placeholder="Your name"
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

              {/* Change password */}
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

            {/* Right column: Danger zone */}
            <aside className="space-y-6">
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
