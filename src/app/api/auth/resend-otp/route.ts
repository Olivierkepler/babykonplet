import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "../../../../lib/prisma";

const resendOtpSchema = z.object({
  email: z.string().email(),
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Email already verified." },
        { status: 400 }
      );
    }

    const otp = generateOtp();

    await prisma.oTPCode.create({
      data: {
        userId: user.id,
        email,
        code: otp,
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`Resent OTP for ${email}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: "OTP resent successfully.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to resend OTP." },
      { status: 500 }
    );
  }
}