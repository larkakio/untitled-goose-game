const STORAGE_KEY = "neon-honk-max-unlocked";

export function readMaxUnlockedLevel(): number {
  if (typeof window === "undefined") return 1;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return 1;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

/** After completing level `completed` (1-based), unlock the next index. */
export function unlockAfterLevel(completedLevelId: number, totalLevels: number) {
  if (typeof window === "undefined") return;
  const next = completedLevelId + 1;
  const capped = Math.min(next, totalLevels);
  const cur = readMaxUnlockedLevel();
  if (capped > cur) {
    window.localStorage.setItem(STORAGE_KEY, String(capped));
  }
}
