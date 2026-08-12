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
      <div className="flex flex-wrap items-center gap-3">
        {category ? (
          <span className="text-sm font-medium capitalize text-slate-500">
            {category}
          </span>
        ) : null}

        {category && brand ? (
          <span className="h-1 w-1 rounded-full bg-slate-300" />
        ) : null}

        {brand ? (
          <span className="text-sm font-medium text-slate-600">
            {brand}
          </span>
        ) : null}
      </div>

      {/* PRODUCT NAME */}
      <h1 className="mt-4 max-w-3xl text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-slate-950 sm:text-[34px] lg:text-[38px]">
        {name}
      </h1>

      {/* REVIEWS */}
      <a
        href="#customer-reviews"
        className="mt-4 inline-flex flex-wrap items-center gap-3 text-sm"
      >
        <div
          className="flex items-center gap-1"
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
            <span className="font-semibold text-slate-900">
              {averageRating.toFixed(1)}
            </span>

            <span className="inline-flex items-center gap-1.5 font-medium text-blue-600 transition hover:text-blue-700 hover:underline">
              <MessageSquareText className="h-4 w-4" />
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-medium text-blue-600 transition hover:text-blue-700 hover:underline">
            <MessageSquareText className="h-4 w-4" />
            0 reviews · Write the first review
          </span>
        )}
      </a>

      {/* PRICE */}
      <div className="mt-5">
        <p className="text-[32px] font-semibold tracking-[-0.02em] text-slate-950 sm:text-[36px]">
          {formatPrice(price)}
        </p>

        <div className="mt-3 space-y-1 text-sm">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Secure checkout
          </div>

          <p className="pl-6 text-slate-500">
            Taxes calculated at checkout
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            Secure payment
          </span>

          <span className="inline-flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-emerald-600" />
            Easy returns
          </span>

          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-emerald-600" />
            Flexible delivery
          </span>
        </div>
      </div>

      {/* DELIVERY */}
      <div className="mt-6 border-t border-slate-200 pt-6">
        <div className="flex items-start gap-4">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-semibold text-slate-950">
              Delivery
            </h2>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Standard delivery
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
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

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Available during checkout for eligible orders
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              <MapPin className="h-4 w-4" />
              Check delivery availability
            </button>
          </div>
        </div>
      </div>

      {/* STOCK */}
      <div className="mt-6">
        <div className="flex flex-wrap items-start gap-3">
          <span
            className={`inline-flex items-center gap-2 text-base font-semibold ${
              isInStock ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {isInStock ? (
              <PackageCheck className="h-5 w-5" />
            ) : (
              <PackageX className="h-5 w-5" />
            )}

            {isInStock ? "In stock" : "Out of stock"}
          </span>

          {isInStock ? (
            <span className="text-sm text-slate-500">
              
            </span>
          ) : null}

          {isLowStock ? (
            <span className="text-sm font-semibold text-amber-700">
              Only {stock} left
            </span>
          ) : null}
        </div>
      </div>

      {/* STORE INFORMATION */}
      <div className="mt-7 border-t border-slate-200 pt-7">
        <dl className="space-y-5 text-sm">
          <div>
            <dt className="flex items-center gap-2 text-slate-500">
              <Store className="h-4 w-4 shrink-0" />
              Sold by
            </dt>

            <dd className="mt-1 pl-6 font-semibold text-slate-900">
              DJADOR Family Store
            </dd>
          </div>

          <div>
            <dt className="flex items-center gap-2 text-slate-500">
              <RotateCcw className="h-4 w-4 shrink-0" />
              Returns
            </dt>

            <dd className="mt-1 pl-6 font-medium text-blue-600">
              Return eligibility shown at checkout
            </dd>
          </div>

          <div>
            <dt className="flex items-center gap-2 text-slate-500">
              <Headphones className="h-4 w-4 shrink-0" />
              Support
            </dt>

            <dd className="mt-1 pl-6 font-medium text-blue-600">
              Customer support available
            </dd>
          </div>
        </dl>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-8 border-t border-slate-200 pt-7">
        <h2 className="text-xl font-semibold tracking-[-0.01em] text-slate-950">
          Product overview
        </h2>

        <p className="mt-4 max-w-prose whitespace-pre-line text-[15px] leading-7 text-slate-600">
          {description || "Product information is currently unavailable."}
        </p>
      </div>
    </div>
  );
}