"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import type { Product } from "@/lib/api/types";

export function ProductBuyBox({ product }: { product: Product }) {
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    setQuantity(1);
  }, [product.id]);

  const outOfStock = product.stock <= 0;

  if (outOfStock) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4">
        <p className="text-sm font-medium text-muted-foreground">
          This product is currently out of stock.
        </p>
        <p className="text-xs text-muted-foreground">
          Check back soon or browse related products below.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-none"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-10 text-center text-sm font-medium tabular-nums">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-none"
            onClick={() =>
              setQuantity((value) => Math.min(product.stock, value + 1))
            }
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <AddToCartButton
          id={product.id}
          title={product.title}
          price={product.price}
          thumbnail={product.thumbnail}
          stock={product.stock}
          quantity={quantity}
          size="lg"
          className="flex-1"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {product.stock <= 10
          ? `Only ${product.stock} left in stock — order soon.`
          : `${product.stock} in stock. Ships ${product.shippingInformation.toLowerCase()}.`}
      </p>
    </div>
  );
}