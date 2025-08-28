import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/auth";
import { deleteRecipe, updateRecipe, toggleLike, addComment, deleteComment } from "./server-actions";
import { fetchRecipeSocialStats } from "@/lib/supabase/social";
import { RecipeEditForm } from "@/components/recipes/RecipeEditForm";
import { ConfirmSubmitButton } from "@/components/recipes/SubmitButton";

export default async function RecipeDetailPage({ params, searchParams }: { params: { id: string }; searchParams: { [k: string]: string | string[] | undefined } }) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("recipes")
    .select("id, title, description, ingredients, instructions, cooking_time, difficulty, category, user_id")
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();
  const recipe = data as Database["public"]["Tables"]["recipes"]["Row"];

  // Load author display name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, email")
    .eq("id", recipe.user_id)
    .maybeSingle();
  const author = profile as (Database["public"]["Tables"]["profiles"]["Row"] | null);
  const authorUsername = (author?.username ?? "").trim();
  const authorEmail = (author?.email ?? "").trim();
  const authorDisplay = authorUsername ? `@${authorUsername}` : authorEmail;

  // Parse ingredients/instructions into lists for nicer rendering
  const ingredientsList = (recipe.ingredients || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const instructionsList = (recipe.instructions || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const currentUser = await getUser();
  const isOwner = currentUser?.id === recipe.user_id;

  const editMode = isOwner && searchParams?.edit === "1";
  const commentError = typeof searchParams?.comment_error === "string" ? searchParams.comment_error : null;

  // Social stats and comments
  const statsMap = await fetchRecipeSocialStats([recipe.id], currentUser?.id ?? null);
  const stats = statsMap[recipe.id];
  
  // Fetch comments with better error handling - try simpler approach first
  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select("id, content, created_at, user_id")
    .eq("recipe_id", recipe.id)
    .order("created_at", { ascending: true });
    
  if (commentsError) {
    console.error("Error fetching comments:", commentsError);
  }
  
  // Fetch profiles separately for each comment
  let commentsWithProfiles: any[] = [];
  if (comments && comments.length > 0) {
    const userIds = [...new Set(comments.map((c: any) => c.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, full_name, email")
      .in("id", userIds);
      
    const profilesMap = new Map(profiles?.map((p: any) => [p.id, p]) ?? []);
    
    commentsWithProfiles = comments.map((comment: any) => ({
      ...comment,
      profiles: profilesMap.get(comment.user_id)
    }));
  }

  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main>
        <section className="px-6 pt-14 pb-12">
          <div className="mx-auto max-w-3xl mb-4">
            <a
              href="/dashboard"
              className="inline-flex items-center h-9 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] text-sm hover:bg-black/[.03] dark:hover:bg-white/[.06] transition-all shadow-sm"
            >
              ← Back to Dashboard
            </a>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-black/[.16] dark:border-white/[.24] bg-background shadow-md hover:shadow-lg transition-shadow p-8">
              <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-semibold">{recipe.title}</h1>
              {isOwner ? (
                <div className="flex items-center gap-2">
                  {editMode ? (
                    <a href={`/recipes/${recipe.id}`} className="h-7 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] text-xs inline-flex items-center">Cancel</a>
                  ) : (
                    <a href={`/recipes/${recipe.id}?edit=1`} className="h-7 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] text-xs inline-flex items-center">Edit</a>
                  )}
                  <form action={deleteRecipe.bind(null, recipe.id)}>
                    <ConfirmSubmitButton confirmText="Delete this recipe? This cannot be undone." pendingText="Deleting…" className="h-7 px-3 rounded-md bg-red-600 text-white text-xs">
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              ) : null}
            </div>
            {!editMode ? (
              <div className="mt-2 text-sm text-black/70 dark:text-white/70">
                {authorDisplay ? <div>By {authorDisplay}</div> : null}
                {recipe.category ? <div>Category: {recipe.category}</div> : null}
                {recipe.cooking_time != null ? <div>Cooking Time: {recipe.cooking_time} minutes</div> : null}
                {recipe.difficulty ? <div>Difficulty: {recipe.difficulty}</div> : null}
              </div>
            ) : null}
            {editMode ? (
              <div className="mt-4">
                <RecipeEditForm defaultValues={recipe} action={updateRecipe.bind(null, recipe.id)} />
              </div>
            ) : null}
            {!editMode && recipe.description ? (
              <p className="mt-4 text-black/70 dark:text-white/70">{recipe.description}</p>
            ) : null}

            {!editMode && ingredientsList.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">Ingredients</h2>
                <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-black/80 dark:text-white/80">
                  {ingredientsList.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {!editMode && instructionsList.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">Instructions</h2>
                <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm text-black/80 dark:text-white/80">
                  {instructionsList.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            ) : null}
            {/* Social actions */}
            <div className="mt-8 flex items-center gap-3 text-sm">
              <form action={toggleLike.bind(null, recipe.id)}>
                <button className={`h-9 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] ${stats?.liked_by_me ? 'bg-black text-white dark:bg-white dark:text-black' : ''} cursor-pointer`}>
                  {stats?.liked_by_me ? '♥ Liked' : '♡ Like'} ({stats?.likes_count ?? 0})
                </button>
              </form>
              <a href="#comments" className="text-black/70 dark:text-white/70 hover:underline">Comments: {stats?.comments_count ?? 0}</a>
            </div>
            </div>
            
            {/* Comments section right under the recipe details */}
            <div id="comments" className="mt-6 rounded-2xl border border-black/[.12] dark:border-white/[.18] bg-background shadow-sm p-6">
              <h3 className="font-medium">Comments</h3>
              {commentError ? (
                <div className="mt-2 text-sm text-red-700 bg-red-50 dark:bg-red-900/40 dark:text-red-200 px-3 py-2 rounded-md">{commentError}</div>
              ) : null}
              {commentsError ? (
                <div className="mt-2 text-sm text-red-700 bg-red-50 dark:bg-red-900/40 dark:text-red-200 px-3 py-2 rounded-md">Error loading comments: {commentsError.message}</div>
              ) : null}
              <div className="mt-3 space-y-3">
                {(commentsWithProfiles ?? []).map((c: any) => (
                  <div key={c.id} className="text-sm border-l-2 border-gray-200 pl-3 py-2 relative group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-black/70 dark:text-white/70">
                          {c.profiles?.username
                            ? `@${c.profiles.username}`
                            : (c.profiles?.email ? `@${c.profiles.email.split('@')[0]}` : 'User')}
                          <span className="ml-2 opacity-70">{new Date(c.created_at).toLocaleString()}</span>
                        </div>
                        <div className="mt-1 text-black/90 dark:text-white/90">{c.content}</div>
                      </div>
                      {currentUser && (currentUser.id === c.user_id || currentUser.id === recipe.user_id) && (
                        <form action={deleteComment.bind(null, c.id)} className="ml-3">
                          <input type="hidden" name="recipe_id" value={recipe.id} />
                          <button 
                            type="submit" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                            title={currentUser.id === c.user_id ? "Delete your comment" : "Delete comment (as recipe owner)"}
                          >
                            🗑️
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
                {((stats?.comments_count ?? 0) === 0 && (commentsWithProfiles ?? []).length === 0) ? (
                  <div className="text-sm text-black/60 dark:text-white/60">No comments yet.</div>
                ) : null}
              </div>

              {currentUser ? (
                <form action={addComment.bind(null, recipe.id)} className="mt-3 flex items-center gap-2">
                  <input name="body" placeholder="Add a comment" className="flex-1 h-10 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background" />
                  <button type="submit" className="h-10 px-3 rounded-md bg-foreground text-background text-sm cursor-pointer">Post</button>
                </form>
              ) : (
                <div className="mt-3 text-sm text-black/60 dark:text-white/60">Sign in to comment.</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


