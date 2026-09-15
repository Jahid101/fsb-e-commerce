"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartItemCount } from "@/store/cart";

export function CartButton() {
  const count = useCartItemCount();

  return (
    <Button variant="outline" size="icon" asChild className="relative">
      <Link href="/cart" aria-label={`Cart, ${count} items`}>
        <ShoppingCart className="size-4" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}