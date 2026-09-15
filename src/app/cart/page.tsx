import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the items in your shopping cart before checkout.",
};

export default function CartPage() {
  return <CartView />;
}