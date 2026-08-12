import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";

type Props = {
  totalItems: number;
  subtotal: number;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function CartSummary({ totalItems, subtotal }: Props) {
  const shipping = 0;
  const estimatedTotal = subtotal + shipping;

  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Order Summary
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Review your cart
        </h2>
      </div>

      <div className="space-y-5 px-6 py-6">
        <div className="flex items-center justify-between text-sm text-slate-700">
          <span>
            Items ({totalItems})
          </span>

          <span className="font-semibold text-slate-950">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 text-sm text-slate-700">
          <span>Shipping</span>

          <span className="text-right font-medium text-slate-600">
            Calculated at checkout
          </span>
        </div>

        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-lg font-bold text-slate-950">
              Estimated total
            </span>

            <span className="text-2xl font-bold tracking-tight text-slate-950">
              {formatPrice(estimatedTotal)}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

            <p className="text-xs leading-5 text-slate-500">
              Taxes, shipping fees, and final order details are confirmed during checkout.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-5">
        <Link
          href="/checkout"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}