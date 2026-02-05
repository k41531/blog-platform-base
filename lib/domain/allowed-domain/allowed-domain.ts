import { Result, ok, err } from "@/lib/shared/result";

export type AllowedDomain = {
  domain: string;
  isActive: boolean;
};

export type AllowedDomainError =
  | { type: "EMPTY_DOMAIN" }
  | { type: "INVALID_DOMAIN" };

export function createAllowedDomain(
  domain: string
): Result<AllowedDomain, AllowedDomainError> {
  if (!domain.trim()) {
    return err({ type: "EMPTY_DOMAIN" });
  }

  if (!isValidDomain(domain)) {
    return err({ type: "INVALID_DOMAIN" });
  }

  return ok({
    domain: domain.toLowerCase(),
    isActive: true,
  });
}

export function isEmailAllowed(
  email: string,
  allowedDomains: AllowedDomain[]
): boolean {
  const emailDomain = extractDomain(email);
  if (!emailDomain) {
    return false;
  }

  return allowedDomains.some(
    (allowed) =>
      allowed.isActive && allowed.domain.toLowerCase() === emailDomain.toLowerCase()
  );
}

export function deactivateDomain(domain: AllowedDomain): AllowedDomain {
  return {
    ...domain,
    isActive: false,
  };
}

export function activateDomain(domain: AllowedDomain): AllowedDomain {
  return {
    ...domain,
    isActive: true,
  };
}

function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z0-9][a-zA-Z0-9-]*)+$/;
  return domainRegex.test(domain);
}

function extractDomain(email: string): string | null {
  const parts = email.split("@");
  if (parts.length !== 2) {
    return null;
  }
  return parts[1];
}
