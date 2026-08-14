"use client";

import { ShoppingBag, Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import CartItem from "../../components/cart/cart-item";
import CartSummary from "../../components/cart/cart-summary";
import EmptyCart from "../../components/cart/empty-cart";
import { useCart } from "../../components/cart/cart-context";

type CartProduct = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  image?: string | null;
};

type CartItemType = {
  id: string;
  quantity: number;
  product: CartProduct;
};

export default function CartPage() {
  const { status } = useSession();
  const { refreshCart } = useCart();
  const [items, setItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

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
  }, [status]);

  function handleQuantityChange(itemId: string, nextQuantity: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: nextQuantity } : item
      )
    );
    void refreshCart();
  }

  function handleRemove(itemId: string) {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    void refreshCart();
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [items]
  );

  // Logged-out state: full illustrated background + centered login card
  if (status === "unauthenticated") {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/background.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center px-4 py-14 sm:py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-500/90 text-white shadow-lg backdrop-blur">
            <ShoppingBag className="h-7 w-7" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
            Shopping Cart
          </p>

          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Review your cart
          </h1>

          <div className="mt-10 w-full max-w-sm rounded-[2rem] bg-white/95 px-8 py-10 text-center shadow-2xl backdrop-blur">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-500 text-white">
              <Lock className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Log in to see your cart
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Sign in to view saved items, save favorites, and continue your
              Baby Konplet shopping journey.
            </p>

            <Link
              href="/login?callbackUrl=/cart"
              className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-slate-500 px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-slate-600"
            >
              Log In
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-300" />
              <span className="h-2 w-2 rounded-full bg-sky-300" />
              <span className="h-2 w-2 rounded-full bg-amber-300" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Shopping Cart
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Review your cart
              </h1>

              {status === "authenticated" && !loading && !error && items.length > 0 ? (
                <p className="mt-2 text-sm text-slate-600">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {status === "loading" ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-2 w-28 animate-pulse rounded-full bg-slate-200" />

            <p className="mt-5 text-sm font-medium text-slate-600">
              Checking your session...
            </p>
          </div>
        ) : loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-2 w-28 animate-pulse rounded-full bg-slate-200" />

            <p className="mt-5 text-sm font-medium text-slate-600">
              Loading cart...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-red-800">
              Unable to load your cart
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>
          </div>
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-7 xl:grid-cols-[1.65fr_0.9fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="xl:sticky xl:top-24 xl:self-start">
              <CartSummary
                totalItems={totalItems}
                subtotal={subtotal}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}