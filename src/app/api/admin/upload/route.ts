import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  console.log("[UPLOAD] request entered /api/admin/upload");

  // Temporary diagnostic: route does not enforce auth today.
  // Log presence of session cookie only (true/false) — no cookie values.
  const cookieHeader = req.headers.get("cookie") ?? "";
  const hasSessionCookie =
    cookieHeader.includes("authjs.session-token") ||
    cookieHeader.includes("__Secure-authjs.session-token") ||
    cookieHeader.includes("next-auth.session-token") ||
    cookieHeader.includes("__Secure-next-auth.session-token");
  console.log("[UPLOAD] authenticated (session cookie present):", hasSessionCookie);

  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  console.log("[UPLOAD] BLOB_READ_WRITE_TOKEN exists:", hasBlobToken);

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    console.log("[UPLOAD] files count:", files.length);
    for (const file of files) {
      console.log("[UPLOAD] file:", {
        name: file?.name ?? null,
        type: file?.type ?? null,
        size: file?.size ?? null,
      });
    }

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

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

    return NextResponse.json({ urls });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    console.error("[UPLOAD] exception message:", message);
    console.error("[UPLOAD] exception stack:", stack ?? "(no stack)");
    console.error("UPLOAD_ERROR", error);

    // Temporary diagnostic: return the real exception message (was hardcoded).
    return NextResponse.json(
      {
        error: message,
        hasBlobToken,
      },
      { status: 500 }
    );
  }
}
