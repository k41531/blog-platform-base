import { describe, it, expect } from "vitest";

import { createLike, removeLike, type Like, type CreateLikeInput } from "./like";

describe("Like関係", () => {
  describe("いいねの作成", () => {
    it("記事にいいねできる", () => {
      // Arrange
      const input: CreateLikeInput = {
        userId: "user-123",
        postId: "post-456",
      };

      // Act
      const result = createLike(input);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.userId).toBe("user-123");
        expect(result.value.postId).toBe("post-456");
        expect(result.value.createdAt).toBeInstanceOf(Date);
      }
    });

    it("いいねの作成日時が記録される", () => {
      // Arrange
      const input: CreateLikeInput = {
        userId: "user-123",
        postId: "post-456",
      };
      const beforeCreate = new Date();

      // Act
      const result = createLike(input);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.createdAt.getTime()).toBeGreaterThanOrEqual(
          beforeCreate.getTime()
        );
      }
    });

    it("既にいいね済みの場合はエラーになる", () => {
      // Arrange
      const input: CreateLikeInput = {
        userId: "user-123",
        postId: "post-456",
      };
      const existingLikes: Like[] = [
        { userId: "user-123", postId: "post-456", createdAt: new Date() },
      ];

      // Act
      const result = createLike(input, existingLikes);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("ALREADY_LIKED");
      }
    });

    it("別の記事へのいいねは影響しない", () => {
      // Arrange
      const input: CreateLikeInput = {
        userId: "user-123",
        postId: "post-789",
      };
      const existingLikes: Like[] = [
        { userId: "user-123", postId: "post-456", createdAt: new Date() },
      ];

      // Act
      const result = createLike(input, existingLikes);

      // Assert
      expect(result.ok).toBe(true);
    });

    it("別のユーザーが同じ記事にいいねできる", () => {
      // Arrange
      const input: CreateLikeInput = {
        userId: "user-999",
        postId: "post-456",
      };
      const existingLikes: Like[] = [
        { userId: "user-123", postId: "post-456", createdAt: new Date() },
      ];

      // Act
      const result = createLike(input, existingLikes);

      // Assert
      expect(result.ok).toBe(true);
    });
  });

  describe("いいねの取り消し", () => {
    it("いいねを取り消せる", () => {
      // Arrange
      const like: Like = {
        userId: "user-123",
        postId: "post-456",
        createdAt: new Date(),
      };

      // Act
      const result = removeLike(like);

      // Assert
      expect(result.ok).toBe(true);
    });

    it("いいねしていない記事の取り消しはエラーになる", () => {
      // Arrange
      const userId = "user-123";
      const postId = "post-456";
      const existingLikes: Like[] = [];

      // Act
      const result = removeLike(undefined, userId, postId, existingLikes);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("NOT_LIKED");
      }
    });
  });
});
