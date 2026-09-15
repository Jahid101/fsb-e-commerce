import { ImageResponse } from "next/og";

export const alt = "ShopHub — Great Products, Honest Prices";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 80px",
          backgroundImage:
            "linear-gradient(135deg, #4c1d95 0%, #6d28d9 40%, #a21caf 75%, #be185d 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            ShopHub
          </div>
        </div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          Great products, honest prices.
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "rgba(255,255,255,0.82)",
            display: "flex",
            gap: 24,
          }}
        >
          <span>500+ products</span>
          <span>·</span>
          <span>24 categories</span>
          <span>·</span>
          <span>Fast checkout</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}