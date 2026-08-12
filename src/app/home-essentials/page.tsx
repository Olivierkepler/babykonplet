import Link from "next/link";
import AutoImageCarousel from "../../components/sections/auto-image-carousel";

// Edit Home Essentials carousel promos here.
const homeSlides = [
  {
    src: "/images/home-essentials/promo-home.png",
    alt: "Home essentials promotion",
    eyebrow: "Home Essentials",
    title: "Refresh Your Home",
    description: "Cleaning, storage, towels, candles, and daily basics.",
    discount: "UP TO 45% OFF",
    code: "HOME45",
    cta: "Shop Home",
  },
  {
    src: "/images/home-essentials/promo-kitchen.png",
    alt: "Kitchen and dining essentials promotion",
    eyebrow: "Kitchen & Dining",
    title: "Kitchen Finds For Less",
    description: "Cookware, mugs, plates, utensils, and handy helpers.",
    discount: "UP TO 40% OFF",
    code: "KITCHEN40",
    cta: "Shop Kitchen",
  },
  {
    src: "/images/home-essentials/promo-bedroom-bath.png",
    alt: "Bedroom and bath essentials promotion",
    eyebrow: "Bedroom & Bath",
    title: "Cozy Home Upgrades",
    description: "Bedding, bath towels, pillows, and soft home accents.",
    discount: "UP TO 35% OFF",
    code: "COZY35",
    cta: "Shop Bath",
  },
];

export default function HomeEssentialsPage() {
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
            slides={homeSlides}
            intervalMs={3500}
            variant="promo"
          />

          <div className="px-2 py-8 md:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Home Essentials
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                Home essentials are coming soon.
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
            Home essentials products will appear here once they are added.
          </p>
        </section>
      </section>
    </main>
  );
}
