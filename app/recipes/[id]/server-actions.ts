"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseIntOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function updateRecipe(recipeId: string, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth/login");

  const title = (formData.get("title") as string | null)?.trim();
  if (!title) redirect(`/recipes/${recipeId}?error=Title%20is%20required`);

  const descriptionRaw = (formData.get("description") as string | null) ?? null;
  const description = descriptionRaw && descriptionRaw.trim().length > 0 ? descriptionRaw : null;
  const ingredientsRaw = (formData.get("ingredients") as string | null) ?? null;
  const ingredients = ingredientsRaw && ingredientsRaw.trim().length > 0 ? ingredientsRaw : null;
  const instructionsRaw = (formData.get("instructions") as string | null) ?? null;
  const instructions = instructionsRaw && instructionsRaw.trim().length > 0 ? instructionsRaw : null;
  const difficultyRaw = (formData.get("difficulty") as string | null) ?? null;
  const difficulty = difficultyRaw && difficultyRaw.trim().length > 0 ? difficultyRaw : null;
  const categoryRaw = (formData.get("category") as string | null) ?? null;
  const category = categoryRaw && categoryRaw.trim().length > 0 ? categoryRaw : null;
  const cooking_time = parseIntOrNull(formData.get("cooking_time"));

  const payload: any = { title, description, ingredients, instructions, difficulty, category, cooking_time };

  const { error } = await supabase
    .from("recipes")
    .update(payload)
    .eq("id", recipeId)
    .eq("user_id", userData.user.id); // ensure ownership

  revalidatePath(`/recipes/${recipeId}`);
  if (error) {
    redirect(`/recipes/${recipeId}?updated=0&error=${encodeURIComponent(error.message)}`);
  } else {
    redirect(`/recipes/${recipeId}?updated=1`);
  }
}

export async function deleteRecipe(recipeId: string) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth/login");

  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId)
    .eq("user_id", userData.user.id); // ensure ownership

  if (error) {
    redirect(`/recipes/${recipeId}?deleted=0&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?deleted=1`);
}

export async function toggleLike(recipeId: string) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth/login");

  const userId = userData.user.id;
  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", userId)
    .eq("recipe_id", recipeId)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("id", (existing as any).id);
  } else {
    await supabase.from("likes").insert({ user_id: userId, recipe_id: recipeId });
  }

  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath(`/dashboard`);
}

export async function addComment(recipeId: string, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth/login");

  const content = ((formData.get("body") as string | null) || "").trim();
  if (!content) {
    redirect(`/recipes/${recipeId}?comment_error=empty`);
  }

  // Ensure user profile exists to satisfy FK constraints if any
  try {
    const { ensureProfileForCurrentUser } = await import("@/lib/supabase/profile");
    await ensureProfileForCurrentUser();
  } catch {}

  const { error } = await supabase.from("comments").insert({ user_id: userData.user.id, recipe_id: recipeId, content });
  revalidatePath(`/recipes/${recipeId}`);
  if (error) {
    redirect(`/recipes/${recipeId}?comment_error=${encodeURIComponent(error.message)}#comments`);
  }
  redirect(`/recipes/${recipeId}#comments`);
}

export async function deleteComment(commentId: string, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth/login");

  // Get the recipe_id from the form data
  const recipeId = formData.get("recipe_id") as string;
  if (!recipeId) {
    redirect(`/dashboard?error=Recipe%20ID%20missing`);
  }

  // First check if the comment exists
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("id, recipe_id, user_id")
    .eq("id", commentId)
    .maybeSingle();

  if (fetchError) {
    redirect(`/recipes/${recipeId}?comment_error=${encodeURIComponent(fetchError.message)}#comments`);
  }

  if (!comment) {
    redirect(`/recipes/${recipeId}?comment_error=Comment%20not%20found#comments`);
  }

  // Check if user is authorized to delete this comment
  // User can delete if they are the comment author OR the recipe owner
  const isCommentAuthor = userData.user.id === comment.user_id;
  
  // Get recipe owner to check if current user is the recipe owner
  const { data: recipe } = await supabase
    .from("recipes")
    .select("user_id")
    .eq("id", comment.recipe_id)
    .maybeSingle();
    
  const isRecipeOwner = recipe && userData.user.id === recipe.user_id;
  
  if (!isCommentAuthor && !isRecipeOwner) {
    redirect(`/recipes/${recipeId}?comment_error=Not%20authorized%20to%20delete%20this%20comment#comments`);
  }

  // Try to delete the comment (no user_id restriction since both comment author and recipe owner can delete)
  const { error: deleteError, count } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  // If deletion fails, provide more specific error information
  if (deleteError) {
    // Check if it's an RLS policy issue
    if (deleteError.message.includes("policy") || deleteError.message.includes("row level security")) {
      redirect(`/recipes/${recipeId}?comment_error=Permission%20denied%20-%20check%20RLS%20policies#comments`);
    }
    
    redirect(`/recipes/${recipeId}?comment_error=${encodeURIComponent(deleteError.message)}#comments`);
  }

  if (count === 0) {
    redirect(`/recipes/${recipeId}?comment_error=No%20comment%20was%20deleted#comments`);
  }

  // Revalidate both the recipe page and dashboard to update counts
  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath(`/dashboard`);
  
  redirect(`/recipes/${recipeId}?comment_deleted=1#comments`);
}


