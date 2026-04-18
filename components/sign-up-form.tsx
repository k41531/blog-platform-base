"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { AuthBrand } from "@/components/auth-brand";

function passwordStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const strength = passwordStrength(password);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください");
      setIsLoading(false);
      return;
    }
    if (password !== repeatPassword) {
      setError("パスワードが一致しません");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard/posts`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
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
        <span className="en-label">SIGN UP</span>
        <h1>新しいアカウントを作る</h1>
        <p>メールアドレスでご登録ください</p>
      </div>
      <form onSubmit={handleSignUp}>
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
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            className="field-input"
            placeholder="8文字以上"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && (
            <div className={`pw-meter s${strength}`}>
              <span />
              <span />
              <span />
              <span />
            </div>
          )}
          <span className="field-hint">
            英大文字・数字・記号を混ぜると強くなります
          </span>
        </div>
        <div className="field">
          <label htmlFor="repeat-password">パスワード（確認用）</label>
          <input
            id="repeat-password"
            type="password"
            className="field-input"
            placeholder="もう一度入力"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
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
          {isLoading ? "登録中…" : "登録する"}
        </button>
        <div className="auth-foot">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/auth/login">ログイン</Link>
        </div>
      </form>
    </div>
  );
}
