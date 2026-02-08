"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FilePlus, Settings, ExternalLink, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard/posts", label: "記事管理", icon: FileText },
  { href: "/dashboard/posts/new", label: "新規作成", icon: FilePlus },
  { href: "/dashboard/settings", label: "設定", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            className={cn("justify-start", isActive && "font-semibold")}
            asChild
          >
            <Link href={item.href}>
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
      <div className="my-2 h-px bg-border" />
      <Button variant="ghost" className="justify-start" asChild>
        <Link href="/" target="_blank">
          <ExternalLink className="mr-2 h-4 w-4" />
          ブログを見る
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="justify-start text-muted-foreground"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        ログアウト
      </Button>
    </nav>
  );
}
