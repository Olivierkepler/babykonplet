import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Resend } from "resend";

import { prisma } from "../../../../lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

const registerSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

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

    const { error: emailError } = await resend.emails.send({
      from: "Baby Konple <onboarding@resend.dev>",
  to: email,
  replyTo: "babykonple@gmail.com",
  subject: "Verify your Baby Konple account",
      html: `
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            max-width: 560px;
            margin: 0 auto;
            padding: 32px;
            color: #111827;
          "
        >
          <h2 style="margin-bottom: 16px;">
            Verify your email
          </h2>
    
          <p>
            Hi${name ? ` ${name}` : ""},
          </p>
    
          <p>
            Thank you for creating an account with Baby Konple.
          </p>
    
          <p>
            Use the verification code below to verify your email address:
          </p>
    
          <div
            style="
              margin: 28px 0;
              padding: 20px;
              text-align: center;
              background-color: #f3f4f6;
              border-radius: 10px;
              font-size: 32px;
              font-weight: 700;
              letter-spacing: 8px;
            "
          >
            ${otp}
          </div>
    
          <p>
            This code expires in 5 minutes.
          </p>
    
          <p>
            If you did not create this account, you can safely ignore this email.
          </p>
    
          <p style="margin-top: 32px;">
            Baby Konple
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend email error:", emailError);

      return NextResponse.json(
        {
          success: false,
          error: "Account created, but verification email could not be sent.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User registered. Verification code sent.",
    });
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to register user.",
      },
      { status: 500 }
    );
  }
}