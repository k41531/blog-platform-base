"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { AuthBrand } from "@/components/auth-brand";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-card fade-in">
        <AuthBrand />
        <div className="status-tick">
          <Mail size={24} />
        </div>
        <div className="auth-header">
          <span className="en-label">CHECK YOUR INBOX</span>
          <h1>メールを送信しました</h1>
          <p>
            <b>{email}</b> にパスワード再設定用のリンクをお送りしました。
          </p>
        </div>
        <Link
          href="/auth/login"
          className="btn-haruni btn-haruni-secondary btn-haruni-block"
        >
          ログインページへ
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-card fade-in">
      <AuthBrand />
      <div className="auth-header">
        <span className="en-label">RESET PASSWORD</span>
        <h1>パスワードの再設定</h1>
        <p>
          登録メールアドレスをご入力ください。
          <br />
          再設定用のリンクをお送りします。
        </p>
      </div>
      <form onSubmit={handleForgotPassword}>
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
          {isLoading ? "送信中…" : "再設定メールを送る"}
        </button>
        <div className="auth-foot">
          思い出した方は <Link href="/auth/login">ログイン</Link>
        </div>
      </form>
    </div>
  );
}
