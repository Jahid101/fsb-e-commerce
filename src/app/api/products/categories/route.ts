import { NextResponse } from "next/server";

import { getCategories, getPriceBounds, getTotalProductCount } from "@/lib/api/products";

export async function GET() {
  return NextResponse.json({
    categories: getCategories(),
    priceBounds: getPriceBounds(),
    total: getTotalProductCount(),
  });
}