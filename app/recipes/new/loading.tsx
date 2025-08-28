import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingNewRecipe() {
  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main>
        <section className="mx-auto max-w-3xl px-6 pt-14 pb-12">
          <Skeleton className="h-7 w-48" />
          <div className="mt-6 grid grid-cols-1 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-11 w-full" />
              </div>
            ))}
            <Skeleton className="h-11 w-32" />
          </div>
        </section>
      </main>
    </div>
  );
}


