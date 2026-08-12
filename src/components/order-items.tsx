import Link from "next/link";
import {
  ArrowRight,
  Package,
  RotateCcw,
  ShoppingCart,
  Star,
} from "lucide-react";

type Item = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  size: string | null;
  color: string | null;
  sku: string | null;
};

type Props = {
  orderId: string;
  orderStatus:
    | "PENDING_PAYMENT"
    | "PAID"
    | "PROCESSING"
    | "PACKING"
    | "READY_TO_SHIP"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "COMPLETED"
    | "CANCELLED"
    | "RETURN_REQUESTED"
    | "RETURNED"
    | "REFUNDED";
  items: Item[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function OrderItems({
  orderStatus,
  items,
}: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Ordered Items
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {items.length} product
              {items.length !== 1 ? "s" : ""} in this order
            </p>
          </div>

          <Package className="h-6 w-6 text-slate-400" />
        </div>
      </div>

      {/* Products */}
      <div className="divide-y divide-slate-200">
        {items.map((item) => {
          const total = item.quantity * item.unitPrice;

          return (
            <div
              key={item.id}
              className="flex flex-col gap-6 p-6 lg:flex-row"
            >
              {/* Product image */}
              <Link
                href={`/products/${item.productSlug}`}
                className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <Package className="h-12 w-12 text-slate-300" />
                )}
              </Link>

              {/* Product details */}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.productSlug}`}
                  className="text-lg font-bold text-slate-950 transition hover:text-blue-700"
                >
                  {item.productName}
                </Link>

                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div>
                    <span className="font-semibold text-slate-900">
                      Quantity
                    </span>

                    <div className="mt-1">
                      {item.quantity}
                    </div>
                  </div>

                  {item.size ? (
                    <div>
                      <span className="font-semibold text-slate-900">
                        Size
                      </span>

                      <div className="mt-1">
                        {item.size}
                      </div>
                    </div>
                  ) : null}

                  {item.color ? (
                    <div>
                      <span className="font-semibold text-slate-900">
                        Color
                      </span>

                      <div className="mt-1">
                        {item.color}
                      </div>
                    </div>
                  ) : null}

                  {item.sku ? (
                    <div>
                      <span className="font-semibold text-slate-900">
                        SKU
                      </span>

                      <div className="mt-1 font-mono">
                        {item.sku}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Unit Price
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {formatPrice(item.unitPrice)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Total
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-950">
                      {formatPrice(total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-56 lg:grid-cols-1">
                <Link
                  href={`/products/${item.productSlug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-400 px-4 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
                >
                  Buy Again
                </Link>

                <Link
                  href={`/products/${item.productSlug}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  View Product
                </Link>

                {orderStatus === "COMPLETED" && (
                  <>
                    <button
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                      <Star className="h-4 w-4" />
                      Write Review
                    </button>

                    <button
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Return Item
                    </button>
                  </>
                )}

                <Link
                  href={`/products/${item.productSlug}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}