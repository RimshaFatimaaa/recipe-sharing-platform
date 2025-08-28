import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { fetchRecipeSocialStats } from "@/lib/supabase/social";
import { toggleLike } from "@/app/recipes/[id]/server-actions";
import DashboardSearch from "@/components/recipes/DashboardSearch";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage({ searchParams }: { searchParams?: { [k: string]: string | string[] | undefined } }) {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const supabase = createSupabaseServerClient();
  // Build filters from URL params
  const q = typeof searchParams?.q === "string" ? searchParams!.q.trim() : "";
  const cat = typeof searchParams?.cat === "string" ? searchParams!.cat.trim() : "";
  const diff = typeof searchParams?.diff === "string" ? searchParams!.diff.trim() : "";

  let query = supabase
    .from("recipes")
    .select("id, title, description, cooking_time, difficulty, category, user_id");

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }
  if (cat) {
    query = query.eq("category", cat);
  }
  if (diff) {
    query = query.eq("difficulty", diff);
  }

  const { data: recipes, error } = await query.order("id", { ascending: false }).limit(24);

  // Build a username map without relying on DB relationship metadata
  let userIdToUsername = new Map<string, string | null>();
  if (!error && recipes && recipes.length > 0) {
    const uniqueUserIds = Array.from(new Set(recipes.map((r: any) => r.user_id)));
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, email")
      .in("id", uniqueUserIds as string[]);
    for (const p of (profiles as Array<{ id: string; username: string | null; email: string | null }> | null) ?? []) {
      const display = p.username ? `@${p.username}` : (p.email ?? null);
      userIdToUsername.set(p.id, display);
    }
  }

  // Social stats for cards
  const stats = await fetchRecipeSocialStats((recipes ?? []).map((r: any) => r.id), user?.id ?? null);

  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main>
        <section className="mx-auto max-w-6xl px-6 pt-14 pb-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Recent Recipes</h1>
              <p className="mt-1 text-sm text-black/70 dark:text-white/70">Latest recipes from everyone</p>
            </div>
            <a href="/recipes/new" className="inline-flex items-center h-10 px-6 rounded-md bg-foreground text-background text-sm font-medium cursor-pointer hover:opacity-90 transition-all shadow-md">Add Recipe</a>
          </div>

          <DashboardSearch />

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
                (recipes ?? []).map((r: { id: string; title: string; description: string | null; cooking_time: number | null; difficulty: string | null; category: string | null; user_id: string }) => {
                  const authorDisplay = userIdToUsername.get(r.user_id) || null;
                  return (
                  <div
                    key={r.id}
                    className="rounded-xl border-2 border-black/[.20] dark:border-white/[.28] p-4 bg-background hover:bg-black/[.03] dark:hover:bg-white/[.06] shadow-md hover:shadow-lg transition-all"
                  >
                    <a href={`/recipes/${r.id}`} className="font-semibold hover:underline block">{r.title}</a>
                    {authorDisplay ? (
                      <div className="mt-0.5 text-xs text-black/60 dark:text-white/60">By {authorDisplay}</div>
                    ) : null}
                    {r.description ? (
                      <div className="mt-1 text-sm text-black/70 dark:text-white/70 line-clamp-2">{r.description}</div>
                    ) : null}
                    <div className="mt-3 flex items-center justify-between text-xs text-black/60 dark:text-white/60">
                      <span>
                        {r.cooking_time != null ? `${r.cooking_time} mins` : ""}
                        {r.cooking_time != null && r.difficulty ? " • " : ""}
                        {r.difficulty ?? ""}
                      </span>
                      <span>{r.category ?? ""}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <form action={toggleLike.bind(null, r.id)}>
                        <button className={`h-7 px-3 rounded-md border-2 border-black/[.16] dark:border-white/[.20] ${stats[r.id]?.liked_by_me ? 'bg-black text-white dark:bg-white dark:text-black' : ''} cursor-pointer hover:opacity-90 transition-all shadow-sm`}> {stats[r.id]?.liked_by_me ? '♥' : '♡'} {stats[r.id]?.likes_count ?? 0}</button>
                      </form>
                      <a href={`/recipes/${r.id}#comments`} className="hover:underline text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white font-medium transition-colors">💬 {stats[r.id]?.comments_count ?? 0}</a>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


