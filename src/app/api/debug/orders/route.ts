import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      userId: true,
      totalAmount: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ orders });
}