import type { Metadata } from "next";

import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your order with a validated, React Hook Form + Zod checkout form.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}