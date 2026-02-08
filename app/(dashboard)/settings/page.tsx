import { getMyProfile } from "@/lib/actions/profile-actions";
import { ProfileForm } from "@/components/features/profile/profile-form";

export default async function SettingsPage() {
  const result = await getMyProfile();

  if (!result.ok) {
    return (
      <div className="text-center text-muted-foreground">
        プロフィールの取得に失敗しました
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">設定</h2>
      <ProfileForm profile={result.value} />
    </div>
  );
}
