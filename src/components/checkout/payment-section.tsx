"use client";

import { useRouter } from "next/navigation";

export default function PaymentSection() {
  const router = useRouter();

  const handleOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
    });

    const data = await res.json();

    if (data.success) {
      router.push("/orders");
    } else {
      alert(data.error || "Failed to place order");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>

      <div className="mt-6 space-y-4">
        <label className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-4">
          <input type="radio" name="paymentMethod" defaultChecked />
          <span className="text-sm font-medium text-slate-900">
            Credit / Debit Card
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-4">
          <input type="radio" name="paymentMethod" />
          <span className="text-sm font-medium text-slate-900">
            Cash on Delivery
          </span>
        </label>
      </div>

      <button
        onClick={handleOrder}
        className="mt-6 w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Place Order
      </button>
    </div>
  );
}