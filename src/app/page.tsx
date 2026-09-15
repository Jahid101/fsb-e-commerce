import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product/product-card";
import { getCategories, getTotalProductCount, queryProducts } from "@/lib/api/products";

export const metadata = {
  title: "Home",
};

export default function HomePage() {
  const total = getTotalProductCount();
  const featured = queryProducts({ sort: "featured", limit: 8 }).data;
  const categories = getCategories()
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return (
    <div>
      <section className="border-b">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              <PackageSearch className="size-3.5" />
              {total} products in one demo storefront
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Shop the catalog. Filter, sort, cart it, checkout.
            </h1>
            <p className="max-w-xl text-muted-foreground">
              A production-style Next.js e-commerce demo powered by a bundled
              582-product dataset with URL-driven search, filtering, pagination,
              product pages, a persistent cart and a validated checkout.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop all products
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/product/1">View a product page</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Browse by category</h2>
            <p className="text-muted-foreground">
              {categories.length} of {getCategories().length} categories
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.name} href={`/products?category=${encodeURIComponent(category.name)}`}>
              <Card className="h-full transition-colors hover:bg-accent">
                <CardContent className="flex items-center justify-between gap-2 p-4">
                  <span className="text-sm font-medium capitalize">
                    {category.name.replace(/-/g, " ")}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {category.count}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Featured products</h2>
            <p className="text-muted-foreground">Top-rated, in stock</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}