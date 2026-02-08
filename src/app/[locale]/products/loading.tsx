import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title skeleton */}
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-80 mb-8" />

        {/* Filter bar skeleton */}
        <div className="flex gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-[16px] overflow-hidden bg-surface-container">
              <Skeleton className="h-56 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
