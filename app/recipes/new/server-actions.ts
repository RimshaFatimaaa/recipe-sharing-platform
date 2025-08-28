"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ensureProfileForCurrentUser } from "@/lib/supabase/profile";

function parseIntOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function createRecipe(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth/login");

  const title = (formData.get("title") as string | null)?.trim();
  if (!title) {
    redirect("/recipes/new?error=Title%20is%20required");
  }

  // Ensure a matching profile row exists for the current user (FK safety)
  await ensureProfileForCurrentUser();

  const descriptionRaw = (formData.get("description") as string | null) ?? null;
  const description = descriptionRaw && descriptionRaw.trim().length > 0 ? descriptionRaw : null;
  const ingredientsInput = (formData.get("ingredients") as string | null) ?? "";
  const ingredients = ingredientsInput.trim().length > 0 ? ingredientsInput : null;
  const instructionsRaw = (formData.get("instructions") as string | null) ?? null;
  const instructions = instructionsRaw && instructionsRaw.trim().length > 0 ? instructionsRaw : null;
  const difficultyRaw = (formData.get("difficulty") as string | null) ?? null;
  const difficulty = difficultyRaw && difficultyRaw.trim().length > 0 ? difficultyRaw : null;
  const categoryRaw = (formData.get("category") as string | null) ?? null;
  const category = categoryRaw && categoryRaw.trim().length > 0 ? categoryRaw : null;
  const cooking_time = parseIntOrNull(formData.get("cooking_time"));

  // Provide id explicitly (robust for schemas without DB default)
  const payload: any = {
    id: randomUUID(),
    user_id: userData.user.id,
    title,
    description,
    ingredients,
    instructions,
    difficulty,
    category,
    cooking_time,
  };

  if (ingredients === null) {
    delete payload.ingredients;
  }

  const { error } = await supabase.from("recipes").insert(payload).select("id");

  // Revalidate dashboard and redirect whether or not an error occurred,
  // so the user flow always lands on dashboard after submitting.
  revalidatePath("/dashboard");
  if (error) {
    const msg = encodeURIComponent(error.message || "insert_failed");
    redirect(`/dashboard?created=0&error=${msg}`);
  } else {
    redirect(`/dashboard?created=1`);
  }
}


