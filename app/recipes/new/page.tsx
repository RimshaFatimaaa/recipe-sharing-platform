import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createRecipe } from "./server-actions";

export default async function NewRecipePage({ searchParams }: { searchParams?: { [k: string]: string | string[] | undefined } }) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth/login");

  const error = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main>
        <section className="mx-auto max-w-3xl px-6 pt-14 pb-12">
          <div className="mb-4">
            <a
              href="/dashboard"
              className="inline-flex items-center h-9 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] text-sm hover:bg-black/[.03] dark:hover:bg-white/[.06] transition-all shadow-sm"
            >
              ← Back to Dashboard
            </a>
          </div>
          
          <h1 className="text-2xl font-semibold">Create a recipe</h1>
          <p className="mt-1 text-sm text-black/70 dark:text-white/70">Fill out the details below.</p>
          {/* Intentionally not rendering inline error UI per request */}

          <div className="mt-6 rounded-xl border-2 border-black/[.16] dark:border-white/[.20] p-6 bg-background shadow-md">
            <form className="grid grid-cols-1 gap-4" action={createRecipe}>
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input name="title" required className="w-full h-11 px-3 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background focus:outline-none focus:ring-2 focus:ring-black/[.20] dark:focus:ring-white/[.30] transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea name="description" rows={3} className="w-full px-3 py-2 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background focus:outline-none focus:ring-2 focus:ring-black/[.20] dark:focus:ring-white/[.30] transition-all shadow-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Cooking time (min)</label>
                  <input name="cooking_time" type="number" min={0} className="w-full h-11 px-3 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background focus:outline-none focus:ring-2 focus:ring-black/[.20] dark:focus:ring-white/[.30] transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Difficulty</label>
                  <select name="difficulty" className="w-full h-11 px-3 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background focus:outline-none focus:ring-2 focus:ring-black/[.20] dark:focus:ring-white/[.30] transition-all shadow-sm">
                    <option value="">Select</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <input name="category" className="w-full h-11 px-3 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background focus:outline-none focus:ring-2 focus:ring-black/[.20] dark:focus:ring-white/[.30] transition-all shadow-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Ingredients</label>
                <textarea name="ingredients" rows={4} placeholder="One per line" className="w-full px-3 py-2 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background focus:outline-none focus:ring-2 focus:ring-black/[.20] dark:focus:ring-white/[.30] transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-sm mb-1">Instructions</label>
                <textarea name="instructions" rows={6} className="w-full px-3 py-2 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background focus:outline-none focus:ring-2 focus:ring-black/[.20] dark:focus:ring-white/[.30] transition-all shadow-sm" />
              </div>
              <div className="pt-2">
                <button className="h-11 px-6 rounded-md bg-foreground text-background text-sm font-medium cursor-pointer hover:opacity-90 transition-all shadow-md">Create recipe</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}


