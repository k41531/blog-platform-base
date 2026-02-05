import { describe, it, expect } from "vitest";

import {
  createPost,
  publishPost,
  unpublishPost,
  type CreatePostInput,
  type Post,
} from "./post";

describe("Post集約", () => {
  describe("記事の作成", () => {
    it("タイトルと本文を指定して記事を作成できる", () => {
      // Arrange
      const input: CreatePostInput = {
        authorId: "user-123",
        title: "はじめてのブログ",
        content: "これは本文です",
      };

      // Act
      const result = createPost(input);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.title).toBe("はじめてのブログ");
        expect(result.value.content).toBe("これは本文です");
        expect(result.value.status).toBe("draft");
      }
    });

    it("作成された記事は下書き状態になる", () => {
      // Arrange
      const input: CreatePostInput = {
        authorId: "user-123",
        title: "新しい記事",
        content: "本文",
      };

      // Act
      const result = createPost(input);

      // Assert
      expect(result.ok && result.value.status).toBe("draft");
    });

    it("タイトルからslugが自動生成される", () => {
      // Arrange
      const input: CreatePostInput = {
        authorId: "user-123",
        title: "Hello World",
        content: "本文",
      };

      // Act
      const result = createPost(input);

      // Assert
      expect(result.ok && result.value.slug).toMatch(/^hello-world-/);
    });

    it("タイトルが空の記事は作成できない", () => {
      // Arrange
      const input: CreatePostInput = {
        authorId: "user-123",
        title: "",
        content: "本文",
      };

      // Act
      const result = createPost(input);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("EMPTY_TITLE");
      }
    });

    it("本文が空の記事は作成できない", () => {
      // Arrange
      const input: CreatePostInput = {
        authorId: "user-123",
        title: "タイトル",
        content: "",
      };

      // Act
      const result = createPost(input);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("EMPTY_CONTENT");
      }
    });

    it("エディタタイプを指定できる（デフォルトはmarkdown）", () => {
      // Arrange
      const markdownInput: CreatePostInput = {
        authorId: "user-123",
        title: "Markdown記事",
        content: "# 見出し",
      };
      const richtextInput: CreatePostInput = {
        authorId: "user-123",
        title: "リッチテキスト記事",
        content: "<p>本文</p>",
        editorType: "richtext",
      };

      // Act
      const markdownResult = createPost(markdownInput);
      const richtextResult = createPost(richtextInput);

      // Assert
      expect(markdownResult.ok && markdownResult.value.editorType).toBe(
        "markdown"
      );
      expect(richtextResult.ok && richtextResult.value.editorType).toBe(
        "richtext"
      );
    });
  });

  describe("記事の公開", () => {
    it("下書き記事を公開できる", () => {
      // Arrange
      const post: Post = createDraftPost();

      // Act
      const result = publishPost(post);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.status).toBe("published");
        expect(result.value.publishedAt).not.toBeNull();
      }
    });

    it("すでに公開済みの記事を公開しようとするとエラーになる", () => {
      // Arrange
      const post: Post = createPublishedPost();

      // Act
      const result = publishPost(post);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("ALREADY_PUBLISHED");
      }
    });
  });

  describe("記事の非公開", () => {
    it("公開済み記事を下書きに戻せる", () => {
      // Arrange
      const post: Post = createPublishedPost();

      // Act
      const result = unpublishPost(post);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.status).toBe("draft");
        expect(result.value.publishedAt).toBeNull();
      }
    });

    it("下書き記事を非公開にしようとするとエラーになる", () => {
      // Arrange
      const post: Post = createDraftPost();

      // Act
      const result = unpublishPost(post);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("NOT_PUBLISHED");
      }
    });
  });
});

// テストヘルパー
function createDraftPost(): Post {
  return {
    id: "post-123",
    authorId: "user-123",
    title: "テスト記事",
    slug: "test-article-abc123",
    content: "テスト本文",
    editorType: "markdown",
    status: "draft",
    publishedAt: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  };
}

function createPublishedPost(): Post {
  return {
    id: "post-456",
    authorId: "user-123",
    title: "公開済み記事",
    slug: "published-article-def456",
    content: "公開済み本文",
    editorType: "markdown",
    status: "published",
    publishedAt: new Date("2025-01-02"),
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-02"),
  };
}
