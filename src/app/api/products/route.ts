import { NextResponse } from "next/server";

import {
  queryProducts,
} from "@/lib/api/products";
import type { ProductQuery, SortOrder } from "@/lib/api/types";

const VALID_SORTS = new Set(["featured", "price", "rating", "title"]);

function numberParam(
  value: string | null,
  fallback?: number
): number | undefined {
  if (value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapParams(searchParams: URLSearchParams): ProductQuery {
  const sort = searchParams.get("_sort") ?? undefined;
  return {
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    priceGte: numberParam(searchParams.get("price_gte")),
    priceLte: numberParam(searchParams.get("price_lte")),
    ratingGte: numberParam(searchParams.get("rating_gte")),
    sort: sort && VALID_SORTS.has(sort) ? (sort as ProductQuery["sort"]) : "featured",
    order: (searchParams.get("_order") === "desc" || searchParams.get("_order") === "asc")
      ? (searchParams.get("_order") as SortOrder)
      : undefined,
    page: numberParam(searchParams.get("_page"), 1),
    limit: numberParam(searchParams.get("_limit")),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = queryProducts(mapParams(searchParams));
  return NextResponse.json(result);
}