import { NextRequest, NextResponse } from "next/server";

import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";

type AddToCartBody = {
  productId?: string;
  variantId?: string | null;
  selectedSize?: string | null;
  selectedColor?: string | null;
  selectionKey?: string;
  quantity?: number;
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Please sign in before adding products to your cart.",
        },
        { status: 401 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    let body: AddToCartBody = {};

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await request.formData();

      body = {
        productId: String(formData.get("productId") || ""),
        variantId: formData.get("variantId")
          ? String(formData.get("variantId"))
          : null,
        selectedSize: formData.get("selectedSize")
          ? String(formData.get("selectedSize"))
          : null,
        selectedColor: formData.get("selectedColor")
          ? String(formData.get("selectedColor"))
          : null,
        selectionKey: formData.get("selectionKey")
          ? String(formData.get("selectionKey"))
          : undefined,
        quantity: Number(formData.get("quantity")),
      };
    }

    const productId = body.productId?.trim();
    const variantId = body.variantId?.trim() || null;
    const selectedSize = body.selectedSize?.trim() || null;
    const selectedColor = body.selectedColor?.trim() || null;
    const quantity = Number(body.quantity);

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Quantity must be a positive whole number.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        variants: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "This product is unavailable.",
        },
        { status: 404 }
      );
    }

    const productHasVariants = product.variants.length > 0;

    let selectedVariant:
      | {
          id: string;
          size: string | null;
          color: string | null;
          stock: number;
          price: number | null;
          isActive: boolean;
        }
      | null = null;

    if (productHasVariants) {
      if (!variantId) {
        return NextResponse.json(
          {
            success: false,
            error: "Please select the required product options.",
          },
          { status: 400 }
        );
      }

      selectedVariant =
        product.variants.find((variant) => variant.id === variantId) || null;

      if (!selectedVariant || !selectedVariant.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: "The selected product option is unavailable.",
          },
          { status: 400 }
        );
      }

      if (selectedVariant.stock <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: "The selected product option is out of stock.",
          },
          { status: 409 }
        );
      }

      if (selectedVariant.size && selectedVariant.size !== selectedSize) {
        return NextResponse.json(
          {
            success: false,
            error: "The selected size does not match this product option.",
          },
          { status: 400 }
        );
      }

      if (selectedVariant.color && selectedVariant.color !== selectedColor) {
        return NextResponse.json(
          {
            success: false,
            error: "The selected color does not match this product option.",
          },
          { status: 400 }
        );
      }
    } else if (product.stock <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "This product is out of stock.",
        },
        { status: 409 }
      );
    }

    const finalSize = selectedVariant?.size || selectedSize;
    const finalColor = selectedVariant?.color || selectedColor;

    const selectionKey = selectedVariant
      ? selectedVariant.id
      : body.selectionKey?.trim() ||
        `${finalColor || "default"}-${finalSize || "default"}`;

    const availableStock = selectedVariant
      ? selectedVariant.stock
      : product.stock;

    const result = await prisma.$transaction(async (transaction) => {
      const cart = await transaction.cart.upsert({
        where: {
          userId,
        },
        update: {},
        create: {
          userId,
        },
      });

      const existingCartItem = await transaction.cartItem.findUnique({
        where: {
          cartId_productId_selectionKey: {
            cartId: cart.id,
            productId,
            selectionKey,
          },
        },
      });

      const newQuantity =
        (existingCartItem?.quantity || 0) + quantity;

      if (newQuantity > availableStock) {
        throw new Error(
          `Only ${availableStock} item${
            availableStock === 1 ? "" : "s"
          } available.`
        );
      }

      return transaction.cartItem.upsert({
        where: {
          cartId_productId_selectionKey: {
            cartId: cart.id,
            productId,
            selectionKey,
          },
        },
        update: {
          quantity: newQuantity,
          variantId: selectedVariant?.id || null,
          selectedSize: finalSize,
          selectedColor: finalColor,
        },
        create: {
          cartId: cart.id,
          productId,
          variantId: selectedVariant?.id || null,
          selectedSize: finalSize,
          selectedColor: finalColor,
          selectionKey,
          quantity,
        },
        include: {
          product: true,
          variant: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Product added to cart.",
      cartItem: result,
    });
  } catch (error) {
    console.error("POST /api/cart/add error:", error);

    if (
      error instanceof Error &&
      error.message.startsWith("Only ")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to add the product to your cart.",
      },
      { status: 500 }
    );
  }
}