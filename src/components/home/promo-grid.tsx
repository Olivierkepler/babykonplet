"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type PromoBanner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
};

type PromoGridProps = {
  banners: PromoBanner[];
};

type CarouselButtonProps = {
  direction: "previous" | "next";
  onClick: () => void;
};

const AUTOPLAY_INTERVAL_MS = 5500;
const RESUME_AFTER_INTERACTION_MS = 7000;

export default function PromoGrid({ banners }: PromoGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const resumeTimeoutRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const updateIndex = useCallback((index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const scrollToCard = useCallback(
    (index: number) => {
      const container = scrollRef.current;

      if (!container) return;

      const card = container.children.item(index);

      if (!(card instanceof HTMLElement)) return;

      container.scrollTo({
        left: card.offsetLeft,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      updateIndex(index);
    },
    [prefersReducedMotion, updateIndex]
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      const totalSlides = banners.length;

      if (totalSlides === 0) return;

      const currentIndex = activeIndexRef.current;

      const nextIndex =
        (currentIndex + direction + totalSlides) % totalSlides;

      scrollToCard(nextIndex);
    },
    [banners.length, scrollToCard]
  );

  const pauseTemporarily = useCallback(() => {
    setIsPausedByUser(true);

    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsPausedByUser(false);
      resumeTimeoutRef.current = null;
    }, RESUME_AFTER_INTERACTION_MS);
  }, []);

  const handlePrevious = useCallback(() => {
    step(-1);
    pauseTemporarily();
  }, [step, pauseTemporarily]);

  const handleNext = useCallback(() => {
    step(1);
    pauseTemporarily();
  }, [step, pauseTemporarily]);

  const handleDotClick = useCallback(
    (index: number) => {
      scrollToCard(index);
      pauseTemporarily();
    },
    [scrollToCard, pauseTemporarily]
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrevious();
    }
  }

  // Respect the user's reduced-motion preference.
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();

    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  // Autoplay.
  useEffect(() => {
    const shouldPause =
      banners.length <= 1 ||
      prefersReducedMotion ||
      isHoveredOrFocused ||
      isPausedByUser;

    if (shouldPause) return;

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        step(1);
      }
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    banners.length,
    prefersReducedMotion,
    isHoveredOrFocused,
    isPausedByUser,
    step,
  ]);

  // Keep active indicator synced with manual scrolling.
  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const cards = Array.from(container.children);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) {
            continue;
          }

          const index = cards.indexOf(entry.target);

          if (index !== -1) {
            updateIndex(index);
          }
        }
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, [banners.length, updateIndex]);

  // Clear interaction timeout when the component unmounts.
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  if (banners.length === 0) {
    return null;
  }

  const isProgressAnimating =
    banners.length > 1 &&
    !prefersReducedMotion &&
    !isHoveredOrFocused &&
    !isPausedByUser;

  return (
    <section
      aria-label="Featured promotions"
      aria-roledescription="carousel"
      className="group/carousel relative "
      onMouseEnter={() => setIsHoveredOrFocused(true)}
      onMouseLeave={() => setIsHoveredOrFocused(false)}
      onFocusCapture={() => setIsHoveredOrFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsHoveredOrFocused(false);
        }
      }}
    >
      {/* Slides */}
      <div
        ref={scrollRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1  outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
      >
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            href={banner.href}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${banners.length}: ${banner.title}`}
            className="group  relative aspect-[16/9] w-[92%] min-w-[92%] shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-[#eaf4f8] ring-1 ring-slate-900/[0.04] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_-18px_rgba(15,23,42,0.17)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#74aed2] focus-visible:ring-offset-4 sm:aspect-[16/8.5] sm:w-[49%] sm:min-w-[49%] lg:w-[33%] lg:min-w-[33%] xl:aspect-[16/8] my-4"
       
          >
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              priority={index === 0}
              sizes="(max-width: 639px) 92vw, (max-width: 1023px) 49vw, 33vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025] "
            />

            {/* Subtle image finish */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/[0.05] via-transparent to-white/[0.03]"
            />
          </Link>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          {/* Desktop navigation */}
          <CarouselButton
            direction="previous"
            onClick={handlePrevious}
          />

          <CarouselButton
            direction="next"
            onClick={handleNext}
          />

          {/* Pagination */}
          <div
            className="mt-5 flex items-center justify-center gap-2"
            aria-label="Choose promotion"
          >
            {banners.map((banner, index) => {
              const isActive = activeIndex === index;

              const indicatorClassName = isActive
                ? "w-9 bg-[#e9f4fa]"
                : "w-1.5 bg-[#dceaf3] hover:scale-125 hover:bg-[#f8cbd5]";

              return (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}: ${banner.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative h-1.5 cursor-pointer overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#74aed2] focus-visible:ring-offset-2 ${indicatorClassName}`}
                >
                  {isActive && isProgressAnimating && (
                    <span
                      key={`progress-${activeIndex}`}
                      className="promo-progress-fill absolute inset-y-0 left-0 rounded-full bg-[#ef8fa5]"
                    />
                  )}

                  {isActive && !isProgressAnimating && (
                    <span className="absolute inset-0 rounded-full bg-[#ef8fa5]" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      <style jsx>{`
        .promo-progress-fill {
          animation: promo-progress ${AUTOPLAY_INTERVAL_MS}ms linear forwards;
        }

        @keyframes promo-progress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .promo-progress-fill {
            width: 100%;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

function CarouselButton({
  direction,
  onClick,
}: CarouselButtonProps) {
  const isPrevious = direction === "previous";

  const Icon = isPrevious ? ChevronLeft : ChevronRight;

  const positionClassName = isPrevious ? "left-4" : "right-4";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        isPrevious ? "Previous promotion" : "Next promotion"
      }
      className={`absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/30 text-[#315d7b] opacity-0 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:bg-white/60 hover:text-[#e97893] active:scale-95 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef8fa5] focus-visible:ring-offset-2 group-hover/carousel:opacity-100 lg:flex ${positionClassName}`}
    >
      <Icon className="h-5 w-5" strokeWidth={2} />
    </button>
  );
}