import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

function getVisiblePages(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items: (number | "…")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (page - previous > 1) items.push("…");
    items.push(page);
    previous = page;
  }
  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1"
    >
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={buildHref(currentPage - 1)} aria-label="Previous page">
            <ChevronLeft className="size-4" />
          </Link>
        ) : (
          <span aria-label="Previous page">
            <ChevronLeft className="size-4" />
          </span>
        )}
      </Button>

      {pages.map((page, index) =>
        page === "…" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1.5 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            className={cn(page === currentPage && "pointer-events-none")}
            asChild
          >
            <Link href={buildHref(page)} aria-current={page === currentPage ? "page" : undefined}>
              {page}
            </Link>
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={buildHref(currentPage + 1)} aria-label="Next page">
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span aria-label="Next page">
            <ChevronRight className="size-4" />
          </span>
        )}
      </Button>
    </nav>
  );
}