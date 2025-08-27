export default function Home() {
  return (
    <div className="font-sans min-h-screen">
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
            <button className="h-9 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] text-sm">Log in</button>
            <button className="h-9 px-3 rounded-md bg-foreground text-background text-sm">Sign up</button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-14 pb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Share and discover recipes you love</h1>
            <p className="mt-4 text-balance text-black/70 dark:text-white/70 leading-7">
              Create beautiful recipe posts with images, ingredients, and step-by-step instructions.
              Save your favorites, leave likes and comments, and follow your favorite cooks.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button className="h-11 px-5 rounded-md bg-foreground text-background text-sm font-medium">Create a recipe</button>
              <button className="h-11 px-5 rounded-md border border-black/[.08] dark:border-white/[.12] text-sm font-medium">Browse recipes</button>
            </div>
          </div>
        </section>

        <section id="discover" className="mx-auto max-w-6xl px-6 pb-16">
          <h2 className="text-xl font-semibold mb-4">Trending recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="rounded-xl border border-black/[.08] dark:border-white/[.12] overflow-hidden">
                <div className="aspect-video bg-black/[.08] dark:bg-white/[.12]" />
                <div className="p-4">
                  <div className="text-sm text-black/60 dark:text-white/60">@chef{i}</div>
                  <div className="mt-1 font-medium">Sample Recipe Title {i}</div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-black/60 dark:text-white/60">
                    <span>❤ 24</span>
                    <span>🔖 10</span>
                    <span>⭐ 4.8</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-black/[.08] dark:border-white/[.12] p-5">
              <div className="text-2xl">📝</div>
              <div className="mt-2 font-medium">Create</div>
              <p className="mt-1 text-sm text-black/70 dark:text-white/70">Add title, images, ingredients, and steps.</p>
            </div>
            <div className="rounded-xl border border-black/[.08] dark:border-white/[.12] p-5">
              <div className="text-2xl">🔍</div>
              <div className="mt-2 font-medium">Discover</div>
              <p className="mt-1 text-sm text-black/70 dark:text-white/70">Browse categories, tags, and search.</p>
            </div>
            <div className="rounded-xl border border-black/[.08] dark:border-white/[.12] p-5">
              <div className="text-2xl">💬</div>
              <div className="mt-2 font-medium">Engage</div>
              <p className="mt-1 text-sm text-black/70 dark:text-white/70">Like, save, rate, and comment.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/[.08] dark:border-white/[.12]">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-black/60 dark:text-white/60">
          © {new Date().getFullYear()} RecipeShare. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
