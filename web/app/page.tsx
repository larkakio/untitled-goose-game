import Link from "next/link";
import { DailyCheckIn } from "@/components/daily-check-in";

export default function Home() {
  return (
    <main className="flex flex-col gap-10">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--neon-magenta)] animate-neon-pulse">
          Base · mobile web
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-bold tracking-tight text-transparent sm:text-4xl bg-gradient-to-r from-[var(--neon-cyan)] via-white to-[var(--neon-magenta)] bg-clip-text drop-shadow-[0_0_20px_rgba(0,245,255,0.35)]">
          Neon Honk Heist
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
          You are the glitch in the plaza. Swipe across the neon grid, steal every data core, and
          escape through the portal before the district locks down.
        </p>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/game"
          className="neon-button inline-flex items-center justify-center rounded-xl px-8 py-4 text-center text-base font-semibold"
        >
          Play now
        </Link>
      </div>

      <DailyCheckIn />

      <footer className="text-center text-[11px] text-zinc-600">
        English UI · Wallet on Base · Builder attribution on check-in when configured
      </footer>
    </main>
  );
}
