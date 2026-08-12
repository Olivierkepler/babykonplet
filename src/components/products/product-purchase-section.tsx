"use client";

import { useMemo, useState } from "react";

import AddToCartButton from "./add-to-cart-button";
import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";

type ProductVariant = {
  id: string;
  size?: string | null;
  color?: string | null;
  stock: number;
  price?: number | null;
  imageUrl?: string | null;
};

type Props = {
  productId: string;
  name: string;
  price: number;
  description?: string;
  brand?: string;
  category?: string;
  stock: number;
  averageRating: number;
  reviewCount: number;
  galleryImages: string[];
  variants: ProductVariant[];
};

export default function ProductPurchaseSection({
  productId,
  name,
  price,
  description,
  brand,
  category,
  stock,
  averageRating,
  reviewCount,
  galleryImages,
  variants,
}: Props) {
  const [selectedColor, setSelectedColor] = useState("");

  const displayedImages = useMemo(() => {
    const mainImages = Array.from(
      new Set(
        galleryImages
          .filter(
            (image): image is string =>
              typeof image === "string" &&
              image.trim().length > 0
          )
          .map((image) => image.trim())
      )
    ).slice(0, 6);

    if (!selectedColor) {
      return mainImages.length > 0
        ? mainImages
        : ["/images/product-placeholder.png"];
    }

    const normalizedSelectedColor = selectedColor
      .trim()
      .toLowerCase();

    const colorImages = variants
      .filter((variant) => {
        const normalizedVariantColor = variant.color
          ?.trim()
          .toLowerCase();

        return (
          normalizedVariantColor === normalizedSelectedColor &&
          Boolean(variant.imageUrl?.trim())
        );
      })
      .map((variant) => variant.imageUrl!.trim());

    const uniqueColorImages = Array.from(
      new Set(colorImages)
    ).slice(0, 6);

    return uniqueColorImages.length > 0
      ? uniqueColorImages
      : mainImages.length > 0
        ? mainImages
        : ["/images/product-placeholder.png"];
  }, [galleryImages, selectedColor, variants]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:rounded-3xl">
      <div className="grid items-start lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT: PRODUCT IMAGES */}
        <div className="min-w-0 border-b border-slate-200 p-3 sm:p-5 lg:border-b-0 lg:border-r lg:p-5">
          <ProductGallery
            images={displayedImages}
            name={
              selectedColor
                ? `${name} - ${selectedColor}`
                : name
            }
          />
        </div>

        {/* RIGHT: PRODUCT DETAILS */}
        <div className="min-w-0 p-4 sm:p-7 lg:p-9">
          <ProductInfo
            name={name}
            price={price}
            description={description}
            brand={brand}
            category={category}
            stock={stock}
            averageRating={averageRating}
            reviewCount={reviewCount}
          />

          <div className="mt-7 border-t border-slate-200 pt-7 sm:mt-8 sm:pt-8">
            <AddToCartButton
              productId={productId}
              stock={stock}
              variants={variants}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />
          </div>
        </div>
      </div>
    </section>
  );
}