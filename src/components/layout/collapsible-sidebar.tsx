"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  BrushCleaning,
  Home,
  Shirt,
  ShoppingBag,
  Sparkles,
  SprayCan,
  Store,
  UserRound,
  UsersRound,
  Utensils,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Store,
  UserRound,
  UsersRound,
  Sparkles,
  SprayCan,
  Shirt,
  ShoppingBag,
  Home,
  Utensils,
  BrushCleaning,
};

type SidebarItem = {
  name: string;
  href: string;
  icon: keyof typeof ICONS;
};

type CollapsibleSidebarProps = {
  items: SidebarItem[];
  title?: string;
  storageKey?: string;
};

export default function CollapsibleSidebar({
  items,
  title = "Categories",
  storageKey = "djador-sidebar-collapsed",
}: CollapsibleSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "1") setCollapsed(true);
    setMounted(true);
  }, [storageKey]);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(storageKey, next ? "1" : "0");
      return next;
    });
  }

  return (
    <aside
      aria-label={title}
      className={`sticky top-[76px] hidden h-[calc(100vh-76px)] shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300 ease-out lg:flex ${
        collapsed ? "w-[72px]" : "w-64"
      } ${mounted ? "" : "invisible"}`}
    >
      <div className="flex h-14 items-center justify-between px-3">
        {!collapsed && (
          <span className="truncate text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            {title}
          </span>
        )}

        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="ml-auto flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon] ?? Store;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0 text-slate-500 transition group-hover:text-slate-900" />

              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}