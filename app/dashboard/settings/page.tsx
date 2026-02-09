import { Suspense } from "react";

import { getMyProfile } from "@/lib/actions/profile-actions";
import { ProfileForm } from "@/components/features/profile/profile-form";

async function SettingsContent() {
  const result = await getMyProfile();

  if (!result.ok) {
    return (
      <div className="text-center text-muted-foreground">
        プロフィールの取得に失敗しました
      </div>
    );
  }

  return <ProfileForm profile={result.value} />;
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">設定</h2>
      <Suspense
        fallback={
          <p className="text-muted-foreground text-center py-12">
            読み込み中...
          </p>
        }
      >
        <SettingsContent />
      </Suspense>
    </div>
  );
}
