import Link from "next/link";
import { prisma } from "../../../lib/prisma";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
  }>;
}) {
  const { search = "" } = await searchParams;

  const customers = await prisma.user.findMany({
    where: search
      ? {
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
        }
      : {},
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allCustomers = await prisma.user.findMany({
    include: {
      orders: true,
    },
  });

  const totalCustomers = allCustomers.length;
  const customersWithOrders = allCustomers.filter(
    (customer) => customer.orders.length > 0
  ).length;

  const totalOrders = allCustomers.reduce(
    (sum, customer) => sum + customer.orders.length,
    0
  );

  const totalRevenue = allCustomers.reduce((sum, customer) => {
    const customerTotal = customer.orders.reduce(
      (orderSum, order) => orderSum + order.totalAmount,
      0
    );

    return sum + customerTotal;
  }, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 px-8 pt-28 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black text-green-600">
              Admin Dashboard / Customers
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Customer Management
            </h1>

            <p className="mt-2 text-slate-600">
              View registered customers, order activity, and total customer
              value.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-lg hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-sm font-bold text-slate-500">
              Total Customers
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              {totalCustomers}
            </h2>
          </div>

          <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-xl shadow-green-100">
            <p className="text-sm font-black text-green-700">
              Customers With Orders
            </p>
            <h2 className="mt-3 text-3xl font-black text-green-700">
              {customersWithOrders}
            </h2>
          </div>

          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-xl shadow-blue-100">
            <p className="text-sm font-black text-blue-700">Total Orders</p>
            <h2 className="mt-3 text-3xl font-black text-blue-700">
              {totalOrders}
            </h2>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
            <p className="text-sm font-bold text-slate-300">Customer Revenue</p>
            <h2 className="mt-3 text-3xl font-black">
              {formatMoney(totalRevenue)}
            </h2>
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <form className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search by customer name or email..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium outline-none focus:border-green-500 focus:bg-white lg:max-w-xl"
            />

            <div className="flex gap-3">
              <button className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800">
                Search
              </button>

              <Link
                href="/admin/customers"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-6 py-5">
            <h2 className="text-xl font-black text-slate-950">
              All Customers
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {customers.length} matching customers.
            </p>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Last Order</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => {
                const totalSpent = customer.orders.reduce(
                  (sum, order) => sum + order.totalAmount,
                  0
                );

                const lastOrder = customer.orders[0];

                const initial =
                  customer.name?.charAt(0).toUpperCase() ||
                  customer.email.charAt(0).toUpperCase();

                return (
                  <tr key={customer.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-sm font-black text-white">
                          {initial}
                        </div>

                        <div>
                          <p className="font-black text-slate-950">
                            {customer.name || "No name"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            #{customer.id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {customer.email}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                        {customer.orders.length}
                      </span>
                    </td>

                    <td className="px-6 py-5 font-black text-slate-950">
                      {formatMoney(totalSpent)}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {lastOrder ? lastOrder.createdAt.toLocaleDateString() : "-"}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {customer.createdAt.toLocaleDateString()}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="rounded-xl border border-blue-200 px-4 py-2 text-xs font-black text-blue-600 hover:bg-blue-50"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {customers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <p className="text-lg font-black text-slate-900">
                      No customers found
                    </p>
                    <p className="mt-2 text-slate-500">
                      Try changing your search.
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