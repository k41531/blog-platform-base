"use server";

import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/lib/shared/result";
import { ok, err } from "@/lib/shared/result";

export type ActionError =
  | { type: "UNAUTHORIZED" }
  | { type: "NOT_FOUND" }
  | { type: "VALIDATION_ERROR"; message: string }
  | { type: "DATABASE_ERROR"; message: string };

export async function getCurrentUserId(): Promise<Result<string, ActionError>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return err({ type: "UNAUTHORIZED" });
  }

  return ok(user.id);
}
