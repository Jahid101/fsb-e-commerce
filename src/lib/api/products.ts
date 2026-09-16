import productsJson from "@/data/products.json";

import type {
  CategorySummary,
  PriceBounds,
  Product,
  ProductListResponse,
  ProductQuery,
} from "./types";

export const allProducts = (
  productsJson as unknown as { products: Product[] }
).products;

export const DEFAULT_PAGE_LIMIT = 12;
export const MAX_PAGE_LIMIT = 48;

export function originalPrice(product: Product): number {
  if (!product.discountPercentage || product.discountPercentage <= 0) {
    return product.price;
  }
  return product.price / (1 - product.discountPercentage / 100);
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function matchesQuery(product: Product, q: string): boolean {
  const needle = normalizeText(q);
  if (!needle) return true;

  const haystack = [
    product.title,
    product.description,
    product.brand,
    product.category,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

function sortProducts(products: Product[], sort: ProductQuery["sort"], order: ProductQuery["order"]): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "featured":
    default:
      sorted.sort((a, b) => {
        const aInStock = a.stock > 0 ? 1 : 0;
        const bInStock = b.stock > 0 ? 1 : 0;
        return bInStock - aInStock || b.rating - a.rating || b.stock - a.stock;
      });
      break;
  }

  if (order === "desc" && (sort === "price" || sort === "title")) {
    sorted.reverse();
  }

  return sorted;
}

export function queryProducts(raw: ProductQuery = {}): ProductListResponse {
  const {
    q,
    category,
    priceGte,
    priceLte,
    ratingGte,
    sort = "featured",
    order = "asc",
    page = 1,
    limit = DEFAULT_PAGE_LIMIT,
    excludeIds = [],
  } = raw;

  let filtered = allProducts.filter((product) => {
    if (excludeIds.includes(product.id)) return false;
    if (category && product.category !== category) return false;
    if (q && !matchesQuery(product, q)) return false;
    if (priceGte && product.price < priceGte) return false;
    if (priceLte && product.price > priceLte) return false;
    if (ratingGte && product.rating < ratingGte) return false;
    return true;
  });

  filtered = sortProducts(filtered, sort, order);

  const total = filtered.length;
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), MAX_PAGE_LIMIT);
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);
  const safePage = Math.min(Math.max(Math.trunc(page), 1), totalPages);
  const start = (safePage - 1) * safeLimit;

  return {
    data: filtered.slice(start, start + safeLimit),
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    },
  };
}

export function getProduct(id: number): Product | undefined {
  return allProducts.find((product) => product.id === id);
}

export function getCategories(): CategorySummary[] {
  const counts = new Map<string, number>();
  for (const product of allProducts) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getPriceBounds(): PriceBounds {
  let min = Infinity;
  let max = -Infinity;
  for (const product of allProducts) {
    if (product.price < min) min = product.price;
    if (product.price > max) max = product.price;
  }
  return { min: Math.floor(min * 100) / 100, max: Math.ceil(max * 100) / 100 };
}

export function getRelatedProducts(id: number, limit = 4): Product[] {
  const product = getProduct(id);
  if (!product) return [];

  const sameCategory = queryProducts({
    category: product.category,
    excludeIds: [id],
    sort: "featured",
    limit,
  }).data;

  if (sameCategory.length >= limit) return sameCategory;

  const fillers = queryProducts({
    excludeIds: [id, ...sameCategory.map((p) => p.id)],
    sort: "featured",
    limit: limit - sameCategory.length,
  }).data;

  return [...sameCategory, ...fillers];
}

export function getTotalProductCount(): number {
  return allProducts.length;
}

export function searchTags(): string[] {
  const tags = new Set<string>();
  for (const product of allProducts) {
    for (const tag of product.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}