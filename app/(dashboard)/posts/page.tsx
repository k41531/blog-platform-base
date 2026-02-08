import Link from "next/link";
import { FilePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getMyPosts } from "@/lib/actions/post-actions";
import { PostListItem } from "@/components/features/dashboard/post-list-item";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const result = await getMyPosts();

  if (!result.ok) {
    return (
      <div className="text-center text-muted-foreground">
        記事の取得に失敗しました
      </div>
    );
  }

  const allPosts = result.value;
  const filter = params.status ?? "all";
  const posts =
    filter === "all"
      ? allPosts
      : allPosts.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">マイ記事</h2>
        <Button asChild>
          <Link href="/dashboard/posts/new">
            <FilePlus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { value: "all", label: "すべて" },
          { value: "draft", label: "下書き" },
          { value: "published", label: "公開済み" },
        ].map((tab) => (
          <Button
            key={tab.value}
            variant={filter === tab.value ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link
              href={
                tab.value === "all"
                  ? "/dashboard/posts"
                  : `/dashboard/posts?status=${tab.value}`
              }
            >
              {tab.label}
            </Link>
          </Button>
        ))}
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            {filter === "all"
              ? "まだ記事がありません"
              : filter === "draft"
                ? "下書きの記事がありません"
                : "公開済みの記事がありません"}
          </p>
          {filter === "all" && (
            <Button className="mt-4" asChild>
              <Link href="/dashboard/posts/new">
                <FilePlus className="mr-2 h-4 w-4" />
                最初の記事を書きましょう
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
