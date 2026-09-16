import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  RotateCcw,
  Sparkles,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product/product-card";
import {
  ProductPrice,
  ProductRating,
} from "@/components/product/product-price";
import { getCategories, queryProducts } from "@/lib/api/products";
import { categoryHue } from "@/lib/category-color";
import { formatPrice } from "@/lib/format";

const PERKS = [
  { icon: Truck, label: "Free shipping over $100" },
  { icon: RotateCcw, label: "30-day easy returns" },
  { icon: BadgeCheck, label: "In-stock guarantee" },
  { icon: Sparkles, label: "New picks added weekly" },
];

export default function HomePage() {
  const featured = queryProducts({ sort: "featured", limit: 8 }).data;
  const heroProducts = featured.slice(0, 3);
  const categories = getCategories()
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const heroPositions = [
    "translate-y-0 rotate-0 z-30",
    "translate-y-10 rotate-2 z-20",
    "translate-y-20 -rotate-2 z-10",
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-gradient">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-white/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -bottom-32 size-[28rem] rounded-full bg-fuchsia-400/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]"
        />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="flex flex-col items-start gap-6 text-left">
            <span
              className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur"
              style={{ animationDelay: "0ms" }}
            >
              <Sparkles className="size-3.5" />
              Fresh picks, Fast shipping
            </span>

            <h1
              className="animate-fade-up text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "100ms" }}
            >
              Shop the catalog.
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-white bg-clip-text text-transparent">
                Filter, sort, cart it, checkout.
              </span>
            </h1>

            <p
              className="animate-fade-up max-w-xl text-base text-white/85 sm:text-lg"
              style={{ animationDelay: "200ms" }}
            >
              Shop the full catalog with live search, filters, sorting and a
              fast, secure checkout.
            </p>

            <div
              className="animate-fade-up flex flex-wrap items-center gap-3"
              style={{ animationDelay: "300ms" }}
            >
              <Button
                size="lg"
                className="group relative isolate overflow-hidden bg-white text-violet-700 shadow-lg shadow-violet-950/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl hover:shadow-violet-950/35 h-12"
                asChild
              >
                <Link href="/products">
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-200/70 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full"
                  />
                  <span
                    aria-hidden
                    className="absolute -z-10 -inset-1 rounded-xl bg-white/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                  />
                  Shop all products
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden h-[26rem] items-center justify-center lg:flex">
            {heroProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className={`animate-fade-in absolute w-56 ${heroPositions[index]}`}
                style={{ animationDelay: `${400 + index * 120}ms` }}
              >
                <Card className="overflow-hidden shadow-2xl transition-transform duration-300 hover:-translate-y-1">
                  <div className="p-3 pb-0">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white/90">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="224px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <CardContent className="flex flex-col gap-1 p-3">
                    <span className="line-clamp-1 text-sm font-medium">
                      {product.title}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {formatPrice(product.price)}
                      </span>
                      <ProductRating rating={product.rating} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            <span
              className="animate-float-fast absolute top-6 -right-2 z-40 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-amber-950 shadow-lg"
              style={{ animationDelay: "700ms" }}
            >
              <Sparkles className="size-3.5" />
              Top rated picks
            </span>
          </div>
        </div>

        <div className="relative border-t border-white/15 bg-white/5 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl overflow-hidden px-4 py-3 sm:px-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex shrink-0 animate-marquee items-center gap-10">
              {[...PERKS, ...PERKS, ...PERKS, ...PERKS].map((perk, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 text-sm text-white/90"
                >
                  <perk.icon className="size-4 text-amber-200" />
                  {perk.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="animate-fade-up">
            <p className="mb-1 text-sm font-semibold tracking-wide text-primary uppercase">
              Departments
            </p>
            <h2 className="text-2xl font-semibold">Browse by category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => {
            const hue = categoryHue(category.name);
            return (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="animate-fade-up"
                style={
                  {
                    animationDelay: `${index * 50}ms`,
                    "--hue": `${hue}`,
                  } as CSSProperties
                }
              >
                <Card className="h-full border-transparent bg-[hsl(var(--hue)_78%_93%)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-[hsl(var(--hue)_45%_18%)]">
                  <CardContent className="flex items-center justify-between gap-2 p-4">
                    <span className="flex items-center gap-2.5 text-sm font-medium capitalize">
                      <span className="size-2.5 shrink-0 rounded-full bg-[hsl(var(--hue)_70%_45%)] dark:bg-[hsl(var(--hue)_70%_65%)]" />
                      {category.name.replace(/-/g, " ")}
                    </span>
                    <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs text-muted-foreground dark:bg-background/50">
                      {category.count}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="animate-fade-up">
            <p className="mb-1 text-sm font-semibold tracking-wide text-primary uppercase">
              Hand-picked for you
            </p>
            <h2 className="text-2xl font-semibold">Featured products</h2>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${(index % 8) * 60}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
