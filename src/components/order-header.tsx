import {
    CalendarDays,
    CircleDollarSign,
    Clock3,
    PackageCheck,
    PackageSearch,
    Truck,
    XCircle,
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
  
  type PaymentStatus =
    | "PENDING"
    | "AUTHORIZED"
    | "CAPTURED"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED";
  
  type Props = {
    order: {
      id: string;
      status: OrderStatus;
      paymentStatus: PaymentStatus;
      createdAt: Date;
      updatedAt: Date;
      totalAmount: number;
      trackingNumber: string | null;
      itemCount: number;
    };
  };
  
  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }
  
  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }
  
  function getOrderNumber(id: string) {
    return `#${id.slice(-8).toUpperCase()}`;
  }
  
  function getOrderStatus(status: OrderStatus) {
    switch (status) {
      case "PENDING_PAYMENT":
        return {
          title: "Order Placed",
          color:
            "bg-amber-50 text-amber-700 border border-amber-200",
          icon: Clock3,
        };
  
      case "PAID":
      case "PROCESSING":
      case "PACKING":
      case "READY_TO_SHIP":
        return {
          title: "Processing",
          color:
            "bg-blue-50 text-blue-700 border border-blue-200",
          icon: PackageSearch,
        };

      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return {
          title: "Shipped",
          color:
            "bg-blue-50 text-blue-700 border border-blue-200",
          icon: Truck,
        };
  
      case "DELIVERED":
      case "COMPLETED":
        return {
          title: "Delivered",
          color:
            "bg-emerald-50 text-emerald-700 border border-emerald-200",
          icon: PackageCheck,
        };
  
      case "RETURN_REQUESTED":
      case "RETURNED":
      case "REFUNDED":
        return {
          title: "Returned",
          color:
            "bg-red-50 text-red-700 border border-red-200",
          icon: XCircle,
        };
  
      case "CANCELLED":
        return {
          title: "Cancelled",
          color:
            "bg-slate-100 text-slate-700 border border-slate-200",
          icon: XCircle,
        };
    }
  }
  
  function getPaymentStatus(status: PaymentStatus) {
    switch (status) {
      case "CAPTURED":
      case "AUTHORIZED":
        return "Paid";
  
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return "Refunded";
  
      case "FAILED":
        return "Failed";
  
      default:
        return "Pending";
    }
  }
  
  export default function OrderHeader({
    order,
  }: Props) {
    const status = getOrderStatus(order.status);
  
    const StatusIcon = status.icon;
  
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Order
              </p>
  
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                {getOrderNumber(order.id)}
              </h1>
  
              <p className="mt-2 text-sm text-slate-500">
                Placed on{" "}
                <span className="font-semibold text-slate-900">
                  {formatDate(order.createdAt)}
                </span>
              </p>
            </div>
  
            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${status.color}`}
            >
              <StatusIcon className="h-4 w-4" />
              {status.title}
            </div>
          </div>
        </div>
  
        {/* Summary */}
        <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarDays className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">
                Order Date
              </span>
            </div>
  
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {formatDate(order.createdAt)}
            </p>
          </div>
  
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <CircleDollarSign className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">
                Payment
              </span>
            </div>
  
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {getPaymentStatus(order.paymentStatus)}
            </p>
          </div>
  
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <PackageCheck className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">
                Items
              </span>
            </div>
  
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {order.itemCount}
            </p>
          </div>
  
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <Truck className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">
                Tracking
              </span>
            </div>
  
            <p className="mt-2 break-all text-sm font-semibold text-slate-900">
              {order.trackingNumber ?? "Not available"}
            </p>
          </div>
  
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <CircleDollarSign className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">
                Total
              </span>
            </div>
  
            <p className="mt-2 text-lg font-bold text-slate-950">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
        </div>
      </section>
    );
  }