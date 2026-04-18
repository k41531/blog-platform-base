import Link from "next/link";

import { formatDateCompact } from "@/lib/utils";
import { PostActionsDropdown } from "@/components/features/dashboard/post-actions-dropdown";
import type { Post } from "@/lib/domain/post/post";

export function PostListItem({ post }: { post: Post }) {
  const isPublished = post.status === "published";
  return (
    <div className="manage-row">
      <div className="ttl-col">
        <div className="ttl-line">
          <Link href={`/dashboard/posts/${post.id}/edit`} className="ttl">
            {post.title || "(無題)"}
          </Link>
          <span
            className={`status-badge ${isPublished ? "is-public" : "is-draft"}`}
          >
            {isPublished ? "公開" : "下書き"}
          </span>
        </div>
        <div className="meta">更新: {formatDateCompact(post.updatedAt)}</div>
      </div>
      <PostActionsDropdown post={post} />
    </div>
  );
}
