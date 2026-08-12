import {
    Check,
    Clock3,
    PackageCheck,
    PackageSearch,
    ShoppingBag,
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
  
  type Props = {
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
  };
  
  type ProgressStep = {
    key: "PLACED" | "PROCESSING" | "COMPLETED";
    title: string;
    description: string;
    icon: typeof ShoppingBag;
  };
  
  const progressSteps: ProgressStep[] = [
    {
      key: "PLACED",
      title: "Order placed",
      description: "We received your order.",
      icon: ShoppingBag,
    },
    {
      key: "PROCESSING",
      title: "Processing",
      description: "Your order is being prepared.",
      icon: PackageSearch,
    },
    {
      key: "COMPLETED",
      title: "Completed",
      description: "Your order has been fulfilled.",
      icon: PackageCheck,
    },
  ];
  
  function formatDateTime(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }
  
  function getCurrentStep(status: OrderStatus) {
    switch (status) {
      case "PENDING_PAYMENT":
        return 0;
  
      case "PAID":
      case "PROCESSING":
      case "PACKING":
      case "READY_TO_SHIP":
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return 1;
  
      case "DELIVERED":
      case "COMPLETED":
        return 2;
  
      case "CANCELLED":
      case "RETURN_REQUESTED":
      case "RETURNED":
      case "REFUNDED":
        return 0;
    }
  }
  
  function getStatusMessage(status: OrderStatus) {
    switch (status) {
      case "PENDING_PAYMENT":
        return {
          title: "Your order has been placed",
          description:
            "We received your order and are waiting for payment confirmation or processing.",
          className:
            "border-amber-200 bg-amber-50 text-amber-900",
          iconClassName: "bg-amber-100 text-amber-700",
          icon: Clock3,
        };
  
      case "PAID":
      case "PROCESSING":
      case "PACKING":
      case "READY_TO_SHIP":
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return {
          title: "Your order is being processed",
          description:
            "Payment has been confirmed and your items are being prepared.",
          className:
            "border-blue-200 bg-blue-50 text-blue-900",
          iconClassName: "bg-blue-100 text-blue-700",
          icon: PackageSearch,
        };
  
      case "DELIVERED":
      case "COMPLETED":
        return {
          title: "Your order is complete",
          description:
            "This order has been successfully fulfilled.",
          className:
            "border-emerald-200 bg-emerald-50 text-emerald-900",
          iconClassName: "bg-emerald-100 text-emerald-700",
          icon: PackageCheck,
        };
  
      case "CANCELLED":
        return {
          title: "This order was cancelled",
          description:
            "No further processing will take place for this order.",
          className:
            "border-slate-200 bg-slate-50 text-slate-900",
          iconClassName: "bg-slate-200 text-slate-700",
          icon: XCircle,
        };
  
      case "RETURN_REQUESTED":
      case "RETURNED":
      case "REFUNDED":
        return {
          title: "This order could not be completed",
          description:
            "There was a problem processing this order or its payment.",
          className:
            "border-red-200 bg-red-50 text-red-900",
          iconClassName: "bg-red-100 text-red-700",
          icon: XCircle,
        };
    }
  }
  
  export default function OrderProgress({
    status,
    createdAt,
    updatedAt,
  }: Props) {
    const currentStep = getCurrentStep(status);
    const statusMessage = getStatusMessage(status);
    const StatusMessageIcon = statusMessage.icon;
  
    const isStopped =
      status === "CANCELLED" ||
      status === "RETURN_REQUESTED" ||
      status === "RETURNED" ||
      status === "REFUNDED";
  
    return (
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <h2 className="text-lg font-bold text-slate-950">
            Order progress
          </h2>
  
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Follow the current status of your order.
          </p>
        </div>
  
        <div className="p-5 sm:p-6">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${statusMessage.className}`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${statusMessage.iconClassName}`}
            >
              <StatusMessageIcon className="h-5 w-5" />
            </span>
  
            <div>
              <h3 className="text-sm font-bold">
                {statusMessage.title}
              </h3>
  
              <p className="mt-1 text-sm leading-6 opacity-80">
                {statusMessage.description}
              </p>
  
              <p className="mt-2 text-xs font-semibold opacity-70">
                Last updated {formatDateTime(updatedAt)}
              </p>
            </div>
          </div>
  
          <div className="mt-8">
            {/* Desktop progress */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute left-[16.66%] right-[16.66%] top-5 h-0.5 bg-slate-200" />
  
                {!isStopped ? (
                  <div
                    className="absolute left-[16.66%] top-5 h-0.5 bg-emerald-500 transition-all"
                    style={{
                      width:
                        currentStep === 0
                          ? "0%"
                          : currentStep === 1
                            ? "33.34%"
                            : "66.68%",
                    }}
                  />
                ) : null}
  
                <div className="relative grid grid-cols-3 gap-4">
                  {progressSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const completed =
                      !isStopped && index < currentStep;
                    const active =
                      !isStopped && index === currentStep;
                    const disabled =
                      isStopped || index > currentStep;
  
                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center text-center"
                      >
                        <span
                          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                            completed
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : active
                                ? "border-amber-400 bg-amber-400 text-slate-950"
                                : disabled
                                  ? "border-slate-200 bg-white text-slate-400"
                                  : "border-slate-300 bg-white text-slate-600"
                          }`}
                        >
                          {completed ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <StepIcon className="h-5 w-5" />
                          )}
                        </span>
  
                        <h3
                          className={`mt-3 text-sm font-bold ${
                            completed || active
                              ? "text-slate-950"
                              : "text-slate-400"
                          }`}
                        >
                          {step.title}
                        </h3>
  
                        <p
                          className={`mt-1 max-w-48 text-xs leading-5 ${
                            completed || active
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          {step.description}
                        </p>
  
                        {index === 0 ? (
                          <p className="mt-2 text-xs font-semibold text-slate-500">
                            {formatDateTime(createdAt)}
                          </p>
                        ) : null}
  
                        {index === currentStep &&
                        currentStep > 0 &&
                        !isStopped ? (
                          <p className="mt-2 text-xs font-semibold text-slate-500">
                            {formatDateTime(updatedAt)}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
  
            {/* Mobile progress */}
            <div className="space-y-0 md:hidden">
              {progressSteps.map((step, index) => {
                const StepIcon = step.icon;
                const completed =
                  !isStopped && index < currentStep;
                const active =
                  !isStopped && index === currentStep;
                const disabled =
                  isStopped || index > currentStep;
                const isLast =
                  index === progressSteps.length - 1;
  
                return (
                  <div
                    key={step.key}
                    className="relative flex gap-4"
                  >
                    {!isLast ? (
                      <div className="absolute left-5 top-10 h-[calc(100%-1rem)] w-0.5 bg-slate-200">
                        {completed ? (
                          <div className="h-full w-full bg-emerald-500" />
                        ) : null}
                      </div>
                    ) : null}
  
                    <div className="relative z-10 shrink-0">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          completed
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : active
                              ? "border-amber-400 bg-amber-400 text-slate-950"
                              : disabled
                                ? "border-slate-200 bg-white text-slate-400"
                                : "border-slate-300 bg-white text-slate-600"
                        }`}
                      >
                        {completed ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </span>
                    </div>
  
                    <div
                      className={`min-w-0 ${
                        isLast ? "pb-0" : "pb-8"
                      }`}
                    >
                      <h3
                        className={`text-sm font-bold ${
                          completed || active
                            ? "text-slate-950"
                            : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </h3>
  
                      <p
                        className={`mt-1 text-sm leading-6 ${
                          completed || active
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        {step.description}
                      </p>
  
                      {index === 0 ? (
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {formatDateTime(createdAt)}
                        </p>
                      ) : null}
  
                      {index === currentStep &&
                      currentStep > 0 &&
                      !isStopped ? (
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {formatDateTime(updatedAt)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
  
            {isStopped ? (
              <div className="mt-7 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm leading-6 text-slate-600">
                  The normal order progress has stopped because this
                  order is{" "}
                  <span className="font-bold text-slate-900">
                    {status === "CANCELLED"
                      ? "cancelled"
                      : "closed"}
                  </span>
                  .
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }