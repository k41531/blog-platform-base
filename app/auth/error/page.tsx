import Link from "next/link";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";

import { AuthBrand } from "@/components/auth-brand";

async function ErrorDetail({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  if (!params?.error) return null;
  return (
    <p
      className="field-hint"
      style={{ textAlign: "center", marginTop: 12 }}
    >
      エラーコード: {params.error}
    </p>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="auth-card fade-in">
      <AuthBrand />
      <div className="status-error">
        <AlertTriangle size={28} />
      </div>
      <div className="auth-header">
        <span
          className="en-label"
          style={{ color: "var(--danger)" }}
        >
          SOMETHING WENT WRONG
        </span>
        <h1>エラーが発生しました</h1>
        <p>
          処理中に予期しないエラーが発生しました。
          <br />
          しばらく経ってからもう一度お試しください。
        </p>
      </div>
      <Suspense>
        <ErrorDetail searchParams={searchParams} />
      </Suspense>
      <Link
        href="/auth/login"
        className="btn-haruni btn-haruni-primary btn-haruni-block"
        style={{ marginTop: 16 }}
      >
        ログインに戻る
      </Link>
    </div>
  );
}
