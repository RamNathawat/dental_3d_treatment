/**
 * Module-level cache for portal data (disclosures + shared links).
 * Lives as a JavaScript singleton in the browser — survives React
 * unmount/remount across client-side navigations within the same session.
 */

export interface PortalData {
  disclosures: any[];
  sharedLinks: any[];
}

const TTL_MS = 45_000; // 45 seconds

let stored: { data: PortalData; ts: number } | null = null;

/** Returns cached data if it exists and is within TTL, otherwise null. */
export function getPortalCache(): PortalData | null {
  if (!stored) return null;
  if (Date.now() - stored.ts > TTL_MS) { stored = null; return null; }
  return stored.data;
}

/** Stores fresh data in the cache. */
export function setPortalCache(data: PortalData): void {
  stored = { data, ts: Date.now() };
}

/** Call after mutations (e.g. create/delete) to force a fresh fetch. */
export function invalidatePortalCache(): void {
  stored = null;
}
