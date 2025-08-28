import { Skeleton } from "@/components/ui/Skeleton";

export default function SavedRecipesLoading() {
  return (
    <div className="font-sans min-h-screen">
      <div className="px-6 pt-14 pb-12">
        <div className="mx-auto max-w-2xl mb-4">
          <Skeleton className="h-9 w-32" />
        </div>
        
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </div>

          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-black/[.08] dark:border-white/[.12] p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-64 mb-2" />
                    <div className="space-y-2 mb-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <Skeleton className="h-4 w-full mb-4" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <Skeleton className="h-5 w-20 mb-2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-52" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-5 w-24 mb-2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/[.08] dark:border-white/[.12]">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
