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

const AUTOPLAY_INTERVAL_MS = 5500;
const RESUME_AFTER_INTERACTION_MS = 7000;

export default function PromoGrid({ banners }: PromoGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const resumeTimeoutRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(false);

  function updateIndex(index: number) {
    activeIndexRef.current = index;
    setActiveIndex(index);
  }

  const scrollToCard = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container) return;

      const card = container.children[index] as
        | HTMLElement
        | undefined;

      if (!card) return;

      container.scrollTo({
        left: card.offsetLeft,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      updateIndex(index);
    },
    [prefersReducedMotion]
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      const length = banners.length;
      if (length === 0) return;

      const current = activeIndexRef.current;
      const next = (current + direction + length) % length;

      scrollToCard(next);
    },
    [scrollToCard, banners.length]
  );

  function pauseTemporarily() {
    setIsPausedByUser(true);

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsPausedByUser(false);
    }, RESUME_AFTER_INTERACTION_MS);
  }

  function handlePrevClick() {
    step(-1);
    pauseTemporarily();
  }

  function handleNextClick() {
    step(1);
    pauseTemporarily();
  }

  function handleDotClick(index: number) {
    scrollToCard(index);
    pauseTemporarily();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
      pauseTemporarily();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
      pauseTemporarily();
    }
  }

  useEffect(() => {
    const query = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setPrefersReducedMotion(query.matches);

    function handleChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches);
    }

    query.addEventListener("change", handleChange);

    return () => {
      query.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (
      banners.length <= 1 ||
      prefersReducedMotion ||
      isHovering ||
      isPausedByUser
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      if (document.hidden) return;
      step(1);
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    banners.length,
    prefersReducedMotion,
    isHovering,
    isPausedByUser,
    step,
  ]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.6
          ) {
            const index = Array.from(
              container.children
            ).indexOf(entry.target);

            if (index !== -1) {
              updateIndex(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: [0.6],
      }
    );

    Array.from(container.children).forEach((child) => {
      observer.observe(child);
    });

    return () => {
      observer.disconnect();
    };
  }, [banners.length]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
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
    !isHovering &&
    !isPausedByUser;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      className="group/carousel relative "
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={scrollRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsHovering(true)}
        onBlur={() => setIsHovering(false)}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 outline-none sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {banners.map((banner, index) => (
         <Link
         key={banner.id}
         href={banner.href}
         role="group"
         aria-roledescription="slide"
         aria-label={`${index + 1} of ${banners.length}: ${banner.title}`}
         className="group relative aspect-[16/9] w-[92%] min-w-[92%] shrink-0 snap-start overflow-hidden  transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none   sm:aspect-[16/8.5] sm:w-[49%] sm:min-w-[49%] lg:aspect-[16/8.5] lg:w-[33%] lg:min-w-[33%] xl:aspect-[16/8] xl:w-[33%] xl:min-w-[33%]"
       >
         <Image
           src={banner.imageUrl}
           alt={banner.title}
           fill
           sizes="(max-width: 639px) 92vw, (max-width: 1023px) 49vw, 33vw"
           priority={index === 0}
           className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
         />
       </Link>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevClick}
            aria-label="Previous promotion"
            className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/30 text-[#082b55] opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105  cursor-pointer hover:text-[#ff4f7b] active:scale-95 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4f7b] group-hover/carousel:opacity-100 lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            aria-label="Next promotion"
            className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/30 text-[#082b55] opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105  cursor-pointer hover:text-[#ff4f7b] active:scale-95 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4f7b] group-hover/carousel:opacity-100 lg:flex"
              >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-4 flex items-center justify-center gap-2">
            {banners.map((banner, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}: ${
                    banner.title
                  }`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative h-1.5 cursor-pointer overflow-hidden rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-8 bg-pink-100"
                      : "w-1.5 bg-slate-200 hover:bg-pink-200"
                  }`}
                >
                  {isActive && isProgressAnimating && (
                    <span
                      key={activeIndex}
                      className="promo-progress-fill absolute inset-y-0 left-0 rounded-full bg-[#ff4f7b]"
                    />
                  )}

                  {isActive && !isProgressAnimating && (
                    <span className="absolute inset-0 rounded-full bg-[#ff4f7b]" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      <style jsx>{`
        .promo-progress-fill {
          animation: promo-progress ${AUTOPLAY_INTERVAL_MS}ms
            linear forwards;
        }

        @keyframes promo-progress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}