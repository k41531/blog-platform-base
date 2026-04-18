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
          className="avatar-md"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div aria-hidden="true" className="avatar-md">
          {getInitial(profile.displayName)}
        </div>
      )}
      <div
        style={{
          fontFamily: "var(--font-jp-sans)",
          fontWeight: 600,
          fontSize: 14,
          color: "var(--fg-1)",
        }}
      >
        {profile.displayName}
      </div>
    </div>
  );
}
