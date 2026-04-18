import { Suspense } from "react";

import { getMyProfile } from "@/lib/actions/profile-actions";
import { ProfileForm } from "@/components/features/profile/profile-form";

async function SettingsContent() {
  const result = await getMyProfile();

  if (!result.ok) {
    return (
      <div className="empty-state">
        <h3>読み込みエラー</h3>
        <p>プロフィールの取得に失敗しました。</p>
      </div>
    );
  }

  return <ProfileForm profile={result.value} />;
}

export default function SettingsPage() {
  return (
    <div className="fade-in">
      <div className="db-main-header">
        <div>
          <span className="en-label">SETTINGS</span>
          <h1 className="db-main-title">設定</h1>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="empty-state">
            <p>読み込み中…</p>
          </div>
        }
      >
        <SettingsContent />
      </Suspense>
    </div>
  );
}
