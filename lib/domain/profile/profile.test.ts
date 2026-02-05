import { describe, it, expect } from "vitest";

import {
  createProfile,
  updateProfile,
  type CreateProfileInput,
  type Profile,
} from "./profile";

describe("Profile集約", () => {
  describe("プロフィールの作成", () => {
    it("メールアドレスと表示名を指定してプロフィールを作成できる", () => {
      // Arrange
      const input: CreateProfileInput = {
        email: "user@example.com",
        displayName: "山田太郎",
      };

      // Act
      const result = createProfile(input);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.email).toBe("user@example.com");
        expect(result.value.displayName).toBe("山田太郎");
      }
    });

    it("アバターURLと自己紹介文を指定できる", () => {
      // Arrange
      const input: CreateProfileInput = {
        email: "user@example.com",
        displayName: "山田太郎",
        avatarUrl: "https://example.com/avatar.png",
        bio: "よろしくお願いします",
      };

      // Act
      const result = createProfile(input);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.avatarUrl).toBe("https://example.com/avatar.png");
        expect(result.value.bio).toBe("よろしくお願いします");
      }
    });

    it("アバターURLと自己紹介文を省略するとnullになる", () => {
      // Arrange
      const input: CreateProfileInput = {
        email: "user@example.com",
        displayName: "山田太郎",
      };

      // Act
      const result = createProfile(input);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.avatarUrl).toBeNull();
        expect(result.value.bio).toBeNull();
      }
    });

    it("表示名が空だとプロフィールを作成できない", () => {
      // Arrange
      const input: CreateProfileInput = {
        email: "user@example.com",
        displayName: "",
      };

      // Act
      const result = createProfile(input);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("EMPTY_DISPLAY_NAME");
      }
    });

    it("メールアドレスの形式が正しくないとエラーになる", () => {
      // Arrange
      const input: CreateProfileInput = {
        email: "invalid-email",
        displayName: "山田太郎",
      };

      // Act
      const result = createProfile(input);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("INVALID_EMAIL");
      }
    });
  });

  describe("プロフィールの更新", () => {
    it("表示名を変更できる", () => {
      // Arrange
      const profile = createTestProfile();
      const changes = { displayName: "新しい名前" };

      // Act
      const result = updateProfile(profile, changes);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.displayName).toBe("新しい名前");
      }
    });

    it("自己紹介文を変更できる", () => {
      // Arrange
      const profile = createTestProfile();
      const changes = { bio: "新しい自己紹介" };

      // Act
      const result = updateProfile(profile, changes);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.bio).toBe("新しい自己紹介");
      }
    });

    it("アバターURLを変更できる", () => {
      // Arrange
      const profile = createTestProfile();
      const changes = { avatarUrl: "https://example.com/new-avatar.png" };

      // Act
      const result = updateProfile(profile, changes);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.avatarUrl).toBe(
          "https://example.com/new-avatar.png"
        );
      }
    });

    it("表示名を空にするとエラーになる", () => {
      // Arrange
      const profile = createTestProfile();
      const changes = { displayName: "" };

      // Act
      const result = updateProfile(profile, changes);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("EMPTY_DISPLAY_NAME");
      }
    });

    it("メールアドレスは変更できない", () => {
      // Arrange
      const profile = createTestProfile();

      // Act
      const result = updateProfile(profile, {});

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.email).toBe(profile.email);
      }
    });
  });
});

// テストヘルパー
function createTestProfile(): Profile {
  return {
    id: "user-123",
    email: "test@example.com",
    displayName: "テストユーザー",
    avatarUrl: null,
    bio: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  };
}
