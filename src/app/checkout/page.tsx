"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import CheckoutForm from "../../components/checkout/checkout-form";
import OrderSummary from "../../components/checkout/order-summary";

type CartItemType = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
};

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCart() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/cart", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          setError("Failed to fetch cart");
          return;
        }

        const resolvedItems =
          data.items || data.cart?.items || data.cartItems || [];

        setItems(resolvedItems);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  const summaryItems = items.map((item) => ({
    id: item.id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Checkout
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Secure checkout
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Enter your contact and delivery information, confirm your
                payment method, and review your order before placing it.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700" />

              <div>
                <p className="text-sm font-bold text-emerald-900">
                  Secure process
                </p>

                <p className="text-xs text-emerald-700">
                  Review all details before submission
                </p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-2 w-32 animate-pulse rounded-full bg-slate-200" />

            <p className="mt-5 text-sm font-medium text-slate-600">
              Loading checkout...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-red-800">
              Unable to load checkout
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Add products to your cart before continuing to checkout.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 xl:grid-cols-[1.55fr_0.95fr]">
            <CheckoutForm />

            <div className="xl:sticky xl:top-24 xl:self-start">
              <OrderSummary items={summaryItems} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}