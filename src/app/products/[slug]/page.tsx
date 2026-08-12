import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";

import ProductPurchaseSection from "../../../components/products/product-purchase-section";
import ReviewSection from "../../../components/reviews/review-section";
import { prisma } from "../../../lib/prisma";

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
  if (!category) {
    return [];
  }

  return prisma.product.findMany({
    where: {
      isActive: true,

      category: {
        equals: category,
        mode: "insensitive",
      },

      id: {
        not: productId,
      },
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

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return (
      <main className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Product Not Found
            </h1>

            <p className="mt-4 text-slate-600">
              The product you are looking for is unavailable.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex rounded-lg bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link
            href="/"
            className="font-medium transition hover:text-slate-950"
          >
            Home
          </Link>

          <ChevronRight className="h-4 w-4" />

          {product.category ? (
            <>
              <Link
                href={`/products?category=${encodeURIComponent(
                  product.category
                )}`}
                className="font-medium transition hover:text-slate-950"
              >
                {product.category}
              </Link>

              <ChevronRight className="h-4 w-4" />
            </>
          ) : null}

          {product.brand ? (
            <>
              <span className="font-medium">
                {product.brand}
              </span>

              <ChevronRight className="h-4 w-4" />
            </>
          ) : null}

          <span className="font-semibold text-slate-900">
            {product.name}
          </span>
        </nav>

        {/* PRODUCT GALLERY + INFO + VARIANTS */}
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

        {/* REVIEWS */}
        <ReviewSection productId={product.id} />

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 ? (
          <section className="mt-14 border-t border-slate-200 pt-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  More to discover
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Related Products
                </h2>
              </div>

              <Link
                href={`/products?category=${encodeURIComponent(
                  product.category || ""
                )}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
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
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-slate-50 p-4">
                    {relatedProduct.imageUrl ? (
                      <img
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-center text-slate-400">
                        <ShoppingBag className="h-8 w-8" />

                        <span className="mt-2 text-sm font-medium">
                          {relatedProduct.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-2 pt-4">
                    <h3 className="line-clamp-2 text-sm font-bold leading-6 text-slate-900">
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