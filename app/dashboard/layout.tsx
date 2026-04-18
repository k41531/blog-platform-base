import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/features/dashboard/dashboard-nav";

async function DashboardSidebar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email ?? "";
  const displayName = email.split("@")[0] || "ゲスト";
  const initial = (displayName[0] ?? "?").toUpperCase();

  return <DashboardNav email={email} displayName={displayName} initial={initial} />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="db-shell">
      <aside className="db-side">
        <Suspense fallback={null}>
          <DashboardSidebar />
        </Suspense>
      </aside>
      <main className="db-main">{children}</main>
    </div>
  );
}
