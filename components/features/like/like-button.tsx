"use client";

import { useState, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleLike } from "@/lib/actions/like-actions";

type LikeState = {
  liked: boolean;
  count: number;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [optimistic, setOptimistic] = useOptimistic<LikeState, void>(
    { liked: initialLiked, count: initialCount },
    (current) => ({
      liked: !current.liked,
      count: current.liked ? current.count - 1 : current.count + 1,
    }),
  );

  function handleClick() {
    startTransition(async () => {
      setErrorMessage(null);
      setOptimistic();
      const result = await toggleLike(postId);
      if (!result.ok) {
        if (result.error.type === "UNAUTHORIZED") {
          setErrorMessage("ログインが必要です");
        } else {
          setErrorMessage("エラーが発生しました");
        }
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
      {errorMessage && (
        <p className="text-xs text-destructive">
          {errorMessage}
          {errorMessage === "ログインが必要です" && (
            <Link href="/auth/login" className="underline ml-1">
              ログイン
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
