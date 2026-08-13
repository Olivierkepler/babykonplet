import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "You must be signed in." },
        { status: 401 }
      );
    }

    const { productId } = await params;

    await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WISHLIST_REMOVE_ERROR", error);

    return NextResponse.json(
      { success: false, error: "Failed to remove from wishlist." },
      { status: 500 }
    );
  }
}