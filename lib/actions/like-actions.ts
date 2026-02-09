"use server";

import { revalidatePath } from "next/cache";

import type { Result } from "@/lib/shared/result";
import { ok, err } from "@/lib/shared/result";
import { createLike } from "@/lib/domain/like/like";
import * as likeRepository from "@/lib/repositories/like-repository";
import type { ActionError } from "@/lib/actions/types";
import { getCurrentUserId } from "@/lib/actions/types";

export async function toggleLike(
  postId: string,
): Promise<Result<{ liked: boolean; count: number }, ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;
  const userId = userResult.value;

  if (!postId) {
    return err({ type: "VALIDATION_ERROR", message: "postId is required" });
  }

  try {
    const existing = await likeRepository.findByUserAndPost(userId, postId);

    if (existing) {
      await likeRepository.remove(userId, postId);
      const count = await likeRepository.countByPostId(postId);
      revalidatePath(`/posts`);
      return ok({ liked: false, count });
    }

    const likeResult = createLike({ userId, postId });
    if (!likeResult.ok) {
      return err({ type: "DATABASE_ERROR", message: likeResult.error.type });
    }

    await likeRepository.create(likeResult.value);
    const count = await likeRepository.countByPostId(postId);
    revalidatePath(`/posts`);
    return ok({ liked: true, count });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return err({ type: "DATABASE_ERROR", message });
  }
}

export async function getLikeCount(
  postId: string,
): Promise<Result<number, ActionError>> {
  if (!postId) {
    return err({ type: "VALIDATION_ERROR", message: "postId is required" });
  }

  try {
    const count = await likeRepository.countByPostId(postId);
    return ok(count);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return err({ type: "DATABASE_ERROR", message });
  }
}

export async function hasLiked(
  postId: string,
): Promise<Result<boolean, ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;
  const userId = userResult.value;

  if (!postId) {
    return err({ type: "VALIDATION_ERROR", message: "postId is required" });
  }

  try {
    const like = await likeRepository.findByUserAndPost(userId, postId);
    return ok(like !== null);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return err({ type: "DATABASE_ERROR", message });
  }
}
