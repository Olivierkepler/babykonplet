"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemoveFromWishlistButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  async function handleRemove(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setRemoving(true);

      await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });

      router.refresh();
    } catch (err) {
      console.error("WISHLIST_REMOVE_ERROR", err);
      setRemoving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={removing}
      aria-label="Remove from wishlist"
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#ff4f7b] shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-50"
    >
      <Heart className="h-4 w-4 fill-current" />
    </button>
  );
}