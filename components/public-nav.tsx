import Link from "next/link";
import { connection } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function PublicNav() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  return (
    <nav className="header-nav">
      <Link href="/">記事一覧</Link>
      {isLoggedIn && <Link href="/dashboard/posts">ダッシュボード</Link>}
    </nav>
  );
}
