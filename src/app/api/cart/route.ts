import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { getCartByUserId } from "../../../lib/db/cart";

export async function GET() {
  try {
    const session = await auth();

    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cart = await getCartByUserId(userId);

    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("GET /api/cart error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}