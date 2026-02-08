import Link from "next/link";

import type { Post } from "@/lib/domain/post/post";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader>
          <CardTitle className="text-xl">{post.title}</CardTitle>
          <CardDescription>
            {post.publishedAt ? formatDate(post.publishedAt) : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {truncate(post.content, 100)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
