"use client";

import { useOptimistic, useTransition } from "react";
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
  const [optimistic, setOptimistic] = useOptimistic<LikeState, void>(
    { liked: initialLiked, count: initialCount },
    (current) => ({
      liked: !current.liked,
      count: current.liked ? current.count - 1 : current.count + 1,
    }),
  );

  function handleClick() {
    startTransition(async () => {
      setOptimistic();
      await toggleLike(postId);
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
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
  );
}
