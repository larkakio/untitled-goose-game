"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { targetChain } from "@/lib/wagmi-config";

export function WrongNetworkBanner() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === targetChain.id) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 border-b border-amber-500/40 bg-amber-950/80 px-4 py-2 text-center text-sm text-amber-100">
      <span>Wrong network — switch to {targetChain.name} for on-chain check-in.</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => switchChain({ chainId: targetChain.id })}
        className="rounded-md bg-amber-500 px-3 py-1 font-medium text-black disabled:opacity-50"
      >
        {isPending ? "Switching…" : `Switch to ${targetChain.name}`}
      </button>
    </div>
  );
}
