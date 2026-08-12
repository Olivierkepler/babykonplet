import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { clearCartByUserId } from "../../../../lib/db/cart";

export async function POST(_req: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await clearCartByUserId(userId);

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to clear cart";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}