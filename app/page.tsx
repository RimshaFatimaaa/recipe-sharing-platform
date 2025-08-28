import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Header />

      <main>
        <section className="px-6 pt-24 pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Share Your Culinary
              <br />
              Masterpieces
            </h1>
            <p className="mt-4 text-black/70 dark:text-white/70 leading-7">
              Join our community of food lovers. Share recipes, discover new dishes, and
              connect with fellow cooking enthusiasts.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <a href="/auth/signup" className="h-10 px-5 rounded-md bg-foreground text-background text-sm font-medium inline-flex items-center justify-center cursor-pointer">Start Sharing</a>
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
