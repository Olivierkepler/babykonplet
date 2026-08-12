import Link from "next/link";

import {
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

import ProductFilters from "../../components/products/product-filters";
import ProductGrid from "../../components/products/product-grid";
import ProductSort from "../../components/products/product-sort";
import { prisma } from "../../lib/prisma";

import {
  STOREFRONT_CATEGORIES,
  getStorefrontCategory,
  normalizeStorefrontBrand,
  normalizeStorefrontValue,
  resolveStorefrontCategory,
  resolveStorefrontSubcategory,
  type FilterOption,
} from "../../lib/storefront-filters";

type ProductClassificationInput = {
  name: string;
  category: string | null;
  subCategory: string | null;
};

/**
 * Product-name keywords used only as a customer-view fallback.
 *
 * The saved subCategory is always preferred when it matches one
 * of the official subcategories.
 */
const PRODUCT_NAME_SUBCATEGORY_KEYWORDS: Record<
  string,
  string[]
> = {
  // Women
  dresses: [
    "dress",
    "dresses",
    "gown",
    "gowns",
    "ball gown",
    "ball gowns",
    "princess gown",
    "princess dress",
    "mini dress",
    "maxi dress",
    "evening gown",
  ],

  skirts: [
    "skirt",
    "skirts",
    "skrit",
    "skrits",
  ],

  tops: [
    "top",
    "tops",
    "blouse",
    "blouses",
    "crop top",
  ],

  pants: [
    "pant",
    "pants",
    "trouser",
    "trousers",
  ],

  jeans: [
    "jean",
    "jeans",
    "denim jeans",
  ],

  bras: [
    "bra",
    "bras",
  ],

  lingerie: [
    "lingerie",
  ],

  jackets: [
    "jacket",
    "jackets",
    "coat",
    "coats",
  ],

  "ethnic-wear": [
    "ethnic wear",
    "kurti",
    "kurta",
    "saree",
    "sari",
    "lehenga",
    "salwar",
  ],

  // Men
  shirts: [
    "shirt",
    "shirts",
    "button down",
  ],

  "t-shirts": [
    "t-shirt",
    "t-shirts",
    "tshirt",
    "tshirts",
    "tee shirt",
    "tee",
  ],

  suits: [
    "suit",
    "suits",
    "blazer",
  ],

  // Beauty
  makeup: [
    "makeup",
    "lipstick",
    "mascara",
    "foundation",
    "eyeliner",
    "concealer",
  ],

  skincare: [
    "skincare",
    "skin care",
    "moisturizer",
    "serum",
    "cleanser",
    "face cream",
  ],

  fragrance: [
    "fragrance",
    "perfume",
    "cologne",
  ],

  "nail-care": [
    "nail care",
    "nail polish",
    "manicure",
  ],

  // Hair Care
  shampoo: [
    "shampoo",
  ],

  conditioner: [
    "conditioner",
  ],

  "hair-oil": [
    "hair oil",
  ],

  "hair-styling": [
    "hair styling",
    "pomade",
    "hair gel",
    "styling gel",
  ],

  "hair-treatment": [
    "hair treatment",
    "hair mask",
    "hair repair",
  ],

  // Shoes
  sneakers: [
    "sneaker",
    "sneakers",
  ],

  "running-shoes": [
    "running shoe",
    "running shoes",
  ],

  sandals: [
    "sandal",
    "sandals",
  ],

  heels: [
    "heel",
    "heels",
    "high heel",
    "high heels",
  ],

  boots: [
    "boot",
    "boots",
  ],

  // Bags
  handbags: [
    "handbag",
    "handbags",
    "purse",
  ],

  "shoulder-bags": [
    "shoulder bag",
    "shoulder bags",
    "chain bag",
    "crossbody",
  ],

  backpacks: [
    "backpack",
    "backpacks",
  ],

  "travel-bags": [
    "travel bag",
    "travel bags",
    "duffel",
    "luggage",
  ],

  wallets: [
    "wallet",
    "wallets",
  ],

  // Food & Grocery
  snacks: [
    "snack",
    "snacks",
    "chips",
  ],

  cookies: [
    "cookie",
    "cookies",
    "biscuit",
    "biscuits",
  ],

  drinks: [
    "drink",
    "drinks",
    "beverage",
    "beverages",
    "juice",
    "soda",
  ],

  "rice-and-grains": [
    "rice",
    "grain",
    "grains",
  ],

  lentils: [
    "lentil",
    "lentils",
    "dal",
  ],

  // Home Essentials
  "home-decor": [
    "home decor",
    "decor",
    "decoration",
  ],

  storage: [
    "storage",
    "organizer",
    "organiser",
  ],

  bathroom: [
    "bathroom",
    "bath",
  ],

  bedroom: [
    "bedroom",
    "bed sheet",
    "bedsheet",
    "pillow",
  ],

  // Kitchen
  cookware: [
    "cookware",
    "pan",
    "pot",
    "frying pan",
  ],

  bakeware: [
    "bakeware",
    "baking tray",
    "cake pan",
  ],

  "kitchen-tools": [
    "kitchen tool",
    "kitchen tools",
    "utensil",
    "utensils",
  ],

  dining: [
    "dining",
    "plate",
    "bowl",
    "cutlery",
  ],

  "food-storage": [
    "food storage",
    "food container",
    "lunch box",
  ],

  // Cleaning
  laundry: [
    "laundry",
    "detergent",
    "fabric softener",
  ],

  "surface-cleaners": [
    "surface cleaner",
    "surface cleaners",
    "floor cleaner",
  ],

  dishwashing: [
    "dishwashing",
    "dish soap",
    "dishwasher",
  ],

  "cleaning-tools": [
    "cleaning tool",
    "cleaning tools",
    "mop",
    "broom",
    "brush",
  ],

  // Wigs
  "human-hair-wigs": [
    "human hair wig",
    "human hair wigs",
  ],

  "synthetic-wigs": [
    "synthetic wig",
    "synthetic wigs",
  ],

  "lace-front-wigs": [
    "lace front wig",
    "lace front wigs",
  ],

  "short-wigs": [
    "short wig",
    "short wigs",
  ],

  "long-wigs": [
    "long wig",
    "long wigs",
  ],

  // Personal Care
  "body-care": [
    "body care",
    "body wash",
    "body lotion",
  ],

  deodorant: [
    "deodorant",
    "deodorants",
    "body spray",
  ],

  "oral-care": [
    "oral care",
    "toothpaste",
    "toothbrush",
    "mouthwash",
  ],

  "feminine-care": [
    "feminine care",
    "sanitary pad",
    "sanitary pads",
  ],

  "mens-grooming": [
    "mens grooming",
    "men's grooming",
    "shaving",
    "beard care",
  ],
};

function normalizeProductName(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferSubcategoryFromProductName(
  productName: string,
  selectedCategory: string,
) {
  const categoryConfig =
    getStorefrontCategory(selectedCategory);

  if (!categoryConfig) {
    return null;
  }

  const normalizedProductName =
    normalizeProductName(productName);

  if (!normalizedProductName) {
    return null;
  }

  for (const subcategory of categoryConfig.subcategories) {
    const keywords =
      PRODUCT_NAME_SUBCATEGORY_KEYWORDS[
        subcategory.value
      ] ?? [];

    const matchesKeyword = keywords.some((keyword) => {
      const normalizedKeyword =
        normalizeProductName(keyword);

      if (!normalizedKeyword) {
        return false;
      }

      const productWords =
        ` ${normalizedProductName} `;

      const keywordWords =
        ` ${normalizedKeyword} `;

      return productWords.includes(keywordWords);
    });

    if (matchesKeyword) {
      return subcategory.value;
    }
  }

  return null;
}

/**
 * Returns the official customer-facing subcategory.
 *
 * Priority:
 * 1. Valid saved subCategory
 * 2. Product-name inference
 */
function getEffectiveProductSubcategory(
  product: ProductClassificationInput,
  selectedCategory: string,
) {
  const categoryConfig =
    getStorefrontCategory(selectedCategory);

  if (!categoryConfig) {
    return null;
  }

  const savedSubcategory =
    resolveStorefrontSubcategory(
      product.subCategory,
    );

  const savedSubcategoryIsOfficial =
    categoryConfig.subcategories.some(
      (subcategory) =>
        subcategory.value === savedSubcategory,
    );

  if (
    savedSubcategory &&
    savedSubcategoryIsOfficial
  ) {
    return savedSubcategory;
  }

  return inferSubcategoryFromProductName(
    product.name,
    selectedCategory,
  );
}

function buildCategoryOptions(
  products: Array<{
    category: string | null;
  }>,
): FilterOption[] {
  return STOREFRONT_CATEGORIES.map((category) => {
    const count = products.filter(
      (product) =>
        resolveStorefrontCategory(
          product.category,
        ) === category.value,
    ).length;

    return {
      name: category.name,
      value: category.value,
      count,
    };
  }).filter((category) => category.count > 0);
}

function buildBrandOptions(
  products: Array<{
    category: string | null;
    brand: string | null;
  }>,
  selectedCategory: string,
): FilterOption[] {
  const brandMap = new Map<
    string,
    FilterOption
  >();

  for (const product of products) {
    const productCategory =
      resolveStorefrontCategory(
        product.category,
      );

    if (
      selectedCategory &&
      productCategory !== selectedCategory
    ) {
      continue;
    }

    const normalizedBrand =
      normalizeStorefrontBrand(
        product.brand,
      );

    if (!normalizedBrand) {
      continue;
    }

    const existingBrand = brandMap.get(
      normalizedBrand.value,
    );

    if (existingBrand) {
      existingBrand.count += 1;
      continue;
    }

    brandMap.set(normalizedBrand.value, {
      name: normalizedBrand.name,
      value: normalizedBrand.value,
      count: 1,
    });
  }

  return Array.from(
    brandMap.values(),
  ).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/**
 * Shows every official subcategory for the selected category.
 *
 * Counts use:
 * - saved subCategory when valid
 * - product name as fallback
 */
function buildProductTypeOptions(
  products: Array<{
    name: string;
    category: string | null;
    subCategory: string | null;
  }>,
  selectedCategory: string,
): FilterOption[] {
  if (!selectedCategory) {
    return [];
  }

  const categoryConfig =
    getStorefrontCategory(selectedCategory);

  if (!categoryConfig) {
    return [];
  }

  return categoryConfig.subcategories.map(
    (subcategory) => {
      const count = products.filter((product) => {
        const productCategory =
          resolveStorefrontCategory(
            product.category,
          );

        if (
          productCategory !== selectedCategory
        ) {
          return false;
        }

        const effectiveSubcategory =
          getEffectiveProductSubcategory(
            product,
            selectedCategory,
          );

        return (
          effectiveSubcategory ===
          subcategory.value
        );
      }).length;

      return {
        name: subcategory.name,
        value: subcategory.value,
        count,
      };
    },
  );
}

async function getProducts(
  selectedCategory: string,
) {
  const products =
    await prisma.product.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const categories =
    buildCategoryOptions(products);

  const brands = buildBrandOptions(
    products,
    selectedCategory,
  );

  const productTypes =
    buildProductTypeOptions(
      products,
      selectedCategory,
    );

  return {
    products,
    categories,
    brands,
    productTypes,
  };
}

function parsePrice(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < 0
  ) {
    return undefined;
  }

  return parsedValue;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    productType?: string;
    search?: string;
    inStock?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  const category =
    normalizeStorefrontValue(
      params.category,
    );

  const brand =
    normalizeStorefrontValue(
      params.brand,
    );

  const productType =
    resolveStorefrontSubcategory(
      params.productType,
    ) || "";

  const search =
    params.search?.toLowerCase().trim() || "";

  const inStock =
    params.inStock === "true";

  const minPrice =
    parsePrice(params.minPrice);

  const maxPrice =
    parsePrice(params.maxPrice);

    const sort = params.sort || "newest";

  const {
    products,
    categories,
    brands,
    productTypes,
  } = await getProducts(category);

  const filteredProducts = products
  .filter((product) => {
      const productCategory =
        resolveStorefrontCategory(
          product.category,
        );

      const productBrand =
        normalizeStorefrontBrand(
          product.brand,
        );

      const productTypeValue = category
        ? getEffectiveProductSubcategory(
            product,
            category,
          )
        : resolveStorefrontSubcategory(
            product.subCategory,
          );

      const searchableText = [
        product.name,
        product.brand,
        product.category,
        product.subCategory,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesCategory = category
        ? productCategory === category
        : true;

      const matchesBrand = brand
        ? productBrand?.value === brand
        : true;

      const matchesProductType =
        productType
          ? productTypeValue === productType
          : true;

      const matchesSearch = search
        ? searchableText.includes(search)
        : true;

      const matchesAvailability = inStock
        ? product.stock > 0
        : true;

      const matchesMinimumPrice =
        minPrice !== undefined
          ? product.price >= minPrice
          : true;

      const matchesMaximumPrice =
        maxPrice !== undefined
          ? product.price <= maxPrice
          : true;

          return (
            matchesCategory &&
            matchesBrand &&
            matchesProductType &&
            matchesSearch &&
            matchesAvailability &&
            matchesMinimumPrice &&
            matchesMaximumPrice
          );
        },
      )
      .sort((a, b) => {
        switch (sort) {
          case "price-low":
            return a.price - b.price;
    
          case "price-high":
            return b.price - a.price;
    
          case "name":
            return a.name.localeCompare(b.name);
    
          case "newest":
          default:
            return (
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
            );
        }
      });

  const selectedCategory =
    getStorefrontCategory(category);

  const selectedSubcategory =
    selectedCategory?.subcategories.find(
      (subcategory) =>
        subcategory.value === productType,
    );

  const pageTitle = selectedSubcategory
    ? `${selectedSubcategory.name} Collection`
    : selectedCategory
      ? `${selectedCategory.name} Collection`
      : search
        ? `Search Results for "${params.search}"`
        : "All Products";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link
            href="/"
            className="font-medium transition hover:text-slate-950"
          >
            Home
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/products"
            className="font-medium transition hover:text-slate-950"
          >
            Products
          </Link>

          {selectedCategory ? (
            <>
              <ChevronRight className="h-4 w-4" />

              <Link
                href={`/products?category=${selectedCategory.value}`}
                className="font-semibold text-slate-900 transition hover:text-blue-600"
              >
                {selectedCategory.name}
              </Link>
            </>
          ) : null}

          {selectedSubcategory ? (
            <>
              <ChevronRight className="h-4 w-4" />

              <span className="font-semibold text-slate-900">
                {selectedSubcategory.name}
              </span>
            </>
          ) : null}
        </nav>

        {/* HEADER */}
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                DJADOR Family Store
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {pageTitle}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Explore our available products and
                find the right item for you.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-bold text-slate-950">
                {filteredProducts.length}
              </span>

              <span>
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}
              </span>
            </div>
          </div>
        </section>

        {/* TOOLBAR */}
        <section className="mt-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Browse products in this collection
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <label className="hidden text-sm font-medium text-slate-500 sm:block">
              Sort by:
            </label>

            <ProductSort value={sort} />
          </div>
        </section>

        {/* PRODUCT AREA */}
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <ProductFilters
              categories={categories}
              brands={brands}
              productTypes={productTypes}
              selectedCategory={category}
              selectedBrand={brand}
              selectedProductType={productType}
              inStock={inStock}
              minPrice={params.minPrice || ""}
              maxPrice={params.maxPrice || ""}
            />
          </div>

          <div className="min-w-0">
            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
              />
            ) : (
              <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-slate-950">
                  No products found
                </h2>

                <p className="mt-3 text-sm text-slate-600">
                  We do not currently have active
                  products matching your selected
                  filters.
                </p>

                <Link
                  href={
                    selectedCategory
                      ? `/products?category=${selectedCategory.value}`
                      : "/products"
                  }
                  className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Clear This Filter
                </Link>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}