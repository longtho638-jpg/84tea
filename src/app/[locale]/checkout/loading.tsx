import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-40 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Shipping form skeleton */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-6 rounded-[16px] bg-surface-container space-y-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-12 w-full rounded-[12px]" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 rounded-[12px]" />
                <Skeleton className="h-12 rounded-[12px]" />
              </div>
              <Skeleton className="h-12 w-full rounded-[12px]" />
              <Skeleton className="h-12 w-full rounded-[12px]" />
              <Skeleton className="h-24 w-full rounded-[12px]" />
            </div>

            {/* Payment method skeleton */}
            <div className="p-6 rounded-[16px] bg-surface-container space-y-4">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-16 w-full rounded-[12px]" />
              <Skeleton className="h-14 w-full rounded-full" />
            </div>
          </div>

          {/* Order summary skeleton */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-[16px] bg-surface-container space-y-4 sticky top-24">
              <Skeleton className="h-6 w-40" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-16 w-16 rounded-[8px]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-outline-variant space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
