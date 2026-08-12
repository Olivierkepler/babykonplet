import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";

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

async function markFulfilled(orderId: string) {
  "use server";

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "COMPLETED" },
  });

  redirect(`/admin/orders/${orderId}`);
}

async function cancelOrder(orderId: string) {
  "use server";

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  redirect(`/admin/orders/${orderId}`);
}

async function updateShipping(orderId: string, formData: FormData) {
  "use server";

  await prisma.order.update({
    where: { id: orderId },
    data: {
      shippingName: String(formData.get("shippingName") || "").trim() || null,
      shippingPhone: String(formData.get("shippingPhone") || "").trim() || null,
      shippingAddress:
        String(formData.get("shippingAddress") || "").trim() || null,
      shippingCity: String(formData.get("shippingCity") || "").trim() || null,
      shippingState: String(formData.get("shippingState") || "").trim() || null,
      shippingZip: String(formData.get("shippingZip") || "").trim() || null,
    },
  });

  redirect(`/admin/orders/${orderId}`);
}

async function updateTracking(orderId: string, formData: FormData) {
  "use server";

  await prisma.order.update({
    where: { id: orderId },
    data: {
      trackingNumber:
        String(formData.get("trackingNumber") || "").trim() || null,
    },
  });

  redirect(`/admin/orders/${orderId}`);
}

