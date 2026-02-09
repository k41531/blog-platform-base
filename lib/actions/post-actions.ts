"use server";

import { revalidatePath } from "next/cache";

import type { Result } from "@/lib/shared/result";
import { ok, err } from "@/lib/shared/result";
import type { Post } from "@/lib/domain/post/post";
import {
  createPost,
  publishPost as domainPublishPost,
  unpublishPost as domainUnpublishPost,
} from "@/lib/domain/post/post";
import * as postRepository from "@/lib/repositories/post-repository";
import type { ActionError } from "@/lib/actions/types";
import { getCurrentUserId } from "@/lib/actions/types";

export async function createDraftPost(
  formData: FormData,
): Promise<Result<Post, ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;
  const userId = userResult.value;

  const title = formData.get("title") as string | null;
  const content = formData.get("content") as string | null;
  const editorType = (formData.get("editorType") as string | null) ?? undefined;

  const result = createPost({
    authorId: userId,
    title: title ?? "",
    content: content ?? "",
    editorType:
      editorType === "richtext" || editorType === "markdown"
        ? editorType
        : undefined,
  });

  if (!result.ok) {
    return err({
      type: "VALIDATION_ERROR",
      message: result.error.type,
    });
  }

  try {
    const saved = await postRepository.create(result.value);
    revalidatePath("/");
    revalidatePath("/dashboard");
    return ok(saved);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

export async function updatePost(
  postId: string,
  formData: FormData,
): Promise<Result<Post, ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;
  const userId = userResult.value;

  const existing = await postRepository.findById(postId);
  if (!existing) return err({ type: "NOT_FOUND" });
  if (existing.authorId !== userId) return err({ type: "UNAUTHORIZED" });

  const title = formData.get("title") as string | null;
  const content = formData.get("content") as string | null;

  if (title !== null && !title.trim()) {
    return err({ type: "VALIDATION_ERROR", message: "EMPTY_TITLE" });
  }
  if (content !== null && !content.trim()) {
    return err({ type: "VALIDATION_ERROR", message: "EMPTY_CONTENT" });
  }

  const updated: Post = {
    ...existing,
    title: title ?? existing.title,
    content: content ?? existing.content,
    updatedAt: new Date(),
  };

  try {
    const saved = await postRepository.update(updated);
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/posts/${saved.slug}`);
    return ok(saved);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

export async function publishPost(
  postId: string,
): Promise<Result<Post, ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;
  const userId = userResult.value;

  const existing = await postRepository.findById(postId);
  if (!existing) return err({ type: "NOT_FOUND" });
  if (existing.authorId !== userId) return err({ type: "UNAUTHORIZED" });

  const result = domainPublishPost(existing);
  if (!result.ok) {
    return err({ type: "VALIDATION_ERROR", message: result.error.type });
  }

  try {
    const saved = await postRepository.update(result.value);
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/posts/${saved.slug}`);
    return ok(saved);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

export async function unpublishPost(
  postId: string,
): Promise<Result<Post, ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;
  const userId = userResult.value;

  const existing = await postRepository.findById(postId);
  if (!existing) return err({ type: "NOT_FOUND" });
  if (existing.authorId !== userId) return err({ type: "UNAUTHORIZED" });

  const result = domainUnpublishPost(existing);
  if (!result.ok) {
    return err({ type: "VALIDATION_ERROR", message: result.error.type });
  }

  try {
    const saved = await postRepository.update(result.value);
    revalidatePath("/");
    revalidatePath("/dashboard");
    return ok(saved);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

export async function deletePost(
  postId: string,
): Promise<Result<void, ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;
  const userId = userResult.value;

  const existing = await postRepository.findById(postId);
  if (!existing) return err({ type: "NOT_FOUND" });
  if (existing.authorId !== userId) return err({ type: "UNAUTHORIZED" });

  try {
    await postRepository.remove(postId);
    revalidatePath("/");
    revalidatePath("/dashboard");
    return ok(undefined);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

export async function getPost(
  slug: string,
): Promise<Result<Post, ActionError>> {
  try {
    const post = await postRepository.findBySlug(slug);
    if (!post) return err({ type: "NOT_FOUND" });
    return ok(post);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

export async function getPublishedPosts(): Promise<
  Result<Post[], ActionError>
> {
  try {
    const posts = await postRepository.findPublished();
    return ok(posts);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

export async function getPostById(
  id: string,
): Promise<Result<Post, ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;
  const userId = userResult.value;

  try {
    const post = await postRepository.findById(id);
    if (!post) return err({ type: "NOT_FOUND" });
    if (post.authorId !== userId) return err({ type: "UNAUTHORIZED" });
    return ok(post);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

export async function getMyPosts(): Promise<Result<Post[], ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;
  const userId = userResult.value;

  try {
    const posts = await postRepository.findByAuthorId(userId);
    return ok(posts);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}
