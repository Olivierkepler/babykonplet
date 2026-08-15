import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, ShoppingBag, Sparkles } from "lucide-react";

import ProductPurchaseSection from "../../../components/products/product-purchase-section";
import ReviewSection from "../../../components/reviews/review-section";
import { prisma } from "../../../lib/prisma";

export const revalidate = 60;

type ProductImage = {
  id: string;
  url: string;
};

type ProductReview = {
  rating: number;
};

type ProductVariant = {
  id: string;
  size?: string | null;
  color?: string | null;
  stock: number;
  price?: number | null;
  imageUrl?: string | null;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string | null;
  brand?: string | null;
  category?: string | null;
  stock: number;
  isActive: boolean;
  imageUrl?: string | null;
  image?: string | null;
  images?: ProductImage[];
  reviews?: ProductReview[];
  variants?: ProductVariant[];
};

type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

async function getProduct(slug: string): Promise<Product | null> {
  return prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      images: true,

      variants: {
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          size: true,
          color: true,
          stock: true,
          price: true,
          imageUrl: true,
        },
      },

      reviews: {
        where: {
          isApproved: true,
        },
        select: {
          rating: true,
        },
      },
    },
  });
}

async function getRelatedProducts(
  productId: string,
  category?: string | null
): Promise<RelatedProduct[]> {
  return prisma.product.findMany({
    where: {
      isActive: true,

      id: {
        not: productId,
      },

      // When the product has a category, stay within it. Otherwise
      // fall back to "other active products" so the section still
      // has something to show instead of silently rendering nothing.
      ...(category
        ? {
            category: {
              equals: category,
              mode: "insensitive",
            },
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 4,

    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      imageUrl: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || !product.isActive) {
    return {
      title: "Product not found",
    };
  }

  const image =
    product.images?.[0]?.url || product.imageUrl || product.image || undefined;

  const description =
    product.description?.slice(0, 155) ||
    `${product.name} — shop now at Baby Konple.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const reviewCount = product.reviews?.length ?? 0;

  const averageRating =
    reviewCount > 0
      ? product.reviews!.reduce(
          (total, review) => total + review.rating,
          0
        ) / reviewCount
      : 0;

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category
  );

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images.map((image) => image.url)
      : [
          product.imageUrl ||
            product.image ||
            "/images/product-placeholder.png",
        ];

  return (
    <main className="min-h-screen ">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:py-12">
        {/* BREADCRUMB CARD */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-[#E7EEF3] bg-white px-5 py-3.5 text-sm text-slate-500 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.15)]"
        >
          <Link
            href="/"
            className="font-medium transition-colors hover:text-[#63A0C7]"
          >
            Home
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />

          <Link
            href="/products"
            className="font-medium transition-colors hover:text-[#63A0C7]"
          >
            Products
          </Link>

          {product.category ? (
            <>
              <ChevronRight
                className="h-4 w-4 text-slate-300"
                aria-hidden="true"
              />

              <Link
                href={`/products?category=${encodeURIComponent(
                  product.category
                )}`}
                className="font-medium transition-colors hover:text-[#63A0C7]"
              >
                {product.category}
              </Link>
            </>
          ) : null}

          <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />

          <span
            aria-current="page"
            className="truncate font-semibold text-slate-950"
          >
            {product.name}
          </span>
        </nav>

        {/* PRODUCT GALLERY + INFO + VARIANTS */}
        <div className=" border border-[#E7EEF3] bg-white p-4 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.18)] sm:p-6 lg:p-8">
          <ProductPurchaseSection
            productId={product.id}
            name={product.name}
            price={product.price}
            description={product.description || undefined}
            brand={product.brand || undefined}
            category={product.category || undefined}
            stock={product.stock}
            averageRating={averageRating}
            reviewCount={reviewCount}
            galleryImages={galleryImages}
            variants={product.variants ?? []}
          />
        </div>

        {/* REVIEWS */}
        <div className="mt-8 rounded-[2rem] border border-[#E7EEF3] bg-white p-4 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.18)] sm:p-6 lg:p-8">
          <ReviewSection productId={product.id} />
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 ? (
          <section className="mt-14">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF4F8] px-3 py-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#63A0C7] text-white">
                    <Sparkles className="h-3 w-3" />
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F8CB5]">
                    More to discover
                  </p>
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  You may also like
                </h2>
              </div>

              <Link
                href={
                  product.category
                    ? `/products?category=${encodeURIComponent(product.category)}`
                    : "/products"
                }
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F8CB5] transition hover:text-[#63A0C7]"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#E7EEF3] bg-white p-3 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#D9EDF5] hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
                >
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#FAF7F2] p-4">
                    {relatedProduct.imageUrl ? (
                      <img
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-center text-[#A8CFDD]">
                        <ShoppingBag className="h-8 w-8" />

                        <span className="mt-2 text-sm font-medium text-slate-500">
                          {relatedProduct.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-2 pt-4">
                    <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-slate-900 transition group-hover:text-[#4F8CB5]">
                      {relatedProduct.name}
                    </h3>

                    <p className="mt-2 text-lg font-bold text-slate-950">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}