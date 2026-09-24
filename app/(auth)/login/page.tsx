// app/(auth)/login/page.tsx

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/tracking");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border border-border rounded-2xl shadow-soft p-8">
        <h1 className="font-serif text-2xl text-ink mb-1 tracking-tight">
          Order Tracker
        </h1>
        <p className="text-sm text-muted-light mb-8">
          Sign in to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-muted mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-ivory text-ink placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-ink/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-ivory text-ink placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-ink/20 transition"
            />
          </div>

          {error && (
            <div className="text-sm text-red-800 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-ink text-ivory rounded-lg text-sm font-medium hover:bg-[#2A2927] disabled:opacity-60 transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
