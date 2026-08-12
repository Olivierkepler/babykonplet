import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            Modern Shopping Experience
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Premium tech products with a real production-style storefront.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Discover curated electronics, clean design, seamless checkout, and a
            shopping experience built like a modern ecommerce brand.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Shop Now
            </Link>

            <Link
              href="/orders"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Orders
            </Link>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-slate-200 pt-6">
            <div>
              <p className="text-2xl font-bold text-slate-900">10K+</p>
              <p className="text-sm text-slate-500">Customers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">500+</p>
              <p className="text-sm text-slate-500">Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">24/7</p>
              <p className="text-sm text-slate-500">Support</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-slate-100" />
          <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-slate-200" />

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
              alt="Featured product"
              className="h-[420px] w-full object-cover md:h-[520px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}