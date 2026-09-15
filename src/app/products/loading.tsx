import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <Skeleton className="mb-2 h-8 w-64" />
      <Skeleton className="mb-8 h-4 w-40" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <Skeleton className="h-8 w-48 self-end" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-lg border p-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}