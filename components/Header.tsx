import { getUser } from "@/lib/supabase/auth";
import { signOut } from "@/app/auth/server-actions";

export default async function Header() {
  const user = await getUser();
  return (
    <header className="border-b border-black/[.08] dark:border-white/[.12]">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <a href="/dashboard" className="flex items-center gap-3">
          <img src="/favicon.ico" alt="logo" className="h-7 w-7 rounded" />
          <span className="text-xl font-semibold tracking-tight">RecipeShare</span>
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <a className="hover:underline underline-offset-4" href="#discover">Discover</a>
          <a className="hover:underline underline-offset-4" href="#categories">Categories</a>
          <a className="hover:underline underline-offset-4" href="#how">How it works</a>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <a href="/saved" className="h-9 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] text-sm flex items-center cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.03] transition-all shadow-sm">Saved</a>
              <a href="/profile" className="h-9 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] text-sm flex items-center cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.03] transition-all shadow-sm">Profile</a>
              <a href="/dashboard" className="h-9 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] text-sm flex items-center cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.03] transition-all shadow-sm">Dashboard</a>
              <form action={signOut}>
                <button className="h-9 px-4 rounded-md bg-foreground text-background text-sm cursor-pointer hover:opacity-90 transition-all shadow-md">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <a href="/auth/login" className="h-9 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] text-sm flex items-center cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.03] transition-all shadow-sm">Log in</a>
              <a href="/auth/signup" className="h-9 px-4 rounded-md bg-foreground text-background text-sm cursor-pointer hover:opacity-90 transition-all shadow-md">Sign up</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


