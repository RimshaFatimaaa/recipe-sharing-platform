import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { fetchRecipeSocialStats } from "@/lib/supabase/social";
import SavedRecipesList from "@/components/recipes/SavedRecipesList";

export default async function SavedRecipesPage() {
  const supabase = createSupabaseServerClient();
  const currentUser = await getUser();
  
  if (!currentUser) {
    redirect("/auth/login");
  }

  // Fetch all recipes that the current user has liked
  const { data: likedRecipes, error: likesError } = await supabase
    .from("likes")
    .select(`
      recipe_id,
      recipes!inner(
        id, 
        title, 
        description, 
        ingredients, 
        instructions, 
        cooking_time, 
        difficulty, 
        category, 
        user_id
      )
    `)
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (likesError) {
    console.error("Error fetching liked recipes:", likesError);
  }

  // Extract recipe data from the joined result
  const recipes = likedRecipes?.map(like => like.recipes) || [];

  // Get social stats for all liked recipes
  const recipeIds = recipes.map(r => r.id);
  const statsMap = await fetchRecipeSocialStats(recipeIds, currentUser.id);

  // Get usernames for recipe authors
  const userIds = [...new Set(recipes.map(r => r.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, email")
    .in("id", userIds);

  const userIdToUsername = new Map(profiles?.map(p => [p.id, p.username || p.email.split('@')[0]]) ?? []);

  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main>
        <section className="px-6 pt-14 pb-12">
          <div className="mx-auto max-w-4xl mb-4">
            <a
              href="/dashboard"
              className="inline-flex items-center h-9 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] text-sm hover:bg-black/[.03] dark:hover:bg-white/[.06] transition-all shadow-sm"
            >
              ← Back to Dashboard
            </a>
          </div>
          
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold">Saved Recipes</h1>
              <p className="mt-2 text-black/70 dark:text-white/70">
                {recipes.length === 0 
                  ? "You haven't saved any recipes yet" 
                  : `${recipes.length} recipe${recipes.length === 1 ? '' : 's'} you've liked`
                }
              </p>
            </div>

            {likesError ? (
              <div className="text-center text-red-600 dark:text-red-400">
                Error loading saved recipes. Please try again.
              </div>
            ) : (
              <SavedRecipesList 
                recipes={recipes} 
                statsMap={statsMap}
                userIdToUsername={userIdToUsername}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
