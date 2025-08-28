"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function DashboardSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState<string>(params.get("q") || "");
  const [cat, setCat] = useState<string>(params.get("cat") || "");
  const [diff, setDiff] = useState<string>(params.get("diff") || "");

  // Debounced update for category/difficulty only
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(Array.from(params.entries()));
      // q is applied only via the Search button; preserve current URL value
      if (cat) next.set("cat", cat); else next.delete("cat");
      if (diff) next.set("diff", diff); else next.delete("diff");
      router.replace(`${pathname}?${next.toString()}`);
    }, 250);
    return () => clearTimeout(t);
  }, [cat, diff, pathname, params, router]);

  // When input is cleared, remove q param to show all results
  useEffect(() => {
    if (q === "" && params.get("q")) {
      const next = new URLSearchParams(Array.from(params.entries()));
      next.delete("q");
      router.replace(`${pathname}?${next.toString()}`);
    }
  }, [q, pathname, params, router]);

  const reset = useCallback(() => {
    setQ("");
    setCat("");
    setDiff("");
    router.replace(pathname);
  }, [pathname, router]);

  const applySearch = useCallback(() => {
    const next = new URLSearchParams(Array.from(params.entries()));
    if (q) next.set("q", q); else next.delete("q");
    if (cat) next.set("cat", cat); else next.delete("cat");
    if (diff) next.set("diff", diff); else next.delete("diff");
    router.replace(`${pathname}?${next.toString()}`);
  }, [q, cat, diff, pathname, params, router]);

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search recipes..."
        className="h-10 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background focus:outline-none focus:ring-2 focus:ring-black/[.20] dark:focus:ring-white/[.30] transition-all shadow-sm"
      />
      <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background focus:outline-none focus:ring-2 focus:ring-black/[.20] dark:focus:ring-white/[.30] transition-all shadow-sm">
        <option value="">All categories</option>
        <option>Breakfast</option>
        <option>Lunch</option>
        <option>Dinner</option>
        <option>Dessert</option>
      </select>
      <select value={diff} onChange={(e) => setDiff(e.target.value)} className="h-10 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] bg-background focus:outline-none focus:ring-2 focus:ring-black/[.20] dark:focus:ring-white/[.30] transition-all shadow-sm">
        <option value="">All difficulties</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <div className="sm:col-span-3 flex gap-2">
        <button onClick={applySearch} className="h-9 px-4 rounded-md bg-foreground text-background text-sm cursor-pointer hover:opacity-90 transition-all shadow-md">Search</button>
        <button onClick={reset} className="h-9 px-4 rounded-md border-2 border-black/[.16] dark:border-white/[.20] text-sm cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.06] transition-all shadow-sm">Reset</button>
      </div>
    </div>
  );
}


