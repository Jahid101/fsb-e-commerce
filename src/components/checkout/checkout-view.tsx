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

function luhnCheck(value: string): boolean {
  const digits = value.replaceAll(" ", "");
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

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
      (value) => {
        const digits = value.replaceAll(" ", "");
        return /^\d{13,19}$/.test(digits) && luhnCheck(digits);
      },
      "Enter a valid card number"
    ),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY")
    .refine((value) => {
      const [month, year] = value.split("/").map(Number);
      return new Date(2000 + year, month, 1) > new Date();
    }, "Card has expired"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "3 or 4 digits"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 5.99;
const LAST_ORDER_KEY = "shophub-last-order";

interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  placedAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

function readLastOrder(): Order | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

function writeLastOrder(order: Order): void {
  try {
    window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    return;
  }
}

function formatCardNumber(value: string): string {
  return value
    .replaceAll(" ", "")
    .replace(/\D/g, "")
    .slice(0, 19)
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
  const [order, setOrder] = React.useState<Order | null>(null);

  React.useEffect(() => {
    setOrder(readLastOrder());
  }, []);

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
      const placed: Order = {
        id: `SH-${Math.floor(100000 + Math.random() * 900000)}`,
        placedAt: new Date().toISOString(),
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        shipping,
        total,
      };
      writeLastOrder(placed);
      clearCart();
      setOrder(placed);
    },
    [items, subtotal, shipping, total, clearCart]
  );

  if (order) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center sm:px-6">
        <PartyPopper className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Order confirmed!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your order. Your confirmation number is{" "}
          <span className="font-semibold text-foreground">{order.id}</span>
        </p>
        <Card className="mt-6 text-left">
          <CardContent className="flex flex-col gap-3">
            <ul className="flex flex-col gap-2 text-sm">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >
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
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Order total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </CardContent>
        </Card>
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
                  aria-describedby={
                    errors.email ? "email-error" : undefined
                  }
                  {...register("email")}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
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
                    aria-describedby={
                      errors.firstName ? "firstName-error" : undefined
                    }
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p
                      id="firstName-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
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
                    aria-describedby={
                      errors.lastName ? "lastName-error" : undefined
                    }
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p
                      id="lastName-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
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
                  aria-describedby={
                    errors.address ? "address-error" : undefined
                  }
                  {...register("address")}
                />
                {errors.address && (
                  <p
                    id="address-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
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
                    aria-describedby={
                      errors.city ? "city-error" : undefined
                    }
                    {...register("city")}
                  />
                  {errors.city && (
                    <p
                      id="city-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
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
                    aria-describedby={errors.zip ? "zip-error" : undefined}
                    {...register("zip")}
                  />
                  {errors.zip && (
                    <p
                      id="zip-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
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
                    aria-describedby={
                      errors.country ? "country-error" : undefined
                    }
                    {...register("country")}
                  />
                  {errors.country && (
                    <p
                      id="country-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
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
                  aria-describedby={
                    errors.cardName ? "cardName-error" : undefined
                  }
                  {...register("cardName")}
                />
                {errors.cardName && (
                  <p
                    id="cardName-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
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
                  aria-describedby={
                    errors.cardNumber ? "cardNumber-error" : undefined
                  }
                  {...register("cardNumber", {
                    onChange: (event) => {
                      event.target.value = formatCardNumber(event.target.value);
                    },
                  })}
                />
                {errors.cardNumber && (
                  <p
                    id="cardNumber-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
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
                    aria-describedby={
                      errors.cardExpiry ? "cardExpiry-error" : undefined
                    }
                    {...register("cardExpiry", {
                      onChange: (event) => {
                        event.target.value = formatExpiry(event.target.value);
                      },
                    })}
                  />
                  {errors.cardExpiry && (
                    <p
                      id="cardExpiry-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
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
                    aria-describedby={
                      errors.cardCvc ? "cardCvc-error" : undefined
                    }
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
                    <p
                      id="cardCvc-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
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