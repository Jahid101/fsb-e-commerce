import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-20 text-center sm:px-6">
      <p className="text-6xl font-semibold text-muted-foreground">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page or product you&apos;re looking for doesn&apos;t exist or has
        been removed.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/products">
          Browse products
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}