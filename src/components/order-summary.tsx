import {
    BadgePercent,
    CircleDollarSign,
    ReceiptText,
    ShieldCheck,
    Truck,
  } from "lucide-react";
  
  type Props = {
    subtotal: number;
    discountAmount: number;
    shippingAmount: number;
    taxAmount: number;
    totalAmount: number;
    currency?: string;
  };
  
  function formatPrice(
    amount: number,
    currency = "USD"
  ) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  
  export default function OrderSummary({
    subtotal,
    discountAmount,
    shippingAmount,
    taxAmount,
    totalAmount,
    currency = "USD",
  }: Props) {
    const hasDiscount = discountAmount > 0;
    const hasFreeShipping = shippingAmount === 0;
  
    return (
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Order summary
            </h2>
  
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Complete pricing breakdown.
            </p>
          </div>
  
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <ReceiptText className="h-5 w-5" />
          </span>
        </div>
  
        <div className="p-5">
          {/* Price breakdown */}
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-slate-600">
                Items subtotal
              </dt>
  
              <dd className="text-sm font-semibold text-slate-950">
                {formatPrice(subtotal, currency)}
              </dd>
            </div>
  
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-sm text-slate-600">
                <Truck className="h-4 w-4 text-slate-400" />
                Shipping
              </dt>
  
              <dd
                className={`text-sm font-semibold ${
                  hasFreeShipping
                    ? "text-emerald-700"
                    : "text-slate-950"
                }`}
              >
                {hasFreeShipping
                  ? "FREE"
                  : formatPrice(shippingAmount, currency)}
              </dd>
            </div>
  
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-slate-600">
                Estimated tax
              </dt>
  
              <dd className="text-sm font-semibold text-slate-950">
                {formatPrice(taxAmount, currency)}
              </dd>
            </div>
  
            {hasDiscount ? (
              <div className="flex items-center justify-between gap-4 rounded-lg bg-emerald-50 px-3 py-3">
                <dt className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <BadgePercent className="h-4 w-4" />
                  Discount
                </dt>
  
                <dd className="text-sm font-bold text-emerald-700">
                  -{formatPrice(discountAmount, currency)}
                </dd>
              </div>
            ) : null}
          </dl>
  
          {/* Grand total */}
          <div className="mt-5 border-t border-slate-200 pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-950">
                  Order total
                </p>
  
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Includes shipping, discounts, and applicable tax.
                </p>
              </div>
  
              <p className="shrink-0 text-2xl font-bold tracking-[-0.025em] text-slate-950">
                {formatPrice(totalAmount, currency)}
              </p>
            </div>
          </div>
  
          {/* Savings */}
          {hasDiscount ? (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm font-bold text-emerald-800">
                You saved{" "}
                {formatPrice(discountAmount, currency)}
              </p>
  
              <p className="mt-1 text-xs leading-5 text-emerald-700">
                Your discount has already been applied to the order
                total.
              </p>
            </div>
          ) : null}
  
          {/* Secure total */}
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
  
            <div>
              <p className="text-sm font-bold text-slate-900">
                Secure checkout total
              </p>
  
              <p className="mt-1 text-xs leading-5 text-slate-500">
                This amount reflects the final total recorded for your
                order.
              </p>
            </div>
          </div>
  
          {/* Total paid summary */}
          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-950 px-4 py-4 text-white">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-amber-400" />
  
              <span className="text-sm font-semibold">
                Total
              </span>
            </div>
  
            <span className="text-lg font-bold">
              {formatPrice(totalAmount, currency)}
            </span>
          </div>
        </div>
      </section>
    );
  }