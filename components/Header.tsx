import { getUser } from "@/lib/supabase/auth";
import { signOut } from "@/app/auth/server-actions";

export default async function Header() {
  const user = await getUser();
  return (
    <header className="border-b border-black/[.08] dark:border-white/[.12]">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-black/[.08] dark:bg-white/[.12]" />
          <span className="text-xl font-semibold tracking-tight">RecipeShare</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <a className="hover:underline underline-offset-4" href="#discover">Discover</a>
          <a className="hover:underline underline-offset-4" href="#categories">Categories</a>
          <a className="hover:underline underline-offset-4" href="#how">How it works</a>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <a href="/dashboard" className="h-9 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] text-sm flex items-center cursor-pointer">Dashboard</a>
              <form action={signOut}>
                <button className="h-9 px-3 rounded-md bg-foreground text-background text-sm cursor-pointer">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <a href="/auth/login" className="h-9 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] text-sm flex items-center cursor-pointer">Log in</a>
              <a href="/auth/signup" className="h-9 px-3 rounded-md bg-foreground text-background text-sm flex items-center cursor-pointer">Sign up</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


