import Link from "next/link";

export default function MainBanner() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid min-h-[420px] items-center rounded-3xl bg-gradient-to-r from-blue-700 to-blue-500 p-10 lg:grid-cols-2">
          
          <div>
            <p className="text-white/80 font-semibold uppercase">
              Summer Sale 2026
            </p>

            <h1 className="mt-4 text-5xl font-bold text-white">
              Up To 70% OFF
            </h1>

            <p className="mt-4 max-w-lg text-lg text-white/90">
              Electronics, Fashion, Home Essentials and thousands
              of products with nationwide delivery.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-blue-700"
            >
              Shop Now
            </Link>
          </div>

          <div className="hidden lg:flex justify-center">
            <img
              src="/images/banner-phone.png"
              alt="sale"
              className="h-80 object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  );
}