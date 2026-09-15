import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductPrice, ProductRating } from "@/components/product/product-price";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import type { Product } from "@/lib/api/types";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;
  const slug = `/product/${product.id}`;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
      <div className="p-4 pb-0">
        <Link
          href={slug}
          className="block aspect-square w-full overflow-hidden rounded-lg bg-muted"
          aria-label={product.title}
        >
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category}
          </span>
          <ProductRating rating={product.rating} />
        </div>

        <h3 className="line-clamp-2 min-h-[2.5rem] leading-tight font-medium">
          <Link href={slug} className="transition-colors hover:text-primary">
            {product.title}
          </Link>
        </h3>

        <ProductPrice product={product} />

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex gap-1">
            {outOfStock && (
              <Badge variant="destructive" className="text-[10px]">
                Out of stock
              </Badge>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <Badge
                className="border-amber-200 bg-amber-100 text-amber-800 text-[10px] dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300"
              >
                Only {product.stock} left
              </Badge>
            )}
            {product.discountPercentage > 0 && (
              <Badge className="hidden border-rose-200 bg-rose-100 text-rose-800 text-[10px] sm:inline-flex dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300">
                SALE
              </Badge>
            )}
          </div>
          <AddToCartButton
            id={product.id}
            title={product.title}
            price={product.price}
            thumbnail={product.thumbnail}
            stock={product.stock}
            className="w-full max-w-[140px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}