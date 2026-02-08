"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateMyProfile } from "@/lib/actions/profile-actions";
import type { Profile } from "@/lib/domain/profile/profile";

type FormState = {
  message: string;
  type: "success" | "error" | "idle";
};

async function handleSubmit(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await updateMyProfile(formData);
  if (result.ok) {
    return { message: "プロフィールを更新しました", type: "success" };
  }
  const errorMessage =
    result.error.type === "VALIDATION_ERROR"
      ? result.error.message
      : "更新に失敗しました";
  return { message: errorMessage, type: "error" };
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(handleSubmit, {
    message: "",
    type: "idle" as const,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロフィール設定</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" value={profile.email} disabled />
            <p className="text-xs text-muted-foreground">
              メールアドレスは変更できません
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">表示名</Label>
            <Input
              id="displayName"
              name="displayName"
              defaultValue={profile.displayName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">自己紹介</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio ?? ""}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">アバターURL</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              defaultValue={profile.avatarUrl ?? ""}
              placeholder="https://example.com/avatar.png"
            />
          </div>

          {state.type !== "idle" && (
            <p
              className={
                state.type === "success"
                  ? "text-sm text-green-600"
                  : "text-sm text-destructive"
              }
            >
              {state.message}
            </p>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? "保存中..." : "保存"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
