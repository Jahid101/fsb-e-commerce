"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, PartyPopper } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";

const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Enter your street address"),
  city: z.string().min(2, "Enter your city"),
  zip: z.string().min(3, "Enter a valid ZIP / postal code").max(10),
  country: z.string().min(2, "Enter your country"),
  cardName: z.string().min(2, "Enter the name on the card"),
  cardNumber: z
    .string()
    .refine(
      (value) => /^\d{13,19}$/.test(value.replaceAll(" ", "")),
      "Enter a valid card number"
    ),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "3 or 4 digits"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 5.99;

function formatCardNumber(value: string): string {
  return value
    .replaceAll(" ", "")
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export function CheckoutView() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderId, setOrderId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zip: "",
      country: "",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const subtotal = React.useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const shipping =
    items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const onSubmit = React.useCallback(
    async (values: CheckoutValues) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const id = `SH-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      setOrderId(id);
    },
    [clearCart]
  );

  if (orderId) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center sm:px-6">
        <PartyPopper className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Order confirmed!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your order. Your confirmation number is{" "}
          <span className="font-semibold text-foreground">{orderId}</span>
        </p>
        <Button className="mt-6 h-10" asChild>
          <Link href="/products">
            Continue shopping
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center sm:px-6">
        <CheckCircle2 className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add products to your cart before proceeding to checkout.
        </p>
        <Button className="mt-6 h-10" asChild>
          <Link href="/products">
            Browse products
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping address</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    autoComplete="given-name"
                    placeholder="Alex"
                    aria-invalid={Boolean(errors.firstName)}
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    autoComplete="family-name"
                    placeholder="Morgan"
                    aria-invalid={Boolean(errors.lastName)}
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Street address</Label>
                <Input
                  id="address"
                  autoComplete="street-address"
                  placeholder="123 Main Street"
                  aria-invalid={Boolean(errors.address)}
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    autoComplete="address-level2"
                    placeholder="New York"
                    aria-invalid={Boolean(errors.city)}
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="zip">ZIP / Postcode</Label>
                  <Input
                    id="zip"
                    autoComplete="postal-code"
                    placeholder="10001"
                    aria-invalid={Boolean(errors.zip)}
                    {...register("zip")}
                  />
                  {errors.zip && (
                    <p className="text-sm text-destructive">
                      {errors.zip.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    autoComplete="country-name"
                    placeholder="United States"
                    aria-invalid={Boolean(errors.country)}
                    {...register("country")}
                  />
                  {errors.country && (
                    <p className="text-sm text-destructive">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cardName">Name on card</Label>
                <Input
                  id="cardName"
                  autoComplete="cc-name"
                  placeholder="Alex Morgan"
                  aria-invalid={Boolean(errors.cardName)}
                  {...register("cardName")}
                />
                {errors.cardName && (
                  <p className="text-sm text-destructive">
                    {errors.cardName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cardNumber">Card number</Label>
                <Input
                  id="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  aria-invalid={Boolean(errors.cardNumber)}
                  {...register("cardNumber", {
                    onChange: (event) => {
                      event.target.value = formatCardNumber(event.target.value);
                    },
                  })}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-destructive">
                    {errors.cardNumber.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                  <Input
                    id="cardExpiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    aria-invalid={Boolean(errors.cardExpiry)}
                    {...register("cardExpiry", {
                      onChange: (event) => {
                        event.target.value = formatExpiry(event.target.value);
                      },
                    })}
                  />
                  {errors.cardExpiry && (
                    <p className="text-sm text-destructive">
                      {errors.cardExpiry.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    aria-invalid={Boolean(errors.cardCvc)}
                    {...register("cardCvc", {
                      onChange: (event) => {
                        event.target.value = event.target.value.replace(
                          /\D/g,
                          ""
                        );
                      },
                    })}
                  />
                  {errors.cardCvc && (
                    <p className="text-sm text-destructive">
                      {errors.cardCvc.message}
                    </p>
                  )}
                </div>
              </div>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting
                  ? "Placing order…"
                  : `Place order · ${formatPrice(total)}`}
              </Button>
            </CardContent>
          </Card>
        </form>

        <Card className="h-fit lg:sticky lg:top-16">
          <CardHeader>
            <CardTitle className="text-lg">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ul className="flex flex-col gap-3 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3">
                  <span className="line-clamp-1 text-muted-foreground">
                    {item.title}
                    <span className="text-foreground">
                      {" "}
                      × {item.quantity}
                    </span>
                  </span>
                  <span className="whitespace-nowrap font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This is a secure, encrypted checkout. No card is charged until you
              review your order.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}