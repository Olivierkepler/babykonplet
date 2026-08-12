import { prisma } from "../../lib/prisma";

export async function getOrderForPayment(orderId: string) {
  const cleanOrderId = orderId.trim();

  console.log("Searching orderId in DB:", JSON.stringify(cleanOrderId));

  const order = await prisma.order.findUnique({
    where: { id: cleanOrderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payments: true,
      user: true,
    },
  });

  console.log("Order found in DB:", order);

  return order;
}

export async function createPaymentRecord(data: {
  orderId: string;
  provider: string;
  providerPaymentId?: string;
  amount: number;
  status:
    | "PENDING"
    | "AUTHORIZED"
    | "CAPTURED"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED";
}) {
  return prisma.payment.create({
    data,
  });
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus:
    | "PENDING"
    | "AUTHORIZED"
    | "CAPTURED"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED",
  orderStatus:
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
    | "REFUNDED"
) {
  return prisma.order.update({
    where: { id: orderId.trim() },
    data: {
      paymentStatus,
      status: orderStatus,
    },
  });
}