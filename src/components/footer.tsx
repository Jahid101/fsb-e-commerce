export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p>© {new Date().getFullYear()} ShopHub. All rights reserved.</p>
      </div>
    </footer>
  );
}