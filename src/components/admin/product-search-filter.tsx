"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const currentStatus = searchParams.get("status") || "all";

  function applyFilter(nextStatus = currentStatus) {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (nextStatus !== "all") params.set("status", nextStatus);

    router.push(`/admin/products?${params.toString()}`);
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilter();
          }}
          placeholder="Search products by name, category, or brand..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-600 md:max-w-md"
        />

        <div className="flex flex-wrap gap-2">
          {["all", "active", "inactive", "out-of-stock"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => applyFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                currentStatus === status
                  ? "bg-green-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {status === "all"
                ? "All"
                : status === "active"
                ? "Active"
                : status === "inactive"
                ? "Inactive"
                : "Out of Stock"}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => applyFilter()}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Search
        </button>
      </div>
    </div>
  );
}