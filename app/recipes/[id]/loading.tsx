import Header from "@/components/Header";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function LoadingRecipe() {
  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main>
        <section className="px-6 pt-14 pb-12">
          <div className="mx-auto max-w-2xl rounded-2xl border border-black/[.08] dark:border-white/[.12] bg-background shadow-sm p-8">
            <Skeleton className="h-8 w-64" />
            <div className="mt-2">
              <SkeletonText lines={3} />
            </div>
            <div className="mt-8">
              <Skeleton className="h-5 w-32" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="mt-8">
              <Skeleton className="h-5 w-32" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


