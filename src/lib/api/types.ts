export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
}

export type ProductSort = "featured" | "price" | "rating" | "title";
export type SortOrder = "asc" | "desc";

export interface ProductQuery {
  q?: string;
  category?: string;
  priceGte?: number;
  priceLte?: number;
  ratingGte?: number;
  sort?: ProductSort;
  order?: SortOrder;
  page?: number;
  limit?: number;
  excludeIds?: number[];
}

export interface ProductListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: ProductListMeta;
}

export interface CategorySummary {
  name: string;
  count: number;
}

export interface PriceBounds {
  min: number;
  max: number;
}