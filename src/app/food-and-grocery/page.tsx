import Link from "next/link";
import AutoImageCarousel from "../../components/sections/auto-image-carousel";

// Edit Food & Grocery carousel promos here.
const foodSlides = [
  {
    src: "/images/food/promo-rice-cans.png",
    alt: "Rice bags and canned food promotion",
    eyebrow: "Food & Grocery",
    title: "Pantry Deals Ready",
    description: "Rice bags, canned food, and everyday basics in one place.",
    discount: "UP TO 50% OFF",
    code: "FOOD50",
    cta: "Shop Grocery",
  },
  {
    src: "/images/food/promo-pantry.png",
    alt: "Pantry essentials promotion",
    eyebrow: "Pantry Essentials",
    title: "Stock Up & Save",
    description: "Rice, canned goods, oil, pasta, and family staples.",
    discount: "UP TO 45% OFF",
    code: "PANTRY45",
    cta: "Shop Pantry",
  },
  {
    src: "/images/food/promo-canned-food.png",
    alt: "Canned food sale promotion",
    eyebrow: "Canned Food",
    title: "Easy Meals Anytime",
    description: "Beans, vegetables, tuna, soups, and quick meal helpers.",
    discount: "UP TO 35% OFF",
    code: "CANS35",
    cta: "Shop Cans",
  },
  {
    src: "/images/food/promo-bulk-rice.png",
    alt: "Bulk rice bags promotion",
    eyebrow: "Rice Deals",
    title: "Rice Bags For Less",
    description: "Bulk rice, pantry packs, and shelf-ready essentials.",
    discount: "UP TO 40% OFF",
    code: "RICE40",
    cta: "Shop Rice",
  },
];

export default function FoodAndGroceryPage() {
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
            slides={foodSlides}
            intervalMs={3500}
            variant="promo"
          />

          <div className="px-2 py-8 md:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Food & Grocery
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                Grocery essentials are coming soon.
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
          <h2 className="text-2xl font-bold text-slate-900">
            No products yet
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            Food and grocery products will appear here once they are added.
          </p>
        </section>
      </section>
    </main>
  );
}
