"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";

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
    <div className="settings-card" style={{ maxWidth: 680 }}>
      <h3>プロフィール設定</h3>
      <p className="desc">他のメンバーに表示される情報です。</p>

      <form action={formAction}>
        <div className="field">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            className="field-input"
            value={profile.email}
            disabled
            style={{ opacity: 0.6, cursor: "not-allowed" }}
          />
          <span className="field-hint">メールアドレスは変更できません</span>
        </div>

        <div className="field">
          <label htmlFor="displayName">表示名</label>
          <input
            id="displayName"
            name="displayName"
            className="field-input"
            defaultValue={profile.displayName}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="bio">自己紹介</label>
          <textarea
            id="bio"
            name="bio"
            className="field-input"
            defaultValue={profile.bio ?? ""}
            rows={4}
            style={{ resize: "vertical" }}
          />
        </div>

        <div className="field">
          <label htmlFor="avatarUrl">アバターURL</label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            className="field-input"
            defaultValue={profile.avatarUrl ?? ""}
            placeholder="https://example.com/avatar.png"
          />
        </div>

        {state.type === "error" && (
          <div className="field-error" style={{ marginBottom: 12 }}>
            {state.message}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 12,
            alignItems: "center",
          }}
        >
          <button
            type="submit"
            className="btn-pop"
            disabled={isPending}
          >
            {isPending ? "保存中…" : "保存する"}
          </button>
          {state.type === "success" && (
            <span
              style={{
                color: "var(--success)",
                fontSize: 13,
                fontFamily: "var(--font-jp-sans)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Check size={14} /> {state.message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
