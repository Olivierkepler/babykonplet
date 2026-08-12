import Link from "next/link";
import { prisma } from "../../../../lib/prisma";

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

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!customer) {
    return <main className="p-10">Customer not found</main>;
  }

  const totalSpent = customer.orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const totalItemsPurchased = customer.orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  const avgOrderValue =
    customer.orders.length > 0
      ? Math.round(totalSpent / customer.orders.length)
      : 0;

  const completedOrders = customer.orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  const pendingOrders = customer.orders.filter(
    (order) => order.status === "PENDING_PAYMENT"
  ).length;

  const cancelledOrders = customer.orders.filter(
    (order) => order.status === "CANCELLED"
  ).length;

  const failedOrders = customer.orders.filter(
    (order) => order.paymentStatus === "FAILED"
  ).length;

  const lastOrder = customer.orders[0];

  const initial =
    customer.name?.charAt(0).toUpperCase() ||
    customer.email.charAt(0).toUpperCase();

  const customerTier =
    totalSpent >= 50000
      ? "Gold Customer"
      : totalSpent >= 20000
      ? "Silver Customer"
      : totalSpent > 0
      ? "Bronze Customer"
      : "New Customer";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-green-600">
              Customers / Customer Details
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Customer Details
            </h1>
            <p className="mt-2 text-slate-600">
              View customer profile, order history, and total customer value.
            </p>
          </div>

          <Link
            href="/admin/customers"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-lg hover:bg-slate-50"
          >
            ← Back to Customers
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Customer Profile
            </p>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-black text-white">
                {initial}
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {customer.name || "No name"}
                </h2>
                <p className="text-slate-500">{customer.email}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                  Active Customer
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  {customerTier}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm text-slate-500">
                <p>Customer ID: #{customer.id.slice(-8)}</p>
                <p>Email: {customer.email}</p>
                <p>Phone: Not added yet</p>
                <p>Joined: {customer.createdAt.toLocaleDateString()}</p>
                <p>
                  Last Order:{" "}
                  {lastOrder ? lastOrder.createdAt.toLocaleDateString() : "Never"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-xl shadow-blue-100">
            <p className="text-xs font-black uppercase tracking-widest text-blue-700">
              Total Orders
            </p>
            <h2 className="mt-5 text-4xl font-black text-blue-700">
              {customer.orders.length}
            </h2>
            <p className="mt-3 text-sm font-medium text-blue-600">
              {customer.orders.length === 0
                ? "New customer"
                : "Orders placed"}
            </p>
          </div>

          <div className="rounded-3xl border border-green-100 bg-green-50 p-6 shadow-xl shadow-green-100">
            <p className="text-xs font-black uppercase tracking-widest text-green-700">
              Total Spent
            </p>
            <h2 className="mt-5 text-4xl font-black text-green-700">
              {formatMoney(totalSpent)}
            </h2>
            <p className="mt-3 text-sm font-medium text-green-600">
              {totalSpent === 0 ? "No purchases yet" : "Lifetime value"}
            </p>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-purple-50 p-6 shadow-xl shadow-purple-100">
            <p className="text-xs font-black uppercase tracking-widest text-purple-700">
              Avg Order Value
            </p>
            <h2 className="mt-5 text-4xl font-black text-purple-700">
              {formatMoney(avgOrderValue)}
            </h2>
            <p className="mt-3 text-sm font-medium text-purple-600">
              {avgOrderValue === 0 ? "No order average yet" : "Per order average"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-slate-500">
              Products Purchased
            </p>
            <h3 className="mt-2 text-3xl font-black text-slate-950">
              {totalItemsPurchased}
            </h3>
          </div>

          <div className="rounded-3xl border border-green-100 bg-green-50 p-5 shadow-sm">
            <p className="text-sm font-black text-green-700">
              Completed Orders
            </p>
            <h3 className="mt-2 text-3xl font-black text-green-700">
              {completedOrders}
            </h3>
          </div>

          <div className="rounded-3xl border border-yellow-100 bg-yellow-50 p-5 shadow-sm">
            <p className="text-sm font-black text-yellow-700">
              Pending Orders
            </p>
            <h3 className="mt-2 text-3xl font-black text-yellow-700">
              {pendingOrders}
            </h3>
          </div>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-5 shadow-sm">
            <p className="text-sm font-black text-red-700">
              Failed / Cancelled
            </p>
            <h3 className="mt-2 text-3xl font-black text-red-700">
              {failedOrders + cancelledOrders}
            </h3>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-xl font-black text-slate-950">
              Order History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Complete list of orders placed by this customer.
            </p>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {customer.orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <p className="font-black text-slate-950">
                      #{order.id.slice(-8)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{order.id}</p>
                  </td>

                  <td className="px-6 py-5 font-black text-slate-950">
                    {formatMoney(order.totalAmount)}
                  </td>

                  <td className="px-6 py-5">
                    {order.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <Badge value={order.status} />
                  </td>

                  <td className="px-6 py-5">
                    <Badge value={order.paymentStatus} />
                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {order.createdAt.toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="rounded-xl border border-blue-200 px-4 py-2 text-xs font-black text-blue-600 hover:bg-blue-50"
                    >
                      View Order
                    </Link>
                  </td>
                </tr>
              ))}

              {customer.orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-2xl">
                      📦
                    </div>

                    <p className="mt-4 text-lg font-black text-slate-900">
                      No orders yet
                    </p>

                    <p className="mt-2 text-slate-500">
                      This customer has not made a purchase yet.
                    </p>

                    <Link
                      href="/products"
                      className="mt-5 inline-block rounded-xl border border-green-200 px-5 py-3 text-sm font-black text-green-700 hover:bg-green-50"
                    >
                      View Products →
                    </Link>
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