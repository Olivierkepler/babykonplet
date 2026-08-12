"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ProductSortProps = {
  value: string;
};

export default function ProductSort({
  value,
}: ProductSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.set("sort", event.target.value);

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      aria-label="Sort products"
      className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-500"
    >
      <option value="newest">
        Newest Arrivals
      </option>

      <option value="price-low">
        Price: Low to High
      </option>

      <option value="price-high">
        Price: High to Low
      </option>

      <option value="name">
        Name: A to Z
      </option>
    </select>
  );
}