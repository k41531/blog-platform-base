import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  await connection();
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-3">
      <span
        className="text-sm"
        style={{ color: "var(--fg-2)", fontFamily: "var(--font-jp-sans)" }}
      >
        こんにちは、<b style={{ color: "var(--fg-1)", fontWeight: 600 }}>{user.email}</b> さん
      </span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Link href="/auth/login" className="btn-ghost-pill">
        ログイン
      </Link>
      <Link href="/auth/sign-up" className="btn-pop btn-pop-sm">
        新規登録
      </Link>
    </div>
  );
}
