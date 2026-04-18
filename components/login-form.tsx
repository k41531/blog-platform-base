"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { AuthBrand } from "@/components/auth-brand";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard/posts");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card fade-in">
      <AuthBrand />
      <div className="auth-header">
        <span className="en-label">LOG IN</span>
        <h1>おかえりなさい</h1>
        <p>メールアドレスでログインしてください</p>
      </div>
      <form onSubmit={handleLogin}>
        <div className="field">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            className="field-input"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">
            パスワード
            <Link
              href="/auth/forgot-password"
              style={{ fontSize: 12, fontWeight: 500 }}
            >
              パスワードを忘れた
            </Link>
          </label>
          <input
            id="password"
            type="password"
            className="field-input"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <div className="field-error" style={{ marginBottom: 12 }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          className="btn-haruni btn-haruni-primary btn-haruni-lg btn-haruni-block"
          disabled={isLoading}
        >
          {isLoading ? "ログイン中…" : "ログイン"}
        </button>
        <div className="auth-foot">
          アカウントをお持ちでない方は{" "}
          <Link href="/auth/sign-up">新規登録</Link>
        </div>
      </form>
    </div>
  );
}
