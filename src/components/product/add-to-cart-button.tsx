"use client";

import * as React from "react";
import { Check, ShoppingCart } from "lucide-react";
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
  const [pending, startTransition] = React.useTransition();
  const [added, setAdded] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const outOfStock = stock <= 0;

  if (outOfStock) {
    return (
      <Button className={className} size={size} disabled>
        Out of stock
      </Button>
    );
  }

  const handleAdd = () => {
    if (added) return;
    startTransition(() => {
      addItem({ id, title, price, thumbnail, stock }, quantity);
      toast.success(`${title.slice(0, 40)} added to cart`);
    });
    setAdded(true);
    timerRef.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Button
      className={className}
      size={size}
      disabled={pending}
      onClick={handleAdd}
      variant={added ? "outline" : undefined}
      aria-live="polite"
    >
      <span
        className={cnIconTransition(added)}
      >
        {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
      </span>
      {added ? "Added!" : "Add to cart"}
    </Button>
  );
}

function cnIconTransition(added: boolean) {
  return added
    ? "text-emerald-500 transition-transform duration-200 scale-110 [&>svg]:text-emerald-500"
    : "transition-transform duration-200";
}