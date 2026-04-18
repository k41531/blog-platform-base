import Link from "next/link";

import type { Post } from "@/lib/domain/post/post";
import { stripMarkdown } from "@/lib/shared/strip-markdown";

function truncate(text: string, maxLength: number): string {
  const plain = stripMarkdown(text);
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength) + "…";
}

function formatDateEn(date: Date): string {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`} className="post-item">
      {post.publishedAt && (
        <div className="post-item-meta-row">
          <span className="post-item-date">
            {formatDateEn(post.publishedAt)}
          </span>
        </div>
      )}
      <h2 className="post-item-title">{post.title}</h2>
      <p className="post-item-excerpt">{truncate(post.content, 120)}</p>
    </Link>
  );
}
