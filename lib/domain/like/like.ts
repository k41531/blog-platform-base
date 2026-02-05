import { Result, ok, err } from "@/lib/shared/result";

export type Like = {
  userId: string;
  postId: string;
  createdAt: Date;
};

export type CreateLikeInput = {
  userId: string;
  postId: string;
};

export type LikeError = { type: "ALREADY_LIKED" } | { type: "NOT_LIKED" };

export function createLike(
  input: CreateLikeInput,
  existingLikes: Like[] = []
): Result<Like, LikeError> {
  const alreadyLiked = existingLikes.some(
    (like) => like.userId === input.userId && like.postId === input.postId
  );

  if (alreadyLiked) {
    return err({ type: "ALREADY_LIKED" });
  }

  const like: Like = {
    userId: input.userId,
    postId: input.postId,
    createdAt: new Date(),
  };

  return ok(like);
}

export function removeLike(
  like?: Like,
  userId?: string,
  postId?: string,
  existingLikes?: Like[]
): Result<void, LikeError> {
  // likeが直接渡された場合は単純に成功
  if (like) {
    return ok(undefined);
  }

  // existingLikesから検索する場合
  if (userId && postId && existingLikes) {
    const found = existingLikes.some(
      (l) => l.userId === userId && l.postId === postId
    );

    if (!found) {
      return err({ type: "NOT_LIKED" });
    }

    return ok(undefined);
  }

  return err({ type: "NOT_LIKED" });
}
