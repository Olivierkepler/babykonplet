"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

type FilterOption = {
  name: string;
  value: string;
  count: number;
};

type ProductFiltersProps = {
  categories: FilterOption[];
  brands: FilterOption[];
  productTypes: FilterOption[];
  selectedCategory?: string;
  selectedBrand?: string;
  selectedProductType?: string;
  inStock?: boolean;
  minPrice?: string;
  maxPrice?: string;
};

function formatFilterTitle(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

export default function ProductFilters({
  categories,
  brands,
  productTypes,
  selectedCategory = "",
  selectedBrand = "",
  selectedProductType = "",
  inStock = false,
  minPrice = "",
  maxPrice = "",
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [brandSearch, setBrandSearch] =
    useState("");

  const [showAllBrands, setShowAllBrands] =
    useState(false);

  const matchingBrands = useMemo(() => {
    const searchValue = brandSearch
      .toLowerCase()
      .trim();

    if (!searchValue) {
      return brands;
    }

    return brands.filter((brand) =>
      brand.name
        .toLowerCase()
        .includes(searchValue),
    );
  }, [brands, brandSearch]);

  const visibleBrands = useMemo(() => {
    if (brandSearch || showAllBrands) {
      return matchingBrands;
    }

    return matchingBrands.slice(0, 8);
  }, [
    matchingBrands,
    brandSearch,
    showAllBrands,
  ]);

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedBrand) ||
    Boolean(selectedProductType) ||
    inStock ||
    Boolean(minPrice) ||
    Boolean(maxPrice);

  function navigateWithParams(
    params: URLSearchParams,
  ) {
    const queryString = params.toString();

    router.push(
      queryString
        ? `/products?${queryString}`
        : "/products",
    );
  }

  function updateFilter(
    name: string,
    value?: string,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    /*
     * Brand and subcategory values depend on
     * the selected category.
     */
    if (name === "category") {
      params.delete("brand");
      params.delete("productType");
    }

    navigateWithParams(params);
  }

  function updateMultipleFilters(
    updates: Record<string, string | undefined>,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    Object.entries(updates).forEach(
      ([name, value]) => {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      },
    );

    navigateWithParams(params);
  }

  function resetFilters() {
    const params = new URLSearchParams();

    const search = searchParams.get("search");

    if (search) {
      params.set("search", search);
    }

    navigateWithParams(params);
  }

  function handlePriceSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget,
    );

    const nextMinPrice = String(
      formData.get("minPrice") || "",
    ).trim();

    const nextMaxPrice = String(
      formData.get("maxPrice") || "",
    ).trim();

    const parsedMinPrice = nextMinPrice
      ? Number(nextMinPrice)
      : undefined;

    const parsedMaxPrice = nextMaxPrice
      ? Number(nextMaxPrice)
      : undefined;

    if (
      parsedMinPrice !== undefined &&
      parsedMaxPrice !== undefined &&
      parsedMinPrice > parsedMaxPrice
    ) {
      return;
    }

    updateMultipleFilters({
      minPrice: nextMinPrice || undefined,
      maxPrice: nextMaxPrice || undefined,
    });
  }

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* FILTER HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-slate-700" />

          <h2 className="text-lg font-bold text-slate-950">
            Filters
          </h2>
        </div>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-blue-600 transition hover:text-blue-800"
          >
            Reset all
          </button>
        ) : null}
      </div>

      {/* ACTIVE FILTER PILLS */}
      {hasActiveFilters ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {selectedCategory ? (
            <button
              type="button"
              onClick={() =>
                updateFilter("category")
              }
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              {formatFilterTitle(
                selectedCategory,
              )}

              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}

          {selectedProductType ? (
            <button
              type="button"
              onClick={() =>
                updateFilter("productType")
              }
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              {formatFilterTitle(
                selectedProductType,
              )}

              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}

          {selectedBrand ? (
            <button
              type="button"
              onClick={() =>
                updateFilter("brand")
              }
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              {formatFilterTitle(selectedBrand)}

              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}

          {inStock ? (
            <button
              type="button"
              onClick={() =>
                updateFilter("inStock")
              }
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              In stock

              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}

          {minPrice ? (
            <button
              type="button"
              onClick={() =>
                updateFilter("minPrice")
              }
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Min ${minPrice}

              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}

          {maxPrice ? (
            <button
              type="button"
              onClick={() =>
                updateFilter("maxPrice")
              }
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Max ${maxPrice}

              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      ) : null}

      {/* CATEGORY OR SUBCATEGORIES */}
      <section className="mt-6 border-t border-slate-200 pt-5">
        {!selectedCategory ? (
          <>
            <h3 className="text-sm font-bold text-slate-950">
              Category
            </h3>

            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                <input
                  type="radio"
                  name="category"
                  checked
                  readOnly
                  className="h-4 w-4 border-slate-300 accent-slate-950"
                />

                <span className="flex-1">
                  All Categories
                </span>
              </label>

              {categories.map((item) => (
                <label
                  key={item.value}
                  className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={false}
                    onChange={() =>
                      updateFilter(
                        "category",
                        item.value,
                      )
                    }
                    className="h-4 w-4 border-slate-300 accent-slate-950"
                  />

                  <span className="min-w-0 flex-1">
                    {item.name}
                  </span>

                  <span className="text-xs text-slate-400">
                    ({item.count})
                  </span>
                </label>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Selected category
                </p>

                <h3 className="mt-1 text-base font-bold text-slate-950">
                  {formatFilterTitle(
                    selectedCategory,
                  )}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateFilter("category")
                }
                className="shrink-0 text-xs font-semibold text-blue-600 transition hover:text-blue-800"
              >
                Change category
              </button>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-950">
                Subcategories
              </h4>

              <div className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="productType"
                    checked={!selectedProductType}
                    onChange={() =>
                      updateFilter("productType")
                    }
                    className="h-4 w-4 border-slate-300 accent-slate-950"
                  />

                  <span className="flex-1">
                    All{" "}
                    {formatFilterTitle(
                      selectedCategory,
                    )}
                  </span>
                </label>

                {productTypes.map((item) => {
                  const isSelected =
                    selectedProductType ===
                    item.value;

                  return (
                    <label
                      key={item.value}
                      className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
                    >
                      <input
                        type="radio"
                        name="productType"
                        checked={isSelected}
                        onChange={() =>
                          updateFilter(
                            "productType",
                            item.value,
                          )
                        }
                        className="h-4 w-4 border-slate-300 accent-slate-950"
                      />

                      <span
                        className={`min-w-0 flex-1 ${
                          isSelected
                            ? "font-semibold text-slate-950"
                            : ""
                        }`}
                      >
                        {item.name}
                      </span>

                      <span className="text-xs text-slate-400">
                        ({item.count})
                      </span>
                    </label>
                  );
                })}

                {productTypes.length === 0 ? (
                  <p className="rounded-lg bg-slate-50 px-3 py-3 text-sm leading-5 text-slate-500">
                    No subcategories are available for{" "}
                    {formatFilterTitle(
                      selectedCategory,
                    )}
                    .
                  </p>
                ) : null}
              </div>
            </div>
          </>
        )}
      </section>

      {/* BRAND */}
      {brands.length > 0 ? (
        <section className="mt-6 border-t border-slate-200 pt-5">
          <h3 className="text-sm font-bold text-slate-950">
            Brand
          </h3>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={brandSearch}
              onChange={(event) =>
                setBrandSearch(
                  event.target.value,
                )
              }
              placeholder="Search brands"
              aria-label="Search brands"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
              <input
                type="radio"
                name="brand"
                checked={!selectedBrand}
                onChange={() =>
                  updateFilter("brand")
                }
                className="h-4 w-4 border-slate-300 accent-slate-950"
              />

              <span className="flex-1">
                All Brands
              </span>
            </label>

            {visibleBrands.map((item) => {
              const isSelected =
                selectedBrand === item.value;

              return (
                <label
                  key={item.value}
                  className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
                >
                  <input
                    type="radio"
                    name="brand"
                    checked={isSelected}
                    onChange={() =>
                      updateFilter(
                        "brand",
                        item.value,
                      )
                    }
                    className="h-4 w-4 border-slate-300 accent-slate-950"
                  />

                  <span
                    className={`min-w-0 flex-1 ${
                      isSelected
                        ? "font-semibold text-slate-950"
                        : ""
                    }`}
                  >
                    {item.name}
                  </span>

                  <span className="text-xs text-slate-400">
                    ({item.count})
                  </span>
                </label>
              );
            })}
          </div>

          {brandSearch &&
          matchingBrands.length === 0 ? (
            <p className="mt-4 rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-500">
              No brands found.
            </p>
          ) : null}

          {brands.length > 8 && !brandSearch ? (
            <button
              type="button"
              onClick={() =>
                setShowAllBrands(
                  (currentValue) =>
                    !currentValue,
                )
              }
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
            >
              {showAllBrands ? (
                <>
                  Show less

                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show more

                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          ) : null}
        </section>
      ) : null}

      {/* AVAILABILITY */}
      <section className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="text-sm font-bold text-slate-950">
          Availability
        </h3>

        <label className="mt-4 flex cursor-pointer items-center justify-between gap-3">
          <span className="text-sm text-slate-700">
            In stock only
          </span>

          <input
            type="checkbox"
            checked={inStock}
            onChange={(event) =>
              updateFilter(
                "inStock",
                event.target.checked
                  ? "true"
                  : undefined,
              )
            }
            className="h-4 w-4 rounded border-slate-300 accent-slate-950"
          />
        </label>
      </section>

      {/* PRICE */}
      <section className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="text-sm font-bold text-slate-950">
          Price
        </h3>

        <form
          key={`${minPrice}-${maxPrice}`}
          onSubmit={handlePriceSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="minPrice"
              min="0"
              step="1"
              defaultValue={minPrice}
              placeholder="Min"
              aria-label="Minimum price"
              className="min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
            />

            <input
              type="number"
              name="maxPrice"
              min="0"
              step="1"
              defaultValue={maxPrice}
              placeholder="Max"
              aria-label="Maximum price"
              className="min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Apply Price
          </button>
        </form>
      </section>
    </aside>
  );
}