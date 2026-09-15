"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Product } from "@/lib/api/types";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    setActive(0);
  }, [product.id]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
        <Image
          key={images[active % images.length]}
          src={images[active % images.length]}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-muted transition-colors",
                index === active
                  ? "ring-2 ring-ring"
                  : "hover:ring-1 hover:ring-ring/40"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${product.title} — image ${index + 1}`}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}