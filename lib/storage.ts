// ─── Generic localStorage helpers ───────────────────────────────────────────

const isBrowser = typeof window !== 'undefined';

export function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full — silently fail
  }
}

export function removeItem(key: string): void {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

// ─── Storage Keys ───────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  TICKETS: 'tcd_tickets',
  USERS: 'tcd_users',
  BUSINESS_UNITS: 'tcd_business_units',
  NEXT_TICKET_NUMBER: 'tcd_next_ticket_number',
  SEEDED: 'tcd_seeded',
  THEME: 'tcd_theme',
} as const;
