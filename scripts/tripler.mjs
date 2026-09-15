import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'products.json'), 'utf8'));
const N = raw.length;

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260916);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (min, max) => min + rand() * (max - min);
const round = (n) => Math.round(n * 100) / 100;

const PRO_SUFFIXES = ['Pro', 'Plus', 'Max', 'Elite', 'Advanced', 'XL', '2026 Edition'];
const LITE_SUFFIXES = ['Lite', 'Essential', 'Compact', 'Value', 'Basic', 'Mini', 'Classic'];

const REVIEWERS = [
  'Eleanor Collins', 'Lucas Gordon', 'Mia Rodriguez', 'Noah Bennett', 'Olivia Hayes',
  'Ethan Walker', 'Sophia Reed', 'Liam Cooper', 'Ava Mitchell', 'Mason Carter',
  'Isabella Price', 'James Foster', 'Amelia Brooks', 'Benjamin Ward', 'Charlotte Gray',
  'Henry Stewart', 'Zoe Patterson', 'Daniel Hughes', 'Grace Campbell', 'Samuel Allen',
  'Emily Ross', 'David Murphy', 'Chloe Bailey', 'Michael Turner', 'Lily Anderson',
  'Matthew Scott', 'Nora Kelly', 'Joseph Rivera', 'Ruby Sanders', 'Jack Morgan',
];

const NEGATIVE_COMMENTS = [
  'Would not recommend!', 'Not as described at all.', 'Extremely disappointed.',
  'Poor quality for the price.', 'Fell apart within a week.',
];
const MIXED_COMMENTS = [
  'Average quality, does the job.', 'Decent but overpriced.', 'Nothing special.',
  'It works but feels cheap.', 'Okay for the price.', 'Mixed feelings about this one.',
];
const POSITIVE_COMMENTS = [
  'Very satisfied!', 'Highly impressed!', 'Exactly as described.', 'Great value for money.',
  'Works as expected.', 'Excellent build quality.', 'Better than expected.',
  'Would buy again.', 'Fantastic product, fast delivery.',
];

function makeReviews(rating) {
  const count = Math.floor(between(1, 8));
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const reviewerName = pick(REVIEWERS);
    let r;
    if (rating >= 4.4) {
      r = Math.round(between(4, 5));
    } else if (rating >= 3.6) {
      r = Math.round(between(3, 5));
    } else {
      r = Math.round(between(1, 3));
    }
    const pool = r >= 4 ? POSITIVE_COMMENTS : r === 3 ? MIXED_COMMENTS : NEGATIVE_COMMENTS;
    const email = reviewerName.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/ /g, '.') + '@x.dummyjson.com';
    const daysAgo = Math.floor(between(0, 360));
    reviews.push({
      rating: r,
      comment: pick(pool),
      date: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      reviewerName,
      reviewerEmail: email,
    });
  }
  return reviews;
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function makeImages(title, count) {
  const base = slugify(title);
  return Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${base}${i > 0 ? `-${i + 1}` : ''}/800/800`);
}

const ELEVATED = ['Pro', 'Plus', 'Max', 'Elite', 'Advanced', 'XL', '2026 Edition'];
const BUDGET = ['Lite', 'Essential', 'Compact', 'Value', 'Basic', 'Mini', 'Classic'];

function mutate(p, id, kind) {
  const suffix = pick(kind === 'elite' ? ELEVATED : BUDGET);
  const isElite = kind === 'elite';
  const priceScale = isElite ? between(1.15, 1.6) : between(0.65, 0.95);
  const discount = isElite ? between(10, 35) : between(0, 12);
  const stock = Math.floor(between(0, 260));
  const rating = isElite ? between(3.8, 4.9) : between(3.4, 4.6);
  const availability = stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'In Stock';
  const newTitle = `${p.title} ${suffix}`;
  const slug = slugify(newTitle);
  return {
    ...p,
    id,
    title: newTitle,
    price: round(p.price * priceScale),
    discountPercentage: round(discount),
    rating: round(rating),
    stock,
    availabilityStatus: availability,
    sku: `${p.sku}-${suffix.toUpperCase().replace(/ /g, '')}`,
    weight: round(p.weight * between(0.9, 1.2)),
    dimensions: {
      width: round(p.dimensions.width * between(0.9, 1.2)),
      height: round(p.dimensions.height * between(0.9, 1.2)),
      depth: round(p.dimensions.depth * between(0.9, 1.2)),
    },
    reviews: makeReviews(rating),
    minimumOrderQuantity: Math.max(1, Math.floor(between(1, p.minimumOrderQuantity || 12))),
    meta: {
      createdAt: new Date(Date.now() - Math.floor(between(100, 400)) * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      barcode: Math.floor(between(1e12, 1e13 - 1)).toString(),
      qrCode: `https://dummyjson.com/icon/${slug}/150`,
    },
    images: makeImages(newTitle, 3),
    thumbnail: `https://picsum.photos/seed/${slug}/300/300`,
  };
}

const products = [];
for (let i = 0; i < N; i++) {
  const original = raw[i];
  products.push(original);
  products.push(mutate(original, N + original.id, 'elite'));
  products.push(mutate(original, 2 * N + original.id, 'budget'));
}

const out = { products };
const outPath = path.join(ROOT, 'products.final.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

const ids = new Set(products.map((p) => p.id));
const skus = new Set(products.map((p) => p.sku));
console.log(`total products: ${products.length}`);
console.log(`unique ids: ${ids.size}`);
console.log(`unique skus: ${skus.size}`);
console.log(`out of stock: ${products.filter((p) => p.stock === 0).length}`);
console.log(`categories: ${new Set(products.map((p) => p.category)).size}`);
console.log(`missing description: ${products.filter((p) => !p.description).length}`);
console.log(`missing reviews: ${products.filter((p) => !p.reviews || p.reviews.length === 0).length}`);
console.log(`products with no images: ${products.filter((p) => !p.images || p.images.length === 0).length}`);
console.log(`wrote ${outPath}`);