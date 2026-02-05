import { Result, ok, err } from "@/lib/shared/result";

export type EditorType = "markdown" | "richtext";
export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  editorType: EditorType;
  status: PostStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePostInput = {
  authorId: string;
  title: string;
  content: string;
  editorType?: EditorType;
};

export type PostError =
  | { type: "EMPTY_TITLE" }
  | { type: "EMPTY_CONTENT" }
  | { type: "ALREADY_PUBLISHED" }
  | { type: "NOT_PUBLISHED" };

export function createPost(input: CreatePostInput): Result<Post, PostError> {
  if (!input.title.trim()) {
    return err({ type: "EMPTY_TITLE" });
  }

  if (!input.content.trim()) {
    return err({ type: "EMPTY_CONTENT" });
  }

  const now = new Date();
  const post: Post = {
    id: generateId(),
    authorId: input.authorId,
    title: input.title,
    slug: generateSlug(input.title),
    content: input.content,
    editorType: input.editorType ?? "markdown",
    status: "draft",
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  return ok(post);
}

export function publishPost(post: Post): Result<Post, PostError> {
  if (post.status === "published") {
    return err({ type: "ALREADY_PUBLISHED" });
  }

  const now = new Date();
  return ok({
    ...post,
    status: "published",
    publishedAt: now,
    updatedAt: now,
  });
}

export function unpublishPost(post: Post): Result<Post, PostError> {
  if (post.status === "draft") {
    return err({ type: "NOT_PUBLISHED" });
  }

  const now = new Date();
  return ok({
    ...post,
    status: "draft",
    publishedAt: null,
    updatedAt: now,
  });
}

function generateId(): string {
  return crypto.randomUUID();
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  const suffix = crypto.randomUUID().slice(0, 8);
  return `${base}-${suffix}`;
}
