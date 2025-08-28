import Header from "@/components/Header";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function LoadingProfile() {
  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main>
        <section className="mx-auto max-w-2xl px-6 pt-14 pb-12">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-3 w-72" />
          <div className="mt-6 space-y-4">
            <div>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-2 h-11 w-full" />
            </div>
            <div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-11 w-full" />
            </div>
            <div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-11 w-full" />
            </div>
            <Skeleton className="h-11 w-32" />
          </div>
        </section>
      </main>
    </div>
  );
}


