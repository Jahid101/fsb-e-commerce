"use client";

import { ArrowDownWideNarrow } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterRouter } from "@/hooks/use-filter-router";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price|asc", label: "Price: Low to High" },
  { value: "price|desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
  { value: "title|asc", label: "Name: A to Z" },
  { value: "title|desc", label: "Name: Z to A" },
];

export function SortSelect() {
  const { searchParams, update } = useFilterRouter();

  const sort = searchParams.get("_sort") ?? "featured";
  const order = searchParams.get("_order");
  const current =
    order === "asc" || order === "desc"
      ? `${sort}|${order}`
      : SORT_OPTIONS.some((option) => option.value === sort)
        ? sort
        : "featured";

  return (
    <div className="flex items-center gap-2">
      <ArrowDownWideNarrow className="hidden size-4 text-muted-foreground sm:block" />
      <Select
        value={current}
        onValueChange={(value) => {
          const [newSort, newOrder] = value.split("|");
          update({
            _sort: newSort,
            _order: newOrder ?? null,
            _page: null,
          });
        }}
      >
        <SelectTrigger className="w-[190px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}