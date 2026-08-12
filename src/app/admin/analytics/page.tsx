import Link from "next/link";
import { prisma } from "../../../lib/prisma";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

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

export default async function AdminAnalyticsPage() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const endOfYesterday = new Date(startOfToday);

  const startOfLast7Days = new Date(startOfToday);
  startOfLast7Days.setDate(startOfLast7Days.getDate() - 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayOrders = orders.filter(
    (order) => order.createdAt >= startOfToday
  );

  const yesterdayOrders = orders.filter(
    (order) =>
      order.createdAt >= startOfYesterday && order.createdAt < endOfYesterday
  );

  const last7DaysOrders = orders.filter(
    (order) => order.createdAt >= startOfLast7Days
  );

  const monthOrders = orders.filter(
    (order) => order.createdAt >= startOfMonth
  );

  const todayRevenue = todayOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const yesterdayRevenue = yesterdayOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const last7DaysRevenue = last7DaysOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const monthRevenue = monthOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const totalItemsSold = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  const activeProducts = products.filter((p) => p.isActive).length;
  const inactiveProducts = products.filter((p) => !p.isActive).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);

  const pendingOrders = orders.filter((o) => o.status === "PENDING_PAYMENT").length;
  const fulfilledOrders = orders.filter((o) => o.status === "COMPLETED").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;
  const failedPayments = orders.filter(
    (o) => o.paymentStatus === "FAILED"
  ).length;
  const refundedPayments = orders.filter(
    (o) => o.paymentStatus === "REFUNDED"
  ).length;

  const topProducts = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  const recentOrders = orders.slice(0, 6);

  const averageOrderValue =
    orders.length > 0 ? Math.round(revenue / orders.length) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-green-600">
              Admin Dashboard / Analytics
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Store Analytics
            </h1>
            <p className="mt-2 text-slate-600">
              Monitor revenue, orders, product performance, and inventory health.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-lg hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
            <p className="text-sm font-bold text-slate-300">Total Revenue</p>
            <h2 className="mt-3 text-4xl font-black">
  {formatMoney(revenue)}
</h2>
            <p className="mt-3 text-sm text-green-300">Updated live</p>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-xl shadow-blue-100">
            <p className="text-sm font-black text-blue-700">Total Orders</p>
            <h2 className="mt-3 text-4xl font-black text-blue-700">
              {orders.length}
            </h2>
            <p className="mt-3 text-sm text-blue-600">
  Avg {formatMoney(averageOrderValue)}
</p>
          </div>

          <div className="rounded-3xl border border-green-100 bg-green-50 p-6 shadow-xl shadow-green-100">
            <p className="text-sm font-black text-green-700">Items Sold</p>
            <h2 className="mt-3 text-4xl font-black text-green-700">
              {totalItemsSold}
            </h2>
            <p className="mt-3 text-sm text-green-600">Across all orders</p>
          </div>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 shadow-xl shadow-red-100">
            <p className="text-sm font-black text-red-700">Out of Stock</p>
            <h2 className="mt-3 text-4xl font-black text-red-700">
              {outOfStock}
            </h2>
            <p className="mt-3 text-sm text-red-600">Needs attention</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-950">
              Sales History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Revenue and order activity by time period.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-sm font-black text-green-700">Today</p>
              <h3 className="mt-2 text-3xl font-black text-green-700">
  {formatMoney(todayRevenue)}
