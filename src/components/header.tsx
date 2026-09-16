"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Store } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { CartButton } from "@/components/cart-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", exact: true },
  { href: "/products", label: "Shop", exact: false },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-brand-gradient text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Store className="size-4" />
          </span>
          <span className="text-lg text-gradient">ShopHub</span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 sm:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-gradient transition-opacity",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:hidden">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-2">
                {NAV_ITEMS.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
              <SheetFooter>
                <p className="text-xs text-muted-foreground">
                  Great products, honest prices.
                </p>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <ThemeToggle />
          <CartButton />
        </div>
      </div>
    </header>
  );
}