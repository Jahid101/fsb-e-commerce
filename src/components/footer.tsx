import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          © {new Date().getFullYear()} ShopHub — demo e-commerce. Data from the
          bundled 582-product dataset.
        </p>
        <div className="flex items-center gap-4">
          <Link className="hover:text-foreground" href="/products">
            Browse 582 products
          </Link>
          <Link className="hover:text-foreground" href="/cart">
            Cart
          </Link>
        </div>
      </div>
    </footer>
  );
}