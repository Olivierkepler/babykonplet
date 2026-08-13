import Link from "next/link";
import Image from "next/image";
import { Heart, UserRound } from "lucide-react";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import RemoveFromWishlistButton from "../../../components/wishlist/remove-from-wishlist-button";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <UserRound className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
          Sign in to view your wishlist
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
          Items you save will appear here after signing in.
        </p>
        <Link
          href="/login"
          className="mt-7 inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-pink-600">
          Account
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-[-0.025em] text-slate-950 sm:text-[30px]">
          My Wishlist
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-600">
          Products you've saved for later.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[#ff4f7b]">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-950">
            Your wishlist is empty
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            Tap the heart icon on any product to save it here.
          </p>
          <Link
            href="/products"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <RemoveFromWishlistButton productId={item.productId} />

              <Link href={`/products/${item.product.slug}`}>
                <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-[#f1f3f6]">
                  {item.product.imageUrl ? (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 22vw"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-slate-400">
                      {item.product.name}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-slate-900">
                  {item.product.name}
                </h3>

                <p className="mt-1 text-sm font-black text-slate-950">
                  {formatPrice(item.product.price)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}