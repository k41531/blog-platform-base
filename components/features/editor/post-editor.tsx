"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { CodeMirrorEditor } from "@/components/features/editor/codemirror/codemirror-editor";
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
    <div className="space-y-5">
      {error && <div className="form-error-banner">{error}</div>}

      <div className="field">
        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          className="editor-title-input"
          placeholder="記事のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="field">
        <label>本文</label>
        <Card>
          <CardContent className="p-4">
            <CodeMirrorEditor
              value={content}
              onChange={setContent}
              disabled={isPending}
            />
          </CardContent>
        </Card>
      </div>

      <div className="editor-actions">
        <button
          type="button"
          className="btn-haruni btn-haruni-secondary"
          onClick={handleSaveDraft}
          disabled={isPending}
        >
          {isPending ? "保存中…" : "下書き保存"}
        </button>
        <button
          type="button"
          className="btn-pop"
          onClick={handlePublish}
          disabled={isPending}
        >
          {isPending
            ? "公開中…"
            : mode === "edit" && post?.status === "published"
              ? "更新する"
              : "公開する"}
        </button>
        {mode === "edit" && post?.status === "published" && (
          <button
            type="button"
            className="btn-ghost-pill"
            onClick={handleUnpublish}
            disabled={isPending}
          >
            {isPending ? "処理中…" : "非公開にする"}
          </button>
        )}
        <button
          type="button"
          className="btn-ghost-pill"
          onClick={() => router.push("/dashboard/posts")}
          disabled={isPending}
          style={{ marginLeft: "auto" }}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
