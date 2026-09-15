import { NextResponse } from "next/server";

import { getProduct } from "@/lib/api/products";

function parseProductId(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  return Number(value);
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/products/[id]">
) {
  const { id } = await ctx.params;

  const productId = parseProductId(id);
  if (productId === null) {
    return NextResponse.json(
      { error: "Invalid product id. It must be a positive integer." },
      { status: 400 }
    );
  }

  const product = getProduct(productId);
  if (!product) {
    return NextResponse.json(
      { error: `Product with id ${productId} was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}