import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../../lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await req.json();

    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const price = Number(body.price || 0);
    const originalPrice = Number(body.originalPrice || 0);
    const brand = String(body.brand || "").trim();
    const category = String(body.category || "").trim();
    const stock = Math.max(0, Number(body.stock || 0));
    const isActive = Boolean(body.isActive);
    const currentImageUrl = String(body.currentImageUrl || "").trim();

    const newImageUrls: string[] = Array.isArray(body.newImageUrls)
      ? body.newImageUrls.filter(
          (url: unknown): url is string =>
            typeof url === "string" && url.trim().length > 0
        )
      : [];

    if (!name || !description || price <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, description, and price are required.",
        },
        { status: 400 }
      );
    }

    // Same rule as the original server action: a freshly uploaded
    // image becomes the new main image; otherwise keep the existing one.
    const mainImageUrl =
      newImageUrls.length > 0 ? newImageUrls[0] : currentImageUrl || null;

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        originalPrice: originalPrice > 0 ? originalPrice : null,
        brand: brand || null,
        category: category || null,
        imageUrl: mainImageUrl,
        stock,
        isActive,
      },
    });

    if (newImageUrls.length > 0) {
      await prisma.productImage.createMany({
        data: newImageUrls.map((url) => ({ productId: id, url })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR", error);

    return NextResponse.json(
      { success: false, error: "Failed to update product." },
      { status: 500 }
    );
  }
}