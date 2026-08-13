import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
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

    const highestOrder = await prisma.promoBanner.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const banner = await prisma.promoBanner.create({
      data: {
        title,
        subtitle,
        imageUrl,
        href,
        isActive,
        order: (highestOrder?.order ?? -1) + 1,
      },
    });

    return NextResponse.json(
      { success: true, banner },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_PROMO_BANNER_ERROR", error);

    return NextResponse.json(
      { success: false, error: "Failed to create banner." },
      { status: 500 }
    );
  }
}