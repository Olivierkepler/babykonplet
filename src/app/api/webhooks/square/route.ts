import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const eventType = body?.type;
    const payment = body?.data?.object?.payment;

    if (!eventType || !payment) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    // STEP 1: Normalize incoming ID
    const providerPaymentId = String(payment.id || "").trim();

    console.log("Incoming ID:", JSON.stringify(providerPaymentId), providerPaymentId.length);

    // STEP 2: Fetch all payments
    const allPayments = await prisma.payment.findMany({
      select: {
        id: true,
        orderId: true,
        providerPaymentId: true,
        status: true,
      },
    });

    console.log(
      "All payment IDs:",
      allPayments.map((p) => ({
        id: p.id,
        providerPaymentId: JSON.stringify(String(p.providerPaymentId || "").trim()),
        length: String(p.providerPaymentId || "").trim().length,
      }))
    );

    // STEP 3: Normalize function (VERY IMPORTANT)
    const normalize = (value: string) =>
      value.trim().replace(/^"|"$/g, "");

    // STEP 4: Match manually (robust fix)
    const matchedPayment = allPayments.find(
      (p) =>
        normalize(String(p.providerPaymentId || "")) ===
        normalize(providerPaymentId)
    );

    console.log("Matched payment:", matchedPayment);

    if (!matchedPayment) {
      return NextResponse.json(
        { success: false, error: "Payment record not found" },
        { status: 404 }
      );
    }

    // STEP 5: Status mapping
    let newPaymentStatus:
      | "PENDING"
      | "AUTHORIZED"
      | "CAPTURED"
      | "FAILED"
      | "REFUNDED"
      | "PARTIALLY_REFUNDED" = "PENDING";
    let newOrderStatus:
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
      | "REFUNDED" = "PENDING_PAYMENT";

    if (payment.status === "COMPLETED") {
      newPaymentStatus = "CAPTURED";
      newOrderStatus = "PAID";
    } else if (payment.status === "FAILED" || payment.status === "CANCELED") {
      newPaymentStatus = "FAILED";
      newOrderStatus = "CANCELLED";
    }

    // STEP 6: Update Payment
    await prisma.payment.update({
      where: { id: matchedPayment.id },
      data: { status: newPaymentStatus },
    });

    // STEP 7: Update Order
    await prisma.order.update({
      where: { id: matchedPayment.orderId },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      routeVersion: "FINAL_FIXED_MATCH",
    });

  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}