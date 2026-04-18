import Link from "next/link";
import { Check } from "lucide-react";

import { AuthBrand } from "@/components/auth-brand";

export default function Page() {
  return (
    <div className="auth-card fade-in">
      <AuthBrand />
      <div className="status-tick">
        <Check size={28} />
      </div>
      <div className="auth-header">
        <span className="en-label">WELCOME</span>
        <h1>ご登録ありがとうございます</h1>
        <p>
          ご登録メールアドレス宛に確認メールを送信しました。
          <br />
          メール内のリンクをクリックして、アカウントを有効化してください。
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
