import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { prisma } from "../../../../../../lib/prisma";

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
    const imageUrl = String(body.imageUrl || "").trim();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "imageUrl is required." },
        { status: 400 }
      );
    }

    await prisma.product.update({
      where: { id },
      data: { imageUrl },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SET_MAIN_IMAGE_ERROR", error);

    return NextResponse.json(
      { success: false, error: "Failed to set main image." },
      { status: 500 }
    );
  }
}