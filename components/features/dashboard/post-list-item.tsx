import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatDateCompact } from "@/lib/utils";
import { PostActionsDropdown } from "@/components/features/dashboard/post-actions-dropdown";
import type { Post } from "@/lib/domain/post/post";

export function PostListItem({ post }: { post: Post }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/posts/${post.id}/edit`}
            className="truncate font-medium hover:underline"
          >
            {post.title}
          </Link>
          <Badge
            variant={post.status === "published" ? "default" : "secondary"}
            className={
              post.status === "published"
                ? "bg-green-600 hover:bg-green-600/80"
                : ""
            }
          >
            {post.status === "published" ? "公開" : "下書き"}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          更新: {formatDateCompact(post.updatedAt)}
        </p>
      </div>
      <PostActionsDropdown post={post} />
    </div>
  );
}
