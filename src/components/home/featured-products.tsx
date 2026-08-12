import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const featuredProducts = [
  {
    id: 1,
    name: "Herbal Shampoo",
    price: 14.99,
    originalPrice: 24.99,
    image: "/images/products/shampoo.jpg",
    rating: 4.6,
    reviews: "1,250",
    offer: "Min. 25% Off",
  },
  {
    id: 2,
    name: "Moisturizing Face Cream",
    price: 18.99,
    originalPrice: 29.99,
    image: "/images/products/face-cream.jpg",
    rating: 4.5,
    reviews: "980",
    offer: "Best Seller",
  },
  {
    id: 3,
    name: "Ladies Handbag",
    price: 34.99,
    originalPrice: 59.99,
    image: "/images/products/handbag.jpg",
    rating: 4.7,
    reviews: "1,430",
    offer: "Trending Deal",
  },
  {
    id: 4,
    name: "Kitchen Utensil Set",
    price: 19.99,
    originalPrice: 34.99,
    image: "/images/products/kitchen-set.jpg",
    rating: 4.4,
    reviews: "760",
    offer: "Home Deal",
  },
];;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

export default function FeaturedProducts({
  title = "Trending Products",
}: {
  title?: string;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>

        <Link
          href="/products"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-700"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <Link
            key={product.id}
            href="/products"
            className="group rounded-xl bg-white p-3 transition hover:shadow-md"
          >
            <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="mt-3">
              <div className="inline-flex items-center gap-1 rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                {product.rating}
                <Star className="h-3 w-3 fill-white" />
              </div>

              <span className="ml-2 text-xs text-slate-500">
                ({product.reviews})
              </span>

              <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-slate-800">
                {product.name}
              </h3>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">
                  {formatPrice(product.price)}
                </span>

                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold text-green-600">
                {product.offer}
              </p>

              <p className="mt-1 text-xs font-medium text-blue-600">
                $500 with Bank offer + more
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}