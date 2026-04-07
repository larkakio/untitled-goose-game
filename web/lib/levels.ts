export type Tile = "floor" | "wall" | "key" | "exit";

export type LevelDef = {
  id: number;
  title: string;
  /** Rows from top; each string same width */
  ascii: string[];
};

function parseAscii(rows: string[]): {
  grid: Tile[][];
  start: { x: number; y: number };
  keys: number;
} {
  const grid: Tile[][] = [];
  let start = { x: 1, y: 1 };
  let keys = 0;

  rows.forEach((row, y) => {
    const line: Tile[] = [];
    [...row].forEach((ch, x) => {
      if (ch === "#") line.push("wall");
      else if (ch === ".") line.push("floor");
      else if (ch === "K") {
        line.push("key");
        keys += 1;
      } else if (ch === "E") line.push("exit");
      else if (ch === "S") {
        line.push("floor");
        start = { x, y };
      } else if (ch === " ") line.push("wall");
      else line.push("floor");
    });
    grid.push(line);
  });

  return { grid, start, keys };
}

export function buildLevel(def: LevelDef) {
  return parseAscii(def.ascii);
}

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    title: "Tutorial Pond",
    ascii: [
      "#########",
      "#S......#",
      "#..#....#",
      "#..K....#",
      "#....#..#",
      "#......E#",
      "#########",
    ],
  },
  {
    id: 2,
    title: "Back Alley Grid",
    ascii: [
      "###########",
      "#S........#",
      "#.####.##.#",
      "#....K....#",
      "#.##.##.#.#",
      "#......K..#",
      "#.####....#",
      "#........E#",
      "###########",
    ],
  },
  {
    id: 3,
    title: "Neon Plaza Run",
    ascii: [
      "###############",
      "#S............#",
      "#.###.#.###.#.#",
      "#...#...#...#.#",
      "###.#.#.#.#.#.#",
      "#...K...K.....#",
      "#.###.#.#.###.#",
      "#.....#...#...#",
      "#.#.#.###.#.#.#",
      "#............E#",
      "###############",
    ],
  },
];
