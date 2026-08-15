import {
  Headphones,
  MapPin,
  MessageSquareText,
  PackageCheck,
  PackageX,
  RotateCcw,
  ShieldCheck,
  Star,
  Store,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  name: string;
  price: number;
  description?: string;
  brand?: string;
  category?: string;
  stock: number;
  averageRating: number;
  reviewCount: number;

  // Slot for AddToCartButton (color/size selectors + the actual
  // add-to-cart / buy-now buttons) so it renders inside the same
  // buybox card as price/delivery/stock.
  purchaseControls?: ReactNode;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getEstimatedDeliveryLabel() {
  const date = new Date();
  date.setDate(date.getDate() + 5);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function ProductInfo({
  name,
  price,
  description,
  brand,
  category,
  stock,
  averageRating,
  reviewCount,
  purchaseControls,
}: Props) {
  const roundedRating = Math.round(averageRating);
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;
  const estimatedDelivery = getEstimatedDeliveryLabel();

  return (
    <div className="grid w-full gap-8 text-slate-900 xl:grid-cols-[minmax(0,1fr)_320px]">
      {/* LEFT COLUMN */}
      <div className="min-w-0">
        {/* STORE LINK */}
        <a
          href="#"
          className="text-sm font-semibold text-[#4F8CB5] transition hover:text-[#63A0C7] hover:underline"
        >
          Visit the Baby Konplet Store
        </a>

        {/* PRODUCT NAME */}
        <h1 className="mt-2 max-w-3xl text-[26px] font-bold leading-[1.25] tracking-[-0.01em] text-slate-950 sm:text-[28px]">
          {name}
        </h1>

        {/* CATEGORY / BRAND */}
        {(category || brand) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {category ? (
              <span className="inline-flex items-center rounded-full bg-[#EAF4F8] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4F8CB5]">
                {category}
              </span>
            ) : null}

            {brand ? (
              <span className="text-sm font-semibold text-slate-500">
                {brand}
              </span>
            ) : null}
          </div>
        )}

        {/* REVIEWS */}
        <a
          href="#customer-reviews"
          className="mt-3 inline-flex flex-wrap items-center gap-3 border-b border-transparent pb-3 text-sm transition hover:opacity-80"
        >
          <div
            className="flex items-center gap-0.5"
            aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-[18px] w-[18px] ${
                  star <= roundedRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>

          {reviewCount > 0 ? (
            <>
              <span className="font-bold text-slate-900">
                {averageRating.toFixed(1)}
              </span>

              <span className="inline-flex items-center gap-1.5 font-semibold text-[#4F8CB5] transition hover:text-[#63A0C7] hover:underline">
                <MessageSquareText className="h-4 w-4" />
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </span>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#4F8CB5] transition hover:text-[#63A0C7] hover:underline">
              <MessageSquareText className="h-4 w-4" />
              Be the first to write a review
            </span>
          )}
        </a>

        <div className="border-t border-[#E7EEF3]" />

        {/* MOBILE / TABLET BUYBOX ESSENTIALS */}
        <div className="mt-5 xl:hidden">
          <p className="text-[32px] font-bold tracking-[-0.02em] text-slate-950">
            {formatPrice(price)}
          </p>

          <span
            className={`mt-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${
              isInStock
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {isInStock ? (
              <PackageCheck className="h-4 w-4" />
            ) : (
              <PackageX className="h-4 w-4" />
            )}

            {isInStock ? "In stock" : "Out of stock"}
          </span>

          {isLowStock ? (
            <span className="ml-2 mt-3 inline-flex w-fit items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
              Only {stock} left
            </span>
          ) : null}
        </div>

        {/* PURCHASE CONTROLS — MOBILE / TABLET */}
        {purchaseControls && (
          <div className="mt-6 xl:hidden">{purchaseControls}</div>
        )}

        {/* DESCRIPTION */}
        <div className="mt-8 border-t border-[#E7EEF3] pt-7">
          <h2 className="text-xl font-bold tracking-[-0.01em] text-slate-950">
            Product overview
          </h2>

          <p className="mt-4 max-w-prose whitespace-pre-line text-[15px] leading-7 text-slate-600">
            {description ||
              "We're still writing up the full details for this item — check back soon, or reach out to our team with any questions."}
          </p>
        </div>

        {/* STORE INFORMATION */}
        <div className="mt-8 border-t border-[#E7EEF3] pt-7">
          <dl className="space-y-5 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF4F8] text-[#63A0C7]">
                <Store className="h-4 w-4" />
              </div>

              <div>
                <dt className="text-slate-500">Sold by</dt>
                <dd className="mt-0.5 font-bold text-slate-900">
                  Baby Konplet Store
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF4F8] text-[#63A0C7]">
                <RotateCcw className="h-4 w-4" />
              </div>

              <div>
                <dt className="text-slate-500">Returns</dt>
                <dd className="mt-0.5 font-semibold text-[#4F8CB5]">
                  Return eligibility shown at checkout
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF4F8] text-[#63A0C7]">
                <Headphones className="h-4 w-4" />
              </div>

              <div>
                <dt className="text-slate-500">Support</dt>
                <dd className="mt-0.5 font-semibold text-[#4F8CB5]">
                  Questions about this item? Contact our team
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {/* RIGHT COLUMN — DESKTOP BUYBOX */}
      <div className="hidden min-w-0 xl:block xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-2xl border border-[#E7EEF3] p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.15)]">
          {/* PRICE */}
          <p className="text-[30px] font-bold tracking-[-0.02em] text-slate-950">
            {formatPrice(price)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Taxes calculated at checkout
          </p>

          {/* DELIVERY */}
          <div className="mt-5 flex items-start gap-3 border-t border-[#E7EEF3] pt-5">
            <Truck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#63A0C7]" />

            <p className="text-sm leading-6 text-slate-700">
              <span className="font-bold text-slate-950">
                Free delivery {estimatedDelivery}
              </span>
              <br />
              on orders over $35
            </p>
          </div>

          {/* LOCATION */}
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#4F8CB5] transition hover:text-[#63A0C7] hover:underline"
          >
            <MapPin className="h-4 w-4" />
            Update delivery location
          </button>

          {/* STOCK */}
          <div className="mt-5 border-t border-[#E7EEF3] pt-5">
            <span
              className={`inline-flex w-fit items-center gap-2 text-base font-bold ${
                isInStock ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {isInStock ? (
                <PackageCheck className="h-[18px] w-[18px]" />
              ) : (
                <PackageX className="h-[18px] w-[18px]" />
              )}

              {isInStock ? "In Stock" : "Out of stock"}
            </span>

            {isLowStock ? (
              <p className="mt-1.5 text-sm font-semibold text-amber-700">
                Only {stock} left — order soon
              </p>
            ) : null}
          </div>

          {/* VARIANT SELECTORS + ADD TO CART */}
          {purchaseControls && (
            <div className="mt-5 border-t border-[#E7EEF3] pt-5">
              {purchaseControls}
            </div>
          )}

          {/* TRUST BADGES */}
          <div className="mt-5 flex flex-col gap-2 rounded-xl bg-[#F2F9FC] px-4 py-3 text-xs font-semibold text-[#4F819F]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              Secure checkout
            </span>

            <span className="inline-flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5 shrink-0" />
              Easy returns
            </span>
          </div>
        </div>

        
      </div>
    </div>
  );
}