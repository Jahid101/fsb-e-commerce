"use client";

import { useTransition } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

interface AddToCartButtonProps {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
  quantity?: number;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function AddToCartButton({
  id,
  title,
  price,
  thumbnail,
  stock,
  quantity = 1,
  className,
  size = "default",
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [pending, startTransition] = useTransition();

  const outOfStock = stock <= 0;

  if (outOfStock) {
    return (
      <Button className={className} size={size} disabled>
        Out of stock
      </Button>
    );
  }

  return (
    <Button
      className={className}
      size={size}
      disabled={pending}
      onClick={() =>
        startTransition(() => {
          addItem({ id, title, price, thumbnail, stock }, quantity);
          toast.success(`${title.slice(0, 40)} added to cart`);
        })
      }
    >
      <ShoppingCart className="size-4" />
      Add to cart
    </Button>
  );
}