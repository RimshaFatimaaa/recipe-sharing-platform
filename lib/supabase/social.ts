import { createSupabaseServerClient } from "./server";

export type RecipeSocialStats = {
  recipe_id: string;
  likes_count: number;
  comments_count: number;
  liked_by_me: boolean;
};

export async function fetchRecipeSocialStats(recipeIds: string[], currentUserId: string | null): Promise<Record<string, RecipeSocialStats>> {
  const supabase = createSupabaseServerClient();
  const stats: Record<string, RecipeSocialStats> = {};
  if (recipeIds.length === 0) return stats;

  // Fetch rows and aggregate in memory ("group" isn't supported on the JS client)
  const { data: likesRows } = await supabase
    .from("likes")
    .select("recipe_id, user_id")
    .in("recipe_id", recipeIds);

  const { data: commentRows } = await supabase
    .from("comments")
    .select("recipe_id")
    .in("recipe_id", recipeIds);

  const { data: likedMine } = currentUserId
    ? await supabase
        .from("likes")
        .select("recipe_id")
        .eq("user_id", currentUserId)
        .in("recipe_id", recipeIds)
    : { data: [] } as any;

  for (const id of recipeIds) {
    const likesCount = (likesRows || []).filter((r: any) => r.recipe_id === id).length;
    const commentsCount = (commentRows || []).filter((r: any) => r.recipe_id === id).length;
    const likedByMe = (likedMine || []).some((r: any) => r.recipe_id === id);
    stats[id] = { recipe_id: id, likes_count: likesCount, comments_count: commentsCount, liked_by_me: likedByMe };
  }

  return stats;
}


