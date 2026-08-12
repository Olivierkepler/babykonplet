import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { auth } from "../../../../auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // --------------------------------------------------
    // ADMIN AUTHORIZATION
    // --------------------------------------------------

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden. Admin access required.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // BLOB CONFIGURATION
    // --------------------------------------------------

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error(
        "[UPLOAD] BLOB_READ_WRITE_TOKEN is not configured."
      );

      return NextResponse.json(
        {
          success: false,
          error: "Upload service is not configured.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // READ FILES
    // --------------------------------------------------

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        {
          success: false,
          error: "No files uploaded.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // UPLOAD TO VERCEL BLOB
    // --------------------------------------------------

    const urls: string[] = [];

    for (const file of files) {
      if (!file || file.size === 0) {
        continue;
      }

      const safeName = file.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");

      const blob = await put(
        `products/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}-${safeName}`,
        file,
        {
          access: "public",
        }
      );

      urls.push(blob.url);
    }

    if (urls.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid files were uploaded.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      urls,
    });
  } catch (error) {
    console.error("UPLOAD_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file.",
      },
      { status: 500 }
    );
  }
}