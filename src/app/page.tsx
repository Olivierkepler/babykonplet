import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PromoGrid from "../components/home/promo-grid";
import CollapsibleSidebar from "../components/layout/collapsible-sidebar";
import AdSidebar from "../components/layout/ad-sidebar";
import { prisma } from "../lib/prisma";
import { getActivePromoBanners, getActiveAdSlots } from "../lib/content";

const sidebarCategories = [
  { name: "All Products", href: "/products?section=discover", icon: "Store" },
  { name: "Women", href: "/products?category=women", icon: "UserRound" },
  { name: "Men", href: "/products?category=men", icon: "UsersRound" },
  { name: "Beauty", href: "/products?category=beauty", icon: "Sparkles" },
  { name: "Hair Care", href: "/products?category=hair-care", icon: "SprayCan" },
  { name: "Shoes", href: "/products?category=shoes", icon: "Shirt" },
  { name: "Bags", href: "/products?category=bags", icon: "ShoppingBag" },
  { name: "Food & Grocery", href: "/products?category=food-grocery", icon: "ShoppingBag" },
  { name: "Home Essentials", href: "/products?category=home-essentials", icon: "Home" },
  { name: "Kitchen", href: "/products?category=kitchen", icon: "Utensils" },
  { name: "Cleaning", href: "/products?category=cleaning", icon: "BrushCleaning" },
  { name: "Wigs", href: "/products?category=wigs", icon: "UsersRound" },
  { name: "Personal Care", href: "/products?category=personal-care", icon: "Sparkles" },
] as const;

type SectionItem = {
  name: string;
  offer: string;
  category: string;
  href: string;
};

// A section is either a solid background color, or a background image.
// Never both — pick one per section.
type Section = {
  title: string;
  href: string;
  items: SectionItem[];
} & ({ background: "color"; color: string } | { background: "image"; src: string });

const sections: Section[] = [
  {
    title: "Best Value Deals on Fashion",
    background: "image",
    // color: "#ffffff",
    src: "/images/fashion/bluebg.png",
    // Arrow shows Women, Men, Shoes and Bags only
    href: "/products?section=fashion",

    items: [
      {
        name: "Women’s Collection",
        offer: "Special offer",
        category: "women",
        href: "/products?category=women",
      },
      {
        name: "Men’s Collection",
        offer: "Top deals",
        category: "men",
        href: "/products?category=men",
      },
      {
        name: "Shoes",
        offer: "Min. 30% Off",
        category: "shoes",
        href: "/products?category=shoes",
      },
      {
        name: "Bags",
        offer: "Best picks",
        category: "bags",
        href: "/products?category=bags",
      },
    ],
  },
  {
    title: "Beauty & Hair Care",
    background: "image",
    src: "/images/background.png",

    // Arrow shows Beauty, Hair Care, Wigs and Personal Care only
    href: "/products?section=beauty-care",

    items: [
      {
        name: "Beauty",
        offer: "Top brands",
        category: "beauty",
        href: "/products?category=beauty",
      },
      {
        name: "Hair Care",
        offer: "Best sellers",
        category: "hair-care",
        href: "/products?category=hair-care",
      },
      {
        name: "Wigs",
        offer: "New arrivals",
        category: "wigs",
        href: "/products?category=wigs",
      },
      {
        name: "Personal Care",
        offer: "Special offer",
        category: "personal-care",
        href: "/products?category=personal-care",
      },
    ],
  },
  {
    title: "Everyday Essentials",
    background: "color",
    color: "#ffffff",

    // Arrow shows Food, Home, Kitchen and Cleaning only
    href: "/products?section=everyday-essentials",

    items: [
      {
        name: "Food & Grocery",
        offer: "Fresh deals",
        category: "food-grocery",
        href: "/products?category=food-grocery",
      },
      {
        name: "Home Essentials",
        offer: "Top sellers",
        category: "home-essentials",
        href: "/products?category=home-essentials",
      },
      {
        name: "Kitchen",
        offer: "New arrivals",
        category: "kitchen",
        href: "/products?category=kitchen",
      },
      {
        name: "Cleaning",
        offer: "Special offer",
        category: "cleaning",
        href: "/products?category=cleaning",
      },
    ],
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

function normalizeCategory(value?: string | null) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getPreviewImages() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      imageUrl: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      category: true,
      imageUrl: true,
    },
  });

  const previews: Record<string, string> = {};

  for (const product of products) {
    if (!product.category || !product.imageUrl) {
      continue;
    }

    const categorySlug = normalizeCategory(product.category);

    if (!previews[categorySlug]) {
      previews[categorySlug] = product.imageUrl;
    }
  }

  return previews;
}

