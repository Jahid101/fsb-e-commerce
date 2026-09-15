import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PackageOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

const VALID_SORTS = new Set(["featured", "price", "rating", "title"]);

function parseQuery(raw: Record<string, string | string[] | undefined>): {
  query: ProductQuery;
  buildHref: (page: number) => string;
  q: string;
  category: string;
} {
  const q = firstValue(raw.q);
  const category = firstValue(raw.category);
  const priceGte = numericParam(raw.price_gte);
  const priceLte = numericParam(raw.price_lte);
  const ratingGte = numericParam(raw.rating_gte);
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
    if (priceGte !== undefined) next.set("price_gte", String(priceGte));
    if (priceLte !== undefined) next.set("price_lte", String(priceLte));
    if (ratingGte !== undefined) next.set("rating_gte", String(ratingGte));
    if (sort !== "featured") next.set("_sort", sort);
    if (order === "asc" || order === "desc") next.set("_order", order);
    if (pageNumber > 1) next.set("_page", String(pageNumber));
    const query = next.toString();
    return query ? `/products?${query}` : "/products";
  };

  return {
    query: { q, category, priceGte, priceLte, ratingGte, sort, order, page },
    buildHref,
    q,
    category,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const raw = await searchParams;
  const { query, buildHref, q, category } = parseQuery(raw);

  const result = queryProducts(query);
  const { data, meta } = result;
  const categories = getCategories();
  const priceBounds = getPriceBounds();

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
        <aside className="lg:sticky lg:top-16 lg:h-fit">
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
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {meta.total === 0 ? 0 : start}–{end}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{meta.total}</span>
            </p>
            <Suspense
              fallback={<Skeleton className="h-8 w-[190px]" />}
            >
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