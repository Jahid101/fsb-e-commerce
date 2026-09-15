import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductCard } from "@/components/product/product-card";
import { ProductPrice, ProductRating } from "@/components/product/product-price";
import { formatPrice } from "@/lib/format";
import {
  getProduct,
  getRelatedProducts,
  originalPrice,
} from "@/lib/api/products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(Number(id));

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.title,
    description: product.description.slice(0, 155),
    openGraph: {
      title: `${product.title} | ShopHub`,
      description: product.description.slice(0, 155),
      images: [product.thumbnail],
      type: "website",
    },
  };
}

function availabilityLabel(product: NonNullable<ReturnType<typeof getProduct>>) {
  if (product.stock <= 0) return { label: "Out of stock", tone: "destructive" as const };
  if (product.stock <= 10) return { label: "Low stock", tone: "secondary" as const };
  return { label: "In stock", tone: "default" as const };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(Number(id));

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product.id, 4);
  const stock = availabilityLabel(product);
  const original = originalPrice(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.length > 0 ? product.images : product.thumbnail,
    sku: product.sku,
    category: product.category,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://shophub-demo.vercel.app/product/${product.id}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews.length,
    },
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/products" className="hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="capitalize hover:text-foreground"
        >
          {product.category.replace(/-/g, " ")}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="line-clamp-1 max-w-[220px] truncate text-foreground">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductGallery product={product} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant={stock.tone}>{stock.label}</Badge>
            <span className="text-muted-foreground">SKU: {product.sku}</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {product.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <ProductRating rating={product.rating} />
            <span className="text-muted-foreground">
              {product.reviews.length}{" "}
              {product.reviews.length === 1 ? "review" : "reviews"}
            </span>
            <span className="text-muted-foreground">by {product.brand}</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">
                {formatPrice(product.price)}
              </span>
              {original > product.price + 0.005 && (
                <span className="text-muted-foreground line-through">
                  {formatPrice(original)}
                </span>
              )}
            </div>
            {original > product.price + 0.005 && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                You save {formatPrice(original - product.price)} (
                {Math.round(product.discountPercentage)}% off)
              </p>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <ProductBuyBox product={product} />

          <Separator />

          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-3">
              <Truck className="size-4 shrink-0 text-muted-foreground" />
              <span>{product.shippingInformation}</span>
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw className="size-4 shrink-0 text-muted-foreground" />
              <span>{product.returnPolicy}</span>
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
              <span>{product.warrantyInformation}</span>
            </li>
          </ul>
        </div>
      </div>

      <Separator className="my-10" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Customer reviews ({product.reviews.length})
          </h2>
          {product.reviews.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {product.reviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="flex flex-col gap-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {review.reviewerName}
                      </span>
                      <time
                        className="text-xs text-muted-foreground"
                        dateTime={review.date}
                      >
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <ProductRating rating={review.rating} />
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No reviews yet for this product.
            </p>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Product details</h2>
          <Card>
            <CardContent className="grid grid-cols-1 gap-x-8 gap-y-3 p-4 sm:grid-cols-2">
              {[
                ["Brand", product.brand],
                ["Category", product.category.replace(/-/g, " ")],
                ["Weight", `${product.weight} g`],
                [
                  "Dimensions",
                  `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`,
                ],
                ["Minimum order", `${product.minimumOrderQuantity}`],
                ["Return policy", product.returnPolicy],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium capitalize">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Related products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}