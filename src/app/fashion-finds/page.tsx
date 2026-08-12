"use client";

import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import AutoImageCarousel from "../../components/sections/auto-image-carousel";

const subcategories = ["Women", "Men", "Kids", "Shoes", "Accessories"];

const filters = {
  Size: ["XS", "S", "M", "L", "XL"],
  Color: ["Black", "White", "Blue", "Red", "Green", "Beige"],
  Price: ["Under $25", "$25-$50", "$50-$100"],
  Type: ["Shirts", "Jeans", "Dresses", "Jackets", "Shoes"],
};

const fashionSlides = [
  {
    src: "/images/fashion/promo-fashion.png",
    alt: "Fashion clothing promotion",
    eyebrow: "Fashion Finds",
    title: "New Styles Every Week",
    description: "Fresh clothes, shoes, and accessories for every mood.",
    discount: "UP TO 70% OFF",
    code: "STYLE70",
    cta: "Shop Fashion",
  },
  {
    src: "/images/fashion/promo-women.png",
    alt: "Women's clothing promotion",
    eyebrow: "Women",
    title: "Looks You Will Love",
    description: "Dresses, denim, tops, and everyday favorites.",
    discount: "UP TO 60% OFF",
    code: "WOMEN60",
    cta: "Shop Women",
  },
  {
    src: "/images/fashion/promo-kids.png",
    alt: "Kids clothing promotion",
    eyebrow: "Kids",
    title: "Cute Fits For Kids",
    description: "Play-ready outfits, sneakers, and cozy basics.",
    discount: "UP TO 50% OFF",
    code: "KIDS50",
    cta: "Shop Kids",
  },
  {
    src: "/images/fashion/promo-accessories.png",
    alt: "Handbags and accessories promotion",
    eyebrow: "Accessories",
    title: "Complete Your Style",
    description: "Bags, wallets, sunglasses, and polished details.",
    discount: "UP TO 40% OFF",
    code: "BAGS40",
    cta: "Shop Bags",
  },
  {
    src: "/images/fashion/promo-shoes.png",
    alt: "Shoes promotion",
    eyebrow: "Shoes",
    title: "Step Into New Deals",
    description: "Sneakers, heels, sandals, and casual pairs.",
    discount: "UP TO 55% OFF",
    code: "SHOES55",
    cta: "Shop Shoes",
  },
  {
    src: "/images/fashion/promo-men.png",
    alt: "Men's clothing promotion",
    eyebrow: "Men",
    title: "Clean Fits For Him",
    description: "Shirts, denim, jackets, and smart essentials.",
    discount: "UP TO 50% OFF",
    code: "MEN50",
    cta: "Shop Men",
  },
];

export default function FashionFindsPage() {
  const [activeSubcategory, setActiveSubcategory] = useState("Women");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [genderSearch, setGenderSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const showFilters = activeSubcategory === "Women" || activeSubcategory === "Men";

  const activeFilterCount = Object.values(activeFilters).reduce(
    (total, groupValues) => total + groupValues.length,
    0
  );

  function toggleFilter(group: string, value: string) {
    setActiveFilters((current) => {
      const groupValues = current[group] || [];
      const nextValues = groupValues.includes(value)
        ? groupValues.filter((item) => item !== value)
        : [...groupValues, value];

      return {
        ...current,
        [group]: nextValues,
      };
    });
  }

  function searchGender() {
    const normalized = genderSearch.trim().toLowerCase();

    if (
      normalized.includes("woman") ||
      normalized.includes("women") ||
      normalized.includes("mujer")
    ) {
      setActiveSubcategory("Women");
      return;
    }

    if (
      normalized.includes("man") ||
      normalized.includes("men") ||
      normalized.includes("hombre")
    ) {
      setActiveSubcategory("Men");
    }
  }

  return (
    <main
      className="bg-slate-50"
      style={{
        fontFamily:
          '"Arial Rounded MT Bold", "Trebuchet MS", Arial, Helvetica, sans-serif',
      }}
    >
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <AutoImageCarousel
            slides={fashionSlides}
            intervalMs={3500}
            variant="promo"
          />

          <div className="px-2 py-8 md:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Fashion Finds
              </p>

              <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                Fashion finds are coming soon.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                This collection page is ready. Products, filters, and featured
                picks can be added here when the catalog is prepared.
              </p>

              <Link
                href="/"
                className="mt-7 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto max-w-4xl text-left">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Shop Fashion
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {activeSubcategory}
                  {activeFilterCount > 0
                    ? ` · ${activeFilterCount} filter${
                        activeFilterCount === 1 ? "" : "s"
                      } selected`
                    : " · Open filters to refine your search"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          <h2 className="mt-10 text-center text-2xl font-bold text-slate-900">
            No products yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            Fashion products will appear here once they are added.
          </p>
        </section>
      </section>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[9999]">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-slate-950/35"
          />

          <aside className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Fashion
                </p>
                <h2 className="text-xl font-black text-slate-950">Filters</h2>
              </div>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div>
                <p className="mb-3 text-sm font-black text-slate-950">
                  Category
                </p>

                <div className="flex flex-wrap gap-2">
                  {subcategories.map((subcategory) => {
                    const isActive = activeSubcategory === subcategory;

                    return (
                      <button
                        key={subcategory}
                        type="button"
                        onClick={() => setActiveSubcategory(subcategory)}
                        className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {subcategory}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-950">
                  Search by shopper
                </p>

                <label className="relative mt-3 block">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={genderSearch}
                    onChange={(event) => setGenderSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        searchGender();
                      }
                    }}
                    placeholder="Women, men, mujer or hombre"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-slate-900"
                  />
                </label>

                <button
                  type="button"
                  onClick={searchGender}
                  className="mt-3 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                >
                  Search
                </button>
              </div>

              {showFilters ? (
                <div className="mt-6 space-y-6">
                  {Object.entries(filters).map(([group, options]) => (
                    <div key={group}>
                      <p className="mb-3 text-sm font-black text-slate-950">
                        {group}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {options.map((option) => {
                          const isActive =
                            activeFilters[group]?.includes(option);

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleFilter(group, option)}
                              className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
                                isActive
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-600">
                  Size, color, price, and type filters appear for Women or Men.
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 p-5">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-700"
              >
                View Results
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}