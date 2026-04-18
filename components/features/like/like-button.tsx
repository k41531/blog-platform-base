"use client";

import { useState, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
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
        // Revert optimistic update: calling the reducer again toggles state back.
        setOptimistic();
        setErrorType(result.error.type);
      }
    });
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isPending}
        aria-label={optimistic.liked ? "いいねを取り消す" : "いいねする"}
        className="gap-1.5"
      >
        <Heart
          className={
            optimistic.liked
              ? "fill-red-500 text-red-500"
              : "text-muted-foreground"
          }
          size={18}
        />
        <span className="text-sm tabular-nums">{optimistic.count}</span>
      </Button>
      <p
        role="status"
        aria-live="polite"
        className="text-xs text-destructive min-h-[1rem]"
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
