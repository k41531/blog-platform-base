"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FilePlus, Settings, ExternalLink, LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const contentItems = [
  { href: "/dashboard/posts", label: "記事管理", icon: FileText },
  { href: "/dashboard/posts/new", label: "新規作成", icon: FilePlus },
];

const accountItems = [
  { href: "/dashboard/settings", label: "設定", icon: Settings },
];

type Props = {
  email: string;
  displayName: string;
  initial: string;
};

export function DashboardNav({ email, displayName, initial }: Props) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isActive = (href: string) =>
    href === "/dashboard/posts"
      ? pathname === href || pathname.startsWith("/dashboard/posts/")
      : pathname === href;

  return (
    <>
      <div className="db-side-brand">
        <span className="en-label">DASHBOARD</span>
        <div className="ttl">
          <span className="mark-dot">B</span>
          ダッシュボード
        </div>
      </div>

      <div className="db-side-group-label">コンテンツ</div>
      {contentItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`db-side-link ${isActive(item.href) ? "is-active" : ""}`}
          >
            <Icon size={16} />
            <span className="lbl">{item.label}</span>
          </Link>
        );
      })}

      <div className="db-side-group-label">アカウント</div>
      {accountItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`db-side-link ${isActive(item.href) ? "is-active" : ""}`}
          >
            <Icon size={16} />
            <span className="lbl">{item.label}</span>
          </Link>
        );
      })}

      <div className="db-side-group-label">リンク</div>
      <Link href="/" className="db-side-link">
        <ExternalLink size={16} />
        <span className="lbl">ブログを見る</span>
      </Link>
      <button type="button" className="db-side-link" onClick={handleLogout}>
        <LogOut size={16} />
        <span className="lbl">ログアウト</span>
      </button>

      <div className="db-side-user">
        <div className="avatar-md" aria-hidden>
          {initial}
        </div>
        <div className="info">
          <div className="n">{displayName}</div>
          <div className="e">{email}</div>
        </div>
      </div>
    </>
  );
}
