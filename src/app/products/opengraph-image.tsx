import { ImageResponse } from "next/og";

import { allProducts, getCategories } from "@/lib/api/products";

export const alt = "ShopHub — Shop all products";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function ProductsOpenGraphImage() {
  const productCount = allProducts.length;
  const categoryCount = getCategories().length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "sans-serif",
          color: "#18181b",
          background: "#fff",
        }}
      >
        <div
          style={{
            width: 420,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            padding: "64px 56px",
            backgroundImage:
              "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #a21caf 100%)",
            color: "#fff",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 38, fontWeight: 800 }}>ShopHub</div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.75)", marginTop: 8 }}>
            Great products, honest prices
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "0 72px",
            gap: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            Shop the
            <br />
            full catalog
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#52525b",
              lineHeight: 1.4,
              maxWidth: 560,
            }}
          >
            Search, filter and sort {productCount} products across {categoryCount}{" "}
            categories with honest pricing and real reviews.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#6d28d9",
              color: "#fff",
              fontSize: 26,
              fontWeight: 700,
              padding: "18px 34px",
              borderRadius: 999,
            }}
          >
            Start shopping
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}