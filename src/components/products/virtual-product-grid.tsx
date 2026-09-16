"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/lib/api/types";

const ROW_ESTIMATE = 420;

function useGridColumns(): number {
  const [columns, setColumns] = useState(1);

  useLayoutEffect(() => {
    const handheld = window.matchMedia("(min-width: 640px)");
    const wide = window.matchMedia("(min-width: 1280px)");
    const compute = () => setColumns(wide.matches ? 3 : handheld.matches ? 2 : 1);
    compute();
    handheld.addEventListener("change", compute);
    wide.addEventListener("change", compute);
    return () => {
      handheld.removeEventListener("change", compute);
      wide.removeEventListener("change", compute);
    };
  }, []);

  return columns;
}

export function VirtualProductGrid({
  products,
}: {
  products: ProductCardData[];
}) {
  const columns = useGridColumns();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  const rows = useMemo(() => {
    const chunks: ProductCardData[][] = [];
    for (let i = 0; i < products.length; i += columns) {
      chunks.push(products.slice(i, i + columns));
    }
    return chunks;
  }, [products, columns]);

  useLayoutEffect(() => {
    const compute = () => {
      if (listRef.current) {
        setScrollMargin(
          listRef.current.getBoundingClientRect().top + window.scrollY
        );
      }
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_ESTIMATE,
    overscan: 6,
    scrollMargin,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div ref={listRef} className="relative">
      <div style={{ height: virtualizer.getTotalSize() }}>
        <div
          style={{
            transform: `translateY(${(virtualItems[0]?.start ?? 0) - scrollMargin}px)`,
          }}
        >
          {virtualItems.map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {rows[virtualRow.index].map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}