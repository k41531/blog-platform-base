"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Key } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { AuthBrand } from "@/components/auth-brand";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
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
      <div className="auth-illustration">
        <Key size={40} />
      </div>
      <div className="auth-header">
        <span className="en-label">NEW PASSWORD</span>
        <h1>新しいパスワードを設定</h1>
        <p>以下に新しいパスワードを入力してください。</p>
      </div>
      <form onSubmit={handleUpdatePassword}>
        <div className="field">
          <label htmlFor="password">新しいパスワード</label>
          <input
            id="password"
            type="password"
            className="field-input"
            placeholder="8文字以上"
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
          {isLoading ? "保存中…" : "保存する"}
        </button>
      </form>
    </div>
  );
}
