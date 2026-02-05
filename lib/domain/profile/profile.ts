import { Result, ok, err } from "@/lib/shared/result";

export type Profile = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProfileInput = {
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
};

export type UpdateProfileInput = {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
};

export type ProfileError =
  | { type: "EMPTY_DISPLAY_NAME" }
  | { type: "INVALID_EMAIL" };

export function createProfile(
  input: CreateProfileInput
): Result<Profile, ProfileError> {
  if (!input.displayName.trim()) {
    return err({ type: "EMPTY_DISPLAY_NAME" });
  }

  if (!isValidEmail(input.email)) {
    return err({ type: "INVALID_EMAIL" });
  }

  const now = new Date();
  const profile: Profile = {
    id: crypto.randomUUID(),
    email: input.email,
    displayName: input.displayName,
    avatarUrl: input.avatarUrl ?? null,
    bio: input.bio ?? null,
    createdAt: now,
    updatedAt: now,
  };

  return ok(profile);
}

export function updateProfile(
  profile: Profile,
  changes: UpdateProfileInput
): Result<Profile, ProfileError> {
  const newDisplayName = changes.displayName ?? profile.displayName;

  if (!newDisplayName.trim()) {
    return err({ type: "EMPTY_DISPLAY_NAME" });
  }

  const now = new Date();
  return ok({
    ...profile,
    displayName: newDisplayName,
    avatarUrl:
      changes.avatarUrl !== undefined ? changes.avatarUrl : profile.avatarUrl,
    bio: changes.bio !== undefined ? changes.bio : profile.bio,
    updatedAt: now,
  });
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
