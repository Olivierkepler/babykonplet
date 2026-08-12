import Link from "next/link";
import { prisma } from "../../../lib/prisma";

function Badge({ value }: { value: string }) {
  const style =
    value === "PAID" ||
    value === "CAPTURED" ||
    value === "AUTHORIZED" ||
    value === "COMPLETED" ||
    value === "DELIVERED" ||
    value === "FULFILLED"
      ? "bg-green-100 text-green-700"
      : value === "FAILED" ||
          value === "CANCELLED" ||
          value === "REFUNDED" ||
          value === "RETURNED" ||
          value === "RETURN_REQUESTED" ||
          value === "PARTIALLY_REFUNDED"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {value}
    </span>
  );
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    payment?: string;
  }>;
}) {
  const { search = "", status = "all", payment = "all" } = await searchParams;

  const orders = await prisma.order.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { id: { contains: search, mode: "insensitive" } },
                {
                  trackingNumber: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  shippingName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  shippingPhone: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  user: {
                    OR: [
                      {
                        name: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                      {
                        email: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                    ],
                  },
                },
              ],
            }
          : {},
        status !== "all"
          ? {
              status: status as
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
                | "REFUNDED",
            }
          : {},
        payment !== "all"
          ? {
              paymentStatus: payment as
                | "PENDING"
                | "AUTHORIZED"
                | "CAPTURED"
                | "FAILED"
                | "REFUNDED"
                | "PARTIALLY_REFUNDED",
            }
          : {},
      ],
    },
    include: {
      user: true,
      items: true,
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allOrders = await prisma.order.findMany();

  const revenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pending = allOrders.filter((o) => o.status === "PENDING_PAYMENT").length;
  const failed = allOrders.filter((o) => o.paymentStatus === "FAILED").length;
  const refunded = allOrders.filter((o) => o.paymentStatus === "REFUNDED").length;

  const statusFilters = [
    { label: "All", value: "all" },
    { label: "Pending", value: "PENDING_PAYMENT" },
    { label: "Fulfilled", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const paymentFilters = [
    { label: "All Payments", value: "all" },
    { label: "Payment Pending", value: "PENDING" },
    { label: "Paid", value: "CAPTURED" },
    { label: "Failed", value: "FAILED" },
    { label: "Refunded", value: "REFUNDED" },
  ];

  function buildUrl(next: {
    search?: string;
    status?: string;
    payment?: string;
  }) {
    const params = new URLSearchParams();

    const nextSearch = next.search ?? search;
    const nextStatus = next.status ?? status;
    const nextPayment = next.payment ?? payment;

    if (nextSearch) params.set("search", nextSearch);
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    if (nextPayment && nextPayment !== "all") params.set("payment", nextPayment);

    return `/admin/orders?${params.toString()}`;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 px-8 pt-24 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black text-green-600">
              Admin Dashboard / Orders
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Order Management
            </h1>

            <p className="mt-2 text-slate-600">
              Track orders, customer shipping details, payment status, notes, and fulfillment.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-lg hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-sm font-bold text-slate-500">Total Orders</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              {allOrders.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-xl shadow-green-100">
            <p className="text-sm font-black text-green-700">Revenue</p>
            <h2 className="mt-3 text-3xl font-black text-green-700">
              {formatMoney(revenue)}
            </h2>
          </div>

          <div className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-xl shadow-yellow-100">
            <p className="text-sm font-black text-yellow-700">Pending</p>
            <h2 className="mt-3 text-3xl font-black text-yellow-700">
              {pending}
            </h2>
          </div>

          <div className="rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 to-rose-50 p-6 shadow-xl shadow-red-100">
            <p className="text-sm font-black text-red-700">Failed</p>
            <h2 className="mt-3 text-3xl font-black text-red-700">
              {failed}
            </h2>
          </div>

          <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-xl shadow-purple-100">
            <p className="text-sm font-black text-purple-700">Refunded</p>
            <h2 className="mt-3 text-3xl font-black text-purple-700">
              {refunded}
            </h2>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <form className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search by order ID, customer, email, phone, tracking..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium outline-none focus:border-green-500 focus:bg-white lg:max-w-xl"
            />

            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="payment" value={payment} />

            <div className="flex gap-3">
              <button className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800">
                Search
              </button>

              <Link
                href="/admin/orders"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Reset
              </Link>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <Link
                key={filter.value}
                href={buildUrl({ status: filter.value })}
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  status === filter.value
                    ? "bg-green-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {paymentFilters.map((filter) => (
              <Link
                key={filter.value}
                href={buildUrl({ payment: filter.value })}
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  payment === filter.value
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5">
            <h2 className="text-xl font-black text-slate-950">Recent Orders</h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {orders.length} matching orders.
            </p>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Shipping</th>
                <th className="px-6 py-4">Tracking</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <p className="font-black text-slate-950">
                      #{order.id.slice(-8)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {order.createdAt.toLocaleDateString()}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900">
                      {order.user?.name || order.shippingName || "Customer"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.user?.email || "-"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    {order.shippingAddress ? (
                      <div>
                        <p className="font-bold text-slate-800">
                          {order.shippingName || "Shipping Name"}
                        </p>
                        <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                          {order.shippingAddress}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {order.shippingCity || "-"} {order.shippingState || ""}{" "}
                          {order.shippingZip || ""}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        Not added
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    {order.trackingNumber ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                        {order.trackingNumber}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        Not added
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5 font-black text-slate-950">
                    {formatMoney(order.totalAmount)}
                  </td>

                  <td className="px-6 py-5">
                    <Badge value={order.status} />
                  </td>

                  <td className="px-6 py-5">
                    <Badge value={order.paymentStatus} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="rounded-xl border border-blue-200 px-4 py-2 text-xs font-black text-blue-600 hover:bg-blue-50"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <p className="text-lg font-black text-slate-900">
                      No orders found
                    </p>
                    <p className="mt-2 text-slate-500">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}