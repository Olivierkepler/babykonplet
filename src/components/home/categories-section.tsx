import Link from "next/link";

const categories = [
  {
    name: "Headphones",
    description: "Wireless, noise-cancelling, and everyday audio gear",
    href: "/products",
  },
  {
    name: "Watches",
    description: "Smart wearables for fitness, calls, and notifications",
    href: "/products",
  },
  {
    name: "Accessories",
    description: "Keyboards, essentials, and desk-friendly tech",
    href: "/products",
  },
  {
    name: "Gaming",
    description: "Performance-focused devices for play and precision",
    href: "/products",
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-slate-50 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Categories
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Shop by collection
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Browse popular categories and discover products designed for work,
            lifestyle, entertainment, and gaming.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {category.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {category.description}
                  </p>
                </div>

                <div className="mt-6 inline-flex items-center text-sm font-semibold text-slate-900">
                  Explore
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}