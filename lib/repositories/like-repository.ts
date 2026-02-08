import { createClient } from "@/lib/supabase/server";
import { Like } from "@/lib/domain/like/like";

type LikeRow = {
  user_id: string;
  post_id: string;
  created_at: string;
};

function toEntity(row: LikeRow): Like {
  return {
    userId: row.user_id,
    postId: row.post_id,
    createdAt: new Date(row.created_at),
  };
}

export async function findByUserAndPost(
  userId: string,
  postId: string,
): Promise<Like | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to find like: ${error.message}`);
  }

  return data ? toEntity(data) : null;
}

export async function findByPostId(postId: string): Promise<Like[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to find likes: ${error.message}`);
  }

  return (data ?? []).map(toEntity);
}

export async function countByPostId(postId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) {
    throw new Error(`Failed to count likes: ${error.message}`);
  }

  return count ?? 0;
}

export async function create(like: Like): Promise<Like> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("likes")
    .insert({
      user_id: like.userId,
      post_id: like.postId,
      created_at: like.createdAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create like: ${error.message}`);
  }

  return toEntity(data);
}

export async function remove(userId: string, postId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", userId)
    .eq("post_id", postId);

  if (error) {
    throw new Error(`Failed to remove like: ${error.message}`);
  }
}
