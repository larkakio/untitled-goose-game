"use client";

import { useConnect, useConnectors } from "wagmi";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function WalletSheet({ open, onClose }: Props) {
  const connectors = useConnectors();
  const { connectAsync, isPending, error } = useConnect();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="neon-panel relative z-10 max-h-[70vh] w-full max-w-md overflow-y-auto rounded-t-2xl p-6 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-orbitron)] text-lg text-[var(--neon-cyan)]">
            Connect wallet
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {connectors.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  void connectAsync({ connector: c }).then(() => onClose());
                }}
                className="flex w-full items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-left text-sm text-zinc-100 hover:border-[var(--neon-cyan)]/50 disabled:opacity-40"
              >
                <span>{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
        {error && (
          <p className="mt-3 text-xs text-red-400" role="alert">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
