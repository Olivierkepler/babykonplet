import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Box,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Package,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";

type OrdersPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

type OrderStatusValue =
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

const statusFilters = [
  {
    label: "All orders",
    value: "ALL",
  },
  {
    label: "Order placed",
    value: "PENDING_PAYMENT",
  },
  {
    label: "Processing",
    value: "PAID",
  },
  {
    label: "Delivered",
    value: "COMPLETED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
] as const;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getOrderNumber(orderId: string) {
  return `#${orderId.slice(-8).toUpperCase()}`;
}

function getStatusDetails(status: OrderStatusValue) {
  switch (status) {
    case "PAID":
    case "PROCESSING":
    case "PACKING":
    case "READY_TO_SHIP":
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return {
        label: "Processing",
        title: "Your order is being prepared.",
        description:
          "Payment has been confirmed and your items are being prepared.",
        badgeClass:
          "border-blue-200 bg-blue-50 text-blue-700",
        icon: Truck,
      };

    case "DELIVERED":
    case "COMPLETED":
      return {
        label: "Delivered",
        title: "Your order has been completed.",
        description:
          "This order has been successfully fulfilled.",
        badgeClass:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        title: "This order was cancelled.",
        description:
          "No further processing will take place for this order.",
        badgeClass:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: XCircle,
      };

    case "RETURN_REQUESTED":
    case "RETURNED":
    case "REFUNDED":
      return {
        label: "Failed",
        title: "This order could not be completed.",
        description:
          "There was a problem processing this order.",
        badgeClass:
          "border-red-200 bg-red-50 text-red-700",
        icon: XCircle,
      };

    default:
      return {
        label: "Order placed",
        title: "Your order has been received.",
        description:
          "Tracking information will appear after your order is prepared.",
        badgeClass:
          "border-amber-200 bg-amber-50 text-amber-700",
        icon: Clock3,
      };
  }
}

function getPaymentDetails(
  status:
    | "PENDING"
    | "AUTHORIZED"
    | "CAPTURED"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED"
) {
  switch (status) {
    case "CAPTURED":
    case "AUTHORIZED":
      return {
        label: "Payment completed",
        className: "text-emerald-700",
      };

    case "FAILED":
      return {
        label: "Payment failed",
        className: "text-red-700",
      };

    case "REFUNDED":
    case "PARTIALLY_REFUNDED":
      return {
        label: "Payment refunded",
        className: "text-purple-700",
      };

    default:
      return {
        label: "Payment pending",
        className: "text-amber-700",
      };
  }
}

export default async function OrdersPage({
  searchParams,
}: OrdersPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id?: string }).id;

  if (!userId) {
    redirect("/login");
  }

  const { q = "", status = "ALL" } = await searchParams;

  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              imageUrl: true,
            },
          },
          variant: {
            select: {
              id: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  const normalizedQuery = q.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      status === "ALL" || order.status === status;

    const matchesSearch =
      !normalizedQuery ||
      order.id.toLowerCase().includes(normalizedQuery) ||
      order.trackingNumber
        ?.toLowerCase()
        .includes(normalizedQuery) ||
      order.items.some((item) => {
        return (
          item.productName
            ?.toLowerCase()
            .includes(normalizedQuery) ||
          item.product.name
            .toLowerCase()
            .includes(normalizedQuery) ||
          item.sku?.toLowerCase().includes(normalizedQuery)
        );
      });

    return matchesStatus && matchesSearch;
  });

  const totalOrders = orders.length;

  const placedOrders = orders.filter(
    (order) => order.status === "PENDING_PAYMENT"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "PAID"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  const stats = [
    {
      title: "Total orders",
      value: totalOrders,
      description: "All purchases made",
      icon: Package,
      iconClass: "bg-blue-50 text-blue-700",
    },
    {
      title: "Order placed",
      value: placedOrders,
      description: "Awaiting processing",
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-700",
    },
    {
      title: "Processing",
      value: processingOrders,
      description: "Being prepared",
      icon: Truck,
      iconClass: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Delivered",
      value: deliveredOrders,
      description: "Completed orders",
      icon: PackageCheck,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              Your purchases
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Track, manage, and review all your purchases in one
              place.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-300"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <p className="text-2xl font-bold tracking-tight text-slate-950">
                  {stat.value}
                </p>
              </div>

              <h2 className="mt-4 text-sm font-bold text-slate-950">
                {stat.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <form
          action="/account/orders"
          method="get"
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_230px_auto]"
        >
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search by order number, product, SKU, or tracking number"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
            />
          </label>

          <select
            name="status"
            defaultValue={status}
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
          >
            {statusFilters.map((filter) => (
              <option
                key={filter.value}
                value={filter.value}
              >
                {filter.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {statusFilters.map((filter) => {
            const active = status === filter.value;

            const href =
              filter.value === "ALL"
                ? q
                  ? `/account/orders?q=${encodeURIComponent(q)}`
                  : "/account/orders"
                : `/account/orders?status=${filter.value}${
                    q ? `&q=${encodeURIComponent(q)}` : ""
                  }`;

            return (
              <Link
                key={filter.value}
                href={href}
                className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold transition ${
                  active
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Results summary */}
      <div className="flex items-center justify-between gap-4 px-1">
        <p className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-bold text-slate-950">
            {filteredOrders.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-slate-950">
            {orders.length}
          </span>{" "}
          orders
        </p>

        {(q || status !== "ALL") && (
          <Link
            href="/account/orders"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            Clear filters
          </Link>
        )}
      </div>

      {/* Orders */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const orderStatus = getStatusDetails(order.status);
            const paymentStatus = getPaymentDetails(
              order.paymentStatus
            );

            const StatusIcon = orderStatus.icon;

            const totalQuantity = order.items.reduce(
              (total, item) => total + item.quantity,
              0
            );

            const visibleItems = order.items.slice(0, 3);
            const additionalItems = Math.max(
              order.items.length - visibleItems.length,
              0
            );

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                {/* Order metadata */}
                <div className="grid gap-5 border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-6 lg:grid-cols-[1.1fr_1fr_0.8fr_0.8fr_auto] lg:items-center">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Order placed
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-500" />

                      <p className="text-sm font-bold text-slate-950">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <p className="mt-1 pl-6 text-xs text-slate-500">
                      {formatTime(order.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Order number
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-slate-950">
                      {getOrderNumber(order.id)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Total
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-slate-950">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Ship to
                    </p>

                    <p className="mt-1.5 truncate text-sm font-bold text-slate-950">
                      {order.shippingName || "Customer"}
                    </p>
                  </div>

                  <div className="lg:text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${orderStatus.badgeClass}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {orderStatus.label}
                    </span>
                  </div>
                </div>

                {/* Order content */}
                <div className="grid gap-6 px-5 py-5 sm:px-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="min-w-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Product thumbnails */}
                      <div className="flex shrink-0 items-center gap-2">
                        {visibleItems.map((item) => {
                          const image =
                            item.variant?.imageUrl ||
                            item.product.imageUrl;

                          return (
                            <Link
                              key={item.id}
                              href={`/products/${item.product.slug}`}
                              className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition hover:border-slate-400"
                            >
                              {image ? (
                                <img
                                  src={image}
                                  alt={
                                    item.productName ||
                                    item.product.name
                                  }
                                  className="h-full w-full object-contain p-2"
                                />
                              ) : (
                                <Box className="h-7 w-7 text-slate-300" />
                              )}
                            </Link>
                          );
                        })}

                        {additionalItems > 0 && (
                          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
                            <span className="text-sm font-bold text-slate-700">
                              +{additionalItems}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Order description */}
                      <div className="min-w-0">
                        <h2 className="text-base font-bold text-slate-950">
                          {totalQuantity}{" "}
                          {totalQuantity === 1
                            ? "item"
                            : "items"}{" "}
                          in this order
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {orderStatus.description}
                        </p>

                        {order.trackingNumber && (
                          <p className="mt-2 truncate text-xs font-semibold text-blue-700">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status and actions */}
                  <div className="border-t border-slate-200 pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <StatusIcon className="h-4 w-4 text-amber-700" />
                        {orderStatus.label}
                      </div>

                      <div
                        className={`flex items-center gap-2 text-sm font-semibold ${paymentStatus.className}`}
                      >
                        <CreditCard className="h-4 w-4" />
                        {paymentStatus.label}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
                      >
                        View order details
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                      >
                        Manage order
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Package className="h-6 w-6" />
          </span>

          <h2 className="mt-5 text-lg font-bold text-slate-950">
            No orders found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            We could not find any orders matching your search or
            selected status.
          </p>

          <Link
            href="/account/orders"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"
          >
            View all orders
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </div>
  );
}