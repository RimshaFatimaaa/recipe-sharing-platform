"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const username = (formData.get("username") as string | null)?.trim() || null;
  const fullName = (formData.get("full_name") as string | null)?.trim() || null;

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    redirect("/auth/login");
  }

  const userId = userData.user.id;

  const { error } = await supabase
    .from("profiles")
    .update({ username, full_name: fullName })
    .eq("id", userId);

  const params = new URLSearchParams();
  if (error) {
    params.set("error", error.message);
  } else {
    params.set("saved", "1");
  }
  redirect(`/profile?${params.toString()}`);
}


