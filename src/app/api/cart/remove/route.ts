import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { removeItemFromCart } from "../../../../lib/db/cart";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "productId is required" },
        { status: 400 }
      );
    }

    const result = await removeItemFromCart(userId, productId);

    return NextResponse.json({
      success: true,
      cartItem: result,
    });
  } catch (error) {
    console.error("POST /api/cart/remove error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to remove item",
      },
      { status: 500 }
    );
  }
}