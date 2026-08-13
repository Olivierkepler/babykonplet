"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Image as ImageIcon,
  ChevronDown,
  LogOut,
  ArrowLeft,
  Menu,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  children?: { href: string; label: string }[];
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [contentOpen, setContentOpen] = useState(
    pathname?.startsWith("/admin/content") ?? false
  );

  const navItems: NavItem[] = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: Package,
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: ShoppingCart,
    },
    {
      href: "/admin/customers",
      label: "Customers",
      icon: Users,
    },
    {
      href: "/admin/content/banners",
      label: "Homepage Content",
      icon: ImageIcon,
      children: [
        { href: "/admin/content/banners", label: "Promo Banners" },
        { href: "/admin/content/ads", label: "Sidebar Ads" },
      ],
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <aside
        className={`sticky top-0 flex h-screen flex-col border-r border-slate-800 bg-[#07111f] transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          {!collapsed && (
            <Link
              href="/admin"
              className="text-3xl font-black text-white"
            >
              DJADOR
              <span className="text-emerald-500">FAMILY Store.</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <p
            className={`mb-3 text-xs uppercase tracking-[0.25em] text-slate-500 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            Main
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              if (item.children) {
                return (
                  <div key={item.href}>
                    <button
                      type="button"
                      onClick={() => setContentOpen((open) => !open)}
                      aria-expanded={contentOpen}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-medium transition ${
                        active
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={20} className="shrink-0" />

                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          <ChevronDown
                            size={16}
                            className={`shrink-0 transition-transform duration-200 ${
                              contentOpen ? "rotate-180" : ""
                            }`}
                          />
                        </>
                      )}
                    </button>

                    {!collapsed && contentOpen && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-4">
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                                childActive
                                  ? "bg-emerald-500/15 text-emerald-400"
                                  : "text-slate-400 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition ${
                    active
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={20} className="shrink-0" />

                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 px-3 pb-5">
          {!collapsed && (
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-800/20 p-5">
              <h3 className="font-bold text-white">Need Help?</h3>

              <p className="mt-2 text-sm text-slate-300">
                Manage products, orders and customers from here.
              </p>

              
                  <Link
                  href="/admin/content/banners"
                className="mt-4 block w-full rounded-xl bg-emerald-600 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Contact Support
              </Link>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={20} className="shrink-0" />
            {!collapsed && <span>Back to store</span>}
          </Link>

          <button
            type="button"
            onClick={() =>
              signOut({
                callbackUrl: "/login",
              })
            }
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}