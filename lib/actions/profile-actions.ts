"use server";

import { revalidatePath } from "next/cache";

import type { Result } from "@/lib/shared/result";
import { ok, err } from "@/lib/shared/result";
import type { Profile, UpdateProfileInput } from "@/lib/domain/profile/profile";
import { updateProfile } from "@/lib/domain/profile/profile";
import * as profileRepository from "@/lib/repositories/profile-repository";
import type { ActionError } from "@/lib/actions/types";
import { getCurrentUserId } from "@/lib/actions/types";

export async function getProfile(
  userId: string,
): Promise<Result<Profile, ActionError>> {
  try {
    const profile = await profileRepository.findById(userId);
    if (!profile) {
      return err({ type: "NOT_FOUND" });
    }
    return ok(profile);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}

export async function getMyProfile(): Promise<Result<Profile, ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;

  return getProfile(userResult.value);
}

export async function updateMyProfile(
  formData: FormData,
): Promise<Result<Profile, ActionError>> {
  const userResult = await getCurrentUserId();
  if (!userResult.ok) return userResult;
  const userId = userResult.value;

  const profile = await profileRepository.findById(userId);
  if (!profile) {
    return err({ type: "NOT_FOUND" });
  }

  const changes: UpdateProfileInput = {};
  const displayName = formData.get("displayName");
  const avatarUrl = formData.get("avatarUrl");
  const bio = formData.get("bio");

  if (typeof displayName === "string") {
    changes.displayName = displayName;
  }
  if (typeof avatarUrl === "string") {
    changes.avatarUrl = avatarUrl;
  }
  if (typeof bio === "string") {
    changes.bio = bio;
  }

  const result = updateProfile(profile, changes);
  if (!result.ok) {
    const message =
      result.error.type === "EMPTY_DISPLAY_NAME"
        ? "表示名は空にできません"
        : "バリデーションエラー";
    return err({ type: "VALIDATION_ERROR", message });
  }

  try {
    const updated = await profileRepository.update(result.value);
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/profile");
    return ok(updated);
  } catch (e) {
    return err({
      type: "DATABASE_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
    });
  }
}
