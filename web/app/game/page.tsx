import Link from "next/link";
import { GameBoard } from "@/components/game/GameBoard";

export default function GamePage() {
  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          className="text-xs font-medium text-[var(--neon-cyan)] hover:underline"
        >
          ← Home
        </Link>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">Swipe to move</span>
      </div>
      <GameBoard />
    </main>
  );
}
