export function getTargetChainId(): number {
  const raw = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (!raw) return 8453;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : 8453;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function getCheckInAddress(): `0x${string}` | undefined {
  const a = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS;
  if (!a || !a.startsWith("0x") || a.length !== 42) return undefined;
  return a as `0x${string}`;
}