</h3>
              <p className="mt-2 text-sm text-green-600">
                {todayOrders.length} orders
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm font-black text-blue-700">Yesterday</p>
              <h3 className="mt-2 text-3xl font-black text-blue-700">
                {formatMoney(yesterdayRevenue)}
              </h3>
              <p className="mt-2 text-sm text-blue-600">
                {yesterdayOrders.length} orders
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5">
              <p className="text-sm font-black text-purple-700">
                Last 7 Days
              </p>
              <h3 className="mt-2 text-3xl font-black text-purple-700">
                {formatMoney(last7DaysRevenue)}
              </h3>
              <p className="mt-2 text-sm text-purple-600">
                {last7DaysOrders.length} orders
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-black text-slate-700">This Month</p>
              <h3 className="mt-2 text-3xl font-black text-slate-950">
                {formatMoney(monthRevenue)}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {monthOrders.length} orders
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-5">
          <div className="rounded-3xl border border-yellow-100 bg-yellow-50 p-5 shadow-sm">
            <p className="text-sm font-black text-yellow-700">Pending</p>
            <h3 className="mt-2 text-3xl font-black text-yellow-700">
              {pendingOrders}
            </h3>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-green-700">Fulfilled</p>
            <h3 className="mt-2 text-3xl font-black text-green-700">
              {fulfilledOrders}
            </h3>
          </div>

          <div className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-red-700">Cancelled</p>
            <h3 className="mt-2 text-3xl font-black text-red-700">
              {cancelledOrders}
            </h3>
          </div>

          <div className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-red-700">Failed Payments</p>
            <h3 className="mt-2 text-3xl font-black text-red-700">
              {failedPayments}
            </h3>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-purple-50 p-5 shadow-sm">
            <p className="text-sm font-black text-purple-700">Refunded</p>
            <h3 className="mt-2 text-3xl font-black text-purple-700">
              {refundedPayments}
            </h3>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Recent Orders
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest customer purchases and payment activity.
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="text-sm font-black text-green-600 hover:text-green-700"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  <div>
                    <p className="font-black text-slate-950">
                      #{order.id.slice(-8)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.user?.name || order.user?.email || "Customer"} •{" "}
                      {order.items.length} items
                    </p>
                  </div>

                  <div className="text-right">
                  <p className="font-black text-slate-950">
  {formatMoney(order.totalAmount)}
</p>
                    <div className="mt-1">
                      <Badge value={order.paymentStatus} />
                    </div>
                  </div>
                </Link>
              ))}

              {recentOrders.length === 0 && (
                <div className="rounded-2xl bg-slate-50 p-8 text-center">
                  <p className="font-black text-slate-900">No orders yet</p>
                  <p className="mt-2 text-sm text-slate-500">
                    New orders will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Top Products
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Products with highest inventory availability.
                </p>
              </div>

              <Link
                href="/admin/products"
                className="text-sm font-black text-green-600 hover:text-green-700"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-sm font-black text-green-700">
                    {index + 1}
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">N/A</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-slate-950">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {product.stock} in stock
                    </p>
                  </div>

                  <p className="font-black text-green-700">
  {formatMoney(product.price)}
</p>
                </div>
              ))}

              {topProducts.length === 0 && (
                <p className="text-sm text-slate-500">No products yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-xl font-black text-slate-950">
              Product Health Summary
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm font-black text-green-700">Active</p>
                <h3 className="mt-2 text-3xl font-black text-green-700">
                  {activeProducts}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-black text-slate-600">Inactive</p>
                <h3 className="mt-2 text-3xl font-black text-slate-950">
                  {inactiveProducts}
                </h3>
              </div>

              <div className="rounded-2xl bg-red-50 p-5">
                <p className="text-sm font-black text-red-700">Out of Stock</p>
                <h3 className="mt-2 text-3xl font-black text-red-700">
                  {outOfStock}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-xl font-black text-slate-950">
              Low Stock Products
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Products with 5 or fewer units remaining.
            </p>

            <div className="mt-5 space-y-3">
              {lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center justify-between rounded-2xl bg-red-50 p-4 hover:bg-red-100"
                >
                  <div>
                    <p className="font-black text-slate-950">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      {product.category || "No category"}
                    </p>
                  </div>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                    {product.stock} left
                  </span>
                </Link>
              ))}

              {lowStockProducts.length === 0 && (
                <div className="rounded-2xl bg-green-50 p-5 text-center">
                  <p className="font-black text-green-700">
                    Inventory looks healthy
                  </p>
                  <p className="mt-1 text-sm text-green-600">
                    No low-stock products right now.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}