import type { MetadataRoute } from "next";

import { allProducts, getCategories } from "@/lib/api/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://shophub-demo.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/products`, lastModified: new Date() },
    { url: `${baseUrl}/cart`, lastModified: new Date() },
    { url: `${baseUrl}/checkout`, lastModified: new Date() },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getCategories().map(
    (category) => ({
      url: `${baseUrl}/products?category=${encodeURIComponent(category.name)}`,
      lastModified: new Date(),
    })
  );

  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(product.meta.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}