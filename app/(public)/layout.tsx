import Link from "next/link";
import { Suspense } from "react";

import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="app-header">
        <div className="app-header-inner">
          <Link href="/" className="brand-logo">
            <div className="mark-dot">B</div>
            <div>
              <div>Blog</div>
              <span className="en-sub">HARU-NI BLOG</span>
            </div>
          </Link>
          <nav className="header-nav">
            <Link href="/">記事一覧</Link>
          </nav>
          <div className="header-actions ml-auto flex items-center gap-3">
            <Suspense>
              <AuthButton />
            </Suspense>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 app-container pb-16">{children}</main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <div>
            <span className="en-tiny">© 2026 BLOG PLATFORM</span>
            <span className="mx-2">・</span>
            ブログプラットフォーム
          </div>
        </div>
      </footer>
    </div>
  );
}
