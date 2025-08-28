import Header from "@/components/Header";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main>
        <section className="mx-auto max-w-6xl px-6 pt-14 pb-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="h-6 w-40 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
              <div className="mt-2 h-3 w-64 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-black/[.08] dark:border-white/[.12] p-4">
                <Skeleton className="h-5 w-3/5" />
                <div className="mt-2">
                  <SkeletonText lines={2} />
                </div>
                <div className="mt-3 flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}


