import { Skeleton } from "@/components/ui/skeleton";

export default function ClubLoading() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Hero skeleton */}
      <div className="py-20 px-4 text-center">
        <Skeleton className="h-5 w-36 mx-auto rounded-full mb-4" />
        <Skeleton className="h-12 w-56 mx-auto mb-4" />
        <Skeleton className="h-5 w-full max-w-lg mx-auto mb-2" />
        <Skeleton className="h-5 w-3/4 max-w-lg mx-auto mb-6" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-12 w-36 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>

      {/* Benefits skeleton */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 rounded-[16px] bg-surface-container text-center space-y-3">
              <Skeleton className="h-12 w-12 rounded-full mx-auto" />
              <Skeleton className="h-5 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Tiers skeleton */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-[16px] bg-surface-container space-y-4">
              <Skeleton className="h-7 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
