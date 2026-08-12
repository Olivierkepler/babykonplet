import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import {
  createProduct,
  getActiveProducts,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from "../../../lib/db/products";
import {
  createProductSchema,
  updateProductSchema,
} from "../../../lib/validations/product";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const activeOnly = searchParams.get("activeOnly");

    if (id) {
      const product = await getProductById(id);

      if (!product) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, product });
    }

    if (slug) {
      const product = await getProductBySlug(slug);

      if (!product) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, product });
    }

    const products =
      activeOnly === "true" ? await getActiveProducts() : await getAllProducts();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = createProductSchema.safeParse({
      ...body,
      price: Number(body.price),
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.product.findUnique({
      where: { slug: parsed.data.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 409 }
      );
    }

    const product = await createProduct({
      ...parsed.data,
      imageUrl: parsed.data.imageUrl || undefined,
    });

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = updateProductSchema.safeParse({
      ...body,
      price: body.price !== undefined ? Number(body.price) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id, ...updateData } = parsed.data;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugTaken = await prisma.product.findUnique({
        where: { slug: updateData.slug },
      });

      if (slugTaken) {
        return NextResponse.json(
          { success: false, error: "Slug already exists" },
          { status: 409 }
        );
      }
    }

    const product = await updateProduct(id, {
      ...updateData,
      imageUrl: updateData.imageUrl === "" ? undefined : updateData.imageUrl,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product id is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    await deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}