"use client";

import { useState } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { checkInAbi } from "@/lib/abi/check-in";
import { getBuilderDataSuffix } from "@/lib/builder-suffix";
import { getCheckInAddress } from "@/lib/env";
import { targetChain } from "@/lib/wagmi-config";
import { WalletSheet } from "./wallet-sheet";

export function DailyCheckIn() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: switching } = useSwitchChain();
  const { writeContractAsync, isPending: writing } = useWriteContract();

  const contract = getCheckInAddress();

  const { data: streak, refetch } = useReadContract({
    address: contract,
    abi: checkInAbi,
    functionName: "streakOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contract && address && chainId === targetChain.id) },
  });

  async function handleCheckIn() {
    setMsg(null);
    if (!contract) {
      setMsg("Check-in contract is not configured.");
      return;
    }
    if (!isConnected || !address) {
      setSheetOpen(true);
      return;
    }
    try {
      if (chainId !== targetChain.id) {
        await switchChainAsync({ chainId: targetChain.id });
      }
      const suffix = getBuilderDataSuffix();
      await writeContractAsync({
        address: contract,
        abi: checkInAbi,
        functionName: "checkIn",
        chainId: targetChain.id,
        ...(suffix ? { dataSuffix: suffix } : {}),
      });
      await refetch();
      setMsg("Check-in confirmed.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Transaction failed.");
    }
  }

  const busy = writing || switching;

  return (
    <section className="neon-panel rounded-xl p-5">
      <h3 className="font-[family-name:var(--font-orbitron)] text-base text-[var(--neon-lime)]">
        Daily on-chain check-in
      </h3>
      <p className="mt-1 text-xs text-zinc-400">
        Once per UTC day on Base. Gas only — no ETH is sent to the contract.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!isConnected ? (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="neon-button rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Connect wallet
          </button>
        ) : (
          <>
            <span className="truncate font-mono text-xs text-zinc-400">
              {address?.slice(0, 6)}…{address?.slice(-4)}
            </span>
            {contract && chainId === targetChain.id && streak != null && (
              <span className="text-xs text-[var(--neon-magenta)]">Streak: {String(streak)}</span>
            )}
            <button
              type="button"
              disabled={busy || !contract}
              onClick={() => void handleCheckIn()}
              className="neon-button rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              {busy ? "Confirm in wallet…" : "Check in"}
            </button>
          </>
        )}
      </div>
      {msg && <p className="mt-2 text-xs text-zinc-300">{msg}</p>}
      <WalletSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </section>
  );
}
