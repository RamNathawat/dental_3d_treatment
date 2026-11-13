/**
 * Link Access & Expiration Utilities for Milestone 3
 * Handles link status evaluation, expiration calculation, badge formatting,
 * and resilient database persistence with doctor_notes fallback.
 */

export type LinkAccessStatus =
  | "active"
  | "expiring_soon"
  | "expired"
  | "revoked"
  | "never";

export interface LinkAccessInfo {
  status: LinkAccessStatus;
  isRevoked: boolean;
  expiresAt: string | null;
  expiresAtDate: Date | null;
  badgeLabel: string;
  badgeColorClass: string;
  badgeDotClass: string;
  relativeTimeText: string;
}

/**
 * Resolves the effective link access state for a case,
 * inspecting top-level columns first, then falling back to doctor_notes.link_access.
 */
export function getCaseLinkAccess(
  caseItem: {
    id?: string;
    status?: string;
    expires_at?: string | null;
    is_revoked?: boolean | null;
    doctor_notes?: any;
  },
  options?: { readLocalCache?: boolean }
): LinkAccessInfo {
  // 1. Check local storage persistence cache (handles environments where DB columns haven't been migrated)
  const allowLocal = options?.readLocalCache ?? true;
  let localSaved: any = null;
  if (allowLocal && typeof window !== "undefined" && caseItem.id) {
    try {
      const raw = localStorage.getItem(`dental_link_access_${caseItem.id}`);
      if (raw) localSaved = JSON.parse(raw);
    } catch {}
  }

  const fallback =
    caseItem.doctor_notes && typeof caseItem.doctor_notes === "object"
      ? caseItem.doctor_notes.link_access
      : null;

  const isRevoked = Boolean(
    caseItem.is_revoked === true ||
      caseItem.status === "revoked" ||
      fallback?.is_revoked === true ||
      (caseItem.is_revoked === undefined && localSaved?.isRevoked === true),
  );

  const expiresAt =
    caseItem.expires_at !== undefined && caseItem.expires_at !== null
      ? caseItem.expires_at
      : fallback?.expires_at ?? localSaved?.expiresAt ?? null;

  const expiresAtDate = expiresAt ? new Date(expiresAt) : null;
  const now = Date.now();

  if (isRevoked) {
    return {
      status: "revoked",
      isRevoked: true,
      expiresAt,
      expiresAtDate,
      badgeLabel: "Revoked",
      badgeColorClass:
        "bg-slate-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/60",
      badgeDotClass: "bg-rose-500",
      relativeTimeText: "Access manually revoked",
    };
  }

  if (!expiresAtDate || isNaN(expiresAtDate.getTime())) {
    return {
      status: "never",
      isRevoked: false,
      expiresAt: null,
      expiresAtDate: null,
      badgeLabel: "No Expiry",
      badgeColorClass:
        "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border-slate-200 dark:border-slate-700",
      badgeDotClass: "bg-slate-400",
      relativeTimeText: "Link remains active indefinitely",
    };
  }

  const diffMs = expiresAtDate.getTime() - now;

  if (diffMs <= 0) {
    const expiredDaysAgo = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    const label =
      expiredDaysAgo === 0
        ? "Expired Today"
        : expiredDaysAgo === 1
        ? "Expired Yesterday"
        : `Expired ${expiredDaysAgo}d ago`;

    return {
      status: "expired",
      isRevoked: false,
      expiresAt,
      expiresAtDate,
      badgeLabel: label,
      badgeColorClass:
        "bg-slate-100 text-slate-600 dark:bg-amber-950/40 dark:text-amber-300 border-slate-200 dark:border-amber-900/60",
      badgeDotClass: "bg-slate-400 dark:bg-amber-500",
      relativeTimeText: `Expired on ${expiresAtDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })}`,
    };
  }

  const hoursRemaining = Math.ceil(diffMs / (1000 * 60 * 60));
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (hoursRemaining <= 24) {
    return {
      status: "expiring_soon",
      isRevoked: false,
      expiresAt,
      expiresAtDate,
      badgeLabel: `${hoursRemaining}h left`,
      badgeColorClass:
        "bg-slate-100 text-slate-800 dark:bg-amber-950/70 dark:text-[#ffd166] border-slate-200 dark:border-amber-700/80 font-medium",
      badgeDotClass: "bg-slate-500 dark:bg-amber-500",
      relativeTimeText: `Expires in ${hoursRemaining} hour${hoursRemaining === 1 ? "" : "s"}`,
    };
  }

  return {
    status: "active",
    isRevoked: false,
    expiresAt,
    expiresAtDate,
    badgeLabel: `${daysRemaining}d left`,
    badgeColorClass:
      "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
    badgeDotClass: "bg-[#25D366]",
    relativeTimeText: `Expires in ${daysRemaining} days (${expiresAtDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })})`,
  };
}

/**
 * Computes an ISO string timestamp N days in the future from now.
 */
export function calculateExpiryFromDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/**
 * Formats a Date object for standard datetime-local HTML inputs (YYYY-MM-DDTHH:mm).
 */
export function formatForDateTimeInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

