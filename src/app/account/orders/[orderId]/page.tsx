import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Headphones,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";

import OrderActions from "../../../../components/order-actions";
import OrderHeader from "../../../../components/order-header";
import OrderItems from "../../../../components/order-items";
import OrderProgress from "../../../../components/order-progress";
import OrderSummary from "../../../../components/order-summary";
import PaymentCard from "../../../../components/payment-card";
import ShippingCard from "../../../../components/shipping-card";

type OrderDetailsPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id?: string }).id;

  if (!userId) {
    redirect("/login");
  }

  const { orderId } = await params;

  if (!orderId?.trim()) {
    notFound();
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
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

      payments: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          provider: true,
          providerPaymentId: true,
          amount: true,
          createdAt: true,
          updatedAt: true,
        },
      },

      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const latestPayment = order.payments[0] ?? null;

  const totalQuantity = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const itemsSubtotal = order.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  const canCancel =
    order.status === "PENDING_PAYMENT" || order.status === "PAID";

  const canBuyAgain =
    order.status === "COMPLETED" ||
    order.status === "CANCELLED" ||
    order.status === "REFUNDED";

  const canTrack =
    Boolean(order.trackingNumber) &&
    (order.status === "PAID" ||
      order.status === "PROCESSING" ||
      order.status === "PACKING" ||
      order.status === "READY_TO_SHIP" ||
      order.status === "SHIPPED" ||
      order.status === "OUT_FOR_DELIVERY" ||
      order.status === "DELIVERED" ||
      order.status === "COMPLETED");

  return (
    <div className="space-y-4">
      {/* Back navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </Link>

        <Link
          href="/account/help"
          className="hidden items-center gap-2 text-sm font-semibold text-blue-700 hover:underline sm:inline-flex"
        >
          <Headphones className="h-4 w-4" />
          Need help?
        </Link>
      </div>

      {/* Main order heading */}
      <OrderHeader
        order={{
          id: order.id,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          totalAmount: order.totalAmount,
          trackingNumber: order.trackingNumber,
          itemCount: totalQuantity,
          paymentStatus:
            latestPayment?.status ?? order.paymentStatus,
        }}
      />

      {/* Order lifecycle */}
      <OrderProgress
        status={order.status}
        createdAt={order.createdAt}
        updatedAt={order.updatedAt}
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        {/* Main column */}
        <main className="min-w-0 space-y-4">
          <OrderItems
            orderId={order.id}
            orderStatus={order.status}
            items={order.items.map((item) => ({
              id: item.id,
              productId: item.product.id,
              productName:
                item.productName || item.product.name,
              productSlug: item.product.slug,
              productImage:
                item.variant?.imageUrl ||
                item.product.imageUrl ||
                null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              size: item.size,
              color: item.color,
              sku: item.sku,
            }))}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <ShippingCard
              shipping={{
                name:
                  order.shippingName ||
                  order.user.name ||
                  "Customer",
                email: order.user.email || "",
                phone:
                  order.shippingPhone ||
                  order.user.phone ||
                  "",
                addressLine1: order.shippingAddress,
                addressLine2: null,
                city: order.shippingCity,
                state: order.shippingState,
                postalCode: order.shippingZip,
                country: null,
                trackingNumber: order.trackingNumber,
                carrier: null,
              }}
            />

            <PaymentCard
              payment={
                latestPayment
                  ? {
                      status: latestPayment.status,
                      provider: latestPayment.provider,
                      transactionId:
                        latestPayment.providerPaymentId,
                      amount: latestPayment.amount,
                      createdAt: latestPayment.createdAt,
                    }
                  : {
                      status: order.paymentStatus,
                      provider: null,
                      transactionId: null,
                      amount: order.totalAmount,
                      createdAt: order.createdAt,
                    }
              }
            />
          </div>
        </main>

        {/* Sidebar */}
        <aside className="space-y-4 xl:sticky xl:top-24">
          <OrderSummary
            subtotal={itemsSubtotal}
            discountAmount={0}
            shippingAmount={0}
            taxAmount={Math.max(
              order.totalAmount - itemsSubtotal,
              0
            )}
            totalAmount={order.totalAmount}
            currency="USD"
          />

          <OrderActions
            orderId={order.id}
            orderStatus={order.status}
            canCancel={canCancel}
            canTrack={canTrack}
            canBuyAgain={canBuyAgain}
          />

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </span>

              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Purchase protection
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your payment and account information are securely
                  protected.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 border-t border-slate-200 pt-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <LockKeyhole className="h-5 w-5" />
              </span>

              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Secure order
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Sensitive payment information is never displayed on
                  this page.
                </p>
              </div>
            </div>
          </section>

          {order.status === "COMPLETED" ? (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                <div>
                  <h2 className="text-sm font-bold text-emerald-950">
                    Order completed
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    This order has been successfully fulfilled.
                  </p>
                </div>
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}