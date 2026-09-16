"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Product } from "@/lib/api/types";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const [active, setActive] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setActive(0);
  }, [product.id]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight")
        setActive((value) => (value + 1) % images.length);
      if (event.key === "ArrowLeft")
        setActive((value) => (value - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, images.length]);

  const image = images[active % images.length];

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge image of ${product.title}`}
          className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl border bg-muted"
        >
          <Image
            key={image}
            src={image}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </button>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((thumb, index) => (
              <button
                key={`${thumb}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border bg-muted transition-all",
                  index === active
                    ? "ring-2 ring-ring"
                    : "opacity-70 hover:opacity-100 hover:ring-1 hover:ring-ring/40"
                )}
                aria-label={`View image ${index + 1}`}
                aria-pressed={index === active}
              >
                <Image
                  src={thumb}
                  alt={`${product.title} — image ${index + 1}`}
                  fill
                  loading="lazy"
                  sizes="25vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.title} image viewer`}
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close image viewer"
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive((value) =>
                    (value - 1 + images.length) % images.length
                  );
                }}
                aria-label="Previous image"
                className="absolute left-3 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive((value) => (value + 1) % images.length);
                }}
                aria-label="Next image"
                className="absolute right-3 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="size-6" />
              </button>
              <p className="absolute top-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                {active + 1} / {images.length}
              </p>
            </>
          )}

          <div
            className="relative aspect-square max-h-[85svh] w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              key={image}
              src={image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}