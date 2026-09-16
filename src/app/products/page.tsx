import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PackageOpen, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterPanel } from "@/components/products/filter-panel";
import { SortSelect } from "@/components/products/sort-select";
import { Pagination } from "@/components/products/pagination";
import { ProductCard } from "@/components/product/product-card";
import {
  getCategories,
  getPriceBounds,
  queryProducts,
  DEFAULT_PAGE_LIMIT,
} from "@/lib/api/products";
import type { ProductQuery, ProductSort } from "@/lib/api/types";
import { firstValue, numericParam } from "@/lib/url";

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const raw = await searchParams;
  const params = Object.keys(raw).filter(
    (key) => raw[key] !== undefined && raw[key] !== ""
  );
  const isCategoryPage = params.length === 1 && !!raw.category;

  return {
    title: "Shop all products",
    description:
      "Browse and filter a 500+ product catalog by search, category, price, rating, sorting and pagination.",
    alternates: {
      canonical: isCategoryPage
        ? `/products?category=${encodeURIComponent(firstValue(raw.category))}`
        : "/products",
    },
    openGraph: {
      url: isCategoryPage
        ? `/products?category=${encodeURIComponent(firstValue(raw.category))}`
        : "/products",
      title: "Shop all products",
      description:
        "Browse and filter a 500+ product catalog by search, category, price, rating, sorting and pagination.",
      type: "website",
    },
  };
}

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function buildCurrentHref(
  raw: Record<string, string | string[] | undefined>
): string {
  const current = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    const first = firstValue(value);
    if (first) current.set(key, first);
  }
  return current.size ? `/products?${current.toString()}` : "/products";
}

const VALID_SORTS = new Set(["featured", "price", "rating", "title"]);
const VALID_RATINGS = new Set([2, 3, 4, 4.5]);

function parseQuery(
  raw: Record<string, string | string[] | undefined>,
  validCategories: Map<string, string>
): {
  query: ProductQuery;
  buildHref: (page: number) => string;
  q: string;
  category?: string;
} {
  const q = firstValue(raw.q);
  const rawCategory = firstValue(raw.category);
  const category = rawCategory
    ? validCategories.get(rawCategory.toLowerCase())
    : undefined;
  const priceGte = numericParam(raw.price_gte);
  const priceLte = numericParam(raw.price_lte);
  const rawRating = numericParam(raw.rating_gte);
  const ratingGte =
    rawRating !== undefined && VALID_RATINGS.has(rawRating)
      ? rawRating
      : undefined;
  const inverted =
    priceGte !== undefined && priceLte !== undefined && priceGte > priceLte;
  const gte = inverted ? undefined : priceGte;
  const lte = inverted ? undefined : priceLte;
  const _sort = firstValue(raw._sort);
  const _order = firstValue(raw._order);

  const sort: ProductSort = VALID_SORTS.has(_sort)
    ? (_sort as ProductSort)
    : "featured";
  const order =
    _order === "asc" || _order === "desc"
      ? (_order as ProductQuery["order"])
      : undefined;
  const page = numericParam(raw._page) ?? 1;

  const buildHref = (pageNumber: number) => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category) next.set("category", category);
    if (gte !== undefined) next.set("price_gte", String(gte));
    if (lte !== undefined) next.set("price_lte", String(lte));
    if (ratingGte !== undefined) next.set("rating_gte", String(ratingGte));
    if (sort !== "featured") next.set("_sort", sort);
    if (order === "asc" || order === "desc") next.set("_order", order);
    if (pageNumber > 1) next.set("_page", String(pageNumber));
    const query = next.toString();
    return query ? `/products?${query}` : "/products";
  };

  return {
    query: {
      q,
      category,
      priceGte: gte,
      priceLte: lte,
      ratingGte,
      sort,
      order,
      page,
    },
    buildHref,
    q,
    category,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const raw = await searchParams;
  const categories = getCategories();
  const validCategories = new Map(
    categories.map((c) => [c.name.toLowerCase(), c.name])
  );
  const { query, buildHref, q, category } = parseQuery(raw, validCategories);

  const result = queryProducts(query);
  const { data, meta } = result;
  const priceBounds = getPriceBounds();

  if (buildHref(meta.page) !== buildCurrentHref(raw)) {
    redirect(buildHref(meta.page));
  }

  const start = (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Shop", item: "/products" },
    ...(category ? [{ name: category.replace(/-/g, " "), item: `/products?category=${encodeURIComponent(category)}` }] : []),
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `https://fsb-e-commerce.vercel.app${crumb.item}`,
    })),
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: q ? `Search results for "${q}"` : category ? category.replace(/-/g, " ") : "All products",
    numberOfItems: data.length,
    itemListElement: data.map((product, index) => ({
      "@type": "ListItem",
      position: (meta.page - 1) * meta.limit + index + 1,
      url: `https://fsb-e-commerce.vercel.app/product/${product.id}`,
      name: product.title,
      image: product.thumbnail,
    })),
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {q ? (
            <>
              Results for{" "}
              <span className="text-primary">&ldquo;{q}&rdquo;</span>
            </>
          ) : category ? (
            <>
              <span className="capitalize">{category.replace(/-/g, " ")}</span>{" "}
              products
            </>
          ) : (
            "All products"
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          Search, filter and sort the full catalog
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:sticky lg:top-16 lg:block lg:h-fit">
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            }
          >
            <FilterPanel
              categories={categories}
              priceBounds={priceBounds}
              total={meta.total}
            />
          </Suspense>
        </aside>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden"
                    aria-label="Open filters"
                  >
                    <SlidersHorizontal className="size-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-5 overflow-y-auto px-4 pb-6">
                    <Suspense
                      fallback={
                        <div className="flex flex-col gap-4">
                          <Skeleton className="h-9 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      }
                    >
                      <FilterPanel
                        categories={categories}
                        priceBounds={priceBounds}
                        total={meta.total}
                      />
                    </Suspense>
                  </div>
                </SheetContent>
              </Sheet>
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {meta.total === 0 ? 0 : start}–{end}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">{meta.total}</span>
              </p>
            </div>
            <Suspense fallback={<Skeleton className="h-8 w-[190px]" />}>
              <SortSelect />
            </Suspense>
          </div>

          {data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${(index % 6) * 40}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center gap-4 border-dashed p-12 text-center">
              <PackageOpen className="size-12 text-muted-foreground" />
              <div>
                <h2 className="text-lg font-semibold">No products found</h2>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  No products match your current filters. Try adjusting the
                  search term, category or price range.
                </p>
              </div>
              <Button asChild>
                <Link href="/products">Clear all filters</Link>
              </Button>
            </Card>
          )}

          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            buildHref={buildHref}
          />
        </div>
      </div>
    </div>
  );
}