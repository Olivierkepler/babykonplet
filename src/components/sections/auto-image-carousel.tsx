"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  cta?: string;
  discount?: string;
  code?: string;
};

type Props = {
  slides: Slide[];
  intervalMs?: number;
  variant?: "dark" | "promo";
};

export default function AutoImageCarousel({
  slides,
  intervalMs = 4500,
  variant = "dark",
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlide = slides[activeIndex];
  const isPromo = variant === "promo";

  function goToPrevious() {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    );
  }

  function goToNext() {
    setActiveIndex((current) =>
      current === slides.length - 1 ? 0 : current + 1,
    );
  }

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = window.setInterval(goToNext, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, isPaused, slides.length]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-sm ${
        isPromo ? "bg-white" : "bg-slate-900"
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative aspect-[16/7] min-h-[240px] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.src} className="relative h-full min-w-full">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div
          className={`absolute inset-0 ${
            isPromo
              ? "bg-gradient-to-r from-white/95 via-white/60 to-transparent"
              : "bg-gradient-to-r from-slate-950/80 via-slate-950/25 to-transparent"
          }`}
        />

        {isPromo && activeSlide?.discount ? (
          <div className="absolute right-5 top-5 flex h-20 w-20 items-center justify-center rounded-full bg-pink-600 text-center text-sm font-black leading-tight text-white shadow-lg md:h-24 md:w-24 md:text-base">
            {activeSlide.discount}
          </div>
        ) : null}

        <div
          className={`absolute left-6 top-1/2 max-w-[460px] -translate-y-1/2 md:left-10 ${
            isPromo ? "text-slate-950" : "text-white"
          }`}
        >
          {activeSlide?.eyebrow ? (
            <p
              className={`text-xs font-black uppercase tracking-[0.2em] md:text-sm ${
                isPromo ? "text-pink-600" : "text-blue-100"
              }`}
            >
              {activeSlide.eyebrow}
            </p>
          ) : null}

          {activeSlide?.title ? (
            <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
              {activeSlide.title}
            </h2>
          ) : null}

          {activeSlide?.description ? (
            <p
              className={`mt-3 max-w-sm text-sm font-bold leading-6 md:text-base ${
                isPromo ? "text-slate-600" : "text-blue-50"
              }`}
            >
              {activeSlide.description}
            </p>
          ) : null}

          {activeSlide?.code ? (
            <p className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-pink-600 shadow-sm ring-1 ring-pink-100">
              CODE: {activeSlide.code}
            </p>
          ) : null}

          {activeSlide?.cta ? (
            <button
              type="button"
              className={`mt-5 block rounded-full px-5 py-2.5 text-sm font-black shadow-sm transition ${
                isPromo
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "border border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-slate-950"
              }`}
            >
              {activeSlide.cta}
            </button>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-sm transition hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-sm transition hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              activeIndex === index ? "w-8 bg-white" : "w-2 bg-white/55"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
