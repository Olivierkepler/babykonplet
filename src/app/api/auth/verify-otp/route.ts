import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "../../../../lib/prisma";

const verifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;

    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        email,
        code,
        type: "EMAIL_VERIFICATION",
        used: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP." },
        { status: 400 }
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "OTP expired." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.oTPCode.update({
        where: { id: otpRecord.id },
        data: { used: true },
      }),
      prisma.user.update({
        where: { id: otpRecord.userId },
        data: { emailVerified: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify OTP." },
      { status: 500 }
    );
  }
}