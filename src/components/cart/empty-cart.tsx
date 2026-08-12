import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <ShoppingCart className="h-8 w-8 text-slate-500" />
      </div>

      <h2 className="text-3xl font-bold text-slate-900">Your cart is empty</h2>
      <p className="mt-3 text-sm text-slate-600">
        Add products to your cart and continue your shopping journey.
      </p>

      <Link
        href="/products"
        className="mt-6 inline-flex bg-yellow-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300"
      >
        Shop Now
      </Link>
    </div>
  );
}