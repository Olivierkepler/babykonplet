"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SummaryItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  items: SummaryItem[];
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function OrderSummary({ items }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const estimatedTotal = subtotal;

  async function handlePlaceOrder() {
    try {
      setLoading(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to place order");
        return;
      }

      router.push("/orders");
      router.refresh();
    } catch {
      alert("Something went wrong while placing the order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Order Summary
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Review your order
        </h2>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-slate-950">
                  {item.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Quantity: {item.quantity}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {formatPrice(item.price)} each
                </p>
              </div>

              <p className="shrink-0 font-bold text-slate-950">
                {formatPrice(item.quantity * item.price)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4 border-t border-slate-200 pt-5 text-sm">
          <div className="flex items-center justify-between text-slate-600">
            <span>Total items</span>
            <span className="font-semibold text-slate-900">
              {totalItems}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 text-slate-600">
            <span>Shipping</span>
            <span className="text-right font-medium text-slate-600">
              Calculated separately
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
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

            <p className="text-xs leading-5 text-slate-500">
              Review your delivery information before placing the order.
              Additional charges, when applicable, should be confirmed before
              payment.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={loading || items.length === 0}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Placing Order..." : "Place Order"}

          {!loading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </div>
    </aside>
  );
}