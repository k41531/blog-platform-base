import { createClient } from "@/lib/supabase/server";
import type { Post, EditorType, PostStatus } from "@/lib/domain/post/post";

type PostRow = {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  editor_type: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    authorId: row.author_id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    editorType: row.editor_type as EditorType,
    status: row.status as PostStatus,
    publishedAt: row.published_at ? new Date(row.published_at) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function toRow(post: Post) {
  return {
    id: post.id,
    author_id: post.authorId,
    title: post.title,
    slug: post.slug,
    content: post.content,
    editor_type: post.editorType,
    status: post.status,
    published_at: post.publishedAt?.toISOString() ?? null,
    created_at: post.createdAt.toISOString(),
    updated_at: post.updatedAt.toISOString(),
  };
}

export async function findBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return toPost(data as PostRow);
}

export async function findPublished(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return (data as PostRow[]).map(toPost);
}

export async function findByAuthorId(authorId: string): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", authorId)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return (data as PostRow[]).map(toPost);
}

export async function findById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return toPost(data as PostRow);
}

export async function create(post: Post): Promise<Post> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert(toRow(post))
    .select()
    .single();

  if (error) throw new Error(`Failed to create post: ${error.message}`);
  return toPost(data as PostRow);
}

export async function update(post: Post): Promise<Post> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .update(toRow(post))
    .eq("id", post.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update post: ${error.message}`);
  return toPost(data as PostRow);
}

export async function remove(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) throw new Error(`Failed to delete post: ${error.message}`);
}
