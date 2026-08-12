"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

type CartContextValue = {
  cartCount: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

function getTotalQuantity(
  items: Array<{ quantity?: number }> | undefined
): number {
  if (!items?.length) return 0;

  return items.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    return sum + (Number.isFinite(quantity) ? quantity : 0);
  }, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (status !== "authenticated") {
      setCartCount(0);
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/cart", {
        cache: "no-store",
      });

      if (response.status === 401) {
        setCartCount(0);
        return;
      }

      const data = await response.json();

      if (!response.ok || data.success === false) {
        return;
      }

      const items =
        data.items || data.cart?.items || data.cartItems || [];

      setCartCount(getTotalQuantity(items));
    } catch (error) {
      console.error("Failed to refresh cart count:", error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    void refreshCart();
  }, [status, refreshCart]);

  const value = useMemo(
    () => ({
      cartCount,
      isLoading,
      refreshCart,
    }),
    [cartCount, isLoading, refreshCart]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
