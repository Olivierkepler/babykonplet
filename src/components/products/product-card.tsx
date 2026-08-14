"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, PackageX, Sparkles, Truck } from "lucide-react";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    description?: string | null;
    brand?: string | null;
    category?: string | null;
    stock?: number;
    imageUrl?: string | null;
    image?: string | null;
  };
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function ProductCard({ product }: Props) {
  const [isSaved, setIsSaved] = useState(false);

  const productUrl = `/products/${product.slug}`;

  const image =
    product.imageUrl ||
    product.image ||
    "/images/product-placeholder.png";

  const hasStockValue = typeof product.stock === "number";
  const isInStock = hasStockValue ? product.stock! > 0 : true;

  const isCriticalStock =
    hasStockValue && product.stock! > 0 && product.stock! <= 2;

  const isLowStock =
    hasStockValue &&
    product.stock! > 2 &&
    product.stock! <= 5;

  const hasDiscount =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) /
          product.compareAtPrice!) *
          100,
      )
    : 0;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:border-slate-300 hover:shadow-[0_12px_34px_rgba(15,23,42,0.12)]">
      {/* WISHLIST */}
      <button
        type="button"
        aria-label={
          isSaved
            ? `Remove ${product.name} from your favorites`
            : `Add ${product.name} to your favorites`
        }
        aria-pressed={isSaved}
        onClick={() => setIsSaved((prev) => !prev)}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:border-slate-300 hover:bg-white hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
      >
        <Heart
          className={`h-[18px] w-[18px] transition ${
            isSaved ? "fill-red-500 text-red-500" : ""
          }`}
        />
      </button>

      {/* IMAGE */}
      <Link
        href={productUrl}
        className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-white p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
      >
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {isCriticalStock ? (
            <span className="rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">
              Only {product.stock} left
            </span>
          ) : isLowStock ? (
            <span className="rounded-md bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
              Only {product.stock} left in stock
            </span>
          ) : !isInStock ? (
            <span className="rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-white">
              Sold out
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#EAF4F8] px-2.5 py-1 text-[11px] font-bold text-[#4F8CB5]">
              <Sparkles className="h-3 w-3" />
              New
            </span>
          )}

          {hasDiscount ? (
            <span className="rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white">
              Save {discountPercent}%
            </span>
          ) : null}
        </div>

        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </Link>

      {/* CONTENT */}
    <div className="flex flex-1 flex-col p-4 bg-slate-50">
  {/* Brand Name */}
  <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
    {product.brand ?? "Baby Konplet"}
  </p>

  {/* Product Title */}
  <Link
    href={productUrl}
    className="mt-1.5 group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
  >
    <h2 className="line-clamp-2 min-h-[44px] text-[15px] font-semibold leading-[22px] text-slate-900 transition-colors group-hover:text-[#4F8CB5]">
      {product.name}
    </h2>
  </Link>

  {/* Description */}
  {product.description && (
    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
      {product.description}
    </p>
  )}

  {/* Price Section */}
  <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
    <span className="text-xl font-bold tracking-tight text-slate-950">
      {formatPrice(product.price)}
    </span>

    {hasDiscount && (
      <span className="text-sm font-medium text-slate-400 line-through">
        {formatPrice(product.compareAtPrice!)}
      </span>
    )}
  </div>

  {/* Delivery Status */}
  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium">
    {isInStock ? (
      <>
        <Truck className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
        <span className="text-slate-600">Free shipping on this item</span>
      </>
    ) : (
      <>
        <PackageX className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
        <span className="text-slate-500">Currently unavailable</span>
      </>
    )}
  </div>

  {/* Action Button */}
  <div className="mt-auto pt-4">
    <Link
      href={productUrl}
      className={`flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isInStock
          ? "bg-[#63A0C7] text-white hover:bg-[#4F8CB5] focus-visible:ring-[#63A0C7]"
          : "bg-slate-200/60 text-slate-400 focus-visible:ring-slate-300 pointer-events-none"
      }`}
    >
      {isInStock ? "View Details" : "Notify Me"}
    </Link>
  </div>
</div>
    </article>
  );
}