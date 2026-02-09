import { Skeleton } from "@/components/ui/skeleton";

export default function FranchiseLoading() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Hero skeleton */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Skeleton className="h-5 w-32 mx-auto rounded-full" />
          <Skeleton className="h-12 w-96 mx-auto" />
          <Skeleton className="h-5 w-full max-w-xl mx-auto" />
          <Skeleton className="h-5 w-3/4 max-w-xl mx-auto" />
          <div className="flex gap-4 justify-center pt-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-2xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-[16px]" />
            ))}
          </div>
        </div>
      </div>

      {/* Benefits skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-5 w-96 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 rounded-[16px] bg-surface-container space-y-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>

      {/* Models skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Skeleton className="h-10 w-48 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-[16px] bg-surface-container space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
