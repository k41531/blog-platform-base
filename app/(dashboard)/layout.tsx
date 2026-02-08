import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/features/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b bg-background md:hidden">
        <div className="flex h-14 items-center px-4">
          <h1 className="text-lg font-semibold">ダッシュボード</h1>
        </div>
        <div className="border-t px-4 py-2">
          <DashboardNav />
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-background p-4 md:block">
          <h1 className="mb-6 text-lg font-semibold">ダッシュボード</h1>
          <DashboardNav />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
