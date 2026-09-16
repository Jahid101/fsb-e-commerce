# ShopHub — Next.js E-Commerce (500+ products)

A production-style e-commerce storefront built with the **Next.js App Router**, **TypeScript**, **Tailwind CSS v4** and **shadcn/ui**, backed by a locally bundled dataset of **582 products**.

Live site: [fsb-e-commerce.vercel.app](https://fsb-e-commerce.vercel.app/)

---

## Features

- **Product listing** with URL-driven filtering: full-text search (`q`), category, price range, minimum rating, sorting (featured / price / rating / name) and pagination.
- **Refresh-safe URLs**: every filter lives in the query string, so state survives reloads and is shareable.
- **Product detail pages** with image gallery, price/discount, stock states (including out-of-stock), reviews, product specs, related products, JSON-LD structured data and SEO metadata.
- **Cart** — Zustand store persisted to `localStorage`: add/remove, quantity steppers, live totals, free-shipping threshold.
- **Checkout** — React Hook Form + Zod validated form (contact, shipping, payment) with an order-confirmation state.
- **Dark / light / system theme** via `next-themes` + shadcn CSS variables.
- Loading skeletons, empty states, a global error boundary and a custom 404 page.
- Responsive layout (mobile → desktop), accessible controls, `sitemap.xml`.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.3.5 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui components |
| State (cart) | Zustand v5 with `persist` middleware |
| Forms | React Hook Form + Zod v4 + `@hookform/resolvers` |
| Theme | next-themes |
| Icons | lucide-react |
| Fonts | Geist (next/font) |

---

## Getting started

```bash
npm install          # install dependencies
npm run dev          # start dev server on http://localhost:3000
```

Production:

```bash
npm run build        # type-checks + builds (Turbopack)
npm run start        # serve the production build
```

Requires Node.js ≥ 20.9 (Next.js 16 requirement).

---

## Project structure

```text
src/
├── app/
│   ├── api/                       # Route Handlers (HTTP API layer)
│   │   └── products/
│   │       ├── route.ts           #   GET /api/products      (query params)
│   │       ├── [id]/route.ts      #   GET /api/products/[id] (404 handling)
│   │       └── categories/route.ts#   GET /api/products/categories
│   ├── products/page.tsx          # Listing page (Server Component, URL filters)
│   ├── product/[id]/page.tsx      # Detail page (SSR, generateMetadata, JSON-LD)
│   ├── cart/page.tsx              # Cart (server shell + client view)
│   ├── checkout/page.tsx          # Checkout (server shell + client view)
│   ├── layout.tsx                 # Root layout: theme provider, header, footer
│   ├── page.tsx                   # Home / landing
│   ├── loading.tsx, error.tsx, not-found.tsx
│   └── sitemap.ts
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   ├── product/                   # ProductCard, Gallery, BuyBox, AddToCartButton…
│   ├── products/                  # FilterPanel, SortSelect, Pagination
│   ├── cart/ checkout/            # feature views
│   ├── header.tsx footer.tsx theme-toggle.tsx
├── lib/
│   ├── api/                       # ← API service layer (framework-agnostic)
│   │   ├── types.ts               #   Product, ProductQuery, responses…
│   │   └── products.ts            #   queryProducts/getProduct/getCategories/
│   │                              #   getRelatedProducts/getPriceBounds…
│   ├── format.ts  url.ts
├── store/cart.ts                  # Zustand cart store + selectors
└── data/products.json             # bundled 582-product dataset
```

---

## Data & API architecture

- **No external API at runtime.** The app ships with `src/data/products.json` (582 products, 24 categories, full DummyJSON-style schema). This works identically on a laptop and on Vercel serverless.
- **Dataset**: generated from DummyJSON’s public 194-product feed by a seeded, deterministic generator: each source product is cloned 3× with unique `id`s (1–582) and `SKU`s, varied titles/prices/ratings/stocks, regenerated reviews and images. 5 products are intentionally `stock = 0` to exercise out-of-stock states.
- **Two consumption modes** share the same service functions:

  1. **In-process (default for pages)**. Server Components import `src/lib/api/products.ts` directly and call `queryProducts(...)`. No network hop, no duplicate fetches, works on serverless. `searchParams` from the URL are parsed into a typed `ProductQuery` and applied server-side.
  2. **HTTP (for client components / external consumers)**. The same logic is exposed through Route Handlers at `/api/products` with json-server-style query params:

     | Param | Meaning |
     | --- | --- |
     | `q` | full-text search (title, description, brand, tags, category) |
     | `category` | exact category slug |
     | `price_gte`, `price_lte` | price range |
     | `rating_gte` | minimum rating |
     | `_sort` | `featured` \| `price` \| `rating` \| `title` |
     | `_order` | `asc` \| `desc` |
     | `_page`, `_limit` | pagination (clamped) |

  Both modes return `{ data, meta: { total, page, limit, totalPages } }` (or a product / `404` JSON for `[id]`). **Components never contain query/filter/pagination logic** — that all lives in `src/lib/api/products.ts`, so the two modes can never drift.

- **Related products** (`getRelatedProducts`) prefer same-category, in-stock, top-rated items and backfill from elsewhere, avoiding empty rails.

---

## Server vs. Client components

| Concern | Runs on | Why |
| --- | --- | --- |
| Data fetching & filtering | **Server** (`/products`, `/product/[id]`) | `await searchParams`/`params` in Next 16; no client bundle, no duplicate calls, SEO-ready HTML. |
| Product images, prices, meta, JSON-LD | **Server** | Rendered before JS loads; `generateMetadata` + schema.org markup for rich results. |
| Filter controls, sort dropdown | **Client** (small islands) | Need `useRouter`/`useSearchParams` to update the URL; wrapped in `<Suspense>`. |
| Cart state & badge | **Client** (Zustand + `localStorage`) | Cart is per-browser; persist middleware rehydrates after mount. |
| Gallery, buy box, quantity | **Client** | Interactive state that doesn’t need SEO. |
| Checkout form | **Client** | RHF + Zod run in-browser validation. |

Rule of thumb used: *server by default, client only where interactivity or browser state demands it.*

## State management

- **Cart** — single Zustand store (`src/store/cart.ts`) persisted to `localStorage` under `shophub-cart`. Components subscribe via fine-grained selectors (`useCartItemCount`, `useCartSubtotal`) so unrelated re-renders stay minimal.
- **URL** — the catalog “state” (search/filters/sort/page) is **the URL itself**; there is no duplicated filter state to keep in sync.

## Performance decisions

- **No duplicate fetches**: pages query the bundled data once on the server; the HTTP API only exists for client/ephemeral needs.
- **`useMemo`** for expensive derived totals (cart/checkout summaries).
- **`useEffect` only for real side effects** (syncing local input state to URL params); the debounced search uses a ref-guarded timer with cleanup.
- **Memoized callbacks** (`useCallback` in the filter router) and small, purpose-built client islands rather than large client trees; `React.memo`-style isolation is implicit via Server Components.
- **Images** use `next/image` with remote patterns for `cdn.dummyjson.com` and `picsum.photos`; responsive `sizes`, lazy loading, `priority` on the hero gallery image.
- **Pagination is server-rendered anchor links** building on the current query string — cheap, indexable, refresh-safe.
- **Build output** is mostly static (`/`, `/cart`, `/checkout`, `/sitemap.xml`) with on-demand server rendering for catalog/detail routes.

---

## Deploy on Vercel

```bash
npm i -g vercel
vercel            # link + deploy preview
vercel --prod     # production
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new). No environment variables are required — the dataset is bundled.

> The API routes work on Vercel because they read the bundled JSON (no filesystem/DB dependency). Server Components use the same functions in-process, so nothing extra is deployed.

---

## Notes / omissions

- Checkout is simulated: placing an order validates the form, shows a confirmation, and clears the cart; no payment backend.
- Product images for generated variants come from `picsum.photos` seeds — internet required for full visuals.
- `npm run lint` is not configured (the create-next-app scaffold didn’t include ESLint); type-checking runs as part of `npm run build`.