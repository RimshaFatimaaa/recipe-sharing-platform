"use client";

import { toggleLike } from "@/app/recipes/[id]/server-actions";
import { useRouter } from "next/navigation";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: string | null;
  instructions: string | null;
  cooking_time: number | null;
  difficulty: string | null;
  category: string | null;
  user_id: string;
}

interface SocialStats {
  likes_count: number;
  comments_count: number;
  liked_by_me: boolean;
}

interface SavedRecipesListProps {
  recipes: Recipe[];
  statsMap: Record<string, SocialStats>;
  userIdToUsername: Map<string, string>;
}

export default function SavedRecipesList({ recipes, statsMap, userIdToUsername }: SavedRecipesListProps) {
  const router = useRouter();

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💔</div>
        <h3 className="text-lg font-medium mb-2">No saved recipes yet</h3>
        <p className="text-black/60 dark:text-white/60 mb-6">
          Start exploring recipes and like the ones you want to save!
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center h-11 px-6 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          Browse Recipes
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {recipes.map((recipe) => {
        const stats = statsMap[recipe.id];
        const authorDisplay = userIdToUsername.get(recipe.user_id) || "Unknown";
        
        // Parse ingredients/instructions into lists for nicer rendering
        const ingredientsList = (recipe.ingredients || "")
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        const instructionsList = (recipe.instructions || "")
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        return (
          <div
            key={recipe.id}
            className="rounded-xl border-2 border-black/[.16] dark:border-white/[.20] p-6 hover:bg-black/[.03] dark:hover:bg-white/[.03] transition-all shadow-md hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  <a
                    href={`/recipes/${recipe.id}`}
                    className="hover:underline text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 transition-colors"
                  >
                    {recipe.title}
                  </a>
                </h3>
                <div className="text-sm text-black/70 dark:text-white/70 mb-3">
                  <div>By @{authorDisplay}</div>
                  {recipe.category && <div>Category: {recipe.category}</div>}
                  {recipe.cooking_time != null && <div>Cooking Time: {recipe.cooking_time} minutes</div>}
                  {recipe.difficulty && <div>Difficulty: {recipe.difficulty}</div>}
                </div>
                {recipe.description && (
                  <p className="text-sm text-black/80 dark:text-white/80 mb-4">
                    {recipe.description}
                  </p>
                )}
              </div>
            </div>

                         {/* Ingredients and Instructions Preview */}
             <div className="grid md:grid-cols-2 gap-6 mb-4">
               {ingredientsList.length > 0 && (
                 <div className="bg-black/[.02] dark:bg-white/[.02] p-4 rounded-lg border border-black/[.08] dark:border-white/[.12]">
                   <h4 className="font-semibold text-sm mb-3 text-black dark:text-white">Ingredients</h4>
                   <ul className="text-sm text-black/80 dark:text-white/80 space-y-2">
                    {ingredientsList.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-black/30 dark:bg-white/30 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                    {ingredientsList.length > 3 && (
                      <li className="text-xs text-black/50 dark:text-white/50">
                        +{ingredientsList.length - 3} more ingredients
                      </li>
                    )}
                  </ul>
                </div>
              )}

                             {instructionsList.length > 0 && (
                 <div className="bg-black/[.02] dark:bg-white/[.02] p-4 rounded-lg border border-black/[.08] dark:border-white/[.12]">
                   <h4 className="font-semibold text-sm mb-3 text-black dark:text-white">Instructions</h4>
                   <ol className="text-sm text-black/80 dark:text-white/80 space-y-2">
                    {instructionsList.slice(0, 3).map((step, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-xs text-black/50 dark:text-white/50 mr-2 mt-0.5">
                          {idx + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                    {instructionsList.length > 3 && (
                      <li className="text-xs text-black/50 dark:text-white/50">
                        +{instructionsList.length - 3} more steps
                      </li>
                    )}
                  </ol>
                </div>
              )}
            </div>

            {/* Social actions and navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-black/[.08] dark:border-white/[.12]">
              <div className="flex items-center gap-3 text-sm">
                <form action={toggleLike.bind(null, recipe.id)}>
                  <button className="h-9 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-black text-white dark:bg-white dark:text-black cursor-pointer hover:opacity-90 transition-all shadow-sm">
                    ♥ Liked ({stats?.likes_count ?? 0})
                  </button>
                </form>
                <a 
                  href={`/recipes/${recipe.id}#comments`} 
                  className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white font-medium hover:underline transition-colors"
                >
                  💬 {stats?.comments_count ?? 0}
                </a>
              </div>
              
              <a
                href={`/recipes/${recipe.id}`}
                className="text-sm text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white font-medium hover:underline transition-colors"
              >
                View Full Recipe →
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
