import { createSupabaseServerClient } from './server';

export async function getSession() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function getUser() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}


