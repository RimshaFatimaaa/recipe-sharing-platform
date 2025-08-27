"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const supabase = createSupabaseBrowserClient();
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setStatus("done");
        setMessage("Sign-up complete. Check your email if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setStatus("done");
        setMessage("Signed in. Redirecting…");
        // Optional: refresh to reflect session state in server components
        setTimeout(() => window.location.assign("/"), 400);
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Something went wrong");
    }
  }

  return (
    <div>
      <div className="mb-3 flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`h-8 px-3 rounded-md border ${mode === "signin" ? "bg-foreground text-background" : "border-black/[.08] dark:border-white/[.12]"}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`h-8 px-3 rounded-md border ${mode === "signup" ? "bg-foreground text-background" : "border-black/[.08] dark:border-white/[.12]"}`}
        >
          Sign up
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-11 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full h-11 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 px-4 rounded-md bg-foreground text-background text-sm font-medium"
        >
          {status === "loading" ? (mode === "signup" ? "Creating…" : "Signing in…") : (mode === "signup" ? "Create account" : "Sign in")}
        </button>
        {message ? (
          <div className={`text-sm ${status === "error" ? "text-red-600" : "text-black/70 dark:text-white/70"}`}>{message}</div>
        ) : null}
      </form>
    </div>
  );
}


