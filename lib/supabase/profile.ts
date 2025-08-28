import { createSupabaseServerClient } from "./server";

export async function ensureProfileForCurrentUser() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const userId = user.id;
  const email = user.email ?? null;
  const fullName = (user.user_metadata as any)?.full_name ?? null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("profiles").insert({
      id: userId,
      email,
      full_name: fullName,
    });
  }

  return userId;
}


