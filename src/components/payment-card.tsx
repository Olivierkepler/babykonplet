import {
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    CreditCard,
    Receipt,
    RefreshCcw,
    ShieldCheck,
    Wallet,
    XCircle,
  } from "lucide-react";
  
  type PaymentStatus =
    | "PENDING"
    | "AUTHORIZED"
    | "CAPTURED"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED";
  
  type Payment = {
    status: PaymentStatus;
    provider: string | null;
    transactionId: string | null;
    amount: number;
    createdAt: Date;
  };
  
  type Props = {
    payment: Payment;
  };
  
  function formatPrice(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
  
  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }
  
  function paymentInfo(status: PaymentStatus) {
    switch (status) {
      case "CAPTURED":
      case "AUTHORIZED":
        return {
          title: "Payment Successful",
          description: "Your payment has been securely processed.",
          badge: "Paid",
          icon: CheckCircle2,
          color:
            "bg-emerald-50 border-emerald-200 text-emerald-700",
        };
  
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return {
          title: "Payment Refunded",
          description: "A refund has been issued for this order.",
          badge: "Refunded",
          icon: RefreshCcw,
          color:
            "bg-purple-50 border-purple-200 text-purple-700",
        };
  
      case "FAILED":
        return {
          title: "Payment Failed",
          description: "The payment could not be completed.",
          badge: "Failed",
          icon: XCircle,
          color: "bg-red-50 border-red-200 text-red-700",
        };
  
      default:
        return {
          title: "Payment Pending",
          description:
            "We're waiting for payment confirmation.",
          badge: "Pending",
          icon: CircleDollarSign,
          color:
            "bg-amber-50 border-amber-200 text-amber-700",
        };
    }
  }
  
  export default function PaymentCard({
    payment,
  }: Props) {
    const status = paymentInfo(payment.status);
    const StatusIcon = status.icon;
  
    return (
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Payment Details
            </h2>
  
            <p className="mt-1 text-sm text-slate-500">
              Secure payment information
            </p>
          </div>
  
          <CreditCard className="h-6 w-6 text-slate-400" />
        </div>
  
        <div className="space-y-5 p-5 sm:p-6">
          {/* Status */}
          <div
            className={`rounded-xl border p-4 ${status.color}`}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                <StatusIcon className="h-5 w-5" />
              </span>
  
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold">
                    {status.title}
                  </h3>
  
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold">
                    {status.badge}
                  </span>
                </div>
  
                <p className="mt-2 text-sm leading-6 opacity-90">
                  {status.description}
                </p>
              </div>
            </div>
          </div>
  
          {/* Payment Summary */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Wallet className="h-4 w-4" />
              </span>
  
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment Method
                </p>
  
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {payment.provider || "Online Payment"}
                </p>
              </div>
            </div>
  
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <CircleDollarSign className="h-4 w-4" />
              </span>
  
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount Paid
                </p>
  
                <p className="mt-1 text-lg font-bold text-slate-950">
                  {formatPrice(payment.amount)}
                </p>
              </div>
            </div>
  
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Receipt className="h-4 w-4" />
              </span>
  
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Transaction ID
                </p>
  
                <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                  {payment.transactionId || "Not Available"}
                </p>
              </div>
            </div>
  
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <CalendarDays className="h-4 w-4" />
              </span>
  
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment Date
                </p>
  
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatDate(payment.createdAt)}
                </p>
              </div>
            </div>
          </div>
  
          {/* Security Notice */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </span>
  
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Secure Payment
                </h3>
  
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Your payment information is encrypted and securely
                  processed. Sensitive card details are never stored
                  or displayed.
                </p>
              </div>
            </div>
          </div>
  
          {/* Invoice Button */}
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            <Receipt className="h-4 w-4" />
            Download Invoice
          </button>
        </div>
      </section>
    );
  }