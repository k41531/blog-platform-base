"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Globe, EyeOff, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { publishPost, unpublishPost, deletePost } from "@/lib/actions/post-actions";
import type { Post } from "@/lib/domain/post/post";

export function PostActionsDropdown({ post }: { post: Post }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePublishToggle = () => {
    setError(null);
    startTransition(async () => {
      const result =
        post.status === "draft"
          ? await publishPost(post.id)
          : await unpublishPost(post.id);
      if (!result.ok) {
        setError("操作に失敗しました");
      }
    });
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`「${post.title}」を削除しますか？この操作は取り消せません。`);
    if (!confirmed) return;
    setError(null);
    startTransition(async () => {
      const result = await deletePost(post.id);
      if (!result.ok) {
        setError("削除に失敗しました");
      }
    });
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">アクション</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/dashboard/posts/${post.id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            編集
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePublishToggle}>
            {post.status === "draft" ? (
              <>
                <Globe className="mr-2 h-4 w-4" />
                公開する
              </>
            ) : (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                非公開にする
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && (
        <p className="absolute right-0 top-full mt-1 whitespace-nowrap text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
