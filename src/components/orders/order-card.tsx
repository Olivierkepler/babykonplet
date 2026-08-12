import { CheckCircle2, Clock3, Package, XCircle } from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  product: {
    name: string;
  };
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getStatusStyles(status: string) {
  const normalizedStatus = status.toUpperCase();

  if (
    normalizedStatus === "PAID" ||
    normalizedStatus === "CAPTURED" ||
    normalizedStatus === "AUTHORIZED" ||
    normalizedStatus === "COMPLETED" ||
    normalizedStatus === "DELIVERED" ||
    normalizedStatus === "FULFILLED"
  ) {
    return {
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    };
  }

  if (
    normalizedStatus === "FAILED" ||
    normalizedStatus === "CANCELLED" ||
    normalizedStatus === "REFUNDED" ||
    normalizedStatus === "RETURNED" ||
    normalizedStatus === "RETURN_REQUESTED" ||
    normalizedStatus === "PARTIALLY_REFUNDED"
  ) {
    return {
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    };
  }

  return {
    className: "bg-amber-50 text-amber-700",
    icon: Clock3,
  };
}

export default function OrderCard({ order }: { order: Order }) {
  const orderStatus = getStatusStyles(order.status);
  const paymentStatus = getStatusStyles(order.paymentStatus);

  const OrderStatusIcon = orderStatus.icon;
  const PaymentStatusIcon = paymentStatus.icon;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Package className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Order
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-950">
                {order.id}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${orderStatus.className}`}
            >
              <OrderStatusIcon className="h-3.5 w-3.5" />
              Order: {order.status}
            </span>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${paymentStatus.className}`}
            >
              <PaymentStatusIcon className="h-3.5 w-3.5" />
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
            Items
          </h3>

          <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <span className="font-medium text-slate-900">
                  {item.product.name}
                </span>

                <span className="shrink-0 text-sm font-semibold text-slate-500">
                  Qty: {item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
          <span className="text-sm font-semibold text-slate-500">
            Order total
          </span>

          <span className="text-2xl font-bold tracking-tight text-slate-950">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </div>
    </article>
  );
}