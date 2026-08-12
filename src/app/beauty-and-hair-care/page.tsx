import Link from "next/link";
import AutoImageCarousel from "../../components/sections/auto-image-carousel";

// Edit Beauty & Hair carousel images here.
const beautyHairSlides = [
  {
    src: "/images/beauty-hair/promo-beauty-care.png",
    alt: "Beauty and hair care products",
    eyebrow: "Beauty & Hair Care",
    title: "Glow Up Your Routine",
    description: "Soft-care essentials for hair, skin, and everyday beauty.",
    discount: "UP TO 50% OFF",
    code: "BEAUTY50",
    cta: "Shop Now",
  },
  {
    src: "/images/beauty-hair/promo-hair-styling.png",
    alt: "Hair styling tools",
    eyebrow: "Hair Styling",
    title: "Style It Your Way",
    description: "Dryers, irons, and styling favorites for every look.",
    discount: "UP TO 40% OFF",
    code: "STYLE40",
    cta: "Shop Styling",
  },
  {
    src: "/images/beauty-hair/promo-skincare.png",
    alt: "Skincare products",
    eyebrow: "Skincare",
    title: "Healthy Skin Starts Here.",
    description: "Gentle care with a clean, glowing finish.",
    discount: "UP TO 45% OFF",
    code: "SKIN45",
    cta: "Shop Skin",
  },
  {
    src: "/images/beauty-hair/promo-wigs.png",
    alt: "Wigs and hair collection",
    eyebrow: "Wigs & Hair",
    title: "New Hair. New You.",
    description: "Soft, stylish looks for every mood.",
    discount: "UP TO 35% OFF",
    code: "WIGS35",
    cta: "Shop Wigs",
  },
];

export default function BeautyAndHairCarePage() {
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
            slides={beautyHairSlides}
            intervalMs={3500}
            variant="promo"
          />

          <div className="px-2 py-8 md:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Beauty & Hair Care
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                Beauty essentials are coming soon.
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
            Beauty and hair care products will appear here once they are added.
          </p>
        </section>
      </section>
    </main>
  );
}
