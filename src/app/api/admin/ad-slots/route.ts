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

    const imageUrl = String(body.imageUrl || "").trim();
    const href = String(body.href || "").trim();
    const alt = String(body.alt || "").trim();
    const label = body.label ? String(body.label).trim() : null;
    const isActive = Boolean(body.isActive);

    if (!imageUrl || !href || !alt) {
      return NextResponse.json(
        {
          success: false,
          error: "Image, link, and alt text are required.",
        },
        { status: 400 }
      );
    }

    const highestOrder = await prisma.adSlot.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const ad = await prisma.adSlot.create({
      data: {
        imageUrl,
        href,
        alt,
        label,
        isActive,
        order: (highestOrder?.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, ad }, { status: 201 });
  } catch (error) {
    console.error("CREATE_AD_SLOT_ERROR", error);

    return NextResponse.json(
      { success: false, error: "Failed to create ad." },
      { status: 500 }
    );
  }
}