import { describe, it, expect } from "vitest";

import { stripMarkdown } from "./strip-markdown";

describe("stripMarkdown", () => {
  describe("見出し", () => {
    it("h1〜h6の # を除去する", () => {
      expect(stripMarkdown("# 見出し1")).toBe("見出し1");
      expect(stripMarkdown("###### 見出し6")).toBe("見出し6");
    });

    it("行頭以外の # は残す", () => {
      expect(stripMarkdown("tag #foo")).toBe("tag #foo");
    });
  });

  describe("強調", () => {
    it("**bold** を除去する", () => {
      expect(stripMarkdown("これは **太字** です")).toBe("これは 太字 です");
    });

    it("__bold__ を除去する", () => {
      expect(stripMarkdown("__太字__")).toBe("太字");
    });

    it("*italic* と _italic_ を除去する", () => {
      expect(stripMarkdown("*斜体* と _斜体_")).toBe("斜体 と 斜体");
    });

    it("~~strikethrough~~ を除去する", () => {
      expect(stripMarkdown("~~打消し~~")).toBe("打消し");
    });
  });

  describe("リンクと画像", () => {
    it("[text](url) をテキストに置換する", () => {
      expect(stripMarkdown("詳細は [こちら](https://example.com)")).toBe(
        "詳細は こちら"
      );
    });

    it("![alt](url) をalt に置換する", () => {
      expect(stripMarkdown("![猫](cat.png)")).toBe("猫");
    });
  });

  describe("コード", () => {
    it("```fenced``` を除去する", () => {
      expect(stripMarkdown("前\n```\ncode\n```\n後")).toBe("前 後");
    });

    it("`inline` の中身は残す", () => {
      expect(stripMarkdown("値は `42` です")).toBe("値は 42 です");
    });
  });

  describe("ブロック要素", () => {
    it("引用 > を除去する", () => {
      expect(stripMarkdown("> 引用文")).toBe("引用文");
    });

    it("水平線を除去する", () => {
      expect(stripMarkdown("前\n---\n後")).toBe("前 後");
    });

    it("順序なしリストを除去する", () => {
      expect(stripMarkdown("- 項目1\n- 項目2")).toBe("項目1 項目2");
    });

    it("順序付きリストを除去する", () => {
      expect(stripMarkdown("1. 最初\n2. 次")).toBe("最初 次");
    });
  });

  describe("エッジケース", () => {
    it("空文字列", () => {
      expect(stripMarkdown("")).toBe("");
    });

    it("Markdown構文を含まない普通のテキストはそのまま返す", () => {
      expect(stripMarkdown("普通の本文です")).toBe("普通の本文です");
    });

    it("複合構文を正しく処理する", () => {
      const input = "# タイトル\n\n**重要**: [link](/x) と `code`。";
      expect(stripMarkdown(input)).toBe("タイトル 重要: link と code。");
    });

    it("超長文でもハングせず処理を返す（ReDoS 対策）", () => {
      const input = "**" + "a".repeat(5000);
      const start = Date.now();
      const result = stripMarkdown(input);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(500);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
