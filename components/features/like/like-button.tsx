"use client";

import { useState, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { toggleLike } from "@/lib/actions/like-actions";
import type { ActionError } from "@/lib/actions/types";

type LikeState = {
  liked: boolean;
  count: number;
};

type ErrorType = ActionError["type"];

const ERROR_MESSAGES: Record<ErrorType, string> = {
  UNAUTHORIZED: "ログインが必要です",
  NOT_FOUND: "記事が見つかりません",
  VALIDATION_ERROR: "入力が不正です",
  DATABASE_ERROR: "エラーが発生しました",
};

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [optimistic, setOptimistic] = useOptimistic<LikeState, void>(
    { liked: initialLiked, count: initialCount },
    (current) => ({
      liked: !current.liked,
      count: current.liked ? current.count - 1 : current.count + 1,
    }),
  );

  function handleClick() {
    startTransition(async () => {
      setErrorType(null);
      setOptimistic();
      const result = await toggleLike(postId);
      if (!result.ok) {
        setOptimistic();
        setErrorType(result.error.type);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={optimistic.liked ? "いいねを取り消す" : "いいねする"}
        className={`like-btn ${optimistic.liked ? "is-liked" : ""}`}
      >
        <Heart
          size={16}
          className={optimistic.liked ? "fill-current" : ""}
        />
        <span className="tabular-nums">{optimistic.count}</span>
      </button>
      <p
        role="status"
        aria-live="polite"
        className="text-xs mt-2 min-h-[1rem]"
        style={{ color: "var(--danger)" }}
      >
        {errorType && (
          <>
            {ERROR_MESSAGES[errorType]}
            {errorType === "UNAUTHORIZED" && (
              <Link href="/auth/login" className="underline ml-1">
                ログイン
              </Link>
            )}
          </>
        )}
      </p>
    </div>
  );
}
