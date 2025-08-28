import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureProfileForCurrentUser } from "@/lib/supabase/profile";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // Support a no-op call from client to trigger cookie/session refresh
  if (!code || code === "noop") {
    const supabase = createSupabaseServerClient();
    await supabase.auth.getSession();
    await ensureProfileForCurrentUser();
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(error.message)}`, request.url));
  }

  // Ensure profile exists after session is established
  await ensureProfileForCurrentUser();

  return NextResponse.redirect(new URL("/", request.url));
}


