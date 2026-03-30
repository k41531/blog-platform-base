import type { Profile } from "@/lib/domain/profile/profile";

export function AuthorInfo({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-center gap-3">
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt={profile.displayName}
          className="size-10 rounded-full object-cover"
        />
      ) : (
        <div className="size-10 rounded-full bg-muted flex items-center justify-center">
          <span className="text-sm font-medium text-muted-foreground">
            {profile.displayName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div>
        <p className="text-sm font-medium">{profile.displayName}</p>
      </div>
    </div>
  );
}
