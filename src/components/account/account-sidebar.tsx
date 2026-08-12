"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Bell,
  CircleHelp,
  Grid2X2,
  Heart,
  LogOut,
  MapPin,
  Package,
  RotateCcw,
  User,
} from "lucide-react";

type Props = {
  user: {
    name: string;
    email: string;
    image?: string | null;
    memberSince: string;
  };
};

const accountLinks = [
  {
    href: "/account",
    label: "Dashboard",
    icon: Grid2X2,
  },
  {
    href: "/account/profile",
    label: "My Profile",
    icon: User,
  },
  {
    href: "/account/orders",
    label: "My Orders",
    icon: Package,
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    href: "/account/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/account/addresses",
    label: "Saved Addresses",
    icon: MapPin,
  },
];

const supportLinks = [
  {
    href: "/help",
    label: "Help Center",
    icon: CircleHelp,
  },
  {
    href: "/account/returns",
    label: "Returns & Refunds",
    icon: RotateCcw,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AccountSidebar({ user }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/account") {
      return pathname === "/account";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
      {/* USER INFORMATION */}
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-center gap-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-14 w-14 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
              {getInitials(user.name)}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-950">
              {user.name}
            </p>

            <p className="mt-0.5 truncate text-sm text-blue-700">
              {user.email}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Member since {user.memberSince}
            </p>
          </div>
        </div>
      </div>

      <nav className="p-3">
        <p className="px-3 pb-2 pt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Your account
        </p>

        <div className="space-y-1">
          {accountLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-amber-50 text-amber-800"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active ? "text-amber-700" : "text-slate-600"
                  }`}
                />

                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="my-4 border-t border-slate-200" />

        <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Customer care
        </p>

        <div className="space-y-1">
          {supportLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-amber-50 text-amber-800"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="my-4 border-t border-slate-200" />

        <button
          type="button"
          onClick={() =>
            signOut({
              callbackUrl: "/login",
            })
          }
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </nav>
    </aside>
  );
}