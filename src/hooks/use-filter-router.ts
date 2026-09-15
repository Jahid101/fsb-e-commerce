"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { toParamsString, type ParamUpdates } from "@/lib/url";

export function useFilterRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (updates: ParamUpdates, options?: { resetPage?: boolean }) => {
      router.push(pathname + toParamsString(searchParams, updates, options), {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  return { searchParams, update };
}