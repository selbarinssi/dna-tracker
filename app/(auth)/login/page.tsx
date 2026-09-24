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
    <div className="w-full max-w-md px-6">
      <div className="bg-white border border-[#E8E4DB] rounded-2xl shadow-sm p-8">
        <h1 className="font-serif text-2xl text-[#1A1917] mb-1">Order Tracker</h1>
        <p className="text-sm text-[#8A857A] mb-8">Sign in to continue</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-[#4A4741] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-[#E8E4DB] bg-[#FFFEF9] text-[#1A1917] focus:outline-none focus:ring-2 focus:ring-[#1A1917]/20"
            />
          </div>

          <div>
            <label className="block text-sm text-[#4A4741] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-[#E8E4DB] bg-[#FFFEF9] text-[#1A1917] focus:outline-none focus:ring-2 focus:ring-[#1A1917]/20"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#1A1917] text-[#FFFEF9] rounded-lg text-sm font-medium hover:bg-[#2A2927] disabled:opacity-60 transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
