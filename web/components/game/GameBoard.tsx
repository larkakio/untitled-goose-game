"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { LEVELS, buildLevel, type Tile } from "@/lib/levels";
import { readMaxUnlockedLevel, unlockAfterLevel } from "@/lib/progression";

type Pos = { x: number; y: number };

type GameState = {
  goose: Pos;
  grid: Tile[][];
  won: boolean;
};

const SWIPE_MIN_PX = 36;

function initialState(levelIndex: number): GameState {
  const b = buildLevel(LEVELS[levelIndex]);
  return {
    goose: b.start,
    grid: b.grid.map((r) => [...r]),
    won: false,
  };
}

type Action =
  | { type: "move"; dx: number; dy: number }
  | { type: "reset"; levelIndex: number };

function gameReducer(state: GameState, action: Action): GameState {
  if (action.type === "reset") {
    return initialState(action.levelIndex);
  }
  if (state.won) return state;

  const { dx, dy } = action;
  const nx = state.goose.x + dx;
  const ny = state.goose.y + dy;
  if (ny < 0 || ny >= state.grid.length) return state;
  const row = state.grid[ny];
  if (!row || nx < 0 || nx >= row.length) return state;
  const tile = row[nx];
  if (tile === "wall") return state;

  const grid = state.grid.map((r) => [...r]);
  if (grid[ny][nx] === "key") {
    grid[ny][nx] = "floor";
  }
  const keysRemaining = grid.flat().filter((t) => t === "key").length;
  const onExit = grid[ny][nx] === "exit";
  const win = onExit && keysRemaining === 0;

  return {
    goose: { x: nx, y: ny },
    grid,
    won: win,
  };
}

export function GameBoard() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [state, dispatch] = useReducer(gameReducer, undefined as unknown as GameState, () =>
    initialState(0),
  );
  const [maxUnlocked, setMaxUnlocked] = useState(1);

  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const def = LEVELS[levelIndex];

  const winHandled = useRef(false);

  useEffect(() => {
    setMaxUnlocked(readMaxUnlockedLevel());
  }, []);

  useEffect(() => {
    winHandled.current = false;
    dispatch({ type: "reset", levelIndex });
  }, [levelIndex]);

  useEffect(() => {
    if (state.won && !winHandled.current) {
      winHandled.current = true;
      unlockAfterLevel(def.id, LEVELS.length);
      setMaxUnlocked(readMaxUnlockedLevel());
    }
  }, [state.won, def.id]);

  const tryMove = useCallback((dx: number, dy: number) => {
    dispatch({ type: "move", dx, dy });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") tryMove(0, -1);
      else if (e.key === "ArrowDown") tryMove(0, 1);
      else if (e.key === "ArrowLeft") tryMove(-1, 0);
      else if (e.key === "ArrowRight") tryMove(1, 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tryMove]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (ax < SWIPE_MIN_PX && ay < SWIPE_MIN_PX) return;
    if (ax > ay) tryMove(dx > 0 ? 1 : -1, 0);
    else tryMove(0, dy > 0 ? 1 : -1);
  };

  const keysLeft = state.grid.flat().filter((t) => t === "key").length;
  const height = state.grid.length;
  const width = state.grid[0]?.length ?? 0;

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-[family-name:var(--font-orbitron)] text-lg font-semibold tracking-wide text-[var(--neon-cyan)] drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
            {def.title}
          </h2>
          <p className="text-xs text-zinc-400">
            Level {def.id} of {LEVELS.length} — Swipe the grid to move. Collect all data cores, then reach the exit portal.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--neon-magenta)]/50 bg-black/40 px-3 py-1 text-xs text-[var(--neon-magenta)]">
          Cores left: {keysLeft}
        </div>
      </div>

      <div
        role="application"
        aria-label="Game grid, swipe to move the goose"
        className="relative mx-auto touch-none select-none rounded-xl border-2 border-[var(--neon-cyan)]/40 bg-[#06060f] p-2 shadow-[0_0_24px_rgba(0,255,255,0.15)]"
        style={{
          touchAction: "none",
          width: "min(100vw - 2rem, 420px)",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
            aspectRatio: `${width} / ${height}`,
          }}
        >
          {state.grid.map((row, y) =>
            row.map((tile, x) => {
              const isGoose = state.goose.x === x && state.goose.y === y;
              let bg = "bg-[#0f1020]";
              if (tile === "wall") bg = "bg-[#1a1a2e] shadow-inner";
              if (tile === "key") bg = "bg-gradient-to-br from-fuchsia-600/40 to-cyan-500/30";
              if (tile === "exit") bg = "bg-gradient-to-br from-emerald-500/30 to-cyan-400/20";
              if (isGoose) bg = "bg-gradient-to-br from-amber-300/50 to-yellow-500/40";

              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative flex min-h-[28px] items-center justify-center rounded-sm border border-white/5 ${bg}`}
                >
                  {isGoose && (
                    <span className="text-lg drop-shadow-[0_0_6px_#fff]" aria-hidden>
                      🪿
                    </span>
                  )}
                  {!isGoose && tile === "key" && (
                    <span className="text-[10px] font-bold text-fuchsia-300">◆</span>
                  )}
                  {!isGoose && tile === "exit" && (
                    <span className="text-[10px] text-emerald-300">⌁</span>
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>

      {state.won && (
        <div className="neon-panel rounded-xl p-4 text-center">
          <p className="font-[family-name:var(--font-orbitron)] text-xl text-[var(--neon-lime)]">
            Sector cleared
          </p>
          <p className="mt-1 text-sm text-zinc-300">
            {levelIndex + 1 < LEVELS.length
              ? "The next district unlocks."
              : "You cleared every district. Honk perfected."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {levelIndex + 1 < LEVELS.length && (
              <button
                type="button"
                className="neon-button rounded-lg px-4 py-2 text-sm font-semibold"
                onClick={() => setLevelIndex(levelIndex + 1)}
              >
                Next level
              </button>
            )}
            <button
              type="button"
              className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300"
              onClick={() => {
                winHandled.current = false;
                dispatch({ type: "reset", levelIndex });
              }}
            >
              Replay
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="text-xs uppercase tracking-wider text-zinc-500">Districts</span>
        {LEVELS.map((lv) => {
          const locked = lv.id > maxUnlocked;
          const active = lv.id === def.id;
          return (
            <button
              key={lv.id}
              type="button"
              disabled={locked}
              onClick={() => !locked && setLevelIndex(lv.id - 1)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                active
                  ? "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] ring-1 ring-[var(--neon-cyan)]"
                  : locked
                    ? "cursor-not-allowed bg-zinc-900 text-zinc-600"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {locked ? `${lv.id} 🔒` : `${lv.id}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
