"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthEmailForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setStatus("sent");
      setMessage("Magic link sent. Check your email.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Something went wrong");
    }
  }

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
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-11 px-4 rounded-md bg-foreground text-background text-sm font-medium"
      >
        {status === "loading" ? "Sending…" : "Send magic link"}
      </button>
      {message ? (
        <div className="text-sm text-black/70 dark:text-white/70">{message}</div>
      ) : null}
    </form>
  );
}


