import { NextResponse } from "next/server";
import { auth } from "../../../../../../../auth";
import { prisma } from "../../../../../../../lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const { id, imageId } = await params;

    await prisma.productImage.delete({ where: { id: imageId } });

    const remainingImages = await prisma.productImage.findMany({
      where: { productId: id },
      orderBy: { createdAt: "asc" },
    });

    await prisma.product.update({
      where: { id },
      data: { imageUrl: remainingImages[0]?.url || null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE_PRODUCT_IMAGE_ERROR", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete image." },
      { status: 500 }
    );
  }
}