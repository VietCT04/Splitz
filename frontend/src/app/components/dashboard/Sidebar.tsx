import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Activity,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/friends", label: "Friends", icon: UserRound },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/settle-up", label: "Settle Up", icon: Wallet },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 flex-col gap-4 border-r bg-white p-4 rounded-xl">
      <div className="text-2xl font-bold text-gray-900">SplitMate</div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-100"
              >
                <Icon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-600">
        <p>No recent activity</p>
      </div>
    </aside>
  );
}
