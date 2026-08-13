import Link from "next/link";
import {
  ArrowRight,
  X,
  Mail,
  XIcon,
} from "lucide-react";

const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "New Arrivals", href: "/products?sort=newest" },
      { label: "Cart", href: "/cart" },
      { label: "Orders", href: "/orders" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-slate-100 relative mt-20"
      style={{
        backgroundImage: "url(/images/fashion/bluebg.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        opacity: 0.80,
      }}
 
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-10">
          <div className="relative overflow-hidden  px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-12">
            {/* Decorative elements */}
            {/* <div
              aria-hidden="true"
              className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#FDECEC]/70 blur-2xl"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-[#FFF3C4]/80 blur-2xl"
            /> */}

            <div className="relative max-w-xl">
              {/* <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#6193B7] shadow-sm">
                Stay connected
              </span> */}

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                A little joy, delivered to your inbox.
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
                Discover new products, family favorites, special offers, and
                updates from Baby Konpe.
              </p>
            </div>

            <form className="relative mt-7 w-full max-w-md lg:mt-0">
              <div className="flex items-center rounded-2xl border border-white bg-white p-1.5 shadow-sm transition focus-within:ring-4 focus-within:ring-[#A8CFDD]/20">
                <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                  <Mail
                    className="h-4 w-4 shrink-0 text-[#95B2CE]"
                    aria-hidden="true"
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Email address"
                    className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="group flex shrink-0 items-center gap-2 rounded-xl bg-[#63A0C7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6193B7]"
                >
                  Subscribe
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <p className="mt-2.5 text-xs text-slate-500">
                No spam — just new finds and family favorites.
              </p>
            </form>
          </div>
        </div>

        {/* Main footer */}
        <div className="grid gap-12 border-b border-slate-100 py-14 lg:grid-cols-[1.3fr_2fr] lg:gap-20">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-xl font-bold tracking-tight text-slate-900"
            >
              Baby Konple
              <span className="ml-1.5 font-medium text-[#63A0C7]">
                Store
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500">
              Thoughtfully selected products for families, little ones, and
              everyday moments that matter.
            </p>

            <div className="mt-7 flex items-center gap-2">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDECEC] text-[#E7B09E] transition hover:-translate-y-0.5 hover:bg-[#F9D9D5]"
              >
                <XIcon className="h-4 w-4" />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4F8] text-[#63A0C7] transition hover:-translate-y-0.5 hover:bg-[#D9EDF5]"
              >
                <XIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3"
          >
            {footerSections.map((section, sectionIndex) => (
              <div key={section.title}>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      sectionIndex === 0
                        ? "bg-[#F7CC5C]"
                        : sectionIndex === 1
                          ? "bg-[#A8CFDD]"
                          : "bg-[#E7B09E]"
                    }`}
                  />

                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {section.title}
                  </h3>
                </div>

                <ul className="mt-5 space-y-3.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-sm text-slate-600 transition hover:translate-x-0.5 hover:text-[#63A0C7]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            © {year} Baby Konple. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-slate-400 transition hover:text-[#63A0C7]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-slate-400 transition hover:text-[#63A0C7]"
            >
              Terms
            </Link>

            <Link
              href="/refund-policy"
              className="text-xs text-slate-400 transition hover:text-[#63A0C7]"
            >
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}