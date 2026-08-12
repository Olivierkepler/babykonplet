import Link from "next/link";

const shopLinks = [
  { label: "All Products", href: "/products" },
  { label: "Cart", href: "/cart" },
  { label: "Orders", href: "/orders" },
];

const supportLinks = [
  { label: "Help Center", href: "#" },
  { label: "Returns", href: "#" },
  { label: "Shipping Info", href: "#" },
  { label: "Contact Us", href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Refund Policy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-slate-900"
            >
              DJADOR FAMILY STORE
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
              A modern ecommerce experience focused on smooth browsing, secure
              checkout, and reliable order tracking.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Shop
            </h3>
            <div className="mt-4 space-y-3">
              {shopLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-slate-600 transition hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Support
            </h3>
            <div className="mt-4 space-y-3">
              {supportLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-slate-600 transition hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Legal
            </h3>
            <div className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-slate-600 transition hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 DJADOR FAMILY STORE. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link href="#" className="transition hover:text-slate-900">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:text-slate-900">
              Terms of Service
            </Link>
            <Link href="#" className="transition hover:text-slate-900">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}