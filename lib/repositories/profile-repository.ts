import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/lib/domain/profile/profile";

type ProfileRow = {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function findById(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return toProfile(data as ProfileRow);
}

export async function findByEmail(email: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return null;
  }

  return toProfile(data as ProfileRow);
}

export async function update(profile: Profile): Promise<Profile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: profile.displayName,
      avatar_url: profile.avatarUrl,
      bio: profile.bio,
      updated_at: profile.updatedAt.toISOString(),
    })
    .eq("id", profile.id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Failed to update profile: ${error?.message}`);
  }

  return toProfile(data as ProfileRow);
}
