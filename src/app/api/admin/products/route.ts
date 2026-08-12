import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type VariantInput = {
  size?: string | null;
  color?: string | null;
  stock?: number;
  price?: number | null;
  sku?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const price = Number(body.price || 0);
    const originalPrice = Number(body.originalPrice || 0);
    const brand = String(body.brand || "").trim();
    const category = String(body.category || "").trim();
    const subCategory = String(body.subCategory || "").trim();

    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls
      : Array.isArray(body.images)
      ? body.images
      : [];

    const mainImageUrl =
      imageUrls[0] || String(body.imageUrl || "").trim();

    const isActive = Boolean(body.isActive);

    const rawVariants: VariantInput[] = Array.isArray(body.variants)
      ? body.variants
      : [];

    const variants = rawVariants
      .map((variant) => ({
        size: variant.size ? String(variant.size).trim() : null,
        color: variant.color ? String(variant.color).trim() : null,
        stock: Math.max(0, Number(variant.stock || 0)),
        price:
          Number(variant.price) > 0
            ? Number(variant.price)
            : null,
        sku: variant.sku ? String(variant.sku).trim() : null,
        imageUrl: variant.imageUrl
          ? String(variant.imageUrl).trim()
          : null,
        isActive:
          typeof variant.isActive === "boolean"
            ? variant.isActive
            : true,
      }))
      .filter((variant) => variant.size || variant.color);

    const stock =
      variants.length > 0
        ? variants.reduce(
            (total, variant) => total + variant.stock,
            0
          )
        : Math.max(0, Number(body.stock || 0));

    if (!name || !description || price <= 0) {
      return NextResponse.json(
        {
          error:
            "Name, description, and price are required.",
        },
        { status: 400 }
      );
    }

    const duplicateSkuValues = variants
      .map((variant) => variant.sku)
      .filter((sku): sku is string => Boolean(sku));

    const uniqueSkuValues = new Set(duplicateSkuValues);

    if (uniqueSkuValues.size !== duplicateSkuValues.length) {
      return NextResponse.json(
        {
          error:
            "Each variant SKU must be unique.",
        },
        { status: 400 }
      );
    }

    const slug = `${makeSlug(name)}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        originalPrice:
          originalPrice > 0 ? originalPrice : null,
        brand: brand || null,
        category: category || null,
        subCategory: subCategory || null,
        imageUrl: mainImageUrl || null,
        stock,
        isActive,

        images: {
          create: imageUrls
            .filter(
              (url: unknown): url is string =>
                typeof url === "string" &&
                url.trim().length > 0
            )
            .map((url: string) => ({
              url: url.trim(),
            })),
        },

        variants:
          variants.length > 0
            ? {
                create: variants,
              }
            : undefined,
      },

      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR", error);

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("unique")
    ) {
      return NextResponse.json(
        {
          error:
            "A variant SKU already exists. Please use a different SKU.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}