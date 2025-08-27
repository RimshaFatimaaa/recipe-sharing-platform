import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const supabase = createSupabaseServerClient();
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("id, title, description, created_at")
    .order("created_at", { ascending: false })
    .limit(24);

  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main>
        <section className="mx-auto max-w-6xl px-6 pt-14 pb-12">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">Latest recipes from the community</p>
          <div className="mt-4">
            <a href="/recipes/new" className="inline-flex items-center h-10 px-4 rounded-md bg-foreground text-background text-sm font-medium cursor-pointer">Add Recipes</a>
          </div>

          {error ? (
            <div className="mt-6 text-sm text-red-600">
              Failed to load recipes: {error.message}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(recipes ?? []).length === 0 ? (
                <div className="col-span-full text-sm text-black/60 dark:text-white/60">
                  No recipes yet. Check back soon!
                </div>
              ) : (
                (recipes ?? []).map((r: { id: string; title: string; description: string | null; created_at: string | null }) => (
                  <a
                    key={r.id}
                    href={`#recipe-${r.id}`}
                    className="rounded-xl border border-black/[.08] dark:border-white/[.12] p-4 hover:bg-black/[.03] dark:hover:bg-white/[.06] transition-colors"
                  >
                    <div className="text-xs text-black/60 dark:text-white/60">
                      {new Date(r.created_at ?? "").toLocaleDateString()}
                    </div>
                    <div className="mt-1 font-medium line-clamp-2">{r.title}</div>
                    {r.description ? (
                      <div className="mt-2 text-sm text-black/70 dark:text-white/70 line-clamp-3">{r.description}</div>
                    ) : null}
                  </a>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


