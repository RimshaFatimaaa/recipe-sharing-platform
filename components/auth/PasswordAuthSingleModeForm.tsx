"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function PasswordAuthSingleModeForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        // Ensure the user is NOT logged in after signup (some configs create a session)
        await supabase.auth.signOut();
        setStatus("done");
        setMessage("Account created. Please sign in.");
        setTimeout(() => window.location.assign("/auth/login"), 600);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setStatus("done");
        setMessage("Signed in. Redirecting…");
        setTimeout(() => window.location.assign("/dashboard"), 400);
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Something went wrong");
    }
  }

  const submitText = mode === "signup" ? "Sign up" : "Sign in";

  return (
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
        className="h-11 px-4 rounded-md bg-foreground text-background text-sm font-medium w-full cursor-pointer"
      >
        {status === "loading" ? `${submitText}…` : submitText}
      </button>
      {message ? (
        <div className={`text-sm ${status === "error" ? "text-red-600" : "text-black/70 dark:text-white/70"}`}>{message}</div>
      ) : null}
    </form>
  );
}


