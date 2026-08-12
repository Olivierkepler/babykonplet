import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Headphones,
  Heart,
  MapPin,
  Package,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  User,
} from "lucide-react";

import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  }

  if (currentHour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getOrderStatus(status: string) {
  switch (status) {
    case "COMPLETED":
    case "DELIVERED":
    case "FULFILLED":
      return {
        label: "Delivered",
        className: "bg-emerald-50 text-emerald-700",
      };

    case "PAID":
    case "PROCESSING":
    case "PACKING":
    case "READY_TO_SHIP":
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return {
        label: "Processing",
        className: "bg-blue-50 text-blue-700",
      };

    case "PENDING_PAYMENT":
    case "PENDING":
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700",
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-red-50 text-red-700",
      };

    case "RETURN_REQUESTED":
    case "RETURNED":
    case "REFUNDED":
    case "FAILED":
      return {
        label: "Failed",
        className: "bg-red-50 text-red-700",
      };

    default:
      return {
        label: status,
        className: "bg-slate-100 text-slate-700",
      };
  }
}

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id?: string }).id;

  if (!userId) {
    redirect("/login");
  }

  const [
    user,
    orderCount,
    recentOrders,
    recommendedProducts,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
      },
    }),

    prisma.order.count({
      where: {
        userId,
      },
    }),

    prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    }),

    prisma.product.findMany({
      where: {
        isActive: true,
        stock: {
          gt: 0,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        imageUrl: true,
        brand: true,
      },
    }),
  ]);

  const accountCards = [
    {
      title: "My Orders",
      value: orderCount,
      description: "Track and manage your purchases",
      linkLabel: "View all orders",
      href: "/account/orders",
      icon: Package,
      iconClassName: "bg-amber-50 text-amber-700",
    },
    {
      title: "Wishlist",
      value: 0,
      description: "Products saved for later",
      linkLabel: "View your wishlist",
      href: "/account/wishlist",
      icon: Heart,
      iconClassName: "bg-rose-50 text-rose-600",
    },
    {
      title: "Notifications",
      value: 0,
      description: "Order updates and messages",
      linkLabel: "View notifications",
      href: "/account/notifications",
      icon: Bell,
      iconClassName: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Saved Addresses",
      value: 0,
      description: "Manage delivery locations",
      linkLabel: "Manage addresses",
      href: "/account/addresses",
      icon: MapPin,
      iconClassName: "bg-blue-50 text-blue-700",
    },
  ];

  const quickActions = [
    {
      label: "Track Order",
      href: "/account/orders",
      icon: Truck,
    },
    {
      label: "Buy Again",
      href: "/account/orders",
      icon: RefreshCcw,
    },
    {
      label: "Your Wishlist",
      href: "/account/wishlist",
      icon: Heart,
    },
    {
      label: "Manage Addresses",
      href: "/account/addresses",
      icon: MapPin,
    },
    {
      label: "Payment Methods",
      href: "/account/profile",
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <section className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-[-0.025em] text-slate-950 sm:text-[30px]">
              {getGreeting()}, {user?.name || "Customer"}{" "}
              <span aria-hidden="true">👋</span>
            </h1>

            <p className="mt-2 max-w-3xl text-[15px] leading-6 text-slate-600">
              Manage your orders, profile information, saved products,
              delivery addresses, and account preferences.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/account/profile"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                <User className="h-4 w-4" />
                Manage Profile
              </Link>

              <Link
                href="/account/orders"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <Package className="h-4 w-4" />
                View Orders
              </Link>
            </div>
          </div>

          <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 xl:max-w-[290px]">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-950">
                  Account security
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Your account is protected
                </p>

                <Link
                  href="/account/profile"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
                >
                  Review account settings
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCOUNT SUMMARY */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {accountCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`rounded-xl p-2.5 ${card.iconClassName}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <span className="text-[28px] font-bold leading-none tracking-tight text-slate-950">
                  {card.value}
                </span>
              </div>

              <h2 className="mt-4 text-base font-bold text-slate-950">
                {card.title}
              </h2>

              <p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">
                {card.description}
              </p>

              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                {card.linkLabel}
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </section>

      {/* QUICK ACTIONS */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">
          Quick actions
        </h2>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="grid items-start gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        {/* RECENT ORDERS */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Recent orders
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Your latest purchases and updates
              </p>
            </div>

            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {recentOrders.map((order) => {
                const firstItem = order.items[0];

                const totalItems = order.items.reduce(
                  (total, item) => total + item.quantity,
                  0
                );

                const status = getOrderStatus(order.status);

                return (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      {firstItem?.product.imageUrl ? (
                        <img
                          src={firstItem.product.imageUrl}
                          alt={
                            firstItem.productName ||
                            firstItem.product.name
                          }
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-blue-700">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>

                      <p className="mt-0.5 truncate text-sm font-bold text-slate-950">
                        {firstItem?.productName ||
                          firstItem?.product.name ||
                          "Order items"}
                      </p>

                      <p className="mt-0.5 text-sm text-slate-500">
                        {totalItems}{" "}
                        {totalItems === 1 ? "item" : "items"} ·{" "}
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>

                      <p className="mt-1.5 text-xs text-slate-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <ShoppingBag className="h-5 w-5 text-slate-500" />
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-950">
                No orders yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your orders will appear here after your first purchase.
              </p>
            </div>
          )}

          <div className="border-t border-slate-200 px-4 py-3">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
            >
              View all orders
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* RECOMMENDED PRODUCTS */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Recommended for you
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Discover products you may like
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
            >
              See more
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4">
              {recommendedProducts.map((product, index) => (
                <article
                  key={product.id}
                  className={`flex min-w-0 flex-col p-3 ${
                    index % 2 === 0
                      ? "border-r border-slate-200"
                      : ""
                  } ${
                    index < 2
                      ? "border-b border-slate-200 md:border-b-0"
                      : ""
                  } ${
                    index < recommendedProducts.length - 1
                      ? "md:border-r md:border-slate-200"
                      : ""
                  }`}
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-slate-50"
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain p-2 transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-slate-300" />
                    )}
                  </Link>

                  {product.brand ? (
                    <p className="mt-2 truncate text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      {product.brand}
                    </p>
                  ) : null}

                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-1 line-clamp-2 min-h-10 text-[13px] font-semibold leading-5 text-slate-900 hover:text-blue-700"
                  >
                    {product.name}
                  </Link>

                  <div className="mt-auto pt-2">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <p className="text-sm font-bold text-slate-950">
                        {formatPrice(product.price)}
                      </p>

                      {product.originalPrice &&
                      product.originalPrice > product.price ? (
                        <p className="text-[11px] text-slate-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      ) : null}
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-2 inline-flex min-h-9 w-full items-center justify-center rounded-lg bg-amber-400 px-2 text-xs font-bold text-slate-950 transition hover:bg-amber-300"
                    >
                      View Product
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              Recommendations will appear when products are available.
            </div>
          )}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex gap-3 border-b border-slate-200 p-4 sm:border-r xl:border-b-0">
          <RotateCcw className="h-6 w-6 shrink-0 text-slate-800" />

          <div>
            <p className="text-sm font-bold text-slate-950">
              Easy returns
            </p>

            <p className="mt-0.5 text-sm text-slate-500">
              Convenient return options
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-b border-slate-200 p-4 xl:border-b-0 xl:border-r">
          <ShieldCheck className="h-6 w-6 shrink-0 text-slate-800" />

          <div>
            <p className="text-sm font-bold text-slate-950">
              Secure payments
            </p>

            <p className="mt-0.5 text-sm text-slate-500">
              Transactions are protected
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-b border-slate-200 p-4 sm:border-b-0 sm:border-r">
          <Headphones className="h-6 w-6 shrink-0 text-slate-800" />

          <div>
            <p className="text-sm font-bold text-slate-950">
              Customer support
            </p>

            <p className="mt-0.5 text-sm text-slate-500">
              Help whenever you need it
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-4">
          <Tag className="h-6 w-6 shrink-0 text-slate-800" />

          <div>
            <p className="text-sm font-bold text-slate-950">
              Exclusive deals
            </p>

            <p className="mt-0.5 text-sm text-slate-500">
              Special customer offers
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}