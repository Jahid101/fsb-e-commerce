import { Star } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { originalPrice } from "@/lib/api/products";
import type { Product } from "@/lib/api/types";

import { Badge } from "@/components/ui/badge";

export function ProductPrice({ product }: { product: Product }) {
  const original = originalPrice(product);

  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-semibold text-foreground">
        {formatPrice(product.price)}
      </span>
      {original > product.price + 0.005 && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(original)}
          </span>
          <Badge variant="secondary" className="text-[10px]">
            -{Math.round(product.discountPercentage)}%
          </Badge>
        </>
      )}
    </div>
  );
}

export function ProductRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
    </span>
  );
}