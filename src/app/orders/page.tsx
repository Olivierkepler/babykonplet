import { PackageSearch, UserRound } from "lucide-react";
import Link from "next/link";
import { auth } from "../../auth";
import OrderCard from "../../components/orders/order-card";
import { prisma } from "../../lib/prisma";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-20">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <UserRound className="h-6 w-6" />
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
              Sign in to view your orders
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
              Your order history is available after signing in to your account.
            </p>

            <Link
              href="/login"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign In
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <PackageSearch className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Account
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Review your previous purchases and current order status.
              </p>
            </div>
          </div>
        </section>

        {orders.length > 0 ? (
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
              Products you purchase will appear here after your order is placed.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Start Shopping
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}