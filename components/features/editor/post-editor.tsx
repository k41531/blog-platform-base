"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownPreview } from "@/components/features/editor/markdown-preview";
import type { Post } from "@/lib/domain/post/post";
import {
  createDraftPost,
  updatePost,
  publishPost,
  unpublishPost,
} from "@/lib/actions/post-actions";

type PostEditorProps = {
  mode: "create" | "edit";
  post?: Post;
};

export function PostEditor({ mode, post }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

  function formatError(errorObj: {
    type: string;
    message?: string;
  }): string {
    switch (errorObj.type) {
      case "UNAUTHORIZED":
        return "ログインが必要です";
      case "NOT_FOUND":
        return "記事が見つかりません";
      case "VALIDATION_ERROR":
        switch (errorObj.message) {
          case "EMPTY_TITLE":
            return "タイトルを入力してください";
          case "EMPTY_CONTENT":
            return "本文を入力してください";
          default:
            return errorObj.message ?? "入力内容を確認してください";
        }
      case "DATABASE_ERROR":
        return "保存に失敗しました。もう一度お試しください";
      default:
        return "エラーが発生しました";
    }
  }

  function handleSaveDraft() {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("content", content);
      formData.set("editorType", "markdown");

      if (mode === "edit" && post) {
        const result = await updatePost(post.id, formData);
        if (!result.ok) {
          setError(formatError(result.error));
          return;
        }
      } else {
        const result = await createDraftPost(formData);
        if (!result.ok) {
          setError(formatError(result.error));
          return;
        }
      }
      router.push("/dashboard/posts");
    });
  }

  function handlePublish() {
    setError(null);
    startTransition(async () => {
      if (mode === "edit" && post) {
        // Update first, then publish
        const formData = new FormData();
        formData.set("title", title);
        formData.set("content", content);
        formData.set("editorType", "markdown");

        const updateResult = await updatePost(post.id, formData);
        if (!updateResult.ok) {
          setError(formatError(updateResult.error));
          return;
        }

        if (updateResult.value.status !== "published") {
          const publishResult = await publishPost(post.id);
          if (!publishResult.ok) {
            setError(formatError(publishResult.error));
            return;
          }
        }
      } else {
        // Create draft first, then publish
        const formData = new FormData();
        formData.set("title", title);
        formData.set("content", content);
        formData.set("editorType", "markdown");

        const createResult = await createDraftPost(formData);
        if (!createResult.ok) {
          setError(formatError(createResult.error));
          return;
        }

        const publishResult = await publishPost(createResult.value.id);
        if (!publishResult.ok) {
          setError(formatError(publishResult.error));
          return;
        }
      }
      router.push("/dashboard/posts");
    });
  }

  function handleUnpublish() {
    if (!post) return;
    setError(null);
    startTransition(async () => {
      const result = await unpublishPost(post.id);
      if (!result.ok) {
        setError(formatError(result.error));
        return;
      }
      router.push("/dashboard/posts");
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          placeholder="記事のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
        />
      </div>

      {/* Mobile view toggle */}
      <div className="flex gap-2 md:hidden">
        <Button
          variant={mobileView === "editor" ? "default" : "outline"}
          size="sm"
          onClick={() => setMobileView("editor")}
          type="button"
        >
          編集
        </Button>
        <Button
          variant={mobileView === "preview" ? "default" : "outline"}
          size="sm"
          onClick={() => setMobileView("preview")}
          type="button"
        >
          プレビュー
        </Button>
      </div>

      {/* Desktop: side-by-side, Mobile: tab-switched */}
      <div className="grid gap-4 md:grid-cols-2">
        <div
          className={
            mobileView === "editor" ? "block" : "hidden md:block"
          }
        >
          <Card className="h-full">
            <CardContent className="p-4">
              <Label htmlFor="content" className="sr-only">
                本文
              </Label>
              <textarea
                id="content"
                placeholder="Markdownで記事を書く..."
                className="min-h-[400px] w-full resize-y bg-transparent text-sm focus:outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isPending}
              />
            </CardContent>
          </Card>
        </div>
        <div
          className={
            mobileView === "preview" ? "block" : "hidden md:block"
          }
        >
          <MarkdownPreview content={content} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleSaveDraft}
          disabled={isPending}
          variant="outline"
        >
          {isPending ? "保存中..." : "下書き保存"}
        </Button>
        <Button onClick={handlePublish} disabled={isPending}>
          {isPending ? "公開中..." : "公開"}
        </Button>
        {mode === "edit" && post?.status === "published" && (
          <Button
            onClick={handleUnpublish}
            disabled={isPending}
            variant="secondary"
          >
            {isPending ? "処理中..." : "非公開にする"}
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/posts")}
          disabled={isPending}
        >
          キャンセル
        </Button>
      </div>
    </div>
  );
}
