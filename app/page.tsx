import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Header />

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-14 pb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Share and discover recipes you love</h1>
            <p className="mt-4 text-balance text-black/70 dark:text-white/70 leading-7">
              Create beautiful recipe posts with images, ingredients, and step-by-step instructions.
              Save your favorites, leave likes and comments, and follow your favorite cooks.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/auth/signup" className="h-11 px-5 rounded-md bg-foreground text-background text-sm font-medium flex items-center justify-center cursor-pointer">Start creating</a>
              <a href="/auth/login" className="h-11 px-5 rounded-md border border-black/[.08] dark:border-white/[.12] text-sm font-medium flex items-center justify-center cursor-pointer">Log in</a>
            </div>
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
