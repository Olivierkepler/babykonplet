"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

type GalleryProps = {
  images: string[];
  name: string;
  onOpen: (index: number) => void;
};

type FullscreenViewerProps = {
  open: boolean;
  images: string[];
  name: string;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  onClose: () => void;
};

const MAX_GALLERY_IMAGES = 6;

export default function ProductGallery({
  images,
  name,
}: ProductGalleryProps) {
  const safeImages = useMemo(() => {
    const cleanedImages = images
      .filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0
      )
      .map((image) => image.trim());

    const uniqueImages = Array.from(new Set(cleanedImages)).slice(
      0,
      MAX_GALLERY_IMAGES
    );

    return uniqueImages.length > 0
      ? uniqueImages
      : ["/images/product-placeholder.png"];
  }, [images]);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [safeImages]);

  function openViewer(index: number) {
    setSelectedIndex(index);
    setViewerOpen(true);
  }

  return (
    <>
      <section className="w-full">
        <MobileGallery
          images={safeImages}
          name={name}
          onOpen={openViewer}
        />

        <DesktopGallery
          images={safeImages}
          name={name}
          onOpen={openViewer}
        />
      </section>

      <FullscreenViewer
        open={viewerOpen}
        images={safeImages}
        name={name}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={setSelectedIndex}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
}

function DesktopGallery({
  images,
  name,
  onOpen,
}: GalleryProps) {
  return (
    <div className="hidden grid-cols-2 gap-3 lg:grid">
      {images.map((image, index) => (
        <DesktopImageCard
          key={`${image}-${index}`}
          image={image}
          name={name}
          onClick={() => onOpen(index)}
        />
      ))}
    </div>
  );
}

function DesktopImageCard({
  image,
  name,
  onClick,
}: {
  image: string;
  name: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${name} image`}
      className="group relative flex aspect-[3/4] min-w-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#f7f7f7] transition duration-300 hover:border-slate-400 hover:shadow-md"
    >
      <img
        src={image}
        alt={`${name} product view`}
        className="h-full w-full object-contain p-0 transition duration-500 group-hover:scale-[1.015]"
      />

      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.025]" />
    </button>
  );
}

function MobileGallery({
  images,
  name,
  onOpen,
}: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const previous = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1
    );
  }, [images.length]);

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchStartX.current = event.targetTouches[0].clientX;
    touchEndX.current = null;
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchEndX.current = event.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) {
      next();
    }

    if (distance < -50) {
      previous();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }

  return (
    <div className="lg:hidden">
      <div
        className="relative overflow-hidden rounded-xl border border-slate-200 bg-[#f7f7f7]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() => onOpen(activeIndex)}
          aria-label={`Open ${name} image`}
          className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden"
        >
          <img
            src={images[activeIndex]}
            alt={`${name} product view`}
            className="h-full w-full object-contain"
          />
        </button>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-950 shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next product image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-950 shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, imageIndex) => {
            const selected = activeIndex === imageIndex;

            return (
              <button
                key={`${image}-${imageIndex}`}
                type="button"
                onClick={() => setActiveIndex(imageIndex)}
                aria-label={`Select ${name} image`}
                className={`flex h-[76px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-[#f7f7f7] transition ${
                  selected
                    ? "border-slate-950"
                    : "border-slate-200"
                }`}
              >
                <img
                  src={image}
                  alt={`${name} thumbnail`}
                  className="h-full w-full object-contain"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function FullscreenViewer({
  open,
  images,
  name,
  selectedIndex,
  onSelectedIndexChange,
  onClose,
}: FullscreenViewerProps) {
  const previous = useCallback(() => {
    onSelectedIndexChange(
      selectedIndex === 0
        ? images.length - 1
        : selectedIndex - 1
    );
  }, [
    images.length,
    onSelectedIndexChange,
    selectedIndex,
  ]);

  const next = useCallback(() => {
    onSelectedIndexChange(
      selectedIndex === images.length - 1
        ? 0
        : selectedIndex + 1
    );
  }, [
    images.length,
    onSelectedIndexChange,
    selectedIndex,
  ]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [next, onClose, open, previous]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} image gallery`}
      className="fixed inset-0 z-[200] bg-white"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-md sm:left-6 sm:top-6"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="flex h-full items-center justify-center px-4 pb-24 pt-16 sm:px-20 sm:pb-28 sm:pt-20">
        <img
          src={images[selectedIndex]}
          alt={`${name} full-screen product view`}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={previous}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-950 shadow-md sm:left-6 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-950 shadow-md sm:right-6 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 bg-white px-3 py-3 sm:px-6">
            <div className="mx-auto flex max-w-4xl justify-start gap-2 overflow-x-auto sm:justify-center">
              {images.map((image, imageIndex) => {
                const selected = selectedIndex === imageIndex;

                return (
                  <button
                    key={`${image}-${imageIndex}`}
                    type="button"
                    onClick={() =>
                      onSelectedIndexChange(imageIndex)
                    }
                    aria-label={`Open ${name} image`}
                    className={`flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-white transition sm:h-20 sm:w-16 ${
                      selected
                        ? "border-slate-950"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${name} gallery thumbnail`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}