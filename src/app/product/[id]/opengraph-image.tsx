import { ImageResponse } from "next/og";

import { getProduct } from "@/lib/api/products";
import { categoryHue } from "@/lib/category-color";

export const alt = "ShopHub product";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const EMBEDDABLE_TYPES = new Set(["image/png", "image/jpeg", "image/jpg"]);

function toDataUri(bytes: Uint8Array, mimeType: string): string {
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return `data:${mimeType};base64,${btoa(binary)}`;
}

async function fetchImageData(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const contentTypeHeader = response.headers.get("content-type") ?? "";
    const mimeType = contentTypeHeader.split(";")[0].trim().toLowerCase();
    if (!EMBEDDABLE_TYPES.has(mimeType)) return null;
    const buffer = await response.arrayBuffer();
    return toDataUri(new Uint8Array(buffer), mimeType);
  } catch {
    return null;
  }
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(Number(id));

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#18181b",
            color: "#fff",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Product not found
        </div>
      ),
      { ...size }
    );
  }

  const candidates = [product.thumbnail, ...product.images];
  let imageSrc: string | null = null;
  for (const candidate of candidates) {
    imageSrc = await fetchImageData(candidate);
    if (imageSrc) break;
  }

  const original = product.price / (1 - product.discountPercentage / 100);
  const hue = categoryHue(product.category);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 80px",
          background: "#fff",
          color: "#18181b",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignSelf: "stretch",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <div
            style={{
              color: "#6d28d9",
              fontSize: 24,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {product.category.replace(/-/g, " ")}
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {product.title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
            }}
          >
            <span
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#6d28d9",
              }}
            >
              ${product.price.toFixed(2)}
            </span>
            {original > product.price + 0.005 && (
              <span
                style={{
                  fontSize: 28,
                  color: "#9ca3af",
                  textDecoration: "line-through",
                }}
              >
                ${original.toFixed(2)}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#6b7280",
              display: "flex",
              gap: 20,
            }}
          >
            <span>Rating {product.rating.toFixed(1)} / 5</span>
            <span>·</span>
            <span>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
        </div>

        {imageSrc ? (
          <div
            style={{
              width: 380,
              height: 380,
              borderRadius: 24,
              overflow: "hidden",
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={imageSrc} width={380} height={380} />
          </div>
        ) : (
          <div
            style={{
              width: 380,
              height: 380,
              borderRadius: 24,
              background: `linear-gradient(135deg, hsl(${hue} 45% 55%), hsl(${hue} 35% 40%))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 160,
              fontWeight: 800,
            }}
          >
            {product.category.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}