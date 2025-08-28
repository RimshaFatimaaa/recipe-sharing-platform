import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateProfile } from "./server-actions";

export default async function ProfilePage({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, email")
    .eq("id", userData.user.id)
    .maybeSingle();

  const saved = searchParams?.saved === "1";
  const error = typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="font-sans min-h-screen">
      <Header />
      <main>
        <section className="mx-auto max-w-2xl px-6 pt-14 pb-12">
          <div className="mb-4">
            <a href="/dashboard" className="inline-flex items-center h-9 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] text-sm hover:bg-black/[.03] dark:hover:bg-white/[.06] transition-all shadow-sm">← Back to Dashboard</a>
          </div>
          <h1 className="text-2xl font-semibold">Your profile</h1>
          <p className="mt-1 text-sm text-black/70 dark:text-white/70">Update your public details.</p>

          {saved ? (
            <div className="mt-4 text-sm text-green-700 bg-green-50 dark:bg-green-900/40 dark:text-green-200 px-3 py-2 rounded-md">Saved</div>
          ) : null}
          {error ? (
            <div className="mt-4 text-sm text-red-700 bg-red-50 dark:bg-red-900/40 dark:text-red-200 px-3 py-2 rounded-md">{error}</div>
          ) : null}

          <form className="mt-6 space-y-4" action={updateProfile}>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                defaultValue={profile?.email ?? userData.user.email ?? ''}
                disabled
                className="w-full h-11 px-3 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-black/[.03] dark:bg-white/[.06]"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Full name</label>
              <input
                name="full_name"
                type="text"
                defaultValue={profile?.full_name ?? ''}
                className="w-full h-11 px-3 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                name="username"
                type="text"
                defaultValue={profile?.username ?? ''}
                className="w-full h-11 px-3 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background"
              />
            </div>
            <div className="pt-2">
              <button className="h-11 px-6 rounded-md bg-foreground text-background text-sm font-medium cursor-pointer hover:opacity-90 transition-all shadow-md">Save changes</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}


