import Link from "next/link";
import { ArrowRight, Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100svh-8.5rem)] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6">
      <div
        aria-hidden
        className="animate-float-slow absolute -top-24 -left-24 size-72 rounded-full bg-violet-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-slow absolute -right-24 -bottom-24 size-72 rounded-full bg-fuchsia-500/20 blur-3xl"
        style={{ animationDelay: "-3s" }}
      />
      <div
        aria-hidden
        className="animate-float-slow absolute top-1/3 left-1/2 size-40 -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />

      <p className="text-gradient animate-fade-up text-8xl font-extrabold tracking-tight sm:text-9xl">
        404
      </p>
      <h1 className="animate-fade-up mt-4 text-2xl font-semibold sm:text-3xl">
        This page wandered off the shelf
      </h1>
      <p
        className="animate-fade-up mt-3 max-w-md text-muted-foreground"
        style={{ animationDelay: "80ms" }}
      >
        The page or product you&apos;re looking for doesn&apos;t exist or has
        been moved. Let&apos;s get you back to the good stuff.
      </p>

      <div
        className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3"
        style={{ animationDelay: "160ms" }}
      >
        <Button asChild size="lg">
          <Link href="/products">
            Browse products
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/">
            <Home className="size-4" />
            Go home
          </Link>
        </Button>
      </div>

      <p
        className="animate-fade-up mt-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground"
        style={{ animationDelay: "240ms" }}
      >
        <Compass className="size-3.5" />
        Tip: try a category from the Shop page or search from the catalog.
      </p>
    </div>
  );
}