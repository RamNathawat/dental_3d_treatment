import { describe, it, expect } from "vitest";
import {
  getCaseLinkAccess,
  calculateExpiryFromDays,
  formatForDateTimeInput,
} from "../portal/lib/link-access";

describe("Milestone 3: Link Access & Expiry Logic", () => {
  it("detects manually revoked links with top priority", () => {
    const access = getCaseLinkAccess({
      is_revoked: true,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    });

    expect(access.status).toBe("revoked");
    expect(access.isRevoked).toBe(true);
    expect(access.badgeLabel).toBe("Revoked");
  });

  it("resolves revocation from doctor_notes.link_access fallback", () => {
    const access = getCaseLinkAccess({
      doctor_notes: {
        link_access: {
          is_revoked: true,
        },
      },
    });

    expect(access.status).toBe("revoked");
    expect(access.isRevoked).toBe(true);
  });

  it("detects expired links when expires_at timestamp is in the past", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString();
    const access = getCaseLinkAccess({
      expires_at: pastDate,
      is_revoked: false,
    });

    expect(access.status).toBe("expired");
    expect(access.isRevoked).toBe(false);
    expect(access.badgeLabel).toContain("Expired");
  });

  it("detects expiring_soon links when remaining duration is under 24 hours", () => {
    const soonDate = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString();
    const access = getCaseLinkAccess({
      expires_at: soonDate,
      is_revoked: false,
    });

    expect(access.status).toBe("expiring_soon");
    expect(access.badgeLabel).toBe("8h left");
  });

  it("detects active links with 1-week slider duration", () => {
    const activeDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString();
    const access = getCaseLinkAccess({
      expires_at: activeDate,
      is_revoked: false,
    });

    expect(access.status).toBe("active");
    expect(access.badgeLabel).toBe("4d left");
  });

  it("detects indefinite links when expires_at is null or undefined", () => {
    const access = getCaseLinkAccess({
      expires_at: null,
      is_revoked: false,
    });

    expect(access.status).toBe("never");
    expect(access.badgeLabel).toBe("No Expiry");
    expect(access.relativeTimeText).toContain("indefinitely");
  });

  it("computes future expiry timestamp from days accurately", () => {
    const now = Date.now();
    const isoString = calculateExpiryFromDays(3);
    const date = new Date(isoString);

    expect(date.getTime()).toBeGreaterThan(now);
    const diffHours = (date.getTime() - now) / (1000 * 60 * 60);
    expect(Math.round(diffHours)).toBeCloseTo(72, -1);
  });

  it("formats dates cleanly for datetime-local input", () => {
    const testDate = new Date(2026, 10, 15, 14, 30);
    const formatted = formatForDateTimeInput(testDate);
    expect(formatted).toBe("2026-11-15T14:30");
  });
});

