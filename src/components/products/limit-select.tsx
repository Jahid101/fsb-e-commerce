"use client";

import { Rows3 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterRouter } from "@/hooks/use-filter-router";

export const PAGE_LIMITS = ["12", "24", "50", "100", "all"] as const;
export type PageLimit = (typeof PAGE_LIMITS)[number];

export const DEFAULT_PAGE_LIMIT_VALUE = "12";

const LIMIT_LABELS: Record<PageLimit, string> = {
  "12": "12 per page",
  "24": "24 per page",
  "50": "50 per page",
  "100": "100 per page",
  all: "Show all",
};

export function isPageLimit(value: string): value is PageLimit {
  return (PAGE_LIMITS as readonly string[]).includes(value);
}

export function LimitSelect() {
  const { searchParams, update } = useFilterRouter();

  const raw = searchParams.get("_limit");
  const current = raw && isPageLimit(raw) ? raw : DEFAULT_PAGE_LIMIT_VALUE;

  return (
    <div className="flex items-center gap-2">
      <Rows3 className="hidden size-4 text-muted-foreground sm:block" />
      <Select
        value={current}
        onValueChange={(value) => {
          const next = value as PageLimit;
          update(
            {
              _limit: next === DEFAULT_PAGE_LIMIT_VALUE ? null : next,
              _page: null,
            },
            { resetPage: true }
          );
        }}
      >
        <SelectTrigger className="w-[150px]" aria-label="Items per page">
          <SelectValue placeholder="Per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {PAGE_LIMITS.map((option) => (
              <SelectItem key={option} value={option}>
                {LIMIT_LABELS[option]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}