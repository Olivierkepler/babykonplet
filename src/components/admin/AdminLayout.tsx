"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Menu,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
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
      href: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <aside
        className={`sticky top-0 h-screen border-r border-slate-800 bg-[#07111f] transition-all duration-300 ${
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
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="px-3">
          <p
            className={`mb-3 text-xs uppercase tracking-[0.25em] text-slate-500 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            Main
          </p>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon size={20} />

                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {!collapsed && (
          <div className="absolute bottom-5 left-3 right-3">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-800/20 p-5">
              <h3 className="font-bold text-white">
                Need Help?
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Manage products, orders and customers from here.
              </p>

              <button className="mt-4 w-full rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                Contact Support
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}