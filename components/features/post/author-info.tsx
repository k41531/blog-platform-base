import type { Profile } from "@/lib/domain/profile/profile";

function getInitial(displayName: string): string {
  const [first] = [...displayName];
  return first ? first.toUpperCase() : "?";
}

export function AuthorInfo({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-center gap-3">
      {profile.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatarUrl}
          alt=""
          className="size-10 rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="size-10 rounded-full bg-muted flex items-center justify-center"
        >
          <span className="text-sm font-medium text-muted-foreground">
            {getInitial(profile.displayName)}
          </span>
        </div>
      )}
      <div>
        <p className="text-sm font-medium">{profile.displayName}</p>
      </div>
    </div>
  );
}
