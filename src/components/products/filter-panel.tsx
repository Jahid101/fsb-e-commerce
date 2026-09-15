"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useFilterRouter } from "@/hooks/use-filter-router";
import { clamp, formatPrice } from "@/lib/format";
import type { CategorySummary } from "@/lib/api/types";

interface FilterPanelProps {
  categories: CategorySummary[];
  priceBounds: { min: number; max: number };
  total: number;
}

const RATING_OPTIONS = [
  { value: "4.5", label: "4.5 & up" },
  { value: "4", label: "4 & up" },
  { value: "3", label: "3 & up" },
  { value: "2", label: "2 & up" },
];

function humanizeCategory(name: string): string {
  return name.replace(/-/g, " ");
}

export function FilterPanel({
  categories,
  priceBounds,
  total,
}: FilterPanelProps) {
  const { searchParams, update } = useFilterRouter();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const rating = searchParams.get("rating_gte") ?? "any";
  const priceGte = searchParams.get("price_gte") ?? "";
  const priceLte = searchParams.get("price_lte") ?? "";

  const [searchValue, setSearchValue] = React.useState(q);

  const priceMin = Math.floor(priceBounds.min);
  const priceMax = Math.ceil(priceBounds.max);
  const parsedGte = priceGte ? parseFloat(priceGte) : NaN;
  const parsedLte = priceLte ? parseFloat(priceLte) : NaN;
  const [minPrice, setMinPrice] = React.useState(
    Number.isFinite(parsedGte) ? clamp(parsedGte, priceMin, priceMax) : priceMin
  );
  const [maxPrice, setMaxPrice] = React.useState(
    Number.isFinite(parsedLte) ? clamp(parsedLte, priceMin, priceMax) : priceMax
  );

  React.useEffect(() => {
    setSearchValue(q);
  }, [q]);
  React.useEffect(() => {
    setMinPrice(
      Number.isFinite(parsedGte) ? clamp(parsedGte, priceMin, priceMax) : priceMin
    );
  }, [priceGte, priceMin, priceMax]);
  React.useEffect(() => {
    setMaxPrice(
      Number.isFinite(parsedLte) ? clamp(parsedLte, priceMin, priceMax) : priceMax
    );
  }, [priceLte, priceMin, priceMax]);

  const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const applySearch = React.useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        update({ q: value || null, _page: null }, { resetPage: true });
      }, 350);
    },
    [update]
  );

  React.useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    },
    []
  );

  const clearAll = () =>
    update({
      q: null,
      category: null,
      rating_gte: null,
      price_gte: null,
      price_lte: null,
      _sort: null,
      _order: null,
      _page: null,
    });

  const hasFilters = Boolean(q || category !== "all" || rating !== "any" || priceGte || priceLte);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label htmlFor="filters-search" className="mb-2 block">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="filters-search"
            type="search"
            placeholder="Search products…"
            className="pl-8"
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
              applySearch(event.target.value);
            }}
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block">Category</Label>
        <Select
          value={category}
          onValueChange={(value) =>
            update(
              { category: value === "all" ? null : value, _page: null },
              { resetPage: true }
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  <span className="capitalize">{humanizeCategory(c.name)}</span>
                  <span className="text-muted-foreground">({c.count})</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block">Minimum rating</Label>
        <Select
          value={rating}
          onValueChange={(value) =>
            update(
              { rating_gte: value === "any" ? null : value, _page: null },
              { resetPage: true }
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="any">Any rating</SelectItem>
              {RATING_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <div className="space-y-2 items-center justify-between gap-2">
          <Label>Price range</Label>
          <p className="text-sm font-medium text-primary tabular-nums">
            {formatPrice(minPrice)} – {formatPrice(maxPrice)}
          </p>
        </div>
        <Slider
          aria-label="Price range"
          min={priceMin}
          max={priceMax}
          step={1}
          value={[minPrice, maxPrice]}
          onValueChange={(values) => {
            setMinPrice(values[0]);
            setMaxPrice(values[1]);
          }}
          onValueCommit={(values) =>
            update(
              {
                price_gte:
                  values[0] > priceMin ? String(values[0]) : null,
                price_lte: values[1] < priceMax ? String(values[1]) : null,
                _page: null,
              },
              { resetPage: true }
            )
          }
          className="py-2"
        />
        <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceMin)}</span>
          <span>{formatPrice(priceMax)}</span>
        </div>
      </div>

      {hasFilters && (
        <>
          <Separator />
          <Button variant="outline" size="sm" onClick={clearAll}>
            <X className="size-4" />
            Clear all filters
          </Button>
        </>
      )}

      <p className="text-sm text-muted-foreground">
        {total} product{total === 1 ? "" : "s"} match
      </p>
    </div>
  );
}