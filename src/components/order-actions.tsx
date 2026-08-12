"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Download,
  Loader2,
  MessageCircle,
  PackageSearch,
  Receipt,
  RefreshCcw,
  ShoppingCart,
  Trash2,
} from "lucide-react";

type OrderStatus =
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

type Props = {
  orderId: string;
  orderStatus: OrderStatus;
  canCancel: boolean;
  canTrack: boolean;
  canBuyAgain: boolean;
};

export default function OrderActions({
  orderId,
  orderStatus,
  canCancel,
  canTrack,
  canBuyAgain,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function cancelOrder() {
    if (
      !confirm(
        "Are you sure you want to cancel this order?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/orders/${orderId}/cancel`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      window.location.reload();
    } catch {
      alert("Unable to cancel order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-5">
        <h2 className="text-lg font-bold text-slate-950">
          Order Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage your order and access helpful tools.
        </p>
      </div>

      <div className="grid gap-3 p-5">
        {/* Track Package */}
        {canTrack && (
          <button
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <PackageSearch className="h-5 w-5" />
            Track Package
          </button>
        )}

        {/* Buy Again */}
        {canBuyAgain && (
          <Link
            href={`/cart?buyAgain=${orderId}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 text-sm font-bold text-slate-900 transition hover:bg-amber-300"
          >
            <ShoppingCart className="h-5 w-5" />
            Buy Again
          </Link>
        )}

        {/* Invoice */}
        <button className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
          <Receipt className="h-5 w-5" />
          View Invoice
        </button>

        <button className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
          <Download className="h-5 w-5" />
          Download Invoice
        </button>

        {/* Return */}
        {orderStatus === "COMPLETED" && (
          <button className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
            <RefreshCcw className="h-5 w-5" />
            Request Return
          </button>
        )}

        {/* Contact */}
        <Link
          href="/contact"
          className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          <MessageCircle className="h-5 w-5" />
          Contact Support
        </Link>

        {/* Cancel */}
        {canCancel && (
          <button
            onClick={cancelOrder}
            disabled={loading}
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                Cancel Order
              </>
            )}
          </button>
        )}

        {/* Back */}
        <Link
          href="/account/orders"
          className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Orders
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-center text-xs leading-5 text-slate-500">
          Need help with this order? Our support team is available to
          assist you with cancellations, returns, refunds, shipping,
          and product questions.
        </p>
      </div>
    </section>
  );
}