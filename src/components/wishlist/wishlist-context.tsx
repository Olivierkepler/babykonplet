"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

type WishlistContextValue = {
  wishlistIds: Set<string>;
  wishlistCount: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  pendingIds: Set<string>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status !== "authenticated") {
      setWishlistIds(new Set());
      return;
    }

    let cancelled = false;

    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.success) return;

        const ids = new Set<string>(
          data.items.map((item: { productId: string }) => item.productId)
        );

        setWishlistIds(ids);
      })
      .catch((err) => {
        console.error("WISHLIST_FETCH_ERROR", err);
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (status !== "authenticated") {
        // Caller is responsible for redirecting to /login in this case.
        return;
      }

      const alreadySaved = wishlistIds.has(productId);

      setPendingIds((prev) => new Set(prev).add(productId));

      // Optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (alreadySaved) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });

      try {
        const response = alreadySaved
          ? await fetch(`/api/wishlist/${productId}`, { method: "DELETE" })
          : await fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId }),
            });

        if (!response.ok) {
          throw new Error("Request failed");
        }
      } catch (err) {
        console.error("WISHLIST_TOGGLE_ERROR", err);

        // Revert optimistic update on failure
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (alreadySaved) {
            next.add(productId);
          } else {
            next.delete(productId);
          }
          return next;
        });
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
    },
    [status, wishlistIds]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.size,
        isWishlisted,
        toggleWishlist,
        pendingIds,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}