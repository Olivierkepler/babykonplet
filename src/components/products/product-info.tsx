import {
  Check,
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
  Zap,
} from "lucide-react";

type Props = {
  name: string;
  price: number;
  description?: string;
  brand?: string;
  category?: string;
  stock: number;
  averageRating: number;
  reviewCount: number;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
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
}: Props) {
  const roundedRating = Math.round(averageRating);
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="w-full text-slate-900">
      {/* CATEGORY AND BRAND */}
      <div className="flex flex-wrap items-center gap-2">
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

      {/* PRODUCT NAME */}
      <h1 className="mt-3 max-w-3xl text-[30px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-950 sm:text-[34px] lg:text-[38px]">
        {name}
      </h1>

      {/* REVIEWS */}
      <a
        href="#customer-reviews"
        className="mt-3 inline-flex flex-wrap items-center gap-3 text-sm transition hover:opacity-80"
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

      {/* PRICE */}
      <div className="mt-6">
        <p className="text-[34px] font-bold tracking-[-0.02em] text-slate-950 sm:text-[38px]">
          {formatPrice(price)}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Taxes calculated at checkout
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-[#F2F9FC] px-4 py-3 text-sm font-semibold text-[#4F819F]">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Secure checkout
          </span>

          <span className="inline-flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Easy returns
          </span>

          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Flexible delivery
          </span>
        </div>
      </div>

      {/* STOCK */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${
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
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
            Only {stock} left — order soon
          </span>
        ) : null}
      </div>

      {/* DELIVERY */}
      <div className="mt-7 rounded-2xl border border-[#E7EEF3] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF4F8] text-[#63A0C7]">
            <Truck className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-bold text-slate-950">
              Delivery options
            </h2>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Standard delivery
                  </p>

                  <p className="mt-0.5 text-sm leading-6 text-slate-500">
                    Estimated arrival in 4–7 business days
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Express delivery
                  </p>

                  <p className="mt-0.5 text-sm leading-6 text-slate-500">
                    Available at checkout for eligible orders
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#4F8CB5] transition hover:text-[#63A0C7] hover:underline"
            >
              <MapPin className="h-4 w-4" />
              Check delivery availability
            </button>
          </div>
        </div>
      </div>

      {/* STORE INFORMATION */}
      <div className="mt-7 border-t border-[#E7EEF3] pt-7">
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
    </div>
  );
}