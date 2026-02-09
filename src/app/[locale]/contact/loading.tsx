import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Hero skeleton */}
      <div className="py-16 px-4 text-center">
        <Skeleton className="h-5 w-24 mx-auto rounded-full mb-4" />
        <Skeleton className="h-10 w-72 mx-auto mb-4" />
        <Skeleton className="h-5 w-full max-w-lg mx-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 mb-6" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
            {/* Social links skeleton */}
            <div className="flex gap-3 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>

          {/* Contact form skeleton */}
          <div className="p-6 rounded-[16px] bg-surface-container space-y-4">
            <Skeleton className="h-7 w-36 mb-2" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 rounded-[12px]" />
              <Skeleton className="h-12 rounded-[12px]" />
            </div>
            <Skeleton className="h-12 w-full rounded-[12px]" />
            <Skeleton className="h-12 w-full rounded-[12px]" />
            <Skeleton className="h-32 w-full rounded-[12px]" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
