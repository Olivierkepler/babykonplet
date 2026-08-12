import Link from "next/link";
import {
  Heart,
  PackageCheck,
  PackageX,
  Star,
  Truck,
} from "lucide-react";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
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
  const productUrl = `/products/${product.slug}`;

  const image =
    product.imageUrl ||
    product.image ||
    "/images/product-placeholder.png";

  const hasStockValue = typeof product.stock === "number";
  const isInStock = hasStockValue ? product.stock! > 0 : true;

  const isLowStock =
    hasStockValue &&
    product.stock! > 0 &&
    product.stock! <= 5;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:border-slate-300 hover:shadow-[0_12px_34px_rgba(15,23,42,0.12)]">
      {/* WISHLIST */}
      <button
        type="button"
        aria-label={`Add ${product.name} to wishlist`}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:border-slate-300 hover:bg-white hover:text-red-500"
      >
        <Heart className="h-[18px] w-[18px]" />
      </button>

      {/* IMAGE */}
      <Link
        href={productUrl}
        className="relative flex h-[300px] items-center justify-center overflow-hidden bg-slate-50 p-4 sm:h-[330px] xl:h-[350px]"
      >
        {isLowStock ? (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
            Only {product.stock} left
          </span>
        ) : null}

        {!isInStock ? (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
            Out of stock
          </span>
        ) : null}

        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </Link>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          {product.brand || product.category || "DJADOR"}
        </p>

        <Link href={productUrl}>
        <h2 className="mt-2 line-clamp-2 min-h-[44px] text-[15px] font-semibold leading-[22px] text-slate-900 transition group-hover:text-blue-700">
            {product.name}
          </h2>
        </Link>

        {/* RATING */}
        <p className="mt-2 text-xs font-medium text-slate-500">
  New arrival
</p>
        {/* PRICE */}
        <p className="mt-3 text-xl font-bold tracking-tight text-slate-950">
          {formatPrice(product.price)}
        </p>

        {/* DELIVERY */}
        {isInStock ? (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Truck className="h-4 w-4 text-emerald-600" />
            Free standard delivery
          </div>
        ) : null}

        {/* STOCK */}
        <div className="mt-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
              isInStock
                ? "text-emerald-700"
                : "text-red-700"
            }`}
          >
            {isInStock ? (
              <PackageCheck className="h-4 w-4" />
            ) : (
              <PackageX className="h-4 w-4" />
            )}

            {isInStock
              ? "In stock"
              : "Currently unavailable"}
          </span>
        </div>

        {/* BUTTON */}
        <div className="mt-auto pt-4">
  <Link
    href={productUrl}
    className="inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-800 hover:underline"
  >
            view details
          </Link>
        </div>
      </div>
    </article>
  );
}