function HomeSection({
  section,
  previews,
}: {
  section: Section;
  previews: Record<string, string>;
}) {
  const availableItems = section.items.filter((item) =>
    Boolean(previews[item.category])
  );

  if (availableItems.length === 0) {
    return null;
  }

  const isImageBackground = section.background === "image";

  // Light/white color backgrounds need dark heading text; image
  // backgrounds (with a dark overlay below) and darker colors need
  // white heading text. Adjust this check if you add darker solid
  // colors later — for now, only white/near-white is treated as light.
  const isLightColorBackground =
    section.background === "color" &&
    ["#fff", "#ffffff"].includes(section.color.toLowerCase());

  const headingTextClass =
    isImageBackground || !isLightColorBackground
      ? "text-[#23425b]"
 
      : "text-slate-950";

  const arrowButtonClass = isLightColorBackground
    ? "bg-slate-950 text-white shadow hover:bg-slate-800"
    : "bg-white text-slate-900 shadow hover:bg-slate-100";

  return (
    <section
      className="relative my-20 overflow-hidden rounded-2xl p-4 shadow-sm"
      style={
        section.background === "color"
          ? { backgroundColor: section.color }
          : undefined
      }
    >
      {isImageBackground && (
        <>
          <Image
            src={section.src}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark scrim so the white heading/arrow stay readable
              regardless of what's in the background image. */}
          {/* <div className="absolute inset-0 bg-black/35" /> */}
        </>
      )}

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <h2 className={`text-2xl font-black ${headingTextClass}`}>
            {section.title}
          </h2>

          <Link
            href={section.href}
            aria-label={`View ${section.title}`}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition ${arrowButtonClass}`}
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid gap-4 rounded-xl p-3 sm:grid-cols-2 lg:grid-cols-4">
  {availableItems.map((item) => (
    <Link
      key={item.name}
      href={item.href}
      className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_-4px_rgba(10,37,64,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_rgba(10,37,64,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4f7b] focus-visible:ring-offset-2"
    >
      <div className="flex h-72 items-center justify-center overflow-hidden ">
        <img
          src={previews[item.category]}
          alt={item.name}
          className="max-h-full max-w-full object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>

      <div className="px-3.5 py-3">
        <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-900">
          {item.name}
        </h3>

        <p className="mt-1 text-sm font-bold text-[#ff4f7b]">
          {item.offer}
        </p>
      </div>
    </Link>
  ))}
</div>
      </div>
    </section>
  );
}

type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
};

function ProductGrid({
  products,
  title,
}: {
  products: HomeProduct[];
  title?: string;
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
      {title && (
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">
            {title}
          </h2>

          <Link
            href="/products"
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group"
          >
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-[#f1f3f6]">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="text-sm font-semibold text-slate-400">
                  {product.name}
                </span>
              )}
            </div>

            <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-slate-900">
              {product.name}
            </h3>

            <p className="mt-1 text-sm font-black text-slate-950">
              {formatPrice(product.price)}
            </p>

            <p className="mt-1 text-xs font-semibold text-blue-600">
              Special offer + more
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [previews, banners, ads, latestProducts] = await Promise.all([
    getPreviewImages(),
    getActivePromoBanners(),
    getActiveAdSlots(),
    prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 24,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        imageUrl: true,
      },
    }),
  ]);

  const firstFourProducts = latestProducts.slice(0, 4);
  const secondFourProducts = latestProducts.slice(4, 8);
  const remainingProducts = latestProducts.slice(8);

  return (
    <main className="bg-[#ffffff] ">
      <div className="mx-auto flex max-w-full sm:px-4">
        <CollapsibleSidebar items={sidebarCategories as any} title="Shop by category" />

        <section className="min-w-0 flex-1 px-4 py-4">
          <nav
            aria-label="Product categories"
            className="flex gap-4 overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden"
          >
            {sidebarCategories.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <PromoGrid banners={banners} />

          <HomeSection
            section={sections[0]}
            previews={previews}
          />

          <ProductGrid products={firstFourProducts} />

          <HomeSection
            section={sections[1]}
            previews={previews}
          />

          <ProductGrid products={secondFourProducts} />

          <HomeSection
            section={sections[2]}
            previews={previews}
          />

          <ProductGrid
            products={remainingProducts}
            title="Recommended For You"
          />
        </section>

        <div className="px-4 py-4">
          <AdSidebar ads={ads} /> 
        </div>
      </div>
    </main>
  );
}