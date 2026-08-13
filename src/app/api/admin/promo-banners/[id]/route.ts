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

    const title = String(body.title || "").trim();
    const subtitle = String(body.subtitle || "").trim();
    const imageUrl = String(body.imageUrl || "").trim();
    const href = String(body.href || "").trim();
    const isActive = Boolean(body.isActive);

    if (!title || !subtitle || !imageUrl || !href) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, subtitle, image, and link are required.",
        },
        { status: 400 }
      );
    }

    const banner = await prisma.promoBanner.update({
      where: { id },
      data: { title, subtitle, imageUrl, href, isActive },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error("UPDATE_PROMO_BANNER_ERROR", error);

    return NextResponse.json(
      { success: false, error: "Failed to update banner." },
      { status: 500 }
    );
  }
}