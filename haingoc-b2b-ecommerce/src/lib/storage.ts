// 1. Namespace

const NAMESPACE = "haingoc_v2_";

// V1 -> V2 migration map
const V1_KEYS: Record<string, string> = {
  haingoc_cart: "cart",
};

// 2. Typed localStorage accessors

/**
 * Get an item from localStorage under the v2 namespace.
 * Returns null if not found, SSR, or parse error.
 */
export function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(NAMESPACE + key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Set an item in localStorage under the v2 namespace.
 * No-op during SSR.
 */
export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — silent fail
  }
}

/**
 * Remove an item from localStorage under the v2 namespace.
 */
export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(NAMESPACE + key);
}

// 3. V1 migration

/**
 * Migrate v1 localStorage keys to v2 namespace.
 * Reads the old key, writes to new namespace, deletes old key.
 * Safe to call multiple times (idempotent).
 */
export function migrateV1Keys(): void {
  if (typeof window === "undefined") return;
  for (const [oldKey, newSuffix] of Object.entries(V1_KEYS)) {
    const newKey = NAMESPACE + newSuffix;
    // Only migrate if old key exists AND new key does NOT
    if (
      localStorage.getItem(oldKey) !== null &&
      localStorage.getItem(newKey) === null
    ) {
      try {
        const data = localStorage.getItem(oldKey);
        if (data !== null) {
          localStorage.setItem(newKey, data);
        }
        localStorage.removeItem(oldKey);
      } catch {
        // Migration failed — leave old key intact
      }
    }
  }
}
