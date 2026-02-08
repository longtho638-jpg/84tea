import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative h-[70vh] min-h-[500px]">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* Featured products skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[16px] overflow-hidden">
              <Skeleton className="h-64 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
