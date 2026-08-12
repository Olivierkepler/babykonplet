"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

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

type Props = {
  item: CartItemType;
  onQuantityChange: (itemId: string, nextQuantity: number) => void;
  onRemove: (itemId: string) => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: Props) {
  const [loading, setLoading] = useState(false);

  const image =
    item.product.imageUrl ||
    item.product.image ||
    "/images/product-placeholder.png";

  async function updateQuantity(nextQuantity: number) {
    if (nextQuantity < 1) return;

    try {
      setLoading(true);

      const res = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: item.id,
          quantity: nextQuantity,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to update quantity");
        return;
      }

      onQuantityChange(item.id, nextQuantity);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem() {
    try {
      setLoading(true);

      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.product.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to remove item");
        return;
      }

      onRemove(item.id);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[120px_1fr] sm:gap-5">
        <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 sm:h-28">
          <img
            src={image}
            alt={item.product.name}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">
                {item.product.name}
              </h3>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {formatPrice(item.product.price)}
              </p>
            </div>

            <div className="md:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Subtotal
              </p>
              <p className="mt-1 text-lg font-bold text-slate-950">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
            <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
              <button
                type="button"
                onClick={() => updateQuantity(item.quantity - 1)}
                disabled={loading || item.quantity <= 1}
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="flex h-10 min-w-12 items-center justify-center border-x border-slate-300 px-3 text-sm font-semibold text-slate-900">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => updateQuantity(item.quantity + 1)}
                disabled={loading}
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={removeItem}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}