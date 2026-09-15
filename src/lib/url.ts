export type ParamUpdates = Record<
  string,
  string | number | null | undefined
>;

export function toParamsString(
  params: URLSearchParams,
  updates: ParamUpdates,
  options: { resetPage?: boolean } = {}
): string {
  const next = new URLSearchParams(params.toString());

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
  }

  if (options.resetPage) next.delete("_page");

  const query = next.toString();
  return query ? `?${query}` : "";
}

export function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export function numericParam(
  value: string | string[] | undefined
): number | undefined {
  const raw = firstValue(value);
  if (raw === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}