async function updateNotes(orderId: string, formData: FormData) {
  "use server";

  await prisma.order.update({
    where: { id: orderId },
    data: {
      notes: String(formData.get("notes") || "").trim() || null,
    },
  });

  redirect(`/admin/orders/${orderId}`);
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
      payments: true,
    },
  });

  if (!order) {
    return <main className="p-10">Order not found</main>;
  }

  const orderDate = order.createdAt.toLocaleDateString();
  const orderTime = order.createdAt.toLocaleTimeString();

  const customerInitial =
    order.user?.name?.charAt(0).toUpperCase() ||
    order.user?.email?.charAt(0).toUpperCase() ||
    "C";

  const isFulfilled = order.status === "COMPLETED";
  const isCancelled = order.status === "CANCELLED";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 px-8 pt-28 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-green-600">
                Admin Dashboard / Orders / #{order.id.slice(-8)}
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                Order Details
              </h1>

              <p className="mt-2 text-slate-600">
                Manage shipping, tracking, notes, payment, and fulfillment.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-lg hover:bg-slate-50"
            >
              ← Back to Orders
            </Link>
          </div>

          <div
            className={`mt-6 rounded-2xl px-5 py-4 ${
              isFulfilled
                ? "bg-green-50 text-green-700"
                : isCancelled
                ? "bg-red-50 text-red-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            <p className="font-black">
              {isFulfilled
                ? "✓ This order has been fulfilled."
                : isCancelled
                ? "× This order has been cancelled."
                : "This order is still pending fulfillment."}
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-sm font-bold text-slate-500">Order Number</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              #{order.id.slice(-8)}
            </h2>
            <p className="mt-2 text-xs text-slate-400">Internal order ID</p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
            <p className="text-sm font-bold text-slate-300">Order Total</p>
            <h2 className="mt-3 text-3xl font-black">
              {formatMoney(order.totalAmount)}
            </h2>
            <p className="mt-2 text-xs text-slate-400">Final order value</p>
          </div>

          <div className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-xl shadow-yellow-100">
            <p className="text-sm font-black text-yellow-700">Order Status</p>
            <div className="mt-4">
              <Badge value={order.status} />
            </div>
          </div>

          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-xl shadow-blue-100">
            <p className="text-sm font-black text-blue-700">Payment Status</p>
            <div className="mt-4">
              <Badge value={order.paymentStatus} />
            </div>
          </div>

          <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-xl shadow-purple-100">
            <p className="text-sm font-black text-purple-700">Order Date</p>
            <h2 className="mt-3 text-lg font-black text-slate-950">
              {orderDate}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {orderTime}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-7 py-6">
                <h2 className="text-2xl font-black text-slate-950">
                  Order Items
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Products purchased in this order.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-5 px-7 py-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            N/A
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-lg font-black text-slate-950">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Unit Price: {formatMoney(item.unitPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-slate-950">
                        {formatMoney(item.quantity * item.unitPrice)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">Line total</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="h-fit rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Order Timeline
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track the progress of this order.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700">
                    ✓
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Order created</p>
                    <p className="text-sm text-slate-500">
                      {orderDate} at {orderTime}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      order.paymentStatus === "CAPTURED"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    $
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Payment status</p>
                    <p className="text-sm text-slate-500">
                      Current payment status is {order.paymentStatus}.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status === "COMPLETED"
                      ? "✓"
                      : order.status === "CANCELLED"
                      ? "×"
                      : "!"}
                  </div>
                  <div>
                    <p className="font-black text-slate-900">
                      Fulfillment status
                    </p>
                    <p className="text-sm text-slate-500">
                      Current order status is {order.status}.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    #
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Tracking</p>
                    <p className="text-sm text-slate-500">
                      {order.trackingNumber || "Tracking number not assigned."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <details className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <summary className="cursor-pointer text-2xl font-black text-slate-950">
                Edit Shipping Address
              </summary>

              <p className="mt-2 text-sm text-slate-500">
                Add or update customer delivery information.
              </p>

              <form
                action={updateShipping.bind(null, order.id)}
                className="mt-6 grid gap-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    name="shippingName"
                    defaultValue={order.shippingName || ""}
                    placeholder="Full name"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />

                  <input
                    name="shippingPhone"
                    defaultValue={order.shippingPhone || ""}
                    placeholder="Phone number"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />
                </div>

                <textarea
                  name="shippingAddress"
                  defaultValue={order.shippingAddress || ""}
                  placeholder="Full shipping address"
                  rows={3}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <input
                    name="shippingCity"
                    defaultValue={order.shippingCity || ""}
                    placeholder="City"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />

                  <input
                    name="shippingState"
                    defaultValue={order.shippingState || ""}
                    placeholder="State"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />

                  <input
                    name="shippingZip"
                    defaultValue={order.shippingZip || ""}
                    placeholder="Zip code"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />
                </div>

                <button className="w-fit rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800">
                  Save Shipping
                </button>
              </form>
            </details>

            <details className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <summary className="cursor-pointer text-2xl font-black text-slate-950">
                Edit Order Notes
              </summary>

              <p className="mt-2 text-sm text-slate-500">
                Internal notes for this order.
              </p>

              <form
                action={updateNotes.bind(null, order.id)}
                className="mt-6 grid gap-4"
              >
                <textarea
                  name="notes"
                  defaultValue={order.notes || ""}
                  placeholder="Add notes about delivery, customer request, or admin follow-up..."
                  rows={5}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                />

                <button className="w-fit rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800">
                  Save Notes
                </button>
              </form>
            </details>
          </div>

          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Customer Information
              </h2>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-black text-white">
                    {customerInitial}
                  </div>

                  <div>
                    <p className="text-lg font-black text-slate-950">
                      {order.user?.name || "Customer"}
                    </p>
                    <p className="text-sm font-medium text-slate-500">
                      {order.user?.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm">
                  <div className="flex justify-between border-t border-slate-100 pt-3">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-bold text-slate-700">
                      {order.shippingPhone || "Not Available"}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-slate-100 pt-3">
                    <span className="text-slate-500">Customer ID</span>
                    <span className="font-bold text-slate-700">
                      {order.user?.id.slice(-8) || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Shipping Information
              </h2>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="font-black text-slate-950">
                  {order.shippingName || "Not Added"}
                </p>
                <p className="mt-2 text-slate-600">
                  {order.shippingPhone || "No phone"}
                </p>
                <p className="mt-2 text-slate-600">
                  {order.shippingAddress || "Address not added"}
                </p>
                <p className="text-slate-600">
                  {order.shippingCity || ""} {order.shippingState || ""}{" "}
                  {order.shippingZip || ""}
                </p>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Tracking Number
                  </p>
                  <p className="mt-1 font-black text-slate-950">
                    {order.trackingNumber || "Not assigned"}
                  </p>
                </div>
              </div>

              <form
                action={updateTracking.bind(null, order.id)}
                className="mt-5 grid gap-3"
              >
                <input
                  name="trackingNumber"
                  defaultValue={order.trackingNumber || ""}
                  placeholder="Enter tracking number"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                />

                <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800">
                  Save Tracking
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Items</span>
                  <span className="font-black">{order.items.length}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-black">
                    {formatMoney(order.totalAmount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-black">$0</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Tax</span>
                  <span className="font-black">$0</span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
                  <span className="font-black text-slate-950">Total</span>
                  <span className="font-black text-slate-950">
                    {formatMoney(order.totalAmount)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Payment Details
              </h2>

              {order.payments.length > 0 ? (
                order.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-black text-slate-950">
                        {payment.provider}
                      </p>
                      <Badge value={payment.status} />
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      Amount: {formatMoney(payment.amount)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Payment ID: {payment.providerPaymentId || "-"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-black text-blue-700">
                    No payment record yet.
                  </p>
                  <p className="mt-1 text-xs text-blue-600">
                    This will update after Stripe is connected.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Order Actions
              </h2>

              {isFulfilled ? (
                <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-black text-green-700">
                  ✓ Order completed successfully.
                </div>
              ) : isCancelled ? (
                <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-black text-red-700">
                  × This order has been cancelled.
                </div>
              ) : (
                <>
                  <form
                    action={markFulfilled.bind(null, order.id)}
                    className="mt-4"
                  >
                    <button className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 font-black text-white hover:from-green-700 hover:to-emerald-700">
                      ✓ Mark Fulfilled
                    </button>
                  </form>

                  <form action={cancelOrder.bind(null, order.id)} className="mt-3">
                    <button className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-black text-red-600 hover:bg-red-100">
                      Cancel Order
                    </button>
                  </form>
                </>
              )}

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs leading-5 text-slate-500">
                  Refunds and payment verification will be enabled after Stripe
                  payment integration is added.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}