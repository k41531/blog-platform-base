import { describe, it, expect } from "vitest";

import {
  createAllowedDomain,
  isEmailAllowed,
  deactivateDomain,
  activateDomain,
  type AllowedDomain,
} from "./allowed-domain";

describe("AllowedDomain値オブジェクト", () => {
  describe("許可ドメインの作成", () => {
    it("ドメインを許可リストに追加できる", () => {
      // Arrange
      const domain = "example.com";

      // Act
      const result = createAllowedDomain(domain);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.domain).toBe("example.com");
        expect(result.value.isActive).toBe(true);
      }
    });

    it("作成された許可ドメインは有効状態になる", () => {
      // Arrange
      const domain = "company.co.jp";

      // Act
      const result = createAllowedDomain(domain);

      // Assert
      expect(result.ok && result.value.isActive).toBe(true);
    });

    it("空のドメインは作成できない", () => {
      // Arrange
      const domain = "";

      // Act
      const result = createAllowedDomain(domain);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("EMPTY_DOMAIN");
      }
    });

    it("不正な形式のドメインは作成できない", () => {
      // Arrange
      const domain = "invalid domain";

      // Act
      const result = createAllowedDomain(domain);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("INVALID_DOMAIN");
      }
    });
  });

  describe("メールアドレスの許可判定", () => {
    it("許可されたドメインのメールアドレスは許可される", () => {
      // Arrange
      const allowedDomains: AllowedDomain[] = [
        { domain: "example.com", isActive: true },
      ];
      const email = "user@example.com";

      // Act
      const result = isEmailAllowed(email, allowedDomains);

      // Assert
      expect(result).toBe(true);
    });

    it("許可されていないドメインのメールアドレスは拒否される", () => {
      // Arrange
      const allowedDomains: AllowedDomain[] = [
        { domain: "example.com", isActive: true },
      ];
      const email = "user@other.com";

      // Act
      const result = isEmailAllowed(email, allowedDomains);

      // Assert
      expect(result).toBe(false);
    });

    it("無効化されたドメインのメールアドレスは拒否される", () => {
      // Arrange
      const allowedDomains: AllowedDomain[] = [
        { domain: "example.com", isActive: false },
      ];
      const email = "user@example.com";

      // Act
      const result = isEmailAllowed(email, allowedDomains);

      // Assert
      expect(result).toBe(false);
    });

    it("複数の許可ドメインがある場合いずれかに一致すれば許可される", () => {
      // Arrange
      const allowedDomains: AllowedDomain[] = [
        { domain: "example.com", isActive: true },
        { domain: "company.co.jp", isActive: true },
      ];
      const email = "user@company.co.jp";

      // Act
      const result = isEmailAllowed(email, allowedDomains);

      // Assert
      expect(result).toBe(true);
    });

    it("許可ドメインが空の場合は全てのメールアドレスが拒否される", () => {
      // Arrange
      const allowedDomains: AllowedDomain[] = [];
      const email = "user@example.com";

      // Act
      const result = isEmailAllowed(email, allowedDomains);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("ドメインの有効化・無効化", () => {
    it("許可ドメインを無効化できる", () => {
      // Arrange
      const domain: AllowedDomain = { domain: "example.com", isActive: true };

      // Act
      const result = deactivateDomain(domain);

      // Assert
      expect(result.isActive).toBe(false);
    });

    it("無効化されたドメインを再度有効化できる", () => {
      // Arrange
      const domain: AllowedDomain = { domain: "example.com", isActive: false };

      // Act
      const result = activateDomain(domain);

      // Assert
      expect(result.isActive).toBe(true);
    });
  });
});
