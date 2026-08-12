"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const promoBanners = [
  {
    title: "Beauty & Hair Care",
    subtitle: "Shop oils, shampoo, conditioner and hair essentials",
    image: "/images/banner1.jpg",
    href: "/beauty-and-hair-care",
  },
  {
    title: "Fashion Finds",
    subtitle: "Wigs, bags, shoes and new arrivals",
    image: "/images/banner2.jpg",
    href: "/fashion-finds",
  },
  {
    title: "Food & Grocery",
    subtitle: "Everyday essentials and trusted products",
    image: "/images/banner3.jpg",
    href: "/food-and-grocery",
  },
  {
    title: "Shoes & Bags",
    subtitle: "Fresh styles for women and men",
    image: "/images/banner4.jpg",
    href: "/products",
  },
  {
    title: "New Arrivals",
    subtitle: "Latest products added this week",
    image: "/images/banner5.jpg",
    href: "/home-essentials",
  },
];

export default function PromoGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  function updateIndex(index: number) {
    activeIndexRef.current = index;
    setActiveIndex(index);
  }

  function scrollToCard(index: number) {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.children[index] as HTMLElement;
    if (!card) return;

    container.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });

    updateIndex(index);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        const next =
          activeIndexRef.current === promoBanners.length - 1
            ? 0
            : activeIndexRef.current + 1;

        scrollToCard(next);
      }

      if (e.key === "ArrowLeft") {
        const prev =
          activeIndexRef.current === 0
            ? promoBanners.length - 1
            : activeIndexRef.current - 1;

        scrollToCard(prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="mt-4 overflow-hidden">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {promoBanners.map((banner) => (
          <Link
            key={banner.title}
            href={banner.href}
            className="group relative h-[150px] w-[calc((100%-32px)/3)] min-w-[calc((100%-32px)/3)] snap-start overflow-hidden rounded-2xl bg-slate-200 shadow-sm"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />

          </Link>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-2">
        {promoBanners.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToCard(index)}
            className={`h-2 rounded-full transition-all ${
              activeIndex === index ? "w-8 bg-slate-700" : "w-2 bg-slate-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}