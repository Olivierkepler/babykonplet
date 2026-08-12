import { NextRequest, NextResponse } from "next/server";
import {
  createPaymentRecord,
  getOrderForPayment,
  updateOrderPaymentStatus,
} from "../../../../lib/db/payments";
import {
  squareAccessToken,
  squareBaseUrl,
  squareLocationId,
  squareVersion,
} from "../../../../lib/square/client";
import {
  formatAmountForSquare,
  generateIdempotencyKey,
} from "../../../../lib/square/helpers";

export async function POST(req: NextRequest) {
  try {
    if (!squareAccessToken || !squareLocationId) {
      return NextResponse.json(
        { success: false, error: "Square environment variables are missing" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const orderId = String(body.orderId || "").trim();
    const sourceId = String(body.sourceId || "").trim();

    console.log("Incoming orderId:", JSON.stringify(orderId));
    console.log("Incoming sourceId:", JSON.stringify(sourceId));

    if (!orderId || !sourceId) {
      return NextResponse.json(
        { success: false, error: "orderId and sourceId are required" },
        { status: 400 }
      );
    }

    const order = await getOrderForPayment(orderId);

    console.log("Fetched order:", order);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "CAPTURED") {
      return NextResponse.json(
        { success: false, error: "Order is already paid" },
        { status: 400 }
      );
    }

    if (order.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order has no items" },
        { status: 400 }
      );
    }

    const amount = formatAmountForSquare(order.totalAmount);

    const squareResponse = await fetch(`${squareBaseUrl}/v2/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${squareAccessToken}`,
        "Square-Version": squareVersion,
      },
      body: JSON.stringify({
        idempotency_key: generateIdempotencyKey(),
        source_id: sourceId,
        location_id: squareLocationId,
        amount_money: {
          amount,
          currency: "USD",
        },
        note: `Payment for order ${order.id}`,
      }),
    });

    const squareData = await squareResponse.json();

    if (!squareResponse.ok) {
      await createPaymentRecord({
        orderId: order.id,
        provider: "square",
        providerPaymentId: squareData?.payment?.id,
        amount: order.totalAmount,
        status: "FAILED",
      });

      await updateOrderPaymentStatus(order.id, "FAILED", "CANCELLED");

      const errorMessage =
        squareData?.errors
          ?.map((e: { detail?: string }) => e.detail)
          .filter(Boolean)
          .join(", ") || "Square payment failed";

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: squareData,
        },
        { status: 400 }
      );
    }

    await createPaymentRecord({
      orderId: order.id,
      provider: "square",
      providerPaymentId: squareData?.payment?.id,
      amount: order.totalAmount,
      status: "CAPTURED",
    });

    await updateOrderPaymentStatus(order.id, "CAPTURED", "PAID");

    return NextResponse.json({
      success: true,
      message: "Payment successful",
      payment: squareData.payment,
      orderId: order.id,
    });
  } catch (error) {
    console.error("POST /api/square/charge error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process payment",
      },
      { status: 500 }
    );
  }